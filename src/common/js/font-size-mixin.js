const  BASE_SCREEN_WIDTH = 375

export default {
  created() {
    this.windowResizeHandler()
    // window.addEventListener('resize', this.windowResizeHandler)
  },
  methods: {
    windowResizeHandler() {
      const clientWidth = window.document.body.clientWidth
      const scale = BASE_SCREEN_WIDTH / clientWidth
      const viewport = document.querySelector(`meta[name='viewport']`)
      viewport.content = `width=${BASE_SCREEN_WIDTH},initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`
    }
  }
}