/**
 * 根据元素几何属性，获取对应的样式对象
 * @param  {Object} prop 元素属性对象
 * @return {Object}      样式对象
 */
const getPositionStyle = prop => {
  const styleMap = {}

  if ('w' in prop) {
    styleMap.width = (prop.w / 20) + 'rem'
  }

  if ('h' in prop) {
    styleMap.height = (prop.h / 20) + 'rem'
  }

  if ('y' in prop) {
    styleMap.top = (prop.y / 20) + 'rem'
  }

  if ('x' in prop) {
    styleMap.left = (prop.x / 20) + 'rem'
  }

  if ('r' in prop) {
    styleMap.transform = `rotate(${prop.r}deg)`
  }

  return styleMap
}

/**
 * 拼合来自编辑器 edit-layer 的元素块的几何属性
 * @param  {Object} prop  元素属性
 * @param  {Object} shape 编辑层的元素块几何属性
 * @return {Object}       拼合后的元素属性
 */
const composeTempProps = (prop, shape) => {
  const propObj = Object.assign({}, prop)

  if ('w' in propObj) {
    propObj.w = shape.width
  }

  if ('h' in propObj) {
    propObj.h = shape.height
  }

  if ('y' in propObj) {
    propObj.y = shape.y
  }

  if ('x' in propObj) {
    propObj.x = shape.x
  }

  if ('r' in propObj) {
    propObj.r = shape.rotate
  }

  return propObj
}

export default {
  getPositionStyle,
  composeTempProps
}