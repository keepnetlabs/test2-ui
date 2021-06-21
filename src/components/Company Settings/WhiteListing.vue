<template>
  <div class="white-listing">
    <WhiteListingDirectionsDialog
      v-if="isShowSendEmailDialog"
      :status="isShowSendEmailDialog"
      @on-close="toggleSendEmailDialog"
    />
    <WhiteListingContent />
    <div>
      <h3 class="white-listing__content-header mb-0">Email these directions to customer</h3>
      <p>Send an email to customer with whitelisting directions</p>
      <v-btn
        id="btn-send-email--whitelisting"
        style="box-shadow: none !important;"
        class="white--text btn-util mt-1"
        color="#2196f3"
        rounded
        :disabled="isSendEmailDisabled"
        @click="toggleSendEmailDialog"
      >
        Send Email
        <v-icon class="ml-2" right color="#fff">mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import WhiteListingContent from '@/components/Company Settings/WhiteListingContent'
import WhiteListingDirectionsDialog from '@/components/Company Settings/WhiteListingDirectionsDialog'
export default {
  name: 'WhiteListing',
  components: { WhiteListingDirectionsDialog, WhiteListingContent },
  data() {
    return {
      isSendEmailDisabled: false,
      isShowSendEmailDialog: false
    }
  },
  methods: {
    toggleSendEmailDialog() {
      this.isShowSendEmailDialog = !this.isShowSendEmailDialog
    }
  }
}
</script>

<style lang="scss">
.white-listing {
  &__content {
    &-header {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      margin-top: 24px;
      margin-bottom: 8px;
    }
  }
  p {
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 0;
  }
  & > div {
    max-width: 554px;
  }
  h5 {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    text-decoration: underline;
    color: #383b41;
  }
  a {
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    color: #1173c1 !important;
    display: block;
    text-decoration: none;
  }
  &-in-dialog {
    background: #fafafa;
    border-radius: 20px;
    padding: 24px;
    margin-top: 8px;
    & > div div:first-child h3 {
      margin-top: 0;
    }
  }
}
</style>
