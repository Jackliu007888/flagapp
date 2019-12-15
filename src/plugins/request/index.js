import Utils from './utils'
import { ERROR_TYPE } from './enum'

/**
 * 用于保存引用插件时传入的配置
 * @type {Object}
 */
const pluginOption = {
  errorHandler: () => {}
}

/**
 * 对响应数据的拦截校验器
 * @param  {Object} resData 响应数据
 * @return {Object}         响应数据
 */
const requestInterceptor = resData => {
  if (resData.status === 1) {
    return resData.data
  }
  const err = new Error(resData.msg ? String(resData.msg) : resData)

  pluginOption.errorHandler(ERROR_TYPE.NORMAL_ERROR, err)
  throw err
}

/**
 * 发送请求
 * @param  {String}    url              请求URL
 * @param  {String}    method           请求方法
 * @param  {Object}    headers          自定义头部
 * @param  {Object}    params           请求数据
 * @return {Promise}                    响应结果Promise
 */
const sendRequest = async (
  url = '',
  method = 'GET',
  headers = {},
  params = {}
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const currentURL = method === 'GET' ? url + Utils.queryStringify(params) : url
    const body = Utils.formatBody(params)
    const isFormData = body instanceof FormData

    xhr.open(method, currentURL)
    Utils.setCustomHeader(xhr, headers, isFormData)

    xhr.onreadystatechange = async () => {
      if (xhr.readyState !== 4) {
        return
      }

      if (xhr.status === 500) {
        pluginOption.errorHandler(ERROR_TYPE.SERVER_ERROR, new Error(xhr.responseText))
        return reject(new Error('哎呀，让我缓缓'))
      }

      try {
        resolve(JSON.parse(xhr.responseText))
      } catch (err) {
        pluginOption.errorHandler(ERROR_TYPE.NORMAL_ERROR, err)
        resolve({
          status: 'failed',
          data: '未知的程序错误'
        })
      }
    }

    xhr.send((method !== 'GET') && body)
  })
}

const $http = ({url, method, headers, params}) => sendRequest(url, method, headers, params).then(requestInterceptor)

/**
 * 请求插件
 * @param  {Function}  Vue                     Vue构造函数
 * @param  {String}    options.updateTokenURL  接收一个updateTokenURL属性，作为自动更新token时发送请求用
 * @param  {Function}  options.errorHandler    错误回调，接收两个参数(errorType 与 Error实例)
 */
const httpPlugin = (Vue, options) => {
  Object.assign(pluginOption, options)

  Vue.prototype.$http = $http
}

export {
  $http
}
export default httpPlugin