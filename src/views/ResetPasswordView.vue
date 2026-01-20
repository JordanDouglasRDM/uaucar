<script>
import FloatLabel from 'primevue/floatlabel'
import apiServer from '@/services/apiServer.js'

export default {
  name: 'ResetPasswordView',
  components: { FloatLabel },
  data() {
    return {
      form: {
        token: null,
        email: null,
        password: '',
        password_confirmation: '',
      },
      loading: false,
    }
  },
  created() {
    const { token } = this.$route.params
    const { email } = this.$route.query
    this.form.token = token
    this.form.email = email
  },
  methods: {
    async postReset() {
      try {
        this.loading = true

        const response = await apiServer.post('/auth/reset-password', this.form)

        this.successToast(response.data.message)
        this.$router.push('/login')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async successToast(message) {
      await toast.fire({ icon: 'success', title: message })
    },
    async errorToast(message) {
      await toast.fire({ icon: 'error', title: 'Houve um erro', text: message })
    },
  },
}
</script>

<template>
  <section
    class="section is-flex is-justify-content-center is-align-items-center"
    style="min-height: 100vh"
  >
    <main
      class="border box px-5 pt-5 pb-3 is-flex is-flex-direction-column is-justify-content-space-between"
      style="width: 450px; height: 600px; border: 1px solid #e2e8f0"
    >
      <div class="">
        <p class="has-text-centered is-size-3 has-text-weight-semibold">Redefinir Senha</p>
      </div>

      <div>
        <div class="mt-5 mb-4">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock has-text-pc"></i>
            </InputGroupAddon>
            <FloatLabel variant="on">
              <Password
                id="password"
                v-model="form.password"
                toggleMask
                autocomplete="off"
                fluid
                size="large"
                @keydown.enter="postReset"
              />
              <label class="is-size-6" for="password">Senha</label>
            </FloatLabel>
          </InputGroup>
        </div>

        <div class="mb-0">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock has-text-pc"></i>
            </InputGroupAddon>
            <FloatLabel variant="on">
              <Password
                id="password_confirmation"
                v-model="form.password_confirmation"
                toggleMask
                autocomplete="off"
                fluid
                size="large"
                @keydown.enter="postReset"
              />
              <label class="is-size-6" for="password_confirmation">Confirmação de Senha</label>
            </FloatLabel>
          </InputGroup>
        </div>
        <p class="has-text-left">
          <Button asChild v-slot="slotProps" variant="link">
            <RouterLink
              :to="{
                name: 'login',
                query: { email: this.form.email },
              }"
              :class="slotProps.class"
              class="p-0"
              style="color: var(--p-button-info-background)"
            >
              Voltar para tela principal
            </RouterLink>
          </Button>
        </p>
      </div>

      <div class="is-flex is-justify-content-center mb-5">
        <Button @click="postReset" label="Redefinir Senha" severity="info" fluid :loading />
      </div>
    </main>
  </section>
</template>

<style scoped></style>
