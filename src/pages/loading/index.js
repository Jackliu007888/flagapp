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

// a_00050 - a_00087
const SNOW_IMAGE_LIST = new Array(38).fill(0).map((item, index) => ({
  value: baseUrl + 'snow/a_000' + (index + 50) + '.png',
  type: 'image',
  screen: 'makeFlag',
  name: 'snow/a_000' + (index + 50)
}))

const IMAGE_LIST = [
  ...START_IMAGE_LIST,
  ...SNOW_IMAGE_LIST,
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
  }, {
    value: 'https://static.ws.126.net/163/f2e/news/dada2018_newyear/img/ground/a_00100.jpg',
    type: 'image',
    screen: 'makeFlag',
    name: 'groundImage'
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
  data() {
    return {
      makeFlagImageList: [],
      resLoaded: false,
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
        console.log('start')
      },
      onProgress(index, total) {
        console.log(index, total)
        that.complete = total
      },
      onComplete(total, result) {
        console.log(total, result)
        that.makeFlagImageList = result.filter(d => d.screen === 'makeFlag')
        that.resLoaded = true
      }
    })
  },
  render(h) {
    const percent = (this.complete / this.total).toFixed(2) * 100
    const percentTen = parseInt(percent / 10)
    const percentSingle = percent % 10

    const percentTenNumClass = [style[`w${percentTen}`]]
    const percentSingleNumClass = [style[`w${percentSingle}`]]

    const lineBaseWidth = '12.25'
    const lineStyle = {
      width: (100 - percent) * lineBaseWidth * 0.01 + 'rem',
      marginLeft: '-' + (100 - percent) * lineBaseWidth * 0.005 + 'rem'
    }

    return (
      <div>
        <div class={style['loading']} v-show={!this.resLoaded}>
          <div class={style['logo']}></div>
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
        {/* <div style="display: none;">
          {
            this.resLoaded && IMAGE_LIST.map(d => (
              <img src={d} />
            ))
          }
        </div> */}
        {/* <coundDownPage v-show={this.resLoaded}/> */}
        <makeFlagPage visible={this.resLoaded} makeFlagImageList={this.makeFlagImageList} />
        {/* <selectBgPage /> */}
      </div>
      
    )
  }
}