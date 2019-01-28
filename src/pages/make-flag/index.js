import goImg from '@/assets/img/make-flag/go.png'
import goClickImg from '@/assets/img/make-flag/go_click.png'
import triangleImg from '@/assets/img/make-flag/triangle.png'
import Konva from 'Konva'
import style from './index.module.styl'

import FLAGS from './flags'
import SENSITIVE from './sensitive'
import UUID from 'uuid'

export default {
  props: ['makeFlagImageList', 'visible'],
  triangleConfig: null,
  goConfig: null,
  goClickConfig: null,
  flagBgConfig: null,
  peopleConfig: null,
  configKonva: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  bgConfig:{
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    fill: '#ececec'
  },
  btnConfig: {
    width: 330,
    height: 96,
    x: 210,
    y: 914,
    stroke: '#ed593f',
    strokeWidth: 2
  },
  innerBtnConfig: {
    width: 12,
    height: 96,
    x: 210,
    y: 914,
    fill: '#ed593f',
  },
  groupConfig: {
    clip: {
      width: 330,
      height: 96,
      x: 210,
      y: 914,
    }
  },
  data() {
    return {
      angle: 0,
      isBtnLocked: false,
      startAnimBg: false,
      inputContent: '',
      flagFoldSwithStatus: false,
      indexStatus: false,
      resultText: [],
      selectedFlagList: [],
      flagTextList: [
        '做个自律的人',
        '遇到喜欢的人要主动一点',
        '学会拒绝和说不',
        '瘦10斤',
        '多认识一些新朋友',
        '告别丧丧的自己',
      ],
      animetionTextOver: false,
      showText: false,
      loadOver: false,
      snowConfig: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        heigh: window.innerHeight,
        image: {}
      },
      groundConfig: {
        width: window.innerWidth,
        height: 400,
        x: 0,
        y: window.innerHeight - 400,
        image: {}
      },
      show: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.start()
      } else {
        this.anim.stop()
        this.btnAnim.stop()
      }
    },
    flagFoldSwithStatus(val) {
      if (val) {
        return (this.indexStatus = val)
      } 
      setTimeout(() => {
        this.indexStatus = val
      }, 200)
    }
  },
  computed: {
    selectedFlagListLength() {
      return this.selectedFlagList.length
    }
  },
  methods: {
    async startAnimaition([x, y]) {

      class Star {
        constructor({pos: [x, y] , target: [targetX, targetY] = [40, 40], size: size = 40, onRuning: onRuning = () => {}}) {
          this.x = x
          this.y = y
          this.targetX = targetX
          this.targetY = targetY

          this.star = document.createElement('div')
          this.star.id = UUID()
          document.body.appendChild(this.star)
          this.star.innerText = '🌟'
          this.star.style.position = 'absolute'
          this.star.style.fontSize = size + 'px'

          this.onRuning = onRuning

          this.animation()
        }

        animation() {
          let i = 0
          const diff = 10
          this.onRuning(true)
          
          const anim = () => {
            if (Math.abs(this.targetX - this.x) < diff && Math.abs(this.targetY - this.y) < diff) {
              this.star.style.opacity = 0
              document.body.removeChild(this.star)
              this.star = null

              this.onRuning && this.onRuning(false)
              return false
            }
            this.x += (this.targetX - this.x) / 400 * i
            this.y += (this.targetY - this.y) / 200 * i

            this.star.style.left = this.x + 'px'
            this.star.style.top = this.y + 'px'
          
            i++
            window.requestAnimationFrame(anim)
          }
          window.requestAnimationFrame(anim)
        }
      }

      const star = new Star({
        pos: [x, y],
        target: [40, 40],
        size: 40,
        onRuning: bool => {
          if (bool) {
            let i = 3
            const newRandomStar = () => new Star({ pos: [star.x, star.y], target: [star.x + (Math.random() * 50 - 10), star.y + (Math.random() * 20 + 20)], size: Math.random() > 0.5 ? 30 : 15 })
            
            this.intervalTimer = setInterval(() => {
              i && new Array(i--).fill().forEach(() => newRandomStar())
            }, 200)
          } else {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
          }
        }
      })
    },
    async start() {
      const makeFlagBgList = this.makeFlagImageList.filter(d => d.screen === 'makeFlag' && d.name.includes('snow/a_000')).map(d => d.instance)
      let len = makeFlagBgList.length

      const groundImageList = this.makeFlagImageList.filter(d => d.screen === 'makeFlag' && d.name.includes('ground_grow/a_00')).map(d => d.instance)

      let i = 0
      const animateBg = () => {
        const image = makeFlagBgList[parseInt(i % len)]
        Object.assign(this.snowConfig, { image })
       
        if (this.startAnimBg) {
          Object.assign(this.groundConfig, {
            image: groundImageList[parseInt(i % groundImageList.length)]
          })
        }

        window.requestAnimationFrame(animateBg)
        i += 0.25
      }

      window.requestAnimationFrame(animateBg)

      // ios bug
      Object.assign(this.snowConfig, {
        image:makeFlagBgList[0]
      })
      const flagBgImage = this.makeFlagImageList.find(d => d.name === 'flagBgImage')
      const peopleImage = this.makeFlagImageList.find(d => d.name === 'peopleImage')

      this.$options.flagBgConfig = {
        width: 650,
        height: 672,
        x: window.innerWidth - 650,
        y: 120,
        image: flagBgImage.instance
      }
      this.$options.peopleConfig, {
        image: peopleImage.instance,
        width: 352,
        height: 344,
        x: window.innerWidth - 352,
        y: window.innerHeight - 344,
      }
      if (!this.startAnimBg) {
        Object.assign(this.groundConfig, {
          image: groundImageList[0]
        })
      }
     

      const loadImage = src => {
        return new Promise((resolve, reject) => {
          const image = new Image()
          image.onload = () => { resolve(image) }
          image.onerror = e => { reject(e) }
          image.src = src
        })
      }

      let loadImageList = []
      loadImageList = await Promise.all([
        loadImage(triangleImg),
        loadImage(goImg),
        loadImage(goClickImg),
      ])
      this.$options.triangleConfig = {
        width: 24,
        height: 12,
        x: 375,
        y: 860,
        image: loadImageList[0]
      }
      this.$options.goConfig = {
        width: 148,
        height: 39,
        x: 306,
        y: 940 ,
        clip: {
          width: 148,
          height: 39,
          x: 306,
          y: 940,
        },
        image: loadImageList[1]
      }
      this.$options.goClickConfig = {
        width: 148,
        height: 39,
        x: 306,
        y: 940 ,
        image: loadImageList[2]
      }
      this.loadOver = true

      this.$nextTick(() => {
        const amplitude = 12
        const period = 3000 // in ms
        const centerY = this.$refs.triangle.getStage().getY()
        this.anim = new Konva.Animation(frame => {
          const t = frame.time % (period / 4)

          this.$refs.triangle.getStage().setY(amplitude * Math.sin(t * 2 * Math.PI / period) + centerY)
          this.$refs.triangle.getStage().setOpacity(1 * Math.cos(t * 2 * Math.PI / period))
        }, this.$refs.layer.getStage())
  
        this.anim.start()
      })
    },
    setBtnAnimation() {
      if (this.isBtnLocked) return false
      this.isBtnLocked = true
      const amplitude = 74
      const period = 500 // in ms
      const btnX = this.$refs.btn.getStage().getX()
      const innerBtnWidth = this.$refs.innerBtn.getStage().getWidth()
      this.btnAnim = new Konva.Animation(frame => {
        const diff = amplitude * (frame.time / period)
        if (diff + innerBtnWidth <= 310) {
          this.$refs.group.getStage().setClip({
            x: diff + btnX + 6,
          })
          this.$refs.innerBtn.getStage().setWidth(diff + innerBtnWidth)
        } else {
          this.$refs.goClick.getStage().hide()
          this.$refs.group.getStage().hide()
          this.$refs.btn.getStage().hide()
          this.$refs.innerBtn.getStage().hide()
        }
      }, this.$refs.layer.getStage())

      this.btnAnim.start()
      this.$refs.triangle.getStage().hide()
      this.$refs.flag.getStage().hide()
      this.$refs.people.getStage().hide()

      this.startAnimBg = true

      setTimeout(() => {
        this.showText = true
        this.animationFlagText()
      }, 2000)
    },
    animationFlagText() {

      const getAbsPostion = (level, row) => {
        const baseX = level % 2 === 0 ? 0 : 160
        const baseY = parseInt(level / 2) * 86
        const diffX = (row % 7) * 18
        const diffY = parseInt(row / 7) * 18
        return {
          x: baseX + diffX + 42.5,
          y: baseY + diffY + 160
        }
      }
  
      const checkHit = ({ x, y }, list) => {
        const [w, h] = [18, 18]
  
        return list.some(pos => {
          const x1 = pos.x
          const y1 = pos.y
          if (x1 >= x) {
            if (x1 >= x + w) return false
            if (y1 >= y + h) return false
            if (y >= y1 + h) return false
          }
          if (x > x1) {
            if (x >= x1 + w) return false
            if (y1 >= y + h) return false
            if (y >= y1 + h) return false
          }
          return true
        })
      }
      const getRandomPos = () => {
        return {
          x: Math.min(Math.random() * 340 + 20, 355), 
          y: Math.random() * 150 + 500, 
        }
      }
  
      const getList = len => {
        let list = []
        const getPosList = () => {
          const pos = getRandomPos()
          if (checkHit(pos, list)) {
            getPosList()
          } else {
            list.push(pos)
          }
        }
        while (list.length < len) {
          getPosList()
        }
        return list
      }
     
      const getResultText = () => {
        let result = []
        this.flagTextList.map(d => d.split('')).forEach((item, index) => {
          item.forEach((itm, idx) => {
            const pos = getAbsPostion(index, idx)
            result.push({
              text: itm,
              level: index,
              row: idx,
              // x: px2rem(pos.x) + 'rem',
              // y: px2rem(pos.y) + 'rem'
              x: pos.x,
              y: pos.y
            }) 
          })
        })
        const randomPostionList = getList(result.length)
        randomPostionList.forEach((item, index) => {
          result[index].rx = item.x,
          result[index].ry = item.y
          // result[index].rx = px2rem(item.x) + 'rem',
          // result[index].ry = px2rem(item.y) + 'rem'
        })
  
        return result
      }
  
      const getDiffPos = ({ x, y, rx, ry }, time) => {
        return {
          x: rx - (rx - x) / time,
          y: ry - (ry - y) / time
        }
      }
    
      this.resultText = getResultText()
  
      this.timer = setInterval(() => {
        const checkD = (unitPrecision = 5) => this.resultText.some(({x, y, rx, ry}) => {
          if (Math.abs(x - rx) > unitPrecision || Math.abs(y - ry) > unitPrecision) {
            return false
          }
          return true
        })
        if (checkD()) {
          this.animetionTextOver = true
          clearInterval(this.timer)
          return this.timer = null
        }
        this.resultText = this.resultText.map(item => {
          const {x, y} = getDiffPos(item, 10)
          return {
            ...item,
            rx: x,
            ry: y
          }
        })
      }, 100)
    },
    handleConfirmInput(e) {
      if (!this.inputContent) return false
      
      if (SENSITIVE.includes(this.inputContent)) {
        alert('咦～您输入的个别字符不太对劲，请重新输入')
        this.inputContent = ''
        return false
      }
      this.startAnimaition([e.clientX, e.clientY])
      this.selectedFlagList.push(this.inputContent)
      this.inputContent = ''
    },
    handleChangeInputValue(e) {
      this.inputContent = e.currentTarget.value
    },
    handleClickFlag(e) {
      this.startAnimaition([e.clientX, e.clientY])
      const { text } = e.currentTarget.dataset
      this.selectedFlagList.push(text)
    },
    handleInputFocus() {
      this.$refs.placeholder.style.display = 'none'
      this.$refs.next.style.display = 'none'
      this.$refs.ok.style.display = 'block'
    },
    handleInputBlur() {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
        window.scrollTo(0, Math.max(scrollHeight - 1, 0))
      }, 100)

      this.$refs.next.style.display = 'block'

      if (!this.inputContent) {
        this.$refs.placeholder.style.display = 'block'
        this.$refs.ok.style.display = 'none'
      }
      
    },
    handleOpenFold(e) {
      e.stopPropagation()
      this.flagFoldSwithStatus = true
    },
    handleCloseFold(e) {
      e.stopPropagation()
      this.flagFoldSwithStatus = false
    },
    handleDeleteFlag(e) {
      e.stopPropagation()
      const {index} = e.currentTarget.dataset
      this.selectedFlagList.splice(index, 1)
    },
    handleChangeFlag() {
      if(!this.animetionTextOver) return false
      const shuffle = arr => {
        let n = arr.length, random
        while(0 !== n){
          random =  (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
          [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
        }
        return arr
      }

      const rotate = () => {
        this.angle+=180
        this.$refs['rotate-btn'].style.transform = `rotate(${this.angle}deg)`
      }
      
      
      rotate()
      this.flagTextList = new Array(6).fill(0).map((item, index) => shuffle(FLAGS)[index])
    },
    handleClickNext() {
      if(!this.animetionTextOver) return false
      if (!this.selectedFlagListLength) {
        return alert('立下你的 flag 吧！')
      }
      setTimeout(() => {
        this.$emit('next', this.selectedFlagList)
      }, 300)
    }
  },
  render(h) {
    if(!this.visible) return null
    if(!this.loadOver) return null

    const px2rem = (value, rootValue = 20, unitPrecision = 5) => (value / rootValue).toFixed(unitPrecision)
    return (
      <div class={style['main']}>
        <v-stage ref="stage" config={this.$options.configKonva}>
          <v-layer ref="layer">
            <v-rect config={this.$options.bgConfig} />
            <v-image ref="flag" config={this.$options.flagBgConfig} />
            <v-image config={this.groundConfig} />
            <v-image ref="people" config={this.$options.peopleConfig} />
            <v-image config={this.snowConfig}/>
            <v-image ref="triangle" config={this.$options.triangleConfig} />
            <v-rect ref="btn" onTap={this.setBtnAnimation} onClick={this.setBtnAnimation} config={this.$options.btnConfig} />
            <v-rect ref="innerBtn"  config={this.$options.innerBtnConfig} />
            <v-image ref="goClick" config={this.$options.goClickConfig} />
            <v-group ref="group" onTap={this.setBtnAnimation} onClick={this.setBtnAnimation}  config={this.$options.groupConfig}>
              <v-image ref="go" config={this.$options.goConfig} />
            </v-group>
          </v-layer>
        </v-stage>
        {
          this.showText && (
            <div class={style['select-main']}>
              <div class={{
                [style['fold-click-box']]: true,
                [style['come-front']]: this.indexStatus
              }}>
                <div class={style['fold-click-bg']}></div>
                <div class={{
                  [style['fold-box']]: true,
                  [style['show']]: true,
                  [style['come-front']]: true,
                  [style['open-fold']]: this.flagFoldSwithStatus,
                  [style['add-transform']]: true
                }}>
                  <div onClick={this.handleCloseFold} class={style['close-fold']}></div>
                  <div class={style['fold-intro']}></div>
                  <div class={style['fold-main-padding-box']}>
                    <div class={style['fold-main-box']}>
                      <ul class={style['fold-main']} style={{
                        // height: this.selectedFlagListLength * px2rem(43.5) + 'rem',
                        top: 0
                      }}>
                        {
                          this.selectedFlagList.map((item, index) => (
                            <li style={{top: px2rem(index * 43.5) + 'rem'}}>
                              <div class={style['li-index']}>{index + 1}.</div>
                              <div class={style['li-main']}>
                                <div class={style['li-text']}>{item}</div>
                                <div onClick={this.handleDeleteFlag} data-index={index} class={style['li-delete']}></div>
                              </div>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class={{
                  [style['s-top']]: true,
                  [style['animate']]: this.selectedFlagList.length > 0
                }}
              >
                <div class={style['top-num']}>{this.selectedFlagListLength}</div>
                <div class={style['top-select-text']}>
                </div>
                <div class={style['s-top-tips']}>
                  <div class={style['s-top-tips-line']}></div>
                  <div class={style['s-top-tips-text']}></div>
                </div>
                <div onClick={this.handleOpenFold} class={style['open-select']}></div>
              </div>  
              <ul class={style['box']}>
                {
                  this.flagTextList.map((item, index) => (
                    <li
                      key={item + index}
                      class={{
                        [style['s-li']]: true,
                        [style['chosen']]: this.selectedFlagList.includes(item)
                      }}
                    >
                      <div class={style['num']}>{index + 1}</div>
                      <div class={style['text']}>
                        {
                          this.animetionTextOver && (
                            <div onClick={this.handleClickFlag} data-text={item}>{item}</div>
                          )
                        }
                      </div>
                    </li>
                  ))
                }
              </ul>
              <div class={{[style['hand-box']]: true, [style['hand-ani']]: true}}>
                <div class={style['hand']}></div>
                <div class={style['hand-text']}></div>
              </div>
              <div onClick={this.handleChangeFlag} class={style['change']}>
                <div class={style['change-bg']}></div>
                <div
                  ref="rotate-btn"
                  class={style['change-rotate']}></div>
                <div class={style['change-text']}></div>
              </div>
              <div class={style['input-box']}>
                <div ref="placeholder" class={style['placeholder']}>
                  <div class={style['left-line']}></div>
                </div>
                <input onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} value={this.inputContent} onInput={this.handleChangeInputValue} type="text" id="input" class={style['input']} />
                <div class={style['right-line']}></div>
                <div ref="ok" onClick={this.handleConfirmInput} class={style['ok']}></div>
              </div>
              <div ref="next" onClick={this.handleClickNext} class={style['next']}></div>
            </div>
          )
        }
        {
          !this.animetionTextOver && this.resultText.map(d => (
            <div style={{
              position: 'absolute',
              fontSize: '36px',
              height: '44px',
              color: '#ff4b30',
              left: px2rem(d.rx) + 'rem',
              top: px2rem(d.ry) + 'rem'
            }}>{d.text}</div>
          ))
        }
      </div>
    )
  }
}