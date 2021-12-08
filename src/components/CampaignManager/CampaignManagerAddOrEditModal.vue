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
            <CampaignManagerCampaignInfo
              ref="refCampaignManagerCampaignInfo"
              :default-values="getDefaultValuesOfCampaignInfo"
              :is-edit="isEdit"
              :is-action-button-disabled.sync="isActionButtonDisabled"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              :title="labels.AdvancedSettings"
              :subtitle="labels.AdvancedSettingsSub"
            />
            <CampaignManagerAdvancedSettings
              ref="refCampaignManagerAdvancedSettings"
              :form-details="getAdvancedSettingsFormDetails"
              :default-values="getDefaultValuesOfAdvancedSettings"
              :selected-phishing-scenario="getSelectedPhishingScenario"
              @on-increment-step="step++"
              @set-action-button-disability="setActionButtonDisability"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              :title="labels.CampaignSummary"
              :subtitle="labels.CampaignSummarySub"
            />
            <CampaignManagerSummary
              ref="refCampaignManagerSummary"
              :form-data="getFormDataForCampaignSummary"
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
          :disabled="isActionButtonDisabled"
          @click="handleSubmit"
        >
          {{ [1, 2].includes(step) ? labels.Next : getLastStepText }}
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
import { scrollToComponent } from '@/utils/functions'
import CampaignManagerAdvancedSettings from '@/components/CampaignManager/AdvancedSettings/CampaignManagerAdvancedSettings'
import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary'
import {
  createCampaignManager,
  getCampaignManager,
  updateCampaignManager
} from '@/api/phishingsimulator'
import { searchTargetGroups } from '@/api/targetUsers'

const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}

export default {
  name: 'CampaignManagerAddOrEditModal',
  components: {
    CampaignManagerSummary,
    CampaignManagerAdvancedSettings,
    CampaignManagerCampaignInfo,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    formDetails: {
      type: Object
    },
    isDuplicate: {
      type: Boolean
    }
  },
  emits: EMITS,
  data() {
    return {
      isActionButtonDisabled: false,
      labels,
      step: 1,
      selectedRowFormData: {}
    }
  },
  computed: {
    getTitle() {
      const text = this.isEdit ? labels.Edit : labels.New
      return `${text} Phishing Campaign`
    },
    getLastStepText() {
      return this.$refs.refCampaignManagerCampaignInfo.formData.scheduleTypeId === '1'
        ? labels.Start
        : labels.Save
    },
    getSelectedPhishingScenario() {
      let selectedScenario = {}
      if (this.step === 2) {
        const { refCampaignManagerCampaignInfo } = this.$refs
        const { refCampaignManagerPhishingScenarios } = refCampaignManagerCampaignInfo.$refs
        selectedScenario = refCampaignManagerPhishingScenarios.emailTemplateParams || {}
        selectedScenario.template = refCampaignManagerPhishingScenarios.emailTemplate || ''
      }
      return selectedScenario
    },
    getFormDataForCampaignSummary() {
      let formData = {}
      if (this.step === 3) {
        const { refCampaignManagerCampaignInfo, refCampaignManagerAdvancedSettings } = this.$refs
        formData = {
          ...formData,
          ...refCampaignManagerCampaignInfo.formData,
          ...refCampaignManagerAdvancedSettings.formData,
          emailTemplate:
            refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios.emailTemplate,
          emailTemplateParams:
            refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios
              .emailTemplateParams,
          landingPageTemplate:
            refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios
              .landingPageTemplate,
          landingPageParams:
            refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios
              .landingPageParams
        }

        formData.selectedPhishingScenario =
          refCampaignManagerCampaignInfo.phishingScenarioItems.find(
            (item) => item.resourceId === formData.phishingScenarioResourceId
          ) || refCampaignManagerCampaignInfo.formData.phishingScenario

        formData.selectedSchedule =
          refCampaignManagerCampaignInfo.formData.scheduleTypeId === '1' ? 'Now' : 'Later'
        formData.selectedSmtpSetting = refCampaignManagerAdvancedSettings.responseOfSmtpItems.find(
          (item) => item.resourceId === formData.smtpSettingResourceId
        )
      }
      return formData
    },
    getAdvancedSettingsFormDetails() {
      if (!this.formDetails) return {}
      const {
        distributionEmailOverTimeTypes,
        distributionSmtpDelayTimeTypes,
        sendRandomlyUsersCalculateTypes
      } = this.formDetails
      return {
        distributionEmailOverTimeTypes,
        distributionSmtpDelayTimeTypes,
        sendRandomlyUsersCalculateTypes
      }
    },
    getDefaultValuesOfCampaignInfo() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        name,
        targetGroups,
        phishingScenario,
        scheduleTypeId,
        duration
      } = this.selectedRowFormData
      return {
        name,
        targetGroups,
        phishingScenario,
        scheduleTypeId: scheduleTypeId.toString(),
        duration
      }
    },
    getDefaultValuesOfAdvancedSettings() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        distributionEmailOver,
        distributionEmailOverTimeTypeId,
        distributionSmtpDelayEvery,
        distributionSmtpDelayTimeTypeId,
        distributionTypeId,
        sendingLimit,
        excludeFromReports,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId,
        smtpSetting
      } = this.selectedRowFormData
      return {
        smtpSetting,
        distributionEmailOver: distributionEmailOver.toString(),
        distributionEmailOverTimeTypeId: distributionEmailOverTimeTypeId.toString(),
        distributionSmtpDelayEvery: distributionSmtpDelayEvery.toString(),
        distributionSmtpDelayTimeTypeId: distributionSmtpDelayTimeTypeId.toString(),
        distributionTypeId: distributionTypeId.toString(),
        sendingLimit,
        excludeFromReports,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId: sendRandomlyUsersCalculateTypeId.toString()
      }
    }
  },
  created() {
    if (this.selectedRow) {
      this.callForData()
    }
  },
  methods: {
    callForData() {
      getCampaignManager(this.selectedRow.resourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        if (this.isDuplicate) {
          data.name = `${data.name} - Copy`
        }
        this.selectedRowFormData = data
      })
    },
    closeOverlay() {
      this.$emit(EMITS.ON_CLOSE)
    },
    showErrorMessage(ref) {
      this.$nextTick(() => {
        const el = ref.$el.querySelector('.error--text')
        scrollToComponent(el)
      })
    },
    changeStep(flag = 1) {
      const { refCampaignManagerAdvancedSettings, refCampaignManagerCampaignInfo } = this.$refs
      if (this.step === 2 && flag === 1) {
        if (
          refCampaignManagerAdvancedSettings &&
          refCampaignManagerAdvancedSettings.testEmailErrorMessage &&
          !refCampaignManagerAdvancedSettings.isTestMailSend
        ) {
          refCampaignManagerAdvancedSettings.toggleShowSmtpErrorDialog()
        } else if (
          refCampaignManagerAdvancedSettings &&
          !refCampaignManagerAdvancedSettings.testEmailErrorMessage &&
          !refCampaignManagerAdvancedSettings.isTestMailSend
        ) {
          refCampaignManagerAdvancedSettings
            .callForTestConnection()
            .then((response) => {
              if (response) {
                this.step++
              } else {
                refCampaignManagerAdvancedSettings.toggleShowSmtpErrorDialog()
              }
            })
            .catch(() => {
              refCampaignManagerAdvancedSettings.toggleShowSmtpErrorDialog()
            })
        } else {
          this.step++
        }
      } else if (this.step === 1 && flag === 1) {
        const ids = refCampaignManagerCampaignInfo.formData.targetGroupResourceIds.map(
          (item) => item.value
        )
        searchTargetGroups({
          pageNumber: 1,
          pageSize: 2000000,
          orderBy: 'CreateTime',
          ascending: false,
          filter: {
            Condition: 'AND',
            FilterGroups: [
              {
                Condition: 'AND',
                FilterItems: [],
                FilterGroups: []
              },
              {
                Condition: 'OR',
                FilterItems: [
                  { FieldName: 'resourceId', Value: ids.join(','), Operator: 'Include' }
                ],
                FilterGroups: []
              }
            ]
          }
        }).then((response) => {
          refCampaignManagerCampaignInfo.formData.selectedTargetGroups = response.data.data.results
        })
        this.step += flag
      } else {
        this.step += flag
      }
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    handleSubmit() {
      switch (this.step) {
        case 1:
          const { refCampaignManagerCampaignInfo } = this.$refs
          const { refForm } = refCampaignManagerCampaignInfo.$refs
          if (refForm.validate()) this.changeStep()
          else this.showErrorMessage(refForm)
          break
        case 2:
          const { refCampaignManagerAdvancedSettings } = this.$refs
          const { refForm: refFormAdvanced } = refCampaignManagerAdvancedSettings.$refs
          if (refFormAdvanced.validate()) this.changeStep()
          else this.showErrorMessage(refFormAdvanced)
          break
        case 3:
          const {
            refCampaignManagerCampaignInfo: { formData: campaignManagerFormData },
            refCampaignManagerAdvancedSettings: { formData: advancedSettingsFormData }
          } = this.$refs

          const payload = {
            name: campaignManagerFormData.name,
            phishingScenarioResourceId: campaignManagerFormData.phishingScenarioResourceId,
            scheduleTypeId: campaignManagerFormData.scheduleTypeId,
            duration: campaignManagerFormData.duration,
            targetGroupResourceIds: campaignManagerFormData.targetGroupResourceIds.map(
              (item) => item.value
            ),
            distributionTypeId: advancedSettingsFormData.distributionTypeId,
            distributionSmtpDelayEvery: advancedSettingsFormData.distributionSmtpDelayEvery,
            distributionSmtpDelayTimeTypeId:
              advancedSettingsFormData.distributionSmtpDelayTimeTypeId,
            distributionEmailOver: advancedSettingsFormData.distributionEmailOver,
            distributionEmailOverTimeTypeId:
              advancedSettingsFormData.distributionEmailOverTimeTypeId,
            sendingLimit: advancedSettingsFormData.sendingLimit,
            excludeFromReports: advancedSettingsFormData.excludeFromReports,
            sendOnlyActiveUsers: advancedSettingsFormData.sendOnlyActiveUsers,
            sendRandomlyUsers: advancedSettingsFormData.sendRandomlyUsers,
            sendRandomlyUsersCount: advancedSettingsFormData.sendRandomlyUsersCount,
            sendRandomlyUsersCalculateTypeId:
              advancedSettingsFormData.sendRandomlyUsersCalculateTypeId,
            smtpSettingResourceId: advancedSettingsFormData.smtpSettingResourceId
          }
          this.setActionButtonDisability(true)
          if (this.isEdit) {
            updateCampaignManager(this.selectedRow.resourceId, payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .finally(this.setActionButtonDisability)
          } else {
            createCampaignManager(payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .finally(this.setActionButtonDisability)
          }
      }
    }
  }
}
</script>
