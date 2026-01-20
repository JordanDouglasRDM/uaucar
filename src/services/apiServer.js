import axios from 'axios'
import { setAuthUser } from '@/utils/authUser.js'
import { formatApiErrors } from '@/utils/formatApiErrors'
import { logoutHelper } from '@/utils/logoutHelper.js'

let _notify = null
export function setApiErrorNotifier(fn) {
  _notify = typeof fn === 'function' ? fn : null
}

const apiServer = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_LARAVEL_SERVER,
  timeout: 15000,
})

/**
 * Instância "interna" para sync do /auth/me
 * - NÃO usa os interceptors do apiServer (evita loop)
 */
const apiInternal = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_LARAVEL_SERVER,
  timeout: 15000,
})

let isSyncingMe = false
let lastMeSyncAt = 0
const ME_SYNC_TTL_MS = 30_000

function shouldSyncMe(url, accessToken) {
  if (!accessToken) return false

  // não sincroniza em chamadas de auth/refresh/me pra evitar efeitos colaterais
  if (!url) return false
  if (url.includes('/auth/me')) return false
  if (url.includes('/auth/login')) return false
  if (url.includes('/auth/refresh-token')) return false

  const now = Date.now()
  return now - lastMeSyncAt > ME_SYNC_TTL_MS
}

function syncMeFireAndForget(accessToken) {
  if (isSyncingMe) return

  isSyncingMe = true
  lastMeSyncAt = Date.now()

  apiInternal
    .get('/auth/me', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      const user = res?.data?.data?.user ?? res?.data?.data ?? null
      if (user?.id) setAuthUser(user)
    })
    .catch(() => {
      // aqui é propositalmente silencioso:
      // - se token estiver expirado, o fluxo normal do request/response interceptor já vai tratar (refresh/logout)
      // - não queremos “poluir” UI com erro de sync
    })
    .finally(() => {
      isSyncingMe = false
    })
}

// Intercepta todas as requisições
apiServer.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`

    // atualiza o user em background (sem await)
    if (shouldSyncMe(config?.url, accessToken)) {
      syncMeFireAndForget(accessToken)
    }
  }
  return config
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

apiServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh-token')

    if (status === 401 && isRefreshCall) {
      logoutHelper()
      return Promise.reject(error)
    }

    if (status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      logoutHelper()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return apiServer(originalRequest)
      })
    }

    isRefreshing = true

    try {
      const refreshResponse = await apiServer.post('/auth/refresh-token', null, {
        withCredentials: true,
      })

      const newToken = refreshResponse.data?.data?.access_token
      localStorage.setItem('access_token', newToken)

      processQueue(null, newToken)

      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      return apiServer(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      logoutHelper(true)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 422) {
      const payload = error?.response?.data ?? error
      const html = formatApiErrors(payload)
      _notify?.({
        icon: 'error',
        title: 'Houve uma falha ao enviar os dados.',
        html,
      })
      return Promise.reject(error)
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      _notify?.({
        icon: 'error',
        title: 'Tempo esgotado',
        html: 'A solicitação excedeu o tempo limite.',
      })
    } else if (!error.response) {
      _notify?.({
        icon: 'error',
        title: 'Sem conexão',
        html: 'Não foi possível conectar ao servidor.',
      })
    } else {
      const payload = error.response.data ?? error
      const html = formatApiErrors(payload)
      _notify?.({ icon: 'error', title: 'Erro', html })
    }

    return Promise.reject(error)
  },
)

export default apiServer
