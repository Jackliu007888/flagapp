import MultiPicker from '@/components/multi-picker'
import Utils from '@/common/js/utils'
import API from '@/api'
import { mapActions } from 'vuex'

const SECONDS = 180
const PARENT_VALUE = '-1'

export default {
  components: {
    MultiPicker
  },
  data() {
    return {
      countDownText: '',
      limitCount: {}
    }
  },
  watch: {
    formMap(val) {
      val && this.scrollTop()
    }
  },
  computed: {
    formMap() {
      return this.$store.state.formMap
    },
    formSetting() {
      return this.$store.state.form
    },
  },
  methods: {
    scrollTop() {
      window.document.body.scrollTop = window.document.documentElement.scrollTop = 0
    },
    async checkLimitCount() {
      try {
        // this.$vux.loading.show({ text: '加载中' })
        const token = this.$storage.getItem('token')
        const openid = this.$storage.getItem('openid')
        const resp = await this.$http({
          method: 'POST',
          url: API.checkLimitCount,
          params: {
            token,
            openid,
            id: this.$route.params.eventId
          }
        })
        Object.assign(this.limitCount, resp)
      } catch (error) {
        console.error(error)
      } finally {
        // this.$vux.loading.hide()
      }
    },
    handleClickGetCodeBtn() {
      const {phone} = this.formMap
      if (!this._checkPhoneNumber(phone)) {
        this.$vux.toast.show({
          text: '请输入正确的手机号',
          type: 'warn'
        })
        return false
      }
      this._sendSms(phone).then(() => {
        if (!this.timer) {
          this.countDownText = SECONDS
          this.timer = setInterval(() => {
            if (
              this.countDownText > 0 &&
            this.countDownText <= SECONDS
            ) {
              this.countDownText--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      }).catch(error => {
        this.$vux.toast.show({
          text: process.env.NODE_ENV === 'production' ? '短信发送失败' : error.message,
          type: 'warn'
        })
      })
    },
    _checkRequired() {
      let items = this.$store.state.form.items
      return Object.values(items).some(item => {
        if (item.required) {
          if (!this.formMap[item.key]) {
            this.$vux.toast.show({
              text: item.placeholder + '为必填项',
              type: 'warn'
            })
            return true
          }
        }
      })
    },
    _checkPhoneNumber(phone) {
      return /^1[34578]\d{9}$/.test(phone)
    },
    async handleClickSubmitBtn(e) {
      e.stopPropagation()
      const { code, phone } = this.formMap

      // 判断是否有验证码
      let items = this.$store.state.form.items

      if (items.some(d => d.type === 'itemTypePhone' && d.required)) {
        if (!this._checkPhoneNumber(phone)) {
          this.$vux.toast.show({
            text: '请输入正确的手机号',
            type: 'warn'
          })
          return false
        }
      }
      if (items.some(d => d.type === 'itemTypePhone' && d.range === 1)) {
        if (!code) {
          this.$vux.toast.show({
            text: '请正确填写验证码',
            type: 'warn'
          })
          return false
        }
      }
      // 判断必填项
      if (this._checkRequired()) {
        return false
      }

      const token = this.$storage.getItem('token')
      const openid = this.$storage.getItem('openid')
      const channel = this.$storage.getItem('channel')
      let resp
      try {
        this.$vux.loading.show({text: '加载中'})
        resp = await this.$http({
          method: 'POST',
          url: API.signUp,
          params: {
            token,
            openid,
            channel,
            activity_id: this.$route.params.eventId,
            type: 40,
            pid: this.$storage.getItem('other_uid'),
            user_id: this.$storage.getItem('uid'),
            ...this.formMap
          }
        })

        this.doAfterSumbitSuccess(resp)
        return resp
      } catch (error) {
        this.$vux.toast.show({
          text: error.message,
          type: 'warn'
        })
      } finally {
        this.$vux.loading.hide()
      }
    },
    handleInput(e) {
      this.setFormMap({
        [e.currentTarget.dataset.key]: e.currentTarget.value
      })
    },
    handleSelect(e) {
      return d => {
        this.setFormMap({
          [e]: d
        })
      }
    },
    handleSingleSelect(e) {
      return d => {
        this.setFormMap({
          [e]: d.target.value
        })
      }
    },
    handlePicker(e) {
      return (d) => {
        this.setFormMap({
          [e]: d.toString().replace(/,/g, '-')
        })
      }
    },
    addCodeType(items) {
      // 验证码处理
      if (items.some(item => item.type === 'itemTypeCode')) return false

      let list = Utils.deepClone(items)
      items.forEach((item, index) => {
        if (item.type === 'itemTypePhone') {
          if (item.range === 1) {
            list.splice(index + 1, 0, {
              type: 'itemTypeCode',
              range: 4,
              placeholder: '验证码',
              submitButtonText: '获取验证码',
              key: 'code'
            })
          }
        }
      })
      return list
    },
    _sendSms(mobile) {
      const token = this.$storage.getItem('token')
      const openid = this.$storage.getItem('openid')
      return new Promise(async (resolve, reject) => {
        try {
          this.$vux.loading.show({text: '加载中'})
          let resp = await this.$http({
            method: 'POST',
            url: API.sendSms,
            params: {
              token,
              openid,
              mobile,
              activity_id: this.$route.params.eventId
            }
          })
          resolve(resp)
        } catch (error) {
          reject(error)
        } finally {
          this.$vux.loading.hide()
        }
      })
    },
    async _getAvatar() {
      this.$vux.loading.show({text: '加载中'})
      const token = this.$storage.getItem('token')
      const openid = this.$storage.getItem('openid')
      try {
        let resp = this.$http({
          method: 'POST',
          url: API.eleven.getAvatar,
          params: {
            token,
            openid
          }
        })
        return resp
      } catch (error) {
        console.error(error)
      } finally {
        this.$vux.loading.hide()
      }
    },

    _setSelectData(data) {
      /**
       * 铺平数组
       * id, parent {string}
       */
      const flatten = (arr, parent = PARENT_VALUE) => arr.reduce((a, b) => {
        return [...a, ...(Array.isArray(b.children) ? [...flatten(b.children, b.id.toString()), {
          name: b.name,
          id: b.id.toString(),
          parent,
          limit: b.limit
        }] : [{
          name: b.name,
          id: b.id.toString(),
          parent,
          limit: b.limit
        }])]
      }, [])
      return flatten(data)
    },
    ...mapActions({
      setFormMap: 'setFormMap',
      setForm: 'setForm'
    })
  }
}