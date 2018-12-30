import API from '@/api'

export default {
  methods: {
    /**
     * 获取奖励积分红包信息
     */
    async getAwardList() {
      try {
        const resp = await this.$http({
          method: 'POST',
          url: API.awardList,
          params: {
            activity_id: this.$route.params.eventId,
            token: this.$storage.getItem('token'),
            openid: this.$storage.getItem('openid'),
          }
        })
        this.$store.dispatch('setAwardInfo', {
          redBagAward: Object.keys(resp.redBagAward).map(d => ({
            ...resp.redBagAward[d],
            id: d
          })),
          pointsAward: Object.values(resp.pointsAward).map(d => d.desc),
          awardInfo: resp.awardInfo
        })
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * 获取我的奖励积分红包
     */
    async getMyAward() {
      try {
        const resp = await this.$http({
          method: 'POST',
          url: API.getReward,
          params: {
            activity_id: this.$route.params.eventId,
            token: this.$storage.getItem('token'),
            openid: this.$storage.getItem('openid'),
            user_id: this.$storage.getItem('s_uid')
          }
        })
        this.$store.dispatch('setMyAward', resp)
      } catch (error) {
        console.error(error)
      }
    },
  }
}