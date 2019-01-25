const  BASE_SCREEN_WIDTH = 750

export default {
  created() {
    this.windowResizeHandler()
  },
  methods: {
    windowResizeHandler() {
      const clientWidth = window.document.body.clientWidth
      const scale = clientWidth / BASE_SCREEN_WIDTH * 0.5  
      const viewport = document.querySelector(`meta[name='viewport']`)
      viewport.content = `width=${BASE_SCREEN_WIDTH},initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`
    }
  }
}