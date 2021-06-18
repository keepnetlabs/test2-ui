<template>
  <AppModal
    :status="status"
    icon-name="mdi-briefcase"
    :title="labels.NewCompanyQuickSetup"
    class-name="add-in-configuration"
    title-id="text--configure-new-company-modal-title"
    @closeOverlay="closeOverlay"
  >
    <template v-slot:overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--configure-new-company-white-labeling"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.WhiteLabeling }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-white-listing"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.WhiteListing }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-first-system-user"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.FirstSystemUser }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-next-steps"
            class="k-stepper__step"
            :complete="step > 4"
            :step="4"
            >{{ labels.NextSteps }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1"> </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2"> </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3"> </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="4"> </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template v-slot:overlay-footer>
      <v-btn @click="closeOverlay" class="add-in-configuration__footer-btn-cancel" rounded>
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          @click="changeStep(-1)"
          id="btn-back--phishing-reporter-settings-add-in-configuration"
          class="add-in-configuration__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          {{ labels.Back }}
        </v-btn>
        <v-btn
          @click="changeStep(+1)"
          id="btn-next--phishing-reporter-settings-add-in-configuration"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step < 4"
        >
          {{ labels.Next }}
        </v-btn>
        <v-btn
          @click="submit"
          id="btn-save--phishing-reporter-settings-add-in-configuration"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step === 4"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
export default {
  name: 'ConfigureNewCompanyModal',
  components: { AppModal },
  props: {
    status: {
      type: Boolean
    },
    createdCompanyResourceId: {
      type: String
    }
  },
  data() {
    return {
      labels,
      step: 1
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('on-close')
    },
    changeStep(flag) {
      let hasValidationError = false
      let ret = null
      switch (this.step) {
        case 1:
          break
        case 2:
          break
        case 3:
          break
        case 4:
        default:
          break
      }
      if (!hasValidationError || flag === -1) {
        this.step += flag
      }
      ret = null
    }
  }
}
</script>

<style lang="scss"></style>
