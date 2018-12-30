/**
 * 将对象转换为query字符串
 * @param  {Object} obj 数据集合
 * @return {String}     转换后的query字符串
 */
const queryStringify = obj => {
  const keyList = Object.keys(obj)

  if (keyList.length < 1) {
    return ''
  }

  return '?' + Object.keys(obj).map(key => key + '=' + window.encodeURIComponent(obj[key])).join('&')
}

/**
 * 序列化请求数据信息
 * @param  {Object} obj 数据集合
 * @return {String}     序列化后的字符串
 */
const formatBody = obj => queryStringify(obj).slice(1)

/**
 * 将对象转换为FormData格式
 * @param  {Object}   obj 要转换的对象
 * @return {FormData}     转换后的FormData数据
 */
const getFormData = obj => {
  const formData = new FormData()
  for (let key in obj) {
    formData.append(key, obj[key])
  }
  return formData
}

/**
 * 设置自定义请求头信息
 * @param  {XMLHttpRequest}  xhr        xhr实例
 * @param  {Object}          headers    头部字段的集合
 * @param  {Boolean}         isFormData 是否为FormData数据
 */
const setCustomHeader = (
  xhr,
  headers = {},
  isFormData = false
) => {
  for (let key in (headers || {})) {
    headers[key] && xhr.setRequestHeader(key, headers[key])
  }
  if (!isFormData) {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  }
}

/**
 * 检测是否有二进制类型的变量
 * @param  {Object}  params 参数集合
 * @return {Boolean}        检测结果
 */
const hasBlobValue = params => Object.keys(params).some(key => {
  return (params[key] instanceof Blob) || (params[key] instanceof File)
})

export {
  queryStringify,
  formatBody,
  getFormData,
  setCustomHeader,
  hasBlobValue
}

export default {
  queryStringify,
  formatBody,
  getFormData,
  setCustomHeader,
  hasBlobValue
}