<template>
  <div class="feedback-popup">
    <v-card style="width: 600px;">
      <v-list-item class="feedback-popup__header">
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
      <div class="feedback-popup__text-area">
        <v-form ref="feedbackForm">
          <v-textarea
            filled
            auto-grow
            label="I would like to see"
            rows="4"
            row-height="30"
            shaped
            v-model="feedbackMessage"
            no-resize
            required
            class="feedback-popup__text-area-text"
            :rules="[(v) => !!v || 'Required']"
          ></v-textarea>
        </v-form>
      </div>
      <div class="feedback-button">
        <v-btn class="feedback-button--cancel" text v-on:click="onCancelClicked">CANCEL</v-btn>
        <v-btn class="feedback-button--success" text v-on:click="onFeedbackSend">SEND</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { sendFeedback } from '../api/dashboard'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'FeedbackPopup',
  data() {
    return {
      feedbackMessage: null
    }
  },
  methods: {
    ...mapActions({
      sendFeedback: 'dashboard/sendFeedback',
      changeFeedbackPopup: 'dashboard/changeFeedbackPopup'
    }),
    onFeedbackSend() {
      let payload = { Message: this.feedbackMessage }
      if (this.$refs.feedbackForm.validate()) {
        sendFeedback(payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              message:
                (response && response.data && response.data.message) || 'Feedback has been sent',
              color: 'green',
              icon: 'mdi-check-circle-outline'
            })
            this.changeFeedbackPopup(false)
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              message:
                (error.response && error.response.data && error.response.data.message) ||
                'Feedback can not send',
              color: 'red',
              icon: 'mdi-alert-circle'
            })
            this.changeFeedbackPopup(false)
          })
      }
    },
    onCancelClicked() {
      this.changeFeedbackPopup(false)
    }
  }
}
</script>

<style lang="scss">
.feedback-popup {
  &__header {
    padding: 24px !important;
    border-bottom: 1px solid #e0e0e0;
  }
  &__text-area {
    margin-top: 24px;
    padding: 0 24px !important;
    border-bottom: 1px solid #e0e0e0;
  }
  .feedback-button {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    &--cancel {
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #f56c6c;
    }
    &--success {
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3;
    }
  }
}
.feedback-popup__text-area-text {
  .v-input__slot {
    border-radius: 8px;
    border: solid 1px #2196f3;
    background: #ffffff !important;
    &:before,
    &:after {
      border: none !important;
    }
    .v-label {
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(56, 59, 65, 0.72);
    }
  }
  textarea {
    padding-top: 24px !important;
    font-size: 13px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
    color: #383b41 !important;
  }
  &:hover {
    .v-input__slot {
      border-radius: 8px;
      border: solid 1px #2196f3;
      background: #ffffff;
      &:before,
      &:after {
        border: none !important;
      }
    }
  }
  &:active {
    .v-input__slot {
      border-radius: 8px;
      border: solid 1px #2196f3;
      background: #ffffff;
      &:before,
      &:after {
        border: none !important;
      }
    }
  }
}
</style>
