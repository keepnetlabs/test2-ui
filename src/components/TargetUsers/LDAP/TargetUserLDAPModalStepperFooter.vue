<template>
  <StepperFooter :step="step" :max-step="maxStep" @on-cancel="handleCancel">
    <template #right-side>
      <BackButton
        v-if="isRenderBackButton"
        id="btn-back--target-users-ldap-people-modal"
        class="mr-6"
        @click="changeStep(-1)"
      />
      <NextButton
        v-if="!isStepIsEqualToMax"
        id="btn-next--target-users-ldap-people-modal"
        @click="changeStep()"
      />
      <v-btn
        v-if="isStepIsEqualToMax"
        id="btn-import-selected--target-users-import-people-modal"
        class="target-user-import-file__button target-user-import-file__button--import-selected"
        :style="!selectedItemsCount && { opacity: '.5', pointerEvents: 'none' }"
        rounded
        color="#2196f3"
        @click="$emit('on-import-selected')"
      >
        {{ labels.ImportSelected }} {{ selectedItemsCount ? `(${selectedItemsCount})` : '' }}
      </v-btn>
      <v-btn
        v-if="isStepIsEqualToMax"
        id="btn-import-all--target-users-import-people-modal"
        class="target-user-import-file__button target-user-import-file__button--import-all"
        :style="!totalNumberOfRecords && { opacity: '.5', pointerEvents: 'none' }"
        rounded
        color="#2196f3"
        @click="$emit('on-import-all')"
      >
        {{ labels.ImportAll }} {{ totalNumberOfRecords ? `(${totalNumberOfRecords})` : '' }}
      </v-btn>
    </template>
  </StepperFooter>
</template>

<script>
import labels from '@/model/constants/labels'
import BackButton from '@/components/Common/Buttons/BackButton'
import NextButton from '@/components/Common/Buttons/NextButton'
import StepperFooter from '@/components/Stepper/StepperFooter'
export default {
  name: 'TargetUserLDAPModalStepperFooter',
  components: { StepperFooter, NextButton, BackButton },
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
    totalNumberOfRecords: {
      type: Number
    },
    selectedItemsCount: {
      type: Number
    },
    isSubmitDisabled: {
      type: Boolean,
      default: false
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
    changeStep(val = 1) {
      switch (val) {
        case 1:
          this.$emit('validate-step1', () => {
            this.$emit('update:step', this.step + val)
          })
          break
        case -1:
          this.$emit('update:step', this.step + val)
          break
        default:
          break
      }
    },
    handleCancel() {
      this.$emit('on-cancel')
    }
  }
}
</script>
