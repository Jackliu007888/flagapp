import style from './index.module.styl'
import { COLOR_LIST, IMAGE_LIST } from './enum.js'
import SaveCanvas from '@/pages/save-canvas'
import FlagList from '@/components/flag-list'
import dayjs from 'dayjs'

const RULER_RANGE = [90, 636]
const CHOOSER = ['color', 'image']
export default {
  props: ['visible', 'selectedFlagList'],
  components: {
    SaveCanvas,
    FlagList
  },
  data() {
    return {
      showSaveCanvas: false,
      currentChooser: CHOOSER[0],
      currentImage: IMAGE_LIST[0],
      ruleX: 405,
      step3Flash: false,
      isStep3Fade: false,
      isStep3: false,
      clickedImageChooser: false,
      isShow: false,
      rulerChanged: false,
      chooseMainColor: COLOR_LIST[0].main,
      step3Checked: false,
      nameInputValue: null
    }
  },
  mounted() {
    this.isShow = true
  },
  computed: {
    splitsColor() {
      const item = COLOR_LIST.find(d => d.main === this.chooseMainColor)
      return item ? item.splits : []
    },
    currentSplitColor() {
      const splitWidth = 78
      const rulerWidth = 22
      const baseX = 63
      const index = parseInt((this.ruleX - baseX + (rulerWidth / 2)) / splitWidth)
      return this.splitsColor[index]
    }
  },
  methods: {
    handleClickConfirm() {
      if (!this.nameInputValue) {
        return alert('请输入名字！')
      }
      this.showSaveCanvas = true
    },
    handleChangeMainColor(e) {
      const { mainColor } = e.currentTarget.dataset
      this.chooseMainColor = mainColor
    },
    handleMoveRuler(e) {
      if(!this.ruleStartX) return false
      const [min, max] = RULER_RANGE
      this.ruleX = Math.max(Math.min(e.targetTouches[0].clientX - this.ruleStartX, max), min)
    },
    handleRulerTouchEnd() {
      this.ruleStartX = null
    },
    handleRulerTouchStart(e) {
      this.rulerChanged = true
      this.ruleStartX = e.targetTouches[0].clientX - this.ruleX
    },
    handleClickSplit(e) {
      const [min, max] = RULER_RANGE
      this.ruleX = Math.max(Math.min(e.clientX, max), min)
    },
    handleClickChoose(e) {
      const { choose } = e.currentTarget.dataset
      if (choose === CHOOSER[1]) {
        this.clickedImageChooser = true
      }
      this.currentChooser = choose
    },
    handleClickImage(e) {
      const { index } = e.currentTarget.dataset
      this.currentImage = IMAGE_LIST[index]
    },
    handleGoSign() {
      this.isStep3 = true
      setTimeout(() => {
        this.isStep3Fade = true
      }, 300)
      setTimeout(() => {
        this.$refs.step2.style.display = 'none'
      }, 600)
    },
    handleClickStep3Check() {
      this.step3Checked = true
      this.step3Flash = false
    },
    handleClickNameBox() {
      if (!this.step3Checked) {
        this.step3Flash = true
        setTimeout(() => {
          this.step3Flash = false
        }, 3000)
        return false
      }
      
      this.$refs.namePlaceholder.style.display = 'none'
      this.$refs.nameInput.focus()
    },
    handleInputFocus() {
      this.$refs.namePlaceholder.style.display = 'none'
    },
    handleInputBlur() {
      if (!this.nameInputValue) {
        this.$refs.namePlaceholder.style.display = 'block'
      }
    },
    handleNameInputChange(e) {
      this.nameInputValue = e.currentTarget.value
    }
  },
  render(h) {
    if(!this.visible) return null
    // const px2rem = (value, rootValue = 20, unitPrecision = 5) => (value / rootValue).toFixed(unitPrecision)

    const settingsStyle = {
      backgroundColor: this.currentSplitColor,
      display: 'block',
      transformOrigin: '0px 0px 0px',
      transform: 'scale(1, 1)',
      opacity: 1
    }
    return (
      <div
        class={{
          [style['settings']]: true,
          [style['show']]: this.isShow
        }}
        style={settingsStyle}
      >
        <div
          style={!this.isStep3 ? `display: block;` : `display:none;`}
          class={style['top-tips']}></div>
        <div style={this.isStep3 ? `display: block;` : `display:none;`} class={style['step3-tips']}></div>
        <div class={style['settings-main']}>
          <div class={[style['step3'], style['show-step3']]}>
            <div class={style['step3-text']}></div>
            <div class={{
              [style['read']]: true,
              [style['check']]: this.step3Checked,
              [style['flash']]: this.step3Flash
            }}>
              <div onClick={this.handleClickStep3Check} class={style['read-circle']}></div>
              <div onClick={this.handleClickStep3Check} class={style['read-text']}></div>
            </div>
            <div class={style['name-box']} onClick={this.handleClickNameBox}>
              <div ref="namePlaceholder" class={style['name-placeholder']}>
                <div class={style['name-left-line']}></div>              
              </div>
              <input
                value={this.nameInputValue}
                onInput={this.handleNameInputChange}
                ref="nameInput"
                v-scrollToTopOnBlur
                onFocus={this.handleInputFocus}
                type="text"
                class={style['name']} />
              <div class={style['name-mask']}></div>
            </div>
            <div onClick={this.handleClickConfirm} class={style['confirm']}></div>
          </div>
          <div
            ref="step2"
            class={{
              [style['step-2']]: true,
              [style['go-down']]: this.isStep3,
              [style['fade']]: this.isStep3Fade,
            }}>
            <div class={style['top-title']}>
            </div>
            <div class={style['img-box']}>
              <div class={style['img-bg']} ></div>
              <div style={`background-image: url('${this.currentImage}')`} class={style['img']}></div>
            </div>
            <div class={style['text-box']}>
              <div class={style['text-scroll-box']}>
                <flag-list selectedFlagList={this.selectedFlagList} />
              </div>
            </div>
          </div>
          <img src={this.currentImage} />
        </div>
        <div style={this.isStep3 && `transform: translate3d(0, 21rem, 0)`} class={style['bottom-settings']}>
          <div class={style['choose-main']}>
            <div style={this.currentChooser === CHOOSER[0] ? 'display: block;' : 'display: none;' } class={style['colors-box']}>
              <div class={style['colors-main']}>
                <ul>
                  {
                    COLOR_LIST.map(d => (
                      <li
                        onClick={this.handleChangeMainColor}
                        data-main-color={d.main}
                        key={d.main}
                        style={{ backgroundColor: d.main }}
                        class={{ [style['chosen']]: this.chooseMainColor === d.main }}></li>
                    ))
                  }
                </ul>
              </div>
              <div class={style['colors-split']}>
                <div class={style['outline']}>
                  <div class={style['splits']}>
                    {
                      this.splitsColor.map(d => (
                        <div onClick={this.handleClickSplit} style={`background-color: ${d}`} class={style['split']}></div>
                      ))
                    }
                  </div>
                </div>
                <div
                  onTouchstart={this.handleRulerTouchStart}
                  onTouchmove={this.handleMoveRuler}
                  onTouchend={this.handleRulerTouchEnd}
                  style={`left: ${(this.ruleX)}px`}
                  class={{
                    [style['ruler']]: true,
                    [style['ruler-ani']]: !this.rulerChanged,
                  }}
                ></div>
              </div>
            </div>
            <div style={this.currentChooser === CHOOSER[1] ? 'display: block;' : 'display: none;'} class={style['image-box']}>
              <ul class={style['image-list']}>
                {
                  IMAGE_LIST.map((item, index) => (
                    <li data-index={index} onClick={this.handleClickImage} key={index} style={`background-image: url('${item}')`}></li>
                  ))
                }
              </ul>
            </div>
          </div>
          <div class={style['choose-list']}>
            <div
              onClick={this.handleClickChoose}
              data-choose={CHOOSER[0]}
              class={{
                [style['color-choose']]: true,
                [style['active']]: this.currentChooser === CHOOSER[0]
              }}>
            </div>
            <div
              onClick={this.handleClickChoose}
              data-choose={CHOOSER[1]}
              class={{
                [style['image-choose']]: true,
                [style['active']]: this.currentChooser === CHOOSER[1]
              }}>
            </div>
          </div>
          <div class={style['return']}></div>
          <div onClick={this.handleClickChoose} data-choose={CHOOSER[1]} style={!this.clickedImageChooser ? `display: block;` : `display:none;`} class={style['continue']}></div>
          <div style={this.clickedImageChooser ? `display: block;` : `display:none;`} onClick={this.handleGoSign} class={style['go-sign']}></div>
        </div>
        {
          this.showSaveCanvas && (
            <save-canvas
              backgroundColor={this.chooseMainColor}
              selectedFlagList={this.selectedFlagList}
              signName={this.nameInputValue}
              signTime={dayjs().format('YYYY-MM-DD HH:mm')}
              image={this.currentImage}
              qrcode={this.currentImage}
              visible={true}
              onSaveImageSuccess={(val) => this.$emit('saveImageSuccess', val)}
            />
          )
        }
      </div>
    )
  }
}