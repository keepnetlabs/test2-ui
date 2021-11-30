<template>
  <div class="feedback-popup">
    <v-card style="width: 600px; max-height: 340px; overflow-y: auto;">
      <v-list-item
        class="feedback-popup__header k-dialog__header-max-height"
        :style="getScrollingStyle"
      >
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">
            mdi-message-alert
          </v-icon>
        </div>
        <v-list-item-content>
          <v-list-item-title
            id="text--feedback-popup-title"
            class="v-card-headline"
            style="color: #2196f3 !important;"
            >Feedback</v-list-item-title
          >
          <v-list-item-subtitle id="text--feedback-popup-subtitle" class="feedback-title">
            We treasure your suggestions
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="feedback-popup__text-area">
        <v-form ref="feedbackForm">
          <v-textarea
            ref="refTextArea"
            id="input--feedback-message"
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
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                (!!v && v.length >= 5 && v.length <= 1000) ||
                'Minimum 5 characters - Maximum 1000 character'
            ]"
          ></v-textarea>
        </v-form>
      </div>
      <div class="feedback-button k-dialog__footer-max-height" :style="getScrollingStyle">
        <v-btn
          id="btn-cancel--feedback-popup"
          class="feedback-button--cancel"
          text
          v-on:click="onCancelClicked"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-send--feedback-popup"
          class="feedback-button--success"
          text
          :disabled="saveDisable"
          v-on:click="onFeedbackSend"
          >SEND</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { sendFeedback } from '../api/dashboard'
import labels from '@/model/constants/labels'

export default {
  name: 'FeedbackPopup',
  data() {
    return {
      labels,
      saveDisable: false,
      feedbackMessage: null,
      textAreaHeight: 156
    }
  },
  computed: {
    getScrollingStyle() {
      const style = { boxShadow: 'none !important' }
      if (this.textAreaHeight > 165) {
        style.boxShadow =
          ' 0px 3px 1px -2px rgba(80, 80, 80, 0.12), 0px 2px 2px rgba(80, 80, 80, 0.14), 0px 1px 5px rgba(80, 80, 80, 0.2) !important'
      }
      return style
    }
  },
  watch: {
    feedbackMessage() {
      this.textAreaHeight = this.$refs.refTextArea.$el.getBoundingClientRect().height
    }
  },
  methods: {
    ...mapActions({
      sendFeedback: 'dashboard/sendFeedback',
      changeFeedbackPopup: 'dashboard/changeFeedbackPopup'
    }),
    onFeedbackSend() {
      let payload = { Text: this.feedbackMessage }
      if (this.$refs.feedbackForm.validate()) {
        this.saveDisable = true
        sendFeedback(payload).finally(() => {
          this.saveDisable = false
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
  .v-card {
    border-radius: 12px !important;
  }
  &__header {
    padding: 24px !important;
    border-bottom: 1px solid #e0e0e0;
  }
  &__text-area {
    margin-top: 24px;
    padding: 0 24px !important;
    border-bottom: 1px solid #e0e0e0;
  }
  .v-list-item__content {
    padding: 0 !important;
  }
  .feedback-button {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
      margin-right: 16px;
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
