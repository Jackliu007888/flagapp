import ResLoader from '@/common/js/res-loader'

const IMAGE_LIST = [
  'http://p2.qhimg.com/t01ed1438874f940dc0.jpg',
  'http://p9.qhimg.com/t01b4ff03b72c7dc6c7.jpg',
  'http://p2.qhimg.com/t01dd90dfbec92074d0.jpg',
  'http://p7.qhimg.com/t01cfec6d87cde457c5.jpg',
  'http://p9.qhimg.com/t01943ced462da67833.jpg',
  'http://p0.qhimg.com/t01943ced462da67833.jpg',
  'http://p6.qhimg.com/t01aa15a7ba7ccb49a7.jpg',
  'http://p8.qhimg.com/t010f1e8badf1134376.jpg',
  'http://p8.qhimg.com/t01cf37ea915533a032.jpg',
  'http://p3.qhimg.com/t0193d8a3963e1803e9.jpg',
  'http://p3.qhimg.com/t01cd6a4d4b4bd4457b.jpg'
]

const FONT_LIST = [
  'http://static.ws.126.net/163/f2e/news/happynewyear2019/img/text1.ttf',
  'http://static.ws.126.net/163/f2e/news/happynewyear2019/img/font.ttf'
]

export default {
  data() {
    return {
      imageListLoaded: false,
      complete: 0,
      total: FONT_LIST.length + IMAGE_LIST.length
    }
  },
  created() {
    const that = this
    const resources = [...IMAGE_LIST.map(d => ({
      type: 'image',
      value: d
    })), ...FONT_LIST.map(d => ({
      type: 'font',
      value: d
    }))]

    new ResLoader({
      resources,
      onStart() {
        console.log('start')
      },
      onProgress(index, total) {
        console.log(index, total)
        that.complete = total
      },
      onComplete() {
        console.log('onComplete')
        that.imageListLoaded = true
      }
    })
  },
  render(h) {
    return (
      <div>
        {
          this.imageListLoaded ? IMAGE_LIST.map(image => (
            <img src={image} />
          )) : (
            <span>{(this.complete / this.total).toFixed(2) * 100 + '%'}</span>
          )
        }
      </div>
    )
  }
}