<template>
  <div>
    <v-card style="width: 600px;">
      <v-list-item>
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">
            mdi-message-alert
          </v-icon>
        </div>
        <v-list-item-content>
          <v-list-item-title class="v-card-headline">Feedback</v-list-item-title>
          <v-list-item-subtitle class="feedback-title">
            We treasure your suggestions
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="feedback-text-area pt-6">
        <v-textarea outlined label="I would like to see" v-model="feedbackMessage"></v-textarea>
      </div>
      <div class="feedback-button d-flex flex-row flex-wrap justify-end">
        <v-btn text color="#2196f3" v-on:click="onCancelClicked">CANCEL</v-btn>
        <v-btn text color="#2196f3" v-on:click="onFeedbackSend">SEND</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'FeedbackPopup',
  data() {
    return {
      feedbackMessage: ''
    }
  },
  methods: {
    ...mapActions({
      sendFeedback: 'dashboard/sendFeedback',
      changeFeedbackPopup: 'dashboard/changeFeedbackPopup'
    }),
    onFeedbackSend() {
      this.sendFeedback(this.message)
    },
    onCancelClicked() {
      this.changeFeedbackPopup(false)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep fieldset {
  border-radius: 6px;
  border-color: #2196f3 !important;
}
:v-deep fieldset:focus {
  border-color: #2196f3 !important;
}
::v-deep textarea {
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72) !important;
  padding-left: 20px !important;
  padding-top: 20px !important;
}
::v-deep .theme--dark.v-label {
  background-color: transparent;
  color: #2196f3 !important;
}
::v-deep v-input__slot {
  color: #2196f3 !important;
}
.feedback-title {
  font-family: 'Helvetica', sans-serif !important;
  font-size: 16px !important;
  line-height: 1.2 !important;
  color: rgba(0, 0, 0, 0.87);
}
.v-list-item__subtitle {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
  margin-left: 2px;
}
::v-deep .v-sheet {
  border-radius: 20px;
  background-color: white;
  padding: 24px;
}
.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 20px;
}
.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}
</style>
