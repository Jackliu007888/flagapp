/**
 * 为解决 iOS微信 键盘关闭关闭导致页面空缺的问题
 * 参考： https://blog.csdn.net/wh_xmy/article/details/86472151
 */
export const handleBlurForFixBUG = () => {
  setTimeout(() => {
    const scrollHeight = (document.documentElement.scrollTop || document.body.scrollTop || 0)
    window.scrollTo(0, Math.max(scrollHeight - 1, 0))
  }, 200)
}