import { calcDate } from '@/common/js/countdown'
import dayjs from 'dayjs'

const BASE_FREQUENCY = 10
const WINDOW_BASE_WIDTH = 375

export default {
  mounted() {
    const myCanvas = this.myCanvas = this.$refs.canvas
    window.addEventListener("resize", resizeCanvas, false)
    function resizeCanvas() {
      myCanvas.width = window.innerWidth
      myCanvas.height = window.innerHeight
    }
    resizeCanvas()
    this.resizeTimes = window.innerWidth / WINDOW_BASE_WIDTH

    const ctx = this.ctx = myCanvas.getContext('2d')
    
    // 绘制静态内容
    this.drawBg(ctx)
    this.drawStaticImage(ctx)
    this.drawStaticText(ctx)

    // 绘制动态内容
    let i = 0
    this.timer = setInterval(() => {
      this.drawAudioImage(ctx, i)
      this.drawHouse(ctx, i)
      i ++
    }, BASE_FREQUENCY)

  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
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
    drawStaticImage(ctx) {
      const textImage = new Image()
      textImage.onload = () => {
        ctx.drawImage(textImage, 0, 0, 398, 91, 100 * this.resizeTimes, 500 * this.resizeTimes, 199 * this.resizeTimes, 45.5 * this.resizeTimes)
      }
      textImage.src = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/first/bottom_text.png'

      const logoImage = new Image()
      logoImage.onload = () => {
        ctx.drawImage(logoImage, 0, 0, 505, 68, 0, 10 * this.resizeTimes, 254.5 * this.resizeTimes, 34 * this.resizeTimes)
      }
      logoImage.src = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/first/top_logo2.jpg'
    },
    /**
     * 绘制静态文本
     * @param {*} ctx 
     */
    drawStaticText(ctx) {
      ctx.font = "24px serif"
      ctx.fillStyle = '#000'
      ctx.fillText('请打开声音', 50 * this.resizeTimes, 614 * this.resizeTimes)
    },
    /**
     * 绘制背景房子
     * 动效
     * @param {*} ctx 
     * @param {*} i 
     */
    drawHouse(ctx, i) {
      if (i % 6 !== 0) return false
      const getHouseImage = i => {
        const baseUrl = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/start1/'
        const [imageWidth, imageHeight] = [1504, 1504]
        const imageList = new Array(50).fill(0).map((item, index) => baseUrl + index + '.jpg')
  
        const index = parseInt(i / 4) % imageList.length
        const rest = i % 4
        return {
          src: imageList[index],
          x: rest === 0 || rest === 1 ? 0 : imageWidth / 2,
          y: rest === 0 || rest === 2 ? 0 : imageHeight / 2,
          w: imageWidth / 2,
          h: imageHeight / 2
        }
      }
  
      const index = i / 6
      const image = new Image()
      const { src, x, y, w, h, feature } = getHouseImage(index)
      image.src = src
        
      ctx.clearRect(0, 140 * this.resizeTimes, 375 * this.resizeTimes, 320* this.resizeTimes)
      ctx.fillStyle = 'rgba(236, 236, 236, 1)'
      ctx.fillRect(0, 140 * this.resizeTimes, 375 * this.resizeTimes, 320* this.resizeTimes)
      ctx.drawImage(image, x, y, w, h, 0, 160 * this.resizeTimes, 375 * this.resizeTimes, 320* this.resizeTimes)
  
      const { days, hours, mins, seconds } = calcDate(dayjs('2019-01-01').unix())
      
      ctx.font = "56px serif"
      ctx.fillStyle = '#000'
      const titleText = feature ? '距离2019年还有' : '2019年已经过去了' 
      ctx.fillText(titleText, (this.myCanvas.width - ctx.measureText(titleText).width) / 2, 160 * this.resizeTimes)
      
      ctx.font = "200px serif"
      ctx.fillStyle = '#ff0000'
      ctx.fillText(days, (375 - 275) * this.resizeTimes, 280 * this.resizeTimes) 

      ctx.font = "48px serif"
      ctx.fillStyle = '#ff0000'
      ctx.fillText(hours < 10 ? '0' + hours : hours, 94 * this.resizeTimes, 330 * this.resizeTimes) 
      ctx.fillText(mins < 10 ? '0' + mins : mins, 160 * this.resizeTimes, 330 * this.resizeTimes) 
      ctx.fillText(seconds < 10 ? '0' + seconds : seconds, 216 * this.resizeTimes, 330 * this.resizeTimes) 

      ctx.font = "80px serif"
      ctx.fillStyle = '#000'
      ctx.fillText('天', 202 * this.resizeTimes, 262 * this.resizeTimes)

      ctx.font = "40px serif"
      ctx.fillStyle = '#000'
      
      ctx.fillText('时', 120 * this.resizeTimes, 330 * this.resizeTimes)
      ctx.fillText('分', 186 * this.resizeTimes, 330 * this.resizeTimes)
      ctx.fillText('秒', 242 * this.resizeTimes, 330 * this.resizeTimes)

      ctx.font = "32px serif"
      ctx.fillText('days', 202 * this.resizeTimes, 285 * this.resizeTimes)
      ctx.fillText('hours', 100 * this.resizeTimes, 350 * this.resizeTimes)
      ctx.fillText('mins', 178 * this.resizeTimes, 350 * this.resizeTimes)
      ctx.fillText('ses', 240 * this.resizeTimes, 350 * this.resizeTimes)

      ctx.beginPath()
      ctx.setLineDash([])
      ctx.lineWidth = 1
      ctx.arc((170 - 118 * Math.sin(Math.PI / 6)) * this.resizeTimes, (300 - 118 * Math.cos(Math.PI / 6)) * this.resizeTimes, 5 * this.resizeTimes, 0, Math.PI * 2, false)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(170 * this.resizeTimes, 182 * this.resizeTimes, 5 * this.resizeTimes, 0, Math.PI * 2, false)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.setLineDash([2,10])
      ctx.arc(170 * this.resizeTimes, 300 * this.resizeTimes, 118 * this.resizeTimes, - Math.PI / 2, Math.PI * 4 / 3, false)
      ctx.stroke()

      this.myCanvas.addEventListener("mousemove", function(event) {
        if(event.region) {
          console.log("hit region: " + event.region)
        }
      })


    },
    drawAudioImage(ctx, i) {
      if (!i % 5 !== 0) return false

      const index = parseInt(i / 5)

      const audioImage = new Image()
      audioImage.onload = () => {
        ctx.clearRect(20 * this.resizeTimes, 600 * this.resizeTimes, 28.5 * this.resizeTimes, 16 * this.resizeTimes)
        ctx.fillStyle = 'rgba(236, 236, 236, 1)'
        ctx.fillRect(20 * this.resizeTimes, 600 * this.resizeTimes, 28.5 * this.resizeTimes, 16 * this.resizeTimes)
        ctx.drawImage(audioImage, 0, index % 12 * 415 / 13, 57, 32, 20 * this.resizeTimes, 600 * this.resizeTimes, 28.5 * this.resizeTimes, 16 * this.resizeTimes)
      }
      audioImage.src = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/first/music.png'
    }
  },
  render(h) {
    return (
      <div class="main">
        <canvas ref="canvas" width="375" height="667" style="touch-action:none; cursor: inherit;"></canvas>
      </div>
    )
  }
}