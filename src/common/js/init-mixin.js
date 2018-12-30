import API from '@/api'

export default {
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    /**
     * 判断配置中是否限制位置信息
     * @return {Promsie}
     */
    async checkCitiesPromise() {
      // 获取位置信息
      let position
      // 地理位置授权
      try {
        position = await this.$wx.getLocation()
        this.$storage.setItem('latitude', position.latitude)
        this.$storage.setItem('longitude', position.longitude)
      } catch (error) {
        this.$storage.setItem('latitude', 0)
        this.$storage.setItem('longitude', 0)
      }

      await this._sendCheckCity(position)
    },
    /**
     * 发送经纬度信息，判断是否处于受限城市
     * @param {object} position
     * @param {string | number} longitude 经度
     * @param {string | number} latitude 纬度
     * @return {promise}
    */
    async _sendCheckCity({latitude = 0 , longitude = 0} = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          this.$logoLoading.show()
          const resp = await this.$http({
            url: API.saveAddress,
            method: 'POST',
            params: {
              activity_id: this.$route.params.eventId,
              token: this.$storage.getItem('token'),
              openid: this.$storage.getItem('openid'),
              latitude,
              longitude
            }
          })
          if (parseInt(resp.status) === 0) {
            reject(new Error('您所在城市不支持该活动'))
          } else {
            resolve()
          }
        } catch (error) {
          reject(error)
        } finally {
          this.$logoLoading.hide()
        }
      })
    },
    /**
     * 保存授权重定向后传过来的 token openid
     */
    getTokenFromUrl() {
      const search = window.location.search
      const configs = this.parseParams(search)
      this.$storage.remove('other_uid')
      this.$storage.remove('channel')
      let keyArr = ['token', 'uid', 'other_uid', 'openid', 'channel']
      keyArr.forEach(key => {
        if (configs[key]) {
          this.$storage.setItem(key, configs[key])
        }
      })
    },
    /**
     * 解析 url 参数
     * @param {String} str 形如 ?a=1&b=2
     * @return {Object} {a: 1, b: 2}
     */
    parseParams(str = '') {
      let ret = {}
      if (str.includes('?')) {
        str = str.replace('?', '')
      }
      if (str && str.includes('=')) {
        let arr = str.split('&')
        arr.map(d => {
          ret[d.split('=')[0]] = d.split('=')[1]
        })
      }
      return ret
    },
    /*
     * 设置引导关注
     */
    _setAdvance(watchDescription, publicAccountQRCode) {
      const that = this
      this.$vux.confirm.show({
        title: '温馨提示',
        confirmText: '现在关注',
        cancelText: '已关注不再提示',
        content: watchDescription,
        onCancel() {
          that._sendSubInfo()
        },
        onConfirm() {
          that.$vux.confirm.show({
            confirmText: '现在关注',
            cancelText: '已关注不再提示',
            title: '温馨提示',
            content: `<img height="200" width="200" src="${publicAccountQRCode}" alt="image"/>`,
            onCancel() {
              that._sendSubInfo()
            }
          })
        }
      })
    },
    /**
     * 根据配置设置分享信息
     */
    _setShareInfo(shareInfo) {
      const uid = this.$storage.getItem('s_uid')
      const pid = this.$storage.getItem('other_uid') || this.$storage.getItem('s_uid')
      const openid = this.$storage.getItem('openid')
      const token = this.$storage.getItem('token')
      const activityId = this.$route.params.eventId

      const { title, useSetting, descriptionBeforeSubmit, image } = shareInfo
      const shareBaseUrl = window.location.origin + window.location.pathname
      const channel = this.$storage.getItem('channel')
      const link = channel ? `${shareBaseUrl}?other_uid=${uid}&channel=${channel}` : `${shareBaseUrl}?other_uid=${uid}`

      if (useSetting) {
        this.$wx.shareWithFriend({
          title,
          desc: descriptionBeforeSubmit,
          link,
          imgUrl: image
        }).then(() => {
          this.$statistics.addBehavior({
            openid,
            token,
            uid,
            pid,
            activityId,
            type: 50
          })
        })

        this.$wx.shareTimeline({
          title: descriptionBeforeSubmit,
          link,
          imgUrl: image
        }).then(() => {
          this.$statistics.addBehavior({
            openid,
            token,
            uid,
            pid,
            activityId,
            type: 60
          })
        })
      } else {
        this.$wx.hideOptionMenu()
      }
    },
    /**
     * 请求 获取 wx 签名
     * 载入 wx sdk 配置
     */
    async setConfig(shareInfo) {
      return new Promise(async (resolve, reject) => {
        try {
          this.$logoLoading.show()
          const url = window.location.href.split('#')[0]
          let resp = await this.$http({
            method: 'POST',
            url: API.getWxSignature,
            params: {url}
          })

          this.$wx.setConfig({
            // debug: process.env.NODE_ENV === 'development',
            debug: false,
            appId: resp.appid,
            timestamp: resp.timestamp,
            nonceStr: resp.noncestr,
            signature: resp.signature
          }).then(() => {
            shareInfo && this._setShareInfo(shareInfo)
            resolve(resp)
          })
        } catch (error) {
          console.error(error)
          reject(error)
        } finally {
          this.$logoLoading.hide()
        }
      })
    },
    /**
     * 判断是否需要重定向
     * errcode 为 1 则重定向
     */
    async getWebUrl() {
      return new Promise(async (resolve, reject) => {
        if (this.isLocked) return false
        this.isLocked = true
        this.$logoLoading.show()
        try {
          const url = window.location.href.split('#')[0]
          const token = this.$storage.getItem('token')
          const openid = this.$storage.getItem('openid')
          const uid = this.$storage.getItem('uid') || 0

          let resp = await this.$http({
            method: 'POST',
            url: API.getWebUrl,
            params: {
              url,
              token,
              openid,
              uid,
              activity: this.$route.params.eventId || this.$route.params.orgId
            }
          })
          if (parseInt(resp.status) === 1) {
            window.location.replace(resp.url)
            reject(new Error('redirect'))
            return false
          }
          resolve(resp)
        } catch (error) {
          console.error(error)
          reject(error)
        } finally {
          this.isLocked = false
          this.$logoLoading.hide()
        }
      })
    }
  }
}