<script>
import Button from 'primevue/button'
import { logoutHelper } from '@/utils/logoutHelper.js'
import { getAuthUser } from '@/utils/authUser.js'
import apiServer from '@/services/apiServer.js'

export default {
  name: 'AppSidebar',
  components: { Button },
  emits: ['signout'],
  data() {
    return {
      isCollapsed: false,
      items: [
        { label: 'Dashboard', to: '/home', icon: 'pi pi-chart-bar' },
      ],
      isMobile: false,
      logoutExecutedToday: false,
    }
  },
  mounted() {
    this.isMobile = window.innerHeight >= 1500
    const user = getAuthUser()
    if (user.level === 'master') {
      this.items.push({ label: 'Tenants', to: '/home/tenant', icon: 'pi pi-building' })
    }
  },
  methods: {
    toggle() {
      this.isCollapsed = !this.isCollapsed
    },
    isActive(item) {
      return this.$route.path === item.to
    },
    async postLogout() {
      try {
        const response = await apiServer.post('/logout')

        if (!response.data.success) {
          await this.errorToast(response.data.message)
          return
        }
        await this.successToast(response.data.message)
        logoutHelper()
      } catch (error) {
        console.error(error)
        await this.errorToast('Houve um erro inesperado.')
      }
    },
    async successToast(message) {
      await toast.fire({ icon: 'success', title: message, timer: 1000 })
    },
    async errorToast(message) {
      await toast.fire({ icon: 'error', title: 'Houve um erro', text: message })
    },
  },
}
</script>

<template>
  <aside
    class="p-3 is-flex is-flex-direction-column is-justify-content-start"
    :style="{
      width: isCollapsed ? '72px' : '200px',
      transition: 'width 220ms ease',
      overflow: 'hidden',
      height: 'calc(100vh - 56px)',
    }"
    style="background: var(--navigation-background-white)"
  >
    <div class="is-align-self-flex-end">
      <Button
        severity="contrast"
        icon="pi pi-bars"
        text
        @click="toggle"
        v-tooltip="'Expandir/recolher'"
        size="large"
      />
    </div>

    <!-- MEIO: itens -->
    <nav class="is-flex is-flex-direction-column mt-6">
      <template v-for="item in items" :key="item.to">
        <RouterLink :to="item.to" class="mb-1" style="text-decoration: none">
          <Button
            :label="!isCollapsed ? item.label : ''"
            :icon="item.icon"
            :text="!isActive(item)"
            :severity="isActive(item) ? 'info' : 'secondary'"
            v-tooltip="isCollapsed ? item.label : ''"
            fluid
            :pt="{
              root: { class: !isCollapsed ? 'is-justify-content-flex-start' : '' },
            }"
          />
        </RouterLink>
      </template>
      <div class="is-align-self-center mt-6">
        <Button
          class="mt-4"
          icon="pi pi-sign-out"
          :label="!isCollapsed ? 'Sair' : ''"
          severity="danger"
          @click="postLogout"
          v-tooltip="isCollapsed ? 'Sair' : ''"
        />
      </div>
    </nav>
  </aside>
</template>
