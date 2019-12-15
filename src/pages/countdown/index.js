import { calcDate } from '@/common/js/countdown'
import dayjs from 'dayjs'
import TEXT_IMAGE from '@/assets/img/countdown/bottom_text.png'

const isInRange = (p0, p1, range = 70) => {
  return Math.abs(p0 - p1) <= range
}

const CICLE_CENTER = [341, 586]
const CICLE_R = 236
const CICLE_DOT_TOP_POSTION = [CICLE_CENTER[0], CICLE_CENTER[1] - CICLE_R]
const TRANCE_LEN = 10

const AUDIO_IMAGE = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/first/music.png'

export default {
  props: ['startImageList', 'transformImageList', 'visible'],
  tranceXList: [],
  tranceYList: [],
  data() {
    return {
      currentTransfromImage: null,
      hitStartPostion: null,
      isRunDot: false,
      hitEndPostion: [],
      cicleDotPostion: CICLE_DOT_TOP_POSTION
    }
  },
  computed: {
    /**
     * 0 - Math.PI * 2
     */
    angle() {
      // 第一象限
      if (this.cicleDotPostion[0] - CICLE_CENTER[0] > 0 && this.cicleDotPostion[1] - CICLE_CENTER[1] < 0) {
        return Math.asin((Math.abs(this.cicleDotPostion[0] - CICLE_CENTER[0])) / CICLE_R)
      } 
      // 第二象限
      if (this.cicleDotPostion[0] - CICLE_CENTER[0] > 0 && this.cicleDotPostion[1] - CICLE_CENTER[1] > 0) {
        return Math.acos((Math.abs(this.cicleDotPostion[0] - CICLE_CENTER[0])) / CICLE_R) + Math.PI / 2
      } 
      // 第三象限
      if (this.cicleDotPostion[0] - CICLE_CENTER[0] < 0 && this.cicleDotPostion[1] - CICLE_CENTER[1] > 0) {
        return Math.asin((Math.abs(this.cicleDotPostion[0] - CICLE_CENTER[0])) / CICLE_R)  + Math.PI
      } 
      // 第四象限
      if (this.cicleDotPostion[0] - CICLE_CENTER[0] < 0 && this.cicleDotPostion[1] - CICLE_CENTER[1] < 0) {
        return Math.acos((Math.abs(this.cicleDotPostion[0] - CICLE_CENTER[0])) / CICLE_R)  + Math.PI / 2 * 3
      } 
      return 0
    }
  },
  watch: {
    angle(val) {
      if (this.$options.tranceXList.length <= TRANCE_LEN) {
        this.$options.tranceXList.shift()
      }
      if (this.$options.tranceYList.length <= TRANCE_LEN) {
        this.$options.tranceYList.shift()
      }

      this.$options.tranceXList.push(this.cicleDotPostion[0])
      this.$options.tranceYList.push(this.cicleDotPostion[1])

      if (!val) return (this.currentTransfromImage = null)
      if (this.isRunDot) return (this.currentTransfromImage = null)

      if (val > Math.PI * 5 / 3 && val < Math.PI * 23 / 12) {
        this.$emit('next')
      }
      const len = this.transformImageList.length
      const currentIndex = parseInt(val / (Math.PI * 2) * len) 
      
      this.currentTransfromImage = this.transformImageList[currentIndex].instance

    },
    visible(val) {
      if (!val) {
        document.body.removeEventListener('touchmove', this.bodyScroll, { passive: false })

        return false
      }
      this.$nextTick(async () => {
        const myCanvas = this.myCanvas = this.$refs.canvas
        window.addEventListener("resize", resizeCanvas, false)
        function resizeCanvas() {
          myCanvas.width = window.innerWidth
          myCanvas.height = window.innerHeight
        }
        resizeCanvas()
  
        const loadImage = src => {
          return new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => resolve(image)
            image.onerror = e => reject(e)
            image.src = src
          })
        }

        const [audioImage, textImage] = await Promise.all([
          loadImage(AUDIO_IMAGE),
          loadImage(TEXT_IMAGE),          
        ])
        const ctx = this.ctx = myCanvas.getContext('2d')

       
        let i = 0        
        const animation = () => {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

          this.drawBg(ctx)
          this.drawHouse(ctx, i * 2)
          this.drawStaticImage(ctx, textImage)
          this.drawStaticText(ctx)
          this.drawAudioImage(ctx, i * 2, audioImage)
          this.drawDate(ctx, i)
          this.drawRedDotAndText(ctx, i)
          i++
          window.requestAnimationFrame(animation)
          
        }
        window.requestAnimationFrame(animation)

        document.body.addEventListener('touchmove',this.bodyScroll,{passive: false})


        this.myCanvas.addEventListener('touchmove', this.handleTouchmove)
        this.myCanvas.addEventListener('touchstart',this.handleTouchstart)
        this.myCanvas.addEventListener('touchend',this.handleTouchend)
      })

    },
    hitStartPostion(val) {
      if (!val) {
        this.runDot()
        this.isRunDot = true
      } else {
        this.isRunDot = false
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  destroyed() {
  },
  mounted() {
    this.runDot()    
    this.isRunDot = true
  },
  methods: {
    runDot() {
      let angle = 0
      const anim = () => {
        angle = (angle + 1) % 90
        if (angle >= 0 && angle < 90) {
          this.cicleDotPostion = [Math.sin(angle / 180 * Math.PI) * CICLE_R + CICLE_CENTER[0],CICLE_CENTER[1] - Math.cos(angle / 180 * Math.PI) * CICLE_R]
        }
        if (this.isRunDot) {
          window.requestAnimationFrame(anim)
        }
      }
      window.requestAnimationFrame(anim)
      
    },
    bodyScroll(event) {
      event.preventDefault()
    },
    handleTouchend() {
      this.cicleDotPostion = CICLE_DOT_TOP_POSTION
      this.hitStartPostion = null
    },
    handleTouchmove(e) {
      if (!this.hitStartPostion) return false
    
      const { clientX, clientY } = e.touches[0]
      // 已圆心为原点，建立直角坐标系

      if (clientX < CICLE_CENTER[0] && clientY < CICLE_DOT_TOP_POSTION[1]) {
        return this.handleTouchend()
      }

      if (clientX < CICLE_CENTER[0]) {
        if (this.$options.tranceXList.reduce((acc, pre) => acc + pre, 0) / this.$options.tranceXList.length > CICLE_CENTER[0]) {
          if (this.$options.tranceYList.reduce((acc, pre) => acc + pre, 0) / this.$options.tranceYList.length < CICLE_CENTER[1]) { 
            return this.handleTouchend()
          }
        }
      }

      // 坐标转换
      const postionTransfrom = ([x, y]) => {
        const [x1, y1] = CICLE_CENTER
        return [x - x1, y1 -y]
      }
      
      const postionTransfromBack = ([x, y]) => {
        const [x1, y1] = CICLE_CENTER
        return [x + x1, y1 - y]
      }

      /**
       * 两点确定一条直线
       * y = kx + b
       * 根据两点确定 k, b = 0
       * 圆心向外指向
       */
      const calcLineParams = ([x1, y1], [x2, y2] = [0, 0]) => {
        if(x1 === x2) throw new Error('x1 === x2 !!')
        const k = (y1 - y2) / (x1 - x2)
        const b = y1 - k * x1
        return {k, b}
      }

      /**
       * 计算直线与圆交点
       * y = kx
       * x^2 + y^2 = r^2
       * @parmas {number} k 斜率
       * @parmas {number} r 半径
       * @return [x, y] x >= 0 另一个点原点对称 [-x, -y]
       */
      const calcNote = ({ k, r }) => {
        const x = Math.sqrt(Math.pow(r, 2) / (Math.pow(k, 2) + 1))
        const y = k * x
        return [x, y]
      }

      const [transClientX, transClientY] = postionTransfrom([clientX, clientY])
      const { k } = calcLineParams([transClientX, transClientY])

      const [x, y] = calcNote({ k, r: CICLE_R })

      // 根据实际手势位置判断所在象限
      if (transClientX >= 0) {
        this.cicleDotPostion = postionTransfromBack([x, y])
      } else {
        this.cicleDotPostion = postionTransfromBack([-x, -y])
      }
    },
    handleTouchstart(e) {
      const { clientX, clientY } = e.touches[0]
      
      if (isInRange(clientX, CICLE_DOT_TOP_POSTION[0]) && isInRange(clientY, CICLE_DOT_TOP_POSTION[1])) {
        this.hitStartPostion = [clientX, clientY]
      } else {
        this.hitStartPostion = null
      }
    },
    /**
     * 绘制背景颜色
     * 需要第一步执行
     * @param {*} ctx 
     */
    drawBg(ctx) {
      ctx.fillStyle = 'rgba(236, 236, 236, 1)'
      ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height)
    },
    /**
     * 绘制静态图片
     * 
     * @param {*} ctx 
     */
    drawStaticImage(ctx, textImage) {
      ctx.drawImage(textImage, 0, 0, 398, 91, 200,window.innerHeight - 300, 199 * 2, 45.5 * 2)
    },
    /**
     * 绘制静态文本
     * @param {*} ctx 
     */
    drawStaticText(ctx) {
      ctx.font = "24px serif"
      ctx.fillStyle = '#000'
      ctx.fillText('请打开声音', 100, window.innerHeight - 100)
    },
    drawRedDotAndText(ctx) {
      function rads(x) {
        return Math.PI * x / 180
      }
      function isNear(startAngle, endAngle, angle) {
        return startAngle <= angle && endAngle >= angle
      }
      const drawCircularText = (s, string, startAngle, endAngle) => {
        let radius = s.radius,
          angleDecrement = (startAngle - endAngle) / (string.length - 1),
          angle = parseFloat(startAngle),
          index = 0,
          character
        ctx.save()
        ctx.font = '20px text'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'

        while(index < string.length) {
          character = string.charAt(index)
          ctx.save()
          ctx.beginPath()
          ctx.fillStyle = isNear(startAngle + (index + 1) * angleDecrement, startAngle + (index) * angleDecrement, -(this.angle - 0.2)) ? '#ff0000' : 'black'
          ctx.translate(s.x + Math.sin(angle) * radius,
            s.y - Math.cos(angle) * radius)
          ctx.rotate(angle)
          ctx.fillText(character, 0, 0)
          angle -= angleDecrement
          index++
          ctx.restore()
        }
        ctx.restore()
      }
      drawCircularText({
        x: CICLE_CENTER[0],
        y: CICLE_CENTER[1],
        radius: CICLE_R - 20,
      }, '沿虚线滑动，开始立Flag', rads(10), rads(90))
      
    },
    /**
     * 绘制背景房子
     * 动效
     * @param {*} ctx 
     * @param {*} i 
     */
    drawHouse(ctx, i) {
      if (this.currentTransfromImage) {
        // ctx.clearRect(0, 280, 750, 1464)
        ctx.fillStyle = 'rgba(236, 236, 236, 1)'
        ctx.fillRect(0, 280, 750, 1464)
        ctx.drawImage(this.currentTransfromImage, 0, 0, window.innerWidth, window.innerHeight, 0, 0, 750, 1464)
        return false
      } 

      // if (i % 6 !== 0) return false
      const getHouseImage = i => {
        const [imageWidth, imageHeight] = [1504, 1504]
  
        const index = parseInt(i / 4) % this.startImageList.length
        const rest = i % 4
        return {
          image: this.startImageList[index].instance,
          x: rest === 0 || rest === 1 ? 0 : imageWidth / 2,
          y: rest === 0 || rest === 2 ? 0 : imageHeight / 2,
          w: imageWidth / 2,
          h: imageHeight / 2
        }
      }
  
      const index = parseInt(i / 6)
      const { image, x, y, w, h } = getHouseImage(index)
        
      ctx.clearRect(0, 280, 750, 640)
      ctx.fillStyle = 'rgba(236, 236, 236, 1)'
      ctx.fillRect(0, 280, 750, 640)
      ctx.drawImage(image, x, y, w, h, 0, 320, 750, 640)
      
    },
    drawDate(ctx) {
      const { days, hours, mins, seconds, isFeature } = calcDate(dayjs('2020-01-01').unix())
      
      ctx.font = "56px text"
      ctx.fillStyle = '#000'
      ctx.textAlign = "left"
      const titleText = isFeature ? '距离2020新年还有' : '200年新年已经过去了' 
      ctx.fillText(titleText, (this.myCanvas.width - ctx.measureText(titleText).width) / 2, 140)
      
      ctx.font = "160px text"
      ctx.fillStyle = '#ff0000'
      ctx.textAlign = "right"
      ctx.fillText(days, 400, 560) 

      ctx.font = "48px text"
      ctx.fillStyle = '#ff0000'
      ctx.textAlign = "left"
      ctx.fillText(hours < 10 ? '0' + hours : hours, 190, 660) 
      ctx.fillText(mins < 10 ? '0' + mins : mins, 310, 660) 
      ctx.fillText(seconds < 10 ? '0' + seconds : seconds, 430, 660) 

      ctx.font = "80px text"
      ctx.fillStyle = '#000'
      ctx.fillText('天', 404, 514)

      ctx.font = "40px text"
      ctx.fillStyle = '#000'
      
      ctx.fillText('时', 250, 664)
      ctx.fillText('分', 370, 664)
      ctx.fillText('秒', 490, 664)

      ctx.font = "24px text"
      ctx.fillText('days', 404, 570)
      ctx.fillText('hours', 200, 700)
      ctx.fillText('mins', 356, 700)
      ctx.fillText('ses', 480, 700)

      ctx.beginPath()
      ctx.setLineDash([])
      ctx.lineWidth = 1
      ctx.arc(CICLE_CENTER[0] - CICLE_R * Math.sin(Math.PI / 6), (CICLE_CENTER[1] - CICLE_R * Math.cos(Math.PI / 6)), 10, 0, Math.PI * 2, false)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.strokeStyle = '#ff0000'
      ctx.arc(CICLE_DOT_TOP_POSTION[0], CICLE_DOT_TOP_POSTION[1], 10, 0, Math.PI * 2, false)
      ctx.stroke()

      // draw red dot
      ctx.beginPath()
      ctx.fillStyle = '#ff0000'
      ctx.arc(this.cicleDotPostion[0], this.cicleDotPostion[1], 10, 0, Math.PI * 2, false)
      ctx.fill()

      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.setLineDash([2,10])
      ctx.arc(CICLE_CENTER[0], CICLE_CENTER[1], CICLE_R , - Math.PI / 2, Math.PI * 4 / 3, false)
      ctx.stroke()
    },
    drawAudioImage(ctx, i, audioImage) {
      const index = parseInt(i / 5)
      ctx.drawImage(audioImage, 0, index % 12 * 415 / 13, 57, 32, 40, window.innerHeight - 125, 57, 32)
    }
  },
  render(h) {
    if(!this.visible) return null
    return (
      <div refs="main" class="main">
        <canvas ref="canvas" width="375" height="667" style="touch-action:none; cursor: inherit;"></canvas>
      </div>
    )
  }
}