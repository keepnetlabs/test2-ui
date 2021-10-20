<template>
  <AppModal
    :status="status"
    icon-name="mdi-hook"
    :title="getTitle"
    class-name="add-in-configuration"
    title-id="text--add-or-edit-company-manager-modal-title"
    @closeOverlay="closeOverlay"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-info"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.CampaignInfo }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-advanced-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.AdvancedSettings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-summary"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.CampaignSummary }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.PhishingCampaignInfo"
              :subtitle="labels.PhishingCampaignInfoSub"
            />
            <CampaignManagerCampaignInfo />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              :title="labels.AdvancedSettings"
              :subtitle="labels.AdvancedSettingsSub"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              :title="labels.CampaignSummary"
              :subtitle="labels.CampaignSummarySub"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <v-btn
        @click="closeOverlay"
        id="btn-cancel--add-or-edit-company-manager-modal"
        class="add-in-configuration__footer-btn-cancel"
        rounded
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          @click="changeStep(-1)"
          id="btn-back--add-or-edit-company-manager-modal"
          class="add-in-configuration__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          {{ labels.Back }}
        </v-btn>

        <v-btn
          id="btn-next--add-or-edit-company-manager-modal"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          :disabled="isSaveDisabled"
          @click="handleSubmit"
        >
          {{ [1, 2].includes(step) ? labels.Next : labels.Start }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo'

const EMITS = {
  ON_CLOSE: 'on-close'
}

export default {
  name: 'CampaignManagerAddOrEditModal',
  components: { CampaignManagerCampaignInfo, ConfigureCompanyStepHeader, AppModal },
  props: {
    status: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    }
  },
  emits: EMITS,
  data() {
    return {
      isSaveDisabled: false,
      labels,
      step: 1
    }
  },
  computed: {
    getTitle() {
      const text = this.isEdit ? labels.Edit : labels.New
      return `${text} Phishing Campaign`
    }
  },
  methods: {
    closeOverlay() {
      this.$emit(EMITS.ON_CLOSE)
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    handleSubmit() {
      switch (this.step) {
        case 1:
          this.changeStep()
          break
        case 2:
          this.changeStep()
          break
        case 3:
          this.closeOverlay()
      }
    }
  }
}
</script>
