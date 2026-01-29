import apiServer from '@/services/apiServer.js'

const crudService = {
  delete: async (route, id) => {
    const response = await apiServer.delete(`${route}/${id}`)
    return response.data
  },
  getAll: async (route, params = {}) => {
    const response = await apiServer.get(route, { params })
    return {
      data: response.data.data.data,
      meta: {
        total: response.data.data.total,
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
      },
    }
  },

  getSelect: async (route) => {
    try {
      const params = {
        order_by: 'created_at',
        order_direction: 'desc',
        per_page: 1000,
      }
      const response = await apiServer.get(route, { params })
      return response.data.data.data
    } catch (error) {
      console.error('Falha ao buscar dados para o select:', error)
      throw error
    }
  },

  store: async (route, data) => {
    const response = await apiServer.post(route, data)
    return {
      data: response.data.data,
      message: response.data.message,
    }
  },
  update: async (route, id, data) => {
    const response = await apiServer.put(`${route}/${id}`, data)
    return {
      data: response.data.data,
      message: response.data.message,
    }
  },

  updatePost: async (route, id, data) => {
    const response = await apiServer.post(`${route}/${id}`, data)
    return {
      data: response.data.data,
      message: response.data.message,
    }
  },
}

export default crudService
