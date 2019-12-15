import style from './index.module.styl'
import FlagList from '@/components/flag-list'
import html2canvas from 'html2canvas'

const canvasHeight = window.document.body.offsetHeight


export default {
  components: {
    FlagList
  },
  props: [
    'visible',
    'selectedFlagList',
    'backgroundColor',
    'signName',
    'signTime',
    'image',
  ],
  data() {
    return {
      qrcodeImage: null
    }
  },
  async mounted() {
    const height =this.$refs.textBox.offsetHeight
    this.$refs.endSave.style.height =  Math.max(height + 840, canvasHeight) + 'px' 
    this.$refs.endMain.style.height = Math.max(height + 720, canvasHeight -120) + 'px'

    const generateQRCodeImageURL = async link => {
      const QRCode = (await import('qrcodejs')).default
      const imgURL = await new Promise(resolve => {
        const div = document.createElement('div')

        new QRCode(div, {
          text: link,
          width: 400,
          height: 400
        })

        div.firstElementChild.toBlob(blob => {
          resolve(window.URL.createObjectURL(blob))
        })
      })
      return imgURL
    }
    
    this.qrcodeImage = await generateQRCodeImageURL(window.location.origin + window.location.pathname)

    this.$nextTick(() => {

      let shareContent = this.$refs.endSave //需要截图的包裹的（原生的）DOM 对象
      let width = shareContent.offsetWidth //获取dom 宽度
      let height = shareContent.offsetHeight //获取dom 高度
      let canvas = document.createElement("canvas") //创建一个canvas节点
      let scale = 1 //定义任意放大倍数 支持小数
      canvas.width = width * scale //定义canvas 宽度 * 缩放
      canvas.height = height * scale //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale) //获取context,设置scale 

      let opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: false, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
      }

       
      html2canvas(this.$refs.endSave, opts).then(canvas => {
        
        let context = canvas.getContext('2d')
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        this.$emit('saveImageSuccess', canvas.toDataURL('image/png'))
        // const a = document.createElement('a')
        // a.download = `${name}.png`
        // a.href = canvas.toDataURL('image/png')
        // a.click()

      })
    })
  },
  render(h) {
    if (!this.visible) return null
    

    return (
      <div style={`height: ${canvasHeight}px`} class={style['save-canvas']} >
        <div ref="endSave" style={`background-color: ${this.backgroundColor};`} class={style['end-save']}>
          <div ref="endMain" class={style['end-main']}>
            <div class={style['end-bg']}>
              <div class={style['bottom-white']}></div>
            </div>
            <div class={style['top-title']}></div>
            <div class={style['img-box']}>
              <div class={style['img']}>
                <img src={this.image} />
              </div>
            </div>
            <div ref="textBox" class={style['text-box']}>
              <flag-list selectedFlagList={this.selectedFlagList} />
            </div>
            <div class={style['end-bottom']}>
              <div class={style['sign-name']}>{this.signName}</div>
              <div class={style['sign-time-box']}>
                <div class={style['sign-time']}>立于{this.signTime}</div>
                <div class={style['flag']}></div>
              </div>
              <div class={style['qrcode-scan']}>
                <img src={this.qrcodeImage} alt=""/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}