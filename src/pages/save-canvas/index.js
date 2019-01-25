import style from './index.module.styl'
import FlagList from '@/components/flag-list'
import html2canvas from 'html2canvas'

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
    'qrcode'
  ],
  data() {
    return {
      saveCanvasImage: null
    }
  },
  mounted() {
    const height = Math.max(this.$refs.textBox.offsetHeight, 240)
    this.$refs.endSave.style.height = height + 840 + 'px' 
    this.$refs.endMain.style.height = height + 720 + 'px'

    
    this.$nextTick(() => {

      let shareContent = this.$refs.endSave //需要截图的包裹的（原生的）DOM 对象
      let width = shareContent.offsetWidth //获取dom 宽度
      let height = shareContent.offsetHeight //获取dom 高度
      let canvas = document.createElement("canvas") //创建一个canvas节点
      let scale = 2 //定义任意放大倍数 支持小数
      canvas.width = width * scale //定义canvas 宽度 * 缩放
      canvas.height = height * scale //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale) //获取context,设置scale 

      let opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: true, //日志开关，便于查看html2canvas的内部执行流程
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
        this.saveCanvasImage = canvas.toDataURL('image/png')

        // const a = document.createElement('a')
        // a.download = `${name}.png`

        // a.href = canvas.toDataURL('image/png')
        // a.click()
      })
    })
  },
  render(h) {
    if (!this.visible) return null
    const canvasHeight = window.document.body.offsetHeight

    return (
      <div style={`height: ${canvasHeight}px`} class={style['save-canvas']}>
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
              <div class={style['sign-name']}>{this.signName || 'adadad'}</div>
              <div class={style['sign-time-box']}>
                <div class={style['sign-time']}>立于{this.signTime}</div>
                <div class={style['flag']}></div>
              </div>
              <div class={style['qrcode-scan']}>
                <img src={this.qrcode} alt=""/>
              </div>
            </div>
          </div>
        </div>
        <img class={style['save-image']} src={this.saveCanvasImage} />
      </div>
    )
  }
}