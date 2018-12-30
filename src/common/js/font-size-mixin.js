const [BASE_FONT_SIZE, BASE_SCREEN_WIDTH] = [20, 375]

export default {
  created () {
    this.windowResizeHandler()
    window.addEventListener('resize', this.windowResizeHandler)
  },
  methods: {
    windowResizeHandler() {
      const clientWidth = window.document.body.clientWidth
      const fs = (BASE_FONT_SIZE * clientWidth) / BASE_SCREEN_WIDTH + 'px'
      window.document.getElementsByTagName('html')[0].style.fontSize = fs
    }
  }
}