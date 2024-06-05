<template>
  <div class="d-flex justify-space-between w-100">
    <div>
      <CancelButton :id="ids.cancelButton" @click="handleCancel" />
    </div>
    <div>
      <slot name="right-side">
        <BackButton
          v-if="isRenderBackButton"
          :id="ids.backButton"
          class="mr-6"
          @click="handleBack"
        />
        <VTooltip
          v-if="disabledStatuses.nextButton && !!disabledNextButtonTooltipText"
          :disabled="!disabledNextButtonTooltipText"
          top
          style="z-index: 100000;"
        >
          <template #activator="{ on }">
            <NextButton
              v-if="!isStepIsEqualToMax"
              v-on="on"
              :id="ids.nextButton"
              :disabled="disabledStatuses.nextButton"
              @click="handleNext"
            />
          </template>
          <span>{{ disabledNextButtonTooltipText }}</span>
        </VTooltip>
        <template v-else>
          <NextButton
            v-if="!isStepIsEqualToMax"
            :id="ids.nextButton"
            :disabled="disabledStatuses.nextButton"
            @click="handleNext"
          />
        </template>
        <SaveButton
          v-if="isStepIsEqualToMax"
          :id="ids.saveButton"
          :disabled="disabledStatuses.submitButton"
          :label="saveButtonText"
          @click="handleSubmit"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import NextButton from '@/components/Common/Buttons/NextButton'
import BackButton from '@/components/Common/Buttons/BackButton'
import CancelButton from '@/components/Common/Buttons/CancelButton'
import labels from '@/model/constants/labels'
import SaveButton from '@/components/Common/Buttons/SaveButton'
export default {
  name: 'StepperFooter',
  components: { SaveButton, CancelButton, BackButton, NextButton },
  props: {
    step: {
      type: Number,
      required: true
    },
    maxStep: {
      validator(v) {
        return ['string', 'number'].includes(typeof v)
      }
    },
    disabledStatuses: {
      type: Object,
      default: () => ({
        nextButton: false,
        submitButton: false
      })
    },
    disabledNextButtonTooltipText: {
      type: String
    },
    saveButtonText: {
      type: String,
      default: labels.Save
    },
    ids: {
      type: Object,
      default: () => ({
        cancelButton: '',
        backButton: '',
        nextButton: '',
        saveButton: ''
      })
    }
  },
  data() {
    return { labels }
  },
  computed: {
    isStepIsEqualToMax() {
      return this.step === Number(this.maxStep)
    },
    isRenderBackButton() {
      return this.step > 1
    }
  },
  methods: {
    handleCancel() {
      this.$emit('on-cancel')
    },
    handleBack() {
      this.$emit('on-back')
    },
    handleNext() {
      this.$emit('on-next')
    },
    handleSubmit() {
      this.$emit('on-submit')
    }
  }
}
</script>
