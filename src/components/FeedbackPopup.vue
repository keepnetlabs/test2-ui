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
          <VTextarea
            v-model="feedbackMessage"
            ref="refTextArea"
            id="input--feedback-message"
            filled
            auto-grow
            label="I would like to see"
            rows="4"
            row-height="30"
            shaped
            no-resize
            required
            class="feedback-popup__text-area-text"
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                (!!v && v.length >= 5 && v.length <= 1000) ||
                'Minimum 5 characters - Maximum 1000 character'
            ]"
          />
        </v-form>
      </div>
      <div class="feedback-button k-dialog__footer-max-height" :style="getScrollingStyle">
        <v-btn
          id="btn-cancel--feedback-popup"
          class="feedback-button--cancel"
          text
          @click="onCancelClicked"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-send--feedback-popup"
          class="feedback-button--success"
          text
          :disabled="saveDisable"
          @click="onFeedbackSend"
          >SEND</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { sendFeedback } from '@/api/dashboard'
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
      const textAreaEl = this.$refs?.refTextArea?.$el
      if (!textAreaEl || typeof textAreaEl.getBoundingClientRect !== 'function') return
      this.textAreaHeight = textAreaEl.getBoundingClientRect().height
    }
  },
  methods: {
    ...mapActions({
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
