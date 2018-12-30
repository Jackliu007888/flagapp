import commonMixin from '@/common/js/common-mixin.js'

export default {
  mixins: [commonMixin],
  data() {
    return {
      exchangeVisible: false,
      awardType: '',
      awardId: ''
    }
  },
  methods: {
    handleOpenExchangeDialog(e) {
      this.awardType = e.currentTarget.dataset.type
      this.awardId = e.currentTarget.dataset.id
      this.exchangeVisible = true
    },
    handleCloseExchangeDialog() {
      this.exchangeVisible = false
    },
    handleExchangeActiveSucceed() {
      this.exchangeVisible = false
      this.getAwardList()
      this.getMyInfo && this.getMyInfo()
      this.getMyExchangeLog && this.getMyExchangeLog()
    }
  }
}