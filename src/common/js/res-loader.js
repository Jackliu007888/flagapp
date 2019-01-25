
const isArray = value => Object.prototype.toString.call(value) === '[object Array]'
const isObject = value => Object.prototype.toString.call(value) === '[object Object]'
const isFunction = value => Object.prototype.toString.call(value) === '[object Function]'


class ResLoader {
  constructor(options) {
    const { resources, onStart, onProgress, onComplete } = options
    if (!isArray(resources)) {
      throw new Error('resources must be Array')
    }
    this.resources = resources
    this.onStart = onStart
    this.onProgress = onProgress
    this.onComplete = onComplete
    this.total = resources.length
    this.completeLength = 0

    this.start()
  }

  async start() {
    let result
    isFunction(this.onStart) && this.onStart(this.total)
    try {
      result = await Promise.all(this.resources.map(async (item, index) => {
        let loader
        switch (item.type) {
          case 'image':
            loader = 'imageLoader'
            break
          case 'font':
            loader = 'fontLoader'
            break
          default:
            loader = ''
            break
        }
        if (!loader) {
          throw new Error('no loader')
        }

        const instance = await this[loader](item.value) || {}
        isFunction(this.onProgress) && this.onProgress(index, ++this.completeLength)
        return {
          ...item,
          instance
        }
      }))
    } catch (error) {
      console.error(error)
    }

    isFunction(this.onComplete) && this.onComplete(this.total, result)
  }

  imageLoader(imageData) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.onload = () => resolve(image)
      image.src = isObject(imageData) ? imageData.url : imageData
      image.onerror = () => reject(imageData)
    })
  }

  fontLoader(url, as = 'font', type = 'font/ttf') {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link")
      link.rel = 'preload'
      link.href = url
      link.as = as
      link.type = type
      link.setAttribute('crossorigin', 'anonymous')
  
      if (!link.relList || !link.relList.supports || !link.relList.supports('preload')) {
        return reject('unsupports: Resource Hints preload')
      }
  
      link.addEventListener('load', () => {
        resolve()
      })
      
      document.getElementsByTagName('head')[0].appendChild(link)
    })
  }
}

export default ResLoader