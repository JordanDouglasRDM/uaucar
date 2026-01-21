<script>
import FadeTransition from '@/components/FadeTransition.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

export default {
  name: 'HomeView',
  components: { AppSidebar, AppNavbar, FadeTransition },
}
</script>

<template>
  <div class="is-flex is-flex-direction-column" style="min-height: 100vh">
    <AppNavbar />

    <div class="is-flex" style="flex: 1; overflow: hidden">
      <AppSidebar />

      <main class="p-4" style="flex: 1; overflow: auto">
        <!-- Transição suave usando PrimeVue -->
        <FadeTransition>
          <div class="box p-2" style="height: 100%">
            <RouterView />
          </div>
        </FadeTransition>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
