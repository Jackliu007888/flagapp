import { calcDate } from '@/common/js/countdown'
import dayjs from 'dayjs'

const isInRange = (p0, p1, range = 70) => {
  return Math.abs(p0 - p1) <= range
}

const CICLE_CENTER = [341, 586]
const CICLE_R = 236
const CICLE_DOT_TOP_POSTION = [CICLE_CENTER[0], CICLE_CENTER[1] - CICLE_R]

const AUDIO_IMAGE = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/first/music.png'
const TEXT_IMAGE = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/first/bottom_text.png'

export default {
  props: ['startImageList', 'transformImageList', 'visible'],
  data() {
    return {
      currentTransfromImage: null,
      hitStartPostion: [],
      hitEndPostion: [],
      cicleDotPostion: CICLE_DOT_TOP_POSTION
    }
  },
  computed: {
    /**
     * 0 - Math.PI
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
      if (!val) return (this.currentTransfromImage = null)

      if (val > Math.PI * 5 / 3) {
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
          i++
          window.requestAnimationFrame(animation)
          
        }
        window.requestAnimationFrame(animation)

        document.body.addEventListener('touchmove',this.bodyScroll,{passive: false})


        this.myCanvas.addEventListener('touchmove', this.handleTouchmove)
        this.myCanvas.addEventListener('touchstart',this.handleTouchstart)
        this.myCanvas.addEventListener('touchend',this.handleTouchend)
      })

    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  destroyed() {
  },
  methods: {
    bodyScroll(event) {
      event.preventDefault()
    },
    handleTouchend() {
      this.cicleDotPostion = CICLE_DOT_TOP_POSTION
    },
    handleTouchmove(e) {
      if (!this.hitStartPostion.length) return false
      
      const { clientX, clientY } = e.touches[0]
      // 已圆心为原点，建立直角坐标系

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
       * 根据两点确定 k, b
       * 圆心向外指向
       */
      const getLine = ([x1, y1], [x2, y2] = [0, 0]) => {
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
      const { k } = getLine([transClientX, transClientY])
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
      console.log(clientX, clientY)
      
      if (isInRange(clientX, 341) && isInRange(clientY, 368)) {
        this.hitStartPostion = [clientX, clientY]
      } else {
        this.hitStartPostion = []
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
      const { days, hours, mins, seconds, isFeature } = calcDate(dayjs('2019-02-05').unix())
      
      ctx.font = "56px text"
      ctx.fillStyle = '#000'
      ctx.textAlign = "left"
      const titleText = isFeature ? '距离2019年春节还有' : '2019年春节已经过去了' 
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
      
      // ctx.beginPath()
      // ctx.arc(CICLE_DOT_TOP_POSTION[0], CICLE_DOT_TOP_POSTION[1], 10, 0, Math.PI * 2, false)
      // ctx.stroke()

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