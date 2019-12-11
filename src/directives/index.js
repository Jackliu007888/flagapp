import { handleBlurForFixBUG } from '@/common/js/ployfill'

const directives = Vue => {
  Vue.directive('scrollToTopOnBlur', {
    inserted: function(el) {
      if(el) {
        el.removeEventListener("blur", handleBlurForFixBUG)
        el.addEventListener('blur', handleBlurForFixBUG)
      }
    }
  })
}

export default directives