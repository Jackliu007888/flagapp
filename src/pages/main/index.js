import ResLoader from '@/common/js/res-loader'

import style from './index.module.styl'

import coundDownPage from '@/pages/countdown'
import makeFlagPage from '@/pages/make-flag'
import selectBgPage from '@/pages/select-bg'


const baseUrl = 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/'

const START_IMAGE_LIST = new Array(50).fill(0).map((item, index) => ({
  value: baseUrl + 'start1/' + index + '.jpg',
  type: 'image',
  screen: 'start',
  name: 'start1/' + index   
}))

// a_0000.jpg - a_0101.jpg
const TRANSFORM_IMAGE_LIST = new Array(102).fill(0).map((item, index) => {
  const i = index < 10 ? '00' + index : index < 100 ? '0' + index : index
  return {
    value: baseUrl + 'transform1/a_0' + i + '.jpg',
    type: 'image',
    screen: 'transform',
    name: 'transform/' + index
  }
})

// a_00050 - a_00087
const SNOW_IMAGE_LIST = new Array(38).fill(0).map((item, index) => ({
  value: baseUrl + 'snow/a_000' + (index + 50) + '.png',
  type: 'image',
  screen: 'makeFlag',
  name: 'snow/a_000' + (index + 50)
}))
// a_00100 - a_00136
const GROUND_GROW_IMAGE_LIST = new Array(37).fill(0).map((item, index) => ({
  value: baseUrl + 'ground/a_00' + (index + 100) + '.jpg',
  type: 'image',
  screen: 'makeFlag',
  name: 'ground_grow/a_00' + index,
}))

const IMAGE_LIST = [
  ...START_IMAGE_LIST,
  ...TRANSFORM_IMAGE_LIST,
  ...SNOW_IMAGE_LIST,
  ...GROUND_GROW_IMAGE_LIST,
  {
    value: 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/ground_grow/people.png',
    type: 'image',
    screen: 'makeFlag',
    name: 'peopleImage'
  }, {
    value: 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/intro/bg1.png',
    type: 'image',
    screen: 'makeFlag',
    name: 'flagBgImage'
  }]

const FONT_LIST = [{
  type: 'font',
  value: 'http://static.ws.126.net/163/f2e/news/happynewyear2019/img/text1.ttf'
}, {
  type: 'font',
  value: 'http://static.ws.126.net/163/f2e/news/happynewyear2019/img/font.ttf'
}, {
  type: 'font',
  value: 'http://static.ws.126.net/163/f2e/news/happynewyear2019/img/eng.ttf'
}]

export default {
  components: {
    coundDownPage,
    makeFlagPage,
    selectBgPage
  },
  makeFlagImageList: [],
  startImageList: [],
  transformImageList: [],
  selectedFlagList: [],
  saveCanvasImage: null,
  data() {
    return {
      resLoaded: false,
      saveCanvasImageVisible: false,
      coundDownPagevisible: false,
      makeFlagPageVisible: false,
      selectBgPageVisible: false,
      complete: 0,
      total: FONT_LIST.length + IMAGE_LIST.length
    }
  },
  created() {
    const that = this
    const resources = [...IMAGE_LIST, ...FONT_LIST]

    new ResLoader({
      resources,
      onStart() {
        // console.log('start')
      },
      onProgress(index, total) {
        // console.log(index, total)
        that.complete = total
      },
      onComplete(total, result) {
        console.log(total, result)
        that.$options.makeFlagImageList = result.filter(d => d.screen === 'makeFlag')
        that.$options.transformImageList = result.filter(d => d.screen === 'transform')
        that.$options.startImageList = result.filter(d => d.screen === 'start')
        that.resLoaded = true
        that.coundDownPagevisible = true
      }
    })
  },
  methods: {
    handleSaveImageSuccess(val) {
      this.$options.saveCanvasImage = val
      this.selectBgPageVisible = false
      this.saveCanvasImageVisible = true

      setTimeout(() => {
        this.$refs['save-tips'].style.display = 'none'
      }, 2500)
    },
    handleCoundDownNextPage() {
      this.coundDownPagevisible = false
      this.makeFlagPageVisible = true
    },
    handleMakeFlagNextPage(val) {
      this.makeFlagPageVisible = false
      this.$options.selectedFlagList = val
      this.selectBgPageVisible = true
    }
  },
  render(h) {
    // 注意 JS 精度问题
    const percent = parseInt((this.complete / this.total).toFixed(2) * 100)
    const percentTen = parseInt(percent / 10)
    const percentSingle = percent % 10

    const percentTenNumClass = [style[`w${percentTen}`]]
    const percentSingleNumClass = [style[`w${percentSingle}`]]

    const lineBaseWidth = '12.25'
    const lineStyle = {
      width: (100 - percent) * lineBaseWidth * 0.01 + 'rem',
      marginLeft: '-' + (100 - percent) * lineBaseWidth * 0.005 + 'rem'
    }

    if (this.$options.saveCanvasImage) {
      return (
        <div key={this.$options.saveCanvasImage.length} class={style['save-image-wrap']}>
          <div ref='save-tips' class={style['tips']}>长按保存为图片</div>
          <div style={`height: ${window.document.body.offsetHeight}px`} class={style['scroll']}>
            <img class={style['save-image']} src={this.$options.saveCanvasImage} />
          </div>
        </div>
      )
    }
    return (
      <div>
        <div class={style['loading']} v-show={!this.resLoaded}>
          <div class={style['loading-main']}>
            <div class={style['percent']}>
              <div class={style['percent-bg']}></div>
              <div class={style['percent-ten']}>
                <div class={percentTenNumClass}></div>
              </div>
              <div class={style['percent-single']}>
                <div class={percentSingleNumClass}></div>
              </div>
            </div>
            <div style={lineStyle} class={style['loading-line']}>
              <div class={style['left-rect']}></div>
              <div class={style['right-rect']}></div>
            </div>
          </div>
          <div class={style['loading-text']}>
          </div>
        </div>
        <coundDownPage
          onNext={this.handleCoundDownNextPage}
          startImageList={this.$options.startImageList}
          transformImageList={this.$options.transformImageList}
          visible={this.coundDownPagevisible}
        />
        <makeFlagPage
          makeFlagImageList={this.$options.makeFlagImageList}
          onNext={this.handleMakeFlagNextPage}
          visible={this.makeFlagPageVisible}
        />
        <selectBgPage
          visible={this.selectBgPageVisible} 
          selectedFlagList={this.$options.selectedFlagList}
          onSaveImageSuccess={this.handleSaveImageSuccess}
        />

      </div>
      
    )
  }
}