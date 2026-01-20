<template>
  <main class="container">
    <!-- 40x "1" -->
    <span v-for="i in 40" :key="`p1-${i}`" class="particle" :style="particleStyles[i - 1]">
      1
    </span>

    <!-- 40x "0" -->
    <span v-for="i in 40" :key="`p0-${i}`" class="particle" :style="particleStyles[40 + (i - 1)]">
      0
    </span>

    <article class="content">
      <p>Oops, parece que você se perdeu!</p>
      <p>Código de erro <strong>404</strong></p>
      <p>
        <button type="button" @click="goBack">Voltar de onde parei</button>
      </p>
    </article>
  </main>
</template>

<script>
export default {
  name: 'NotFoundView',
  data() {
    return {
      particleStyles: [],
    }
  },
  created() {
    this.particleStyles = this.generateParticleStyles(80) // 40 + 40
  },
  methods: {
    goBack() {
      // tenta voltar no histórico; se não der, manda pra home
      if (window.history.length > 1) return this.$router.back()
      this.$router.push('/home')
    },

    randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    pick(arr) {
      return arr[this.randInt(0, arr.length - 1)]
    },

    generateParticleStyles(total) {
      const anims = ['float', 'floatReverse', 'float2', 'floatReverse2']

      const styles = []
      for (let i = 1; i <= total; i++) {
        const size = this.randInt(10, 29)
        const blur = i * 0.02
        const speed = this.randInt(20, 39)
        const delay = this.randInt(0, 9) * 0.1
        const anim = this.pick(anims)

        const top = ((Math.random() * 100) / (100 + size / 8)) * 100
        const left = ((Math.random() * 100) / (100 + size / 10)) * 100

        styles.push({
          top: `${top}%`,
          left: `${left}%`,
          fontSize: `${size}px`,
          filter: `blur(${blur}px)`,

          animationName: anim,
          animationDuration: `${speed}s`,
          animationDelay: `${delay}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        })
      }
      return styles
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: white;
  color: black;
  font-family: arial, sans-serif;
  overflow: hidden;
}

.content {
  position: relative;
  width: 600px;
  max-width: 100%;
  margin: 20px;
  background: white;
  padding: 60px 40px;
  text-align: center;
  box-shadow: -10px 10px 67px -12px rgba(0, 0, 0, 0.2);
  opacity: 0;
  animation: apparition 0.5s cubic-bezier(0.39, 0.575, 0.28, 0.995) forwards;
}

.content p {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.6rem;
  letter-spacing: 0.1rem;
  color: #595959;
}

.content p:last-child {
  margin-bottom: 0;
}

.content button {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  border: 3px solid #595959;
  background: transparent;
  font-size: 1rem;
  color: #595959;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
}

.particle {
  position: absolute;
  display: block;
  pointer-events: none;
}
</style>
