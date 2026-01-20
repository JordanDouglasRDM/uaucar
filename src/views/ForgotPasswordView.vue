<script>
import FloatLabel from 'primevue/floatlabel'
import apiServer from '@/services/apiServer.js'

export default {
  name: 'ForgotPasswordView',
  components: { FloatLabel },
  data() {
    return {
      form: {
        email: '',
      },
      loading: false,
    }
  },
  created() {
    const { email } = this.$route.query
    this.form.email = email
  },
  methods: {
    async postReset() {
      try {
        this.loading = true

        const response = await apiServer.post('/auth/forgot-password', this.form)

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
        <p class="has-text-centered is-size-3 has-text-weight-semibold">Recuperar Senha</p>
        <div class="mt-6">
          <p class="subtitle is-size-5">Esqueceu sua senha? Sem problemas.</p>
          <p class="is-size-6">
            Informe-nos seu endereço de e-mail e nós enviaremos um link para redefinição de senha
            que permitirá criar uma nova.
          </p>
        </div>
      </div>

      <div class="mt-5 mb-4">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-envelope has-text-pc"></i>
          </InputGroupAddon>
          <FloatLabel variant="on">
            <InputText
              id="email"
              v-model="form.email"
              autocomplete="off"
              fluid
              size="large"
              @keydown.enter="postReset"
            />
            <label class="is-size-6" for="email">E-mail</label>
          </FloatLabel>
        </InputGroup>
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
        <Button @click="postReset" label="Enviar Link" severity="info" fluid :loading />
      </div>
    </main>
  </section>
</template>

<style scoped></style>
