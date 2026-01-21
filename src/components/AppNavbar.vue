<script>
import Toolbar from 'primevue/toolbar'
import Avatar from 'primevue/avatar'
import { getAuthUser, getUserInitials } from '@/utils/authUser.js'

export default {
  name: 'AppNavbar',
  components: { Toolbar, Avatar },
  data() {
    return {
      userName: '',
    }
  },
  created() {
    this.userName = getAuthUser().name
  },
  computed: {
    avatarClass() {
      const palette = [
        'has-background-primary-light has-text-primary',
        'has-background-link-light has-text-link',
        'has-background-info-light has-text-info',
        'has-background-success-light has-text-success',
        'has-background-warning-light has-text-dark',
        'has-background-danger-light has-text-danger',
      ]
      const name = this.userName
      const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
      return palette[hash % palette.length]
    },
    initials() {
      return getUserInitials(this.userName)
    },
  },
}
</script>
<template>
  <Toolbar
    class="is-unselectable"
    style="
      background-color: var(--navigation-background);
      border: none;
      border-radius: 0;
      height: 56px;
    "
  >
    <template #start>
      <RouterLink
        to="/home"
        class="is-flex is-align-items-center has-text-weight-semibold has-text-white is-size-5"
        style="text-decoration: none"
      >
        <i class="pi pi-bolt mr-2"></i>
        <span>Uau Car</span>
      </RouterLink>
    </template>

    <template #end>
      <div class="is-flex is-align-items-center">
        <span class="mr-3 has-text-white has-text-weight-medium">
          {{ userName }}
        </span>
        <Avatar :label="initials" shape="circle" size="normal" :class="avatarClass" />
      </div>
    </template>
  </Toolbar>
</template>
