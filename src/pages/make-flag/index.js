import goImg from '@/assets/img/make-flag/go.png'
import goClickImg from '@/assets/img/make-flag/go_click.png'
import triangleImg from '@/assets/img/make-flag/triangle.png'
import Konva from 'Konva'
import style from './index.module.styl'

import FLAGS from './flags'
import SENSITIVE from './sensitive'

const scale = 1

export default {
  props: ['makeFlagImageList', 'visible'],
  data() {
    return {
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
      flagBgConfig: {
        width: 650,
        height: 672,
        x: window.innerWidth - 650,
        y: 120,
        image: {}
      },
      peopleConfig: {
        width: 352,
        height: 344,
        x: window.innerWidth - 352,
        y: window.innerHeight - 344,
        image: {}
      },
      groundConfig: {
        width: window.innerWidth,
        height: 400,
        x: 0,
        y: window.innerHeight - 400,
        image: {}
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
      triangleConfig: {
        width: 24,
        height: 12,
        x: 375,
        y: 860,
        image: {}
      },
      goConfig: {
        width: 148,
        height: 39,
        x: 306,
        y: 940 ,
        image: {},
        clip: {
          width: 148,
          height: 39,
          x: 306,
          y: 940,
        }
      },
      goClickConfig: {
        width: 148,
        height: 39,
        x: 306,
        y: 940 ,
        image: {}
      },
      groupConfig: {
        clip: {
          width: 330,
          height: 96,
          x: 210,
          y: 914,
        }
      },
      show: false
    }
  },
  watch: {
    visible(val) {
      val && this.start()
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
    async start() {
      const makeFlagBgList = this.makeFlagImageList.filter(d => d.screen === 'makeFlag' && d.name.includes('a_000')).map(d => d.instance)
      let i = 0
      const animateBg = (i) => {
        const image = makeFlagBgList[i++ % len]
        Object.assign(this.snowConfig, { image })
        setTimeout(() => {
          animateBg(i)
        }, 100)
      }

      let len = makeFlagBgList.length
      animateBg(i)


      const flagBgImage = this.makeFlagImageList.find(d => d.name === 'flagBgImage')
      const peopleImage = this.makeFlagImageList.find(d => d.name === 'peopleImage')
      const groundImage = this.makeFlagImageList.find(d => d.name === 'groundImage')

      Object.assign(this.flagBgConfig, {
        image: flagBgImage.instance
      })
      Object.assign(this.peopleConfig, {
        image: peopleImage.instance
      })
      Object.assign(this.groundConfig, {
        image: groundImage.instance
      })

      const loadImage = src => {
        return new Promise(resolve => {
          const image = new Image()
          image.onload = () => {
            resolve(image)
          }
          image.src = src
        })
      }

      const loadImageList = await Promise.all([
        loadImage(triangleImg),
        loadImage(goImg),
        loadImage(goClickImg),
      ])
      Object.assign(this.triangleConfig, {
        image: loadImageList[0]
      })
      Object.assign(this.goConfig, {
        image: loadImageList[1]
      })
      Object.assign(this.goClickConfig, {
        image: loadImageList[2]
      })
      this.loadOver = true

      this.$nextTick(() => {
        const amplitude = 12
        const period = 3000 // in ms
        const centerY = this.$refs.triangle.getStage().getY()
        const anim = new Konva.Animation(frame => {
          const t = frame.time % (period / 4)
          this.$refs.triangle.getStage().setY(amplitude * Math.sin(t * 2 * Math.PI / period) + centerY)
          this.$refs.triangle.getStage().setOpacity(1 * Math.cos(t * 2 * Math.PI / period))
        }, this.$refs.layer.getStage())

        anim.start()
      })
    },
    setBtnAnimation() {
      const amplitude = 74
      const period = 500 // in ms
      const btnX = this.$refs.btn.getStage().getX()
      const innerBtnWidth = this.$refs.innerBtn.getStage().getWidth()
      const anim = new Konva.Animation(frame => {
        const diff = amplitude * (frame.time / period)
        if (diff + innerBtnWidth <= 165) {
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

      anim.start()
      this.$refs.triangle.getStage().hide()
      this.$refs.flag.getStage().hide()
      this.$refs.people.getStage().hide()

      setTimeout(() => {
        this.showText = true
        this.animationFlagText()

      }, 1000)
    },
    animationFlagText() {

      const getAbsPostion = (level, row) => {
        const baseX = level % 2 === 0 ? 0 : 160
        const baseY = parseInt(level / 2) * 86
        const diffX = (row % 7) * 18
        const diffY = parseInt(row / 7) * 18
        return {
          x: baseX + diffX + 42.5,
          y: baseY + diffY + 202
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
        const checkD = (unitPrecision = 3) => this.resultText.some(({x, y, rx, ry}) => {
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
    handleConfirmInput() {
      if (SENSITIVE.includes(this.inputContent)) {
        alert('咦～您输入的个别字符不太对劲，请重新输入')
        this.inputContent = ''
        return false
      }
      this.selectedFlagList.push(this.inputContent)
      this.inputContent = ''
    },
    handleChangeInputValue(e) {
      this.inputContent = e.currentTarget.value
    },
    handleClickFlag(e) {
      const { text } = e.currentTarget.dataset
      this.selectedFlagList.push(text)
    },
    handleInputFocus() {
      this.$refs.placeholder.style.display = 'none'
      this.$refs.next.style.display = 'none'
      this.$refs.ok.style.display = 'block'
    },
    handleInputBlur() {
      this.$refs.placeholder.style.display = 'block'
      this.$refs.next.style.display = 'block'
      this.$refs.ok.style.display = 'none'
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
      const shuffle = arr => {
        let n = arr.length, random
        while(0 !== n){
          random =  (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
          [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
        }
        return arr
      }
      
      this.flagTextList = new Array(6).fill(0).map((item, index) => shuffle(FLAGS)[index])
    }
  },
  mounted() {
    
  },
  render(h) {

    const px2rem = (value, rootValue = 20, unitPrecision = 5) => (value / rootValue).toFixed(unitPrecision)
    const configKonva =  {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: { x: scale, y: scale }
    }
    const bgConfig = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      fill: '#ececec'
    }
    
    return (
      <div class={style['main']}>
        {
          this.loadOver && (
            <v-stage ref="stage" config={configKonva}>
              <v-layer ref="layer">
                <v-rect config={bgConfig} />
                <v-image ref="flag" config={this.flagBgConfig} />
                <v-image config={this.groundConfig} />
                <v-image ref="people" config={this.peopleConfig} />
                <v-image config={this.snowConfig}/>
                <v-image ref="triangle" config={this.triangleConfig} />
                <v-rect ref="btn" onTap={this.setBtnAnimation} onClick={this.setBtnAnimation} config={this.btnConfig} />
                <v-rect ref="innerBtn"  config={this.innerBtnConfig} />
                <v-image ref="goClick" config={this.goClickConfig} />
                <v-group ref="group" onTap={this.setBtnAnimation} onClick={this.setBtnAnimation}  config={this.groupConfig}>
                  <v-image ref="go" config={this.goConfig} />
                </v-group>
              </v-layer>
            </v-stage>
          )
        }
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
                        height: this.selectedFlagListLength * px2rem(43.5) + 'rem',
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
              <div class={style['s-top']}>
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
                    <li key={item + index} class={style['s-li']}>
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
                <div class={style['change-rotate']}></div>
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
              <div ref="next" class={style['next']}></div>
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