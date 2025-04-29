<template>
  <app-modal :status="status" icon-name="$callback" :title="getModalTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Scenario Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Email Template</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />

          <v-stepper-step
            :class="{
              'k-stepper__step': true
            }"
            :complete="step > 3"
            :step="3"
            >Callback Template</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 4" :step="4"
            >Summary</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="phishing-scenario-info">
              <ConfigureCompanyStepHeader
                class="mb-8"
                :title="labels.ScenarioInfo"
                :subtitle="labels.ScenarioInfoSub"
              />
              <v-form ref="refFormStep1" lazy-validation>
                <form-group title="Scenario Name" has-hint class-name="mt-8">
                  <InputEntityName
                    v-model.trim="formValues.name"
                    id="input--new-phishing-scenarios-template-name"
                    entity-name="scenario name"
                    initial-placeholder="Enter a name"
                  />
                </form-group>
                <form-group title="Description" sub-title="Describe the scenario briefly">
                  <InputDescription
                    v-model.trim="formValues.description"
                    id="input--new-phishing-scenarios-description"
                    entityName="description"
                    initialPlaceholder="Enter description"
                    rows="2"
                    height="100"
                    :maxLength="300"
                  />
                </form-group>
                <form-group
                  has-hint
                  title="Language"
                  sub-title="Select the language you are writing this webpage template in"
                >
                  <input-select-language
                    v-model="formValues.languageTypeResourceId"
                    v-bind="commonRules"
                    item-text="text"
                    item-value="value"
                    required
                    :items="languageOptions"
                    :menu-props="{ offsetY: true }"
                  />
                </form-group>
                <form-group title="Tags" sub-title="Define tags for the scenario">
                  <InputTag
                    ref="refTags"
                    id="input--action-tags-new-scenario"
                    v-model="formValues.tags"
                    :items="[]"
                    class="hide-caret"
                  />
                </form-group>
                <make-available-for
                  ref="refMakeAvailableFor"
                  v-model="availableForRequests"
                  sub-title="Select companies that should see this scenario in their libraries"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <ConfigureCompanyStepHeader
                :title="labels.SelectEmailTemplate"
                subtitle="Choose your email template"
              />
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <EmailTemplateListPreview
                    v-if="step === 2"
                    :scenarioDetailsLookup="scenarioDetailsLookup"
                    :emailTemplateResourceId="emailTemplateResourceId"
                    :category-resource-id="formValues.methodTypeId"
                    :apiFuncs="getEmailTemplateApiFuncs"
                    :defaultBodyData="defaultEmailTemplateBodyData"
                    :languages="languageOptions"
                    isCallback
                    :type="SCENARIO_TYPES.CALLBACK"
                    @initialEmailTemplateId="getInitialEmailTemplateId"
                    @selectedEmailTemplateChange="selectedEmailTemplateChange"
                    @selectedEmailTemplateResourceId="selectedEmailTemplateResourceId"
                    @loading="isSubmitDisabled = $event"
                  />
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <div class="email-settings">
              <ConfigureCompanyStepHeader
                title="Select Callback Template"
                subtitle="Choose your callback template"
              />
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <CallbackTemplateSelectList
                    v-if="step === 3"
                    ref="refCallbackTemplateSelectList"
                    :templateResourceId="formValues.callbackTemplateResourceId"
                    :languages="languages"
                    @initialTemplateId="handleInitialTemplate"
                    @selectedTemplateResourceId="handleSelectedTemplateResourceIdChange"
                    @selectedTemplateChange="handleSelectedTemplateChange"
                  />
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content summary-step" :step="4">
            <div class="email-settings">
              <ConfigureCompanyStepHeader
                class="mb-8"
                :title="labels.ScenarioSummary"
                :subtitle="labels.ScenarioSummarySub"
              />
              <div
                :style="
                  isMethodMfa
                    ? {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        columnGap: '16px',
                        maxWidth: 'calc(100% - 96px)'
                      }
                    : {
                        maxWidth: 'calc(100% - 96px)'
                      }
                "
              >
                <CampaignManagerSummaryCard
                  icon="mdi-information"
                  :title="labels.ScenarioInfo"
                  :items="getScenarioInfoItems"
                />
                <CampaignManagerSummaryCard
                  v-if="isMethodMfa && step === 4"
                  icon="mdi-cog"
                  :title="labels.MFASettings"
                  :items="getMfaSettingsItems"
                />
              </div>
              <v-list-item>
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          mdi-email
                        </v-icon>
                        Email that will be sent to users
                      </div>
                      <div>
                        <v-btn
                          class="campaign-manager-summary-card__button"
                          rounded
                          outlined
                          color="#2196f3"
                          @click="showTemplate1 = !showTemplate1"
                          >Preview
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            {{ showTemplate1 ? 'mdi-menu-up' : 'mdi-menu-down' }}
                          </v-icon></v-btn
                        >
                      </div>
                    </div>
                    <div class="summary-content">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!summaryData">
                          <div class="template-summary__title">
                            {{ summaryData.emailTemplate && summaryData.emailTemplate.name }}
                          </div>
                          <div class="template-summary__sub-title mt-2">
                            From:
                            {{ summaryData.emailTemplate && summaryData.emailTemplate.fromAddress }}
                          </div>
                          <div
                            v-if="hasPhishingFile"
                            class="attachment-wrapper position-relative mt-2 mb-0"
                          >
                            <div class="attachment blue-attach mb-0">
                              <AttachmentsPreview
                                :deletable="false"
                                :att="{
                                  name: summaryData.emailTemplate.phishingFileName
                                }"
                                :isEmailTemplate="true"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="d-flex" v-if="!!summaryData">
                          <v-chip
                            v-if="!!summaryData && !!summaryData.emailTemplate"
                            class="template-list--item template-list--item__chip p mr-2"
                            style="
                              color: white;
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              font-size: 12px;
                            "
                            :color="emailDifficultyChipColor"
                          >
                            {{
                              difficulties.find(
                                (item) =>
                                  item.value === summaryData.emailTemplate.difficultyResourceId
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            v-if="!!summaryData && !!summaryData.emailTemplate"
                            class="template-list--item template-list--item__chip p"
                            style="
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              font-size: 12px;
                            "
                          >
                            {{
                              methods.find(
                                (item) =>
                                  item.value === summaryData.emailTemplate.categoryResourceId
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            v-if="!!summaryData"
                            class="template-list--item template-list--item__chip p"
                            style="
                              background-color: #757575;
                              margin-left: 8px;
                              color: white;
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              font-size: 12px;
                            "
                          >
                            <v-icon style="font-size: 18px;" color="#fff">mdi-web</v-icon
                            >{{
                              summaryData.emailTemplate &&
                              summaryData.emailTemplate.languageShortCode
                            }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="showTemplate1"
                      class="summary-content summary-content__collapsable"
                      style="border: none;"
                    >
                      <div class="summary-template">
                        <KEmailPreview
                          v-if="!!summaryData.emailTemplate.template"
                          :key="summaryData.emailTemplate.template"
                          :html="summaryData.emailTemplate.template"
                          is-extra-height
                        />
                      </div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div style="max-width: calc(100% - 96px);">
                    <CallbackCampaignModalSummaryCallbackTemplate
                      v-if="!!summaryData.callbackTemplate"
                      class="mt-4"
                      :formValues="summaryData.callbackTemplate"
                    />
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        :max-step="4"
        :step.sync="step"
        :disabled-statuses="{
          nextButton: isSubmitDisabled,
          submitButton: isSubmitDisabled
        }"
        :ids="footerButtonsIds"
        @on-cancel="changeNewScenarioModalStatus"
        @on-back="backStep"
        @on-next="nextStep(+1)"
        @on-submit="submit"
      />
    </template>
  </app-modal>
</template>
<script>
import AppModal from '../AppModal'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import CallbackService from '@/api/callback'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import KEmailPreview from '@/components/KEmailPreview'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import {
  SCENARIO_DIFFICULTIES,
  SCENARIO_METHOD_TYPES,
  SCENARIO_METHODS
} from '@/components/PhishingScenarios/utils'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import CallbackTemplateSelectList from '@/components/CallbackScenarios/CallbackTemplateSelectList'
import CallbackCampaignModalSummaryCallbackTemplate from '@/components/CallbackScenarios/CallbackCampaignModalSummaryCallbackTemplate'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { mapGetters } from 'vuex'
import { getDifficultyColor } from '@/components/SmishingReport/Opened/utils'
export default {
  name: 'CallbackScenarioModal',
  components: {
    ConfigureCompanyStepHeader,
    CampaignManagerSummaryCard,
    StepperFooter,
    KEmailPreview,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplateListPreview,
    InputSelectLanguage,
    InputTag,
    InputEntityName,
    InputDescription,
    AttachmentsPreview,
    CallbackTemplateSelectList,
    CallbackCampaignModalSummaryCallbackTemplate
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isAttachmentBased: {
      type: Boolean,
      default: false
    },
    scenarioId: {
      type: String
    },
    scenarioDetailsLookup: {
      required: true
    },
    languages: {
      type: Array
    }
  },
  data() {
    return {
      SCENARIO_TYPES,
      defaultEmailTemplateBodyData: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'createTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  value: '',
                  FieldName: 'CategoryResourceId',
                  Operator: 'Include'
                },
                {
                  value: '',
                  FieldName: 'DifficultyResourceId',
                  Operator: 'Include'
                },
                {
                  value: '',
                  FieldName: 'LanguageTypeResourceId',
                  Operator: 'Include'
                }
              ]
            },
            {
              Condition: 'OR',
              FilterItems: [
                { FieldName: 'Name', Operator: 'Contains', value: '' },
                { FieldName: 'CategoryName', Operator: 'Contains', value: '' },
                {
                  FieldName: 'DifficultyName',
                  Operator: 'Contains',
                  value: ''
                },
                { FieldName: 'CreatedBy', Operator: 'Contains', value: '' },
                { FieldName: 'Tags', Operator: 'Contains', value: '' },
                { FieldName: 'CreateTime', Operator: 'Contains', value: '' }
              ]
            }
          ]
        }
      },
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-edit-scenario-modal',
        backButton: 'btn-back--add-or-edit-scenario-modal',
        nextButton: 'btn-next--add-or-edit-scenario-modal',
        saveButton: 'btn-save--add-or-edit-scenario-modal'
      },
      isInitial: true,
      emailDifficultyChipColor: '#217124',
      isFetched: false,
      selectedTab: '1',
      summaryData: {},
      showTemplate1: false,
      showTemplate2: false,
      languageOptions: [],
      methods: SCENARIO_METHODS,
      difficulties: SCENARIO_DIFFICULTIES,
      isSubmitDisabled: false,
      availableForRequests: [],
      generalDifficultyTypeId: '',
      labels,
      step: 1,
      Validations,
      initialFormValues: {},
      formValues: {
        name: '',
        description: '',
        methodTypeId: '1',
        difficultyTypeId: '1',
        emailTemplateId: null,
        callbackTemplateResourceId: null,
        languageTypeResourceId: '862249c19aad',
        tags: []
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      mfaData: {
        mfaSenderNumberResourceId: '',
        mfaCallerPhoneNumber: '',
        mfaTextTemplate: 'Your verification code: {MFA_CODE}'
      },
      emailTemplateResourceId: null,
      selectedEmailTemplate: null,
      selectedCallbackTemplate: null
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getEmailTemplateApiFuncs() {
      return {
        list: CallbackService.searchEmailTemplates,
        content: CallbackService.getEmailTemplate
      }
    },
    getMethodTypes() {
      return this.scenarioDetailsLookup?.methodTypes || []
    },
    isMethodMfa() {
      return this.formValues.methodTypeId === '4'
    },
    getScenarioInfoItems() {
      return {
        Name: this.formValues.name,
        // Method: this.getMethodText,
        Difficulty: this.getDifficultyType
      }
    },
    getMfaSettingsItems() {
      return {
        'Sender Phone Number': this?.mfaData?.mfaCallerPhoneNumber,
        'Verification Message': this?.mfaData?.mfaTextTemplate
      }
    },
    hasPhishingFile() {
      return !!this.summaryData?.emailTemplate?.phishingFileName
    },
    getSelectedMethod() {
      if (!this.formValues?.methodTypeId) return ''
      if (this.methods[Number(this.formValues?.methodTypeId) - 1].text === 'MFA') {
        return this.selectedEmailTemplate.categoryName === 'Click Only'
          ? 'Click-Only'
          : this.selectedEmailTemplate.categoryName
      }
      return this.methods[Number(this.formValues?.methodTypeId) - 1].text
    },
    getModalTitle() {
      if (!this.isEdit) return 'New Callback Scenario'
      return this.isDuplicate ? 'Duplicate Callback Scenario' : 'Edit Callback Scenario'
    },
    getPhishingFile() {
      return this.summaryData?.emailTemplate?.phishingFileName
        ? {
            name: this.summaryData?.emailTemplate?.phishingFileName
          }
        : null
    },
    getDifficultyType() {
      return (
        this.scenarioDetailsLookup['difficultyTypes']?.find(
          (item) => item.value === parseInt(this.generalDifficultyTypeId)
        )?.text || ''
      )
    }
  },
  watch: {
    'formValues.methodTypeId'(val, oldVal) {
      if (val !== oldVal && !this.isInitial) {
        this.formValues.emailTemplateId = null
        this.emailTemplateResourceId = null
      }
    }
  },
  created() {
    if (this.isDuplicate) this.setFooterDuplicateIds()
    this.callForLanguages()
    if (this.isEdit) {
      this.callForScenario()
    } else {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      this.isInitial = false
    }
    if (!(this.isEdit || this.isDuplicate)) {
      const preferredLanguageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
      this.formValues.languageTypeResourceId = preferredLanguageTypeResourceId
    }
  },
  methods: {
    getDifficultyColor,
    handleInitialTemplate(id) {
      this.initialFormValues.callbackTemplateResourceId = id
    },
    handleSelectedTemplateResourceIdChange(id) {
      this.formValues.callbackTemplateResourceId = id
    },
    handleSelectedTemplateChange(item) {
      this.selectedCallbackTemplate = item
    },
    setFooterDuplicateIds() {
      this.footerButtonsIds = {
        cancelButton: 'btn-cancel--duplicate-scenario-modal',
        backButton: 'btn-back--duplicate-scenario-modal',
        nextButton: 'btn-next--duplicate-scenario-modal',
        saveButton: 'btn-save--duplicate-scenario-modal'
      }
    },
    callForScenario() {
      this.isSubmitDisabled = true
      CallbackService.getCallbackScenario(this.scenarioId)
        .then((response) => {
          this.formValues = response.data.data
          this.formValues.name = `${this.formValues.name}`
          this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
          this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
          this.formValues.emailTemplateId = response.data.data.emailTemplateResourceId
          this.formValues.callbackTemplateResourceId = response.data.data.callbackTemplateResourceId
          this.emailTemplateResourceId = response.data.data.emailTemplateResourceId
          this.formValues.tags = this.formValues.tags || []
          const availableForList = response?.data?.data?.availableForList
          if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
          this.availableForRequests = getAvailableForValueFromList(availableForList)
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isFetched = true
        })
        .finally(() => {
          this.isSubmitDisabled = false
          this.isInitial = false
        })
    },
    getMethodTypeDescription(method = '') {
      switch (method) {
        case SCENARIO_METHOD_TYPES.CLICK_ONLY:
          return 'See who fails for phishing links'
        case SCENARIO_METHOD_TYPES.DATA_SUBMISSION:
          return 'Gather information from users'
        case SCENARIO_METHOD_TYPES.ATTACHMENT:
          return 'Send a trackable file'
        case SCENARIO_METHOD_TYPES.MFA:
          return 'Send a phishing MFA'
        default:
          return ''
      }
    },
    getInitialEmailTemplateId(id) {
      this.initialFormValues.emailTemplateId = id
    },
    selectedEmailTemplateResourceId(id) {
      this.emailTemplateResourceId = id
    },
    selectedEmailTemplateChange(id, item) {
      this.formValues.emailTemplateId = id
      this.selectedEmailTemplate = item
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.name,
            value: language.resourceId,
            description: language.description
          })) || []
      })
    },
    setAttachmentFile(file) {
      this.formValues.attachmentFiles = file
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    changeNewScenarioModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeNewScenarioModalStatus', false)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewScenarioModalStatus', false)
        }
      })
    },
    nextStep() {
      const currentStep = JSON.parse(JSON.stringify(this.step))
      let isValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (currentStep === 1) {
        if (this.$refs.refFormStep1.validate() && isValid) {
          this.step += 1
        } else {
          const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
          scrollToComponent(el)
        }
      }
      if (currentStep === 2) {
        if (!!this.formValues.emailTemplateId || !!this.emailTemplateResourceId) {
          this.isSubmitDisabled = true
          getEmailTemplatePreviewContent(this.emailTemplateResourceId)
            .then((response) => {
              const languageShortCode = this.languageOptions.find(
                (language) => language.value === response?.data?.data?.languageTypeResourceId
              )?.description
              const emailTemplateData = {
                ...response.data.data,
                languageShortCode
              }
              if (this.selectedEmailTemplate) {
                this.generalDifficultyTypeId =
                  this.scenarioDetailsLookup['difficultyTypes']
                    ?.find(
                      (difficulty) => difficulty.text === this.selectedEmailTemplate.difficultyName
                    )
                    ?.value.toString() || ''
                this.emailDifficultyChipColor = this.getDifficultyColor(
                  this.selectedEmailTemplate.difficultyName
                )
              }
              this.summaryData.emailTemplate = JSON.parse(JSON.stringify(emailTemplateData))
              this.step += 1
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      }
      if (currentStep === 3) {
        if (!this.formValues.callbackTemplateResourceId) return
        this.summaryData.callbackTemplate = {
          template: this.selectedCallbackTemplate
        }
        this.step += 1
      }
    },
    backStep() {
      this.step -= 1
      this.isSubmitDisabled = false
    },
    submit() {
      this.isSubmitDisabled = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
      }
      const payload = {
        name: this.formValues.name,
        description: this.formValues.description || '',
        languageTypeResourceId: this.formValues.languageTypeResourceId,
        tags: this.formValues.tags || [],
        emailTemplateId: this.formValues.emailTemplateId,
        callbackTemplateId: this.selectedCallbackTemplate.id,
        availableForRequests: this.availableForRequests
      }
      if (this.isEdit && !this.isDuplicate) {
        CallbackService.updateCallbackScenario(this.scenarioId, payload)
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        CallbackService.createCallbackScenario(payload)
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    }
  }
}
</script>
