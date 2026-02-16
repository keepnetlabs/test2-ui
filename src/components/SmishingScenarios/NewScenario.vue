<template>
  <app-modal :status="status" icon-name="mdi-message-alert" :title="getModalTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Scenario Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Text Message</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />

          <v-stepper-step
            :class="{
              'k-stepper__step': true,
              'k-stepper__step--hidden': isAttachmentBasedScenario
            }"
            :complete="isAttachmentBasedScenario ? false : step > 3"
            :step="isAttachmentBasedScenario ? 10 : 3"
            >Landing Page</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            class="k-stepper__step"
            :complete="isAttachmentBasedScenario ? step > 3 : step > 4"
            :step="isAttachmentBasedScenario ? 3 : 4"
            >Summary</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="phishing-scenario-info">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Scenario Info</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                    >Enter basic information about this scenario</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refFormStep1" lazy-validation>
                <form-group title="Scenario Name" has-hint class-name="mt-8">
                  <InputEntityName
                    v-model.trim="formValues.name"
                    id="input--new-phishing-scenarios-template-name"
                    entityName="scenario name"
                    initialPlaceholder="Enter a name"
                    :disabled="editItemsDisabled"
                  />
                </form-group>
                <form-group title="Description" sub-title="Describe the template briefly">
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
                  title="Method"
                  sub-title="Select the phishing technique for this scenario"
                >
                  <KSelect
                    v-bind="commonRules"
                    v-model="formValues.methodTypeId"
                    :items="scenarioDetailsLookup.methodTypes"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    hint="*Required"
                    required
                    persistent-hint
                    :slots="{ item: true }"
                  >
                    <template #item="{ item }">
                      <div :class="['mail-configuration-select-sources__item-container']">
                        <div class="mail-configuration-select-sources__item">
                          <div class="mail-configuration-select-sources__item-left">
                            {{ item.text }}
                          </div>
                          <div class="mail-configuration-select-sources__item-right-platform">
                            {{ getMethodTypeDescription(item.text) }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </KSelect>
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
                    v-model="formValues.tags"
                    ref="refTags"
                    id="input--action-tags-new-scenario"
                    :items="[]"
                    class="hide-caret"
                  />
                </form-group>
                <make-available-for
                  v-if="isRenderMakeAvailableFor"
                  ref="refMakeAvailableFor"
                  v-model="availableForRequests"
                  sub-title="Select companies that should see this scenario in their libraries"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Select Text Message Template</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title">
                    Choose your text message template for the scenario
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <TextMessageTemplateSelectList
                    v-if="step === 2"
                    ref="refTextMessageTemplateSelectList"
                    :template-resource-id="formValues.textTemplateResourceId"
                    :scenario-details-lookup="scenarioDetailsLookup"
                    :category-resource-id="formValues.methodTypeId"
                    :language-options="languageOptions"
                    @initialTemplateId="handleInitialTemplate"
                    @selectedTemplateResourceId="handleSelectedTemplateResourceIdChange"
                    @selectedTemplateChange="handleSelectedTemplateChange"
                  />
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="isAttachmentBasedScenario ? 10 : 3">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Select Landing Page Template</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title">{{
                    getStep3Subtitle
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <LandingPageListPreview
                    v-if="!isAttachmentBasedScenario && step === 3"
                    ref="refLandingPageTemplateListPreview"
                    :language-options="languageOptions"
                    :scenarioDetailsLookup="scenarioDetailsLookup"
                    :landingPageTemplateResourceId="landingPageTemplateResourceId"
                    :category-resource-id="formValues.methodTypeId"
                    :method="getSelectedMethod"
                    :text-template-method="getSelectedTextTemplateMethod"
                    :is-method-mfa="isMethodMfa"
                    :mfa-data="mfaData"
                    :type="SCENARIO_TYPES.SMISHING"
                    @initialLandingPageTemplateId="getInitialLandingPageTemplateId"
                    @selectedLandingPageChange="selectedLandingPageChange"
                    @selectedLandingPageTemplateResourceId="selectedLandingPageTemplateResourceId"
                    @loading="isSubmitDisabled = $event"
                /></v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content
            class="k-stepper__content summary-step"
            :step="isAttachmentBasedScenario ? 3 : 4"
          >
            <div class="email-settings">
              <v-list-item class="mb-8">
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Scenario Summary</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                    >Preview what this scenario will look like</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div :style="getSummaryContainerStyle">
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
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          mdi-message-processing
                        </v-icon>
                        Text Message Template that will be sent to users
                      </div>
                    </div>
                    <div class="summary-content">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!textMessageTemplate">
                          <div class="template-summary__title">
                            {{ textMessageTemplate && textMessageTemplate.name }}
                          </div>
                          <div class="template-summary__sub-title mt-2">
                            <span class="font-weight-bold">Text Message:</span>
                            {{ getSummaryTextMessage }}
                          </div>
                        </div>
                        <div v-if="!!textMessageTemplate" class="d-flex">
                          <v-chip
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
                                (item) => item.value === textMessageTemplate.difficultyResourceId
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            v-if="!!textMessageTemplate"
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
                                (item) => item.value === textMessageTemplate.categoryResourceId
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            v-if="!!textMessageTemplate"
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
                            >{{ getTextMessageLanguageDisplay }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="!isAttachmentBasedScenario">
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          {{ 'mdi-application' }}
                        </v-icon>
                        Landing Page for users who clicked the phishing link
                      </div>
                      <div>
                        <v-btn
                          class="campaign-manager-summary-card__button"
                          rounded
                          outlined
                          color="#2196f3"
                          @click="showTemplate2 = !showTemplate2"
                          >Preview
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            {{ showTemplate2 ? 'mdi-menu-up' : 'mdi-menu-down' }}
                          </v-icon></v-btn
                        >
                      </div>
                    </div>
                    <div v-if="landingPageTemplate" class="summary-content">
                      <el-tabs
                        v-if="
                          landingPageTemplate.landingPages &&
                          landingPageTemplate.landingPages.length > 1
                        "
                        v-model="selectedTab"
                      >
                        <el-tab-pane
                          v-for="(template, index) in landingPageTemplate.landingPages"
                          :key="index"
                          :name="`${index + 1}`"
                          :label="`Page ${index + 1}`"
                        >
                          <div class="d-flex justify-space-between">
                            <div class="d-flex flex-column" v-if="!!landingPageTemplate">
                              <div class="template-summary__title">
                                {{ landingPageTemplate && landingPageTemplate.name }}
                              </div>
                              <div class="template-summary__sub-title mt-2">
                                <b>URL:</b>
                                {{ landingPageTemplate.urlTemplate }}
                              </div>
                            </div>
                            <div class="d-flex" v-if="!!landingPageTemplate">
                              <v-chip
                                v-if="!!landingPageTemplate"
                                class="template-list--item template-list--item__chip p mr-2"
                                style="
                                  color: white;
                                  border-radius: 6px;
                                  height: 24px;
                                  font-weight: 600;
                                  font-size: 12px;
                                "
                                :color="getLandingPageDifficultyColor"
                              >
                                {{
                                  scenarioDetailsLookup.difficultyTypes.find(
                                    (item) =>
                                      item.value === landingPageTemplate.difficultyTypeId.toString()
                                  ).text
                                }}
                              </v-chip>
                              <v-chip
                                v-if="!!landingPageTemplate"
                                class="template-list--item template-list--item__chip p"
                                style="
                                  border-radius: 6px;
                                  height: 24px;
                                  font-weight: 600;
                                  font-size: 12px;
                                "
                              >
                                {{
                                  scenarioDetailsLookup.methodTypes.find(
                                    (item) =>
                                      item.value === landingPageTemplate.methodTypeId.toString()
                                  ).text
                                }}
                              </v-chip>
                              <v-chip
                                v-if="!!landingPageTemplate"
                                class="template-list--item template-list--item__chip p"
                                style="
                                  color: white;
                                  border-radius: 6px;
                                  height: 24px;
                                  font-weight: 600;
                                  background-color: #757575;
                                  margin-left: 8px;
                                  font-size: 12px;
                                "
                              >
                                <v-icon style="font-size: 18px;" color="#fff">mdi-web</v-icon
                                >{{ getLandingPageLanguageDisplay }}
                              </v-chip>
                            </div>
                          </div>
                        </el-tab-pane>
                      </el-tabs>
                      <div v-else class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!landingPageTemplate">
                          <div class="template-summary__title">
                            {{ landingPageTemplate && landingPageTemplate.name }}
                          </div>
                          <div class="template-summary__sub-title mt-2">
                            <b>URL:</b> {{ landingPageTemplate.urlTemplate }}
                          </div>
                        </div>
                        <div v-if="!!landingPageTemplate" class="d-flex">
                          <v-chip
                            class="template-list--item template-list--item__chip p mr-2"
                            style="
                              color: white;
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              font-size: 12px;
                            "
                            :color="getLandingPageDifficultyColor"
                          >
                            {{
                              scenarioDetailsLookup.difficultyTypes.find(
                                (item) =>
                                  item.value === landingPageTemplate.difficultyTypeId.toString()
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            class="template-list--item template-list--item__chip p"
                            style="
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              font-size: 12px;
                            "
                          >
                            {{
                              scenarioDetailsLookup.methodTypes.find(
                                (item) => item.value === landingPageTemplate.methodTypeId.toString()
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            class="template-list--item template-list--item__chip p"
                            style="
                              color: white;
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              background-color: #757575;
                              margin-left: 8px;
                              font-size: 12px;
                            "
                          >
                            <v-icon style="font-size: 18px;" color="#fff">mdi-web</v-icon
                            >{{ getLandingPageLanguageDisplay }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="showTemplate2"
                      class="summary-content summary-content__collapsable"
                      style="border: none;"
                    >
                      <div class="summary-template">
                        <KEmailPreview
                          v-if="!!getCurrentLandingPageTemplate"
                          :html="getCurrentLandingPageTemplate"
                          :key="getCurrentLandingPageTemplate"
                          is-extra-height
                        />
                      </div>
                    </div>
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
        :max-step="isAttachmentBasedScenario ? 3 : 4"
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
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import SmishingService from '@/api/smishing'
import LandingPageListPreview from '@/components/SmishingScenarios/LandingPageTemplateListPreview'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import KEmailPreview from '@/components/KEmailPreview'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import StepperFooter from '@/components/Stepper/StepperFooter'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import TextMessageTemplateSelectList from '@/components/SmishingScenarios/TextMessageTemplateSelectList'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { mapGetters } from 'vuex'
import { getDifficultyColor } from '@/components/SmishingReport/Opened/utils'
export default {
  name: 'NewScenario',
  components: {
    KSelect,
    StepperFooter,
    KEmailPreview,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    LandingPageListPreview,
    InputSelectLanguage,
    InputTag,
    InputEntityName,
    InputDescription,
    TextMessageTemplateSelectList,
    CampaignManagerSummaryCard
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    editableFormValues: {
      required: false
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
    }
  },
  data() {
    return {
      SCENARIO_TYPES,
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
      showTemplate2: false,
      languageOptions: [],
      methods: [
        { text: 'Click-Only', value: 'WNZt0sCVCWB3' },
        { text: 'Data Submission', value: 'DYC0gugxJMjT' },
        {},
        { text: 'MFA', value: '67LcW2kHbtds' }
      ],
      difficulties: [
        { text: 'Easy', value: 'mT0CeYGgKsVb' },
        { text: 'Medium', value: 'Z5XeVlpw6Dps' },
        { text: 'Hard', value: 'c4LCGEB9MayB' }
      ],
      isSubmitDisabled: false,
      availableForRequests: [],
      tagSearch: '',
      generalDifficultyTypeId: '',
      labels,
      step: 1,
      Validations,
      initialFormValues: {},
      formValues: {
        name: '',
        description: '',
        methodTypeId: '1',
        textTemplateId: null,
        landingPageTemplateId: null,
        languageTypeResourceId: '862249c19aad',
        tags: []
      },
      landingPageTemplate: null,
      textMessageTemplate: null,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 200, labels.getMaxLengthMessage(labels.TemplateName, 200))
        ]
      },
      mfaData: {
        mfaSenderNumberResourceId: '',
        mfaCallerPhoneNumber: '',
        mfaTextTemplate: 'Your verification code: {MFA_CODE}'
      },
      editItemsDisabled: false,
      emailTemplateResourceId: null,
      landingPageTemplateResourceId: null
    }
  },
  methods: {
    getDifficultyColor,
    getMethodTypeDescription(method = '') {
      if (method === 'Click-Only') return 'See who fails for phishing links'
      return method === 'Data Submission' ? 'Gather information from users' : 'Send a smishing MFA'
    },
    handleInitialTemplate(id) {
      this.initialFormValues.textTemplateResourceId = id
    },
    handleSelectedTemplateChange(item) {
      this.formValues.textTemplateId = item.id
      this.textMessageTemplate = item
    },
    handleSelectedTemplateResourceIdChange(id) {
      this.formValues.textTemplateId = id
    },
    getInitialLandingPageTemplateId(id) {
      this.initialFormValues.landingPageTemplateId = id
    },
    selectedEmailTemplateResourceId(id) {
      this.emailTemplateResourceId = id
    },
    selectedLandingPageTemplateResourceId(id) {
      this.landingPageTemplateResourceId = id
    },
    selectedLandingPageChange(item) {
      this.formValues.landingPageTemplateId = item.id
      this.landingPageTemplate = item
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName || language.name,
            languageTypeName: language.name,
            languageShortCode: language.description,
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
        if (!!this.formValues.textTemplateId && !!this.textMessageTemplate) {
          this.step += 1
        }
      }
      if (currentStep === 3) {
        const isMFAFormValid = this.$refs?.refLandingPageTemplateListPreview?.validateMfaForm()
        if (!isMFAFormValid) {
          this.$nextTick(() => {
            if (this.$refs?.refLandingPageTemplateListPreview) {
              this.$refs.refLandingPageTemplateListPreview.selectedTab = 'mfa'
            }
          })
          return
        }
        if (this.formValues.landingPageTemplateId && this.landingPageTemplate) {
          this.mfaData = this.$refs?.refLandingPageTemplateListPreview?.mfaData
          this.emailDifficultyChipColor = this.getDifficultyColor(
            this.textMessageTemplate.difficultyName
          )
          this.textMessageTemplate.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.textMessageTemplate.languageTypeResourceId
          )?.description
          this.landingPageTemplate.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.landingPageTemplate.languageTypeResourceId
          )?.description
          this.step += 1
        }
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
        ...this.formValues,
        availableForRequests: this.availableForRequests,
        methodTypeId: Number.parseInt(this.formValues.methodTypeId),
        mfaSenderNumberResourceId: this.mfaData?.mfaSenderNumberResourceId || '',
        mfaTextTemplate: this.mfaData?.mfaTextTemplate || ''
      }
      if (this.isEdit && !this.isDuplicate) {
        SmishingService.updateSmishingScenario(this.scenarioId, payload)
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        SmishingService.createSmishingScenario(payload)
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    }
  },
  watch: {
    landingPageTemplateResourceId() {
      this.selectedTab = '1'
    },
    'formValues.methodTypeId'(val, oldVal) {
      if (val !== oldVal && !this.isInitial) {
        this.formValues.textTemplateId = null
        this.formValues.landingPageTemplateId = null
        this.landingPageTemplateId = null
        this.landingPageTemplateResourceId = null
        this.emailTemplateResourceId = null
      }
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getTextMessageLanguageDisplay() {
      if (!this.textMessageTemplate) return ''
      const language = this.languageOptions.find(
        (lang) => lang.value === this.textMessageTemplate.languageTypeResourceId
      )
      return language?.text || this.textMessageTemplate.languageShortCode || ''
    },
    getLandingPageLanguageDisplay() {
      if (!this.landingPageTemplate) return ''
      const language = this.languageOptions.find(
        (lang) => lang.value === this.landingPageTemplate.languageTypeResourceId
      )
      return language?.text || this.landingPageTemplate.languageShortCode || ''
    },
    getSummaryContainerStyle() {
      return this.isMethodMfa
        ? {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '16px',
            maxWidth: 'calc(100% - 96px)'
          }
        : {
            maxWidth: 'calc(100% - 96px)'
          }
    },
    getScenarioInfoItems() {
      return {
        Name: this.formValues.name,
        Method: this.getMethodText,
        Difficulty: this.getDifficultyType
      }
    },
    isMethodMfa() {
      return this.formValues.methodTypeId === '4'
    },
    getMfaSettingsItems() {
      return {
        'Sender Phone Number': this?.mfaData?.mfaCallerPhoneNumber,
        'Verification Message': this?.mfaData?.mfaTextTemplate
      }
    },
    getSummaryTextMessage() {
      return this.textMessageTemplate?.template
    },
    getSelectedMethod() {
      return this.formValues?.methodTypeId
        ? this.methods[Number(this.formValues?.methodTypeId) - 1].text
        : ''
    },
    getSelectedTextTemplateMethod() {
      if (this.textMessageTemplate?.categoryName === 'Click Only') return 'Click-Only'
      return this.textMessageTemplate?.categoryName || ''
    },
    getStep3Subtitle() {
      const mTypeText = this.scenarioDetailsLookup.methodTypes.find(
        (mType) => mType.value === this.formValues.methodTypeId
      )?.text
      if (mTypeText === 'Click-Only') return 'Choose your click only type landing page'
      else if (mTypeText === 'Data Submission')
        return 'Choose your data submission type landing page'
      else return 'Choose your attachment type landing page'
    },
    isAttachmentBasedScenario() {
      if (
        this.isAttachmentBased !== undefined &&
        (this.isEdit || this.isDuplicate) &&
        !this.isFetched
      ) {
        return this.isAttachmentBased
      }
      if (this.formValues?.methodTypeId) {
        return this.formValues?.methodTypeId === '3'
      }
      return false
    },
    getModalTitle() {
      if (!this.isEdit) return 'New Smishing Scenario'
      return this.isDuplicate ? 'Duplicate Smishing Scenario' : 'Edit Smishing Scenario'
    },
    getPhishingFile() {
      return this.summaryData?.emailTemplate?.phishingFileName
        ? {
            name: this.summaryData?.emailTemplate?.phishingFileName
          }
        : null
    },
    getLandingPageDifficultyColor() {
      let difficultyType = ''
      if (this.landingPageTemplate) {
        difficultyType = this.scenarioDetailsLookup.difficultyTypes.find(
          (item) => item.value === this.landingPageTemplate.difficultyTypeId.toString()
        )?.text
      }
      if (difficultyType === 'Easy') return '#217124'
      else if (difficultyType === 'Medium') return '#2196F3'
      else return '#F56C6C'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    getDifficultyType() {
      if (this.textMessageTemplate && this.landingPageTemplate) {
        const textMessageTemplateDifficultyValue = this.scenarioDetailsLookup[
          'difficultyTypes'
        ].find((item) => item.text === this.textMessageTemplate?.difficultyName)?.value
        const landingMessageTemplateDifficultyValue = this.scenarioDetailsLookup[
          'difficultyTypes'
        ].find((item) => item.text === this.landingPageTemplate?.difficulty)?.value
        const maxDifficulty = Math.max(
          Number.parseInt(textMessageTemplateDifficultyValue),
          Number.parseInt(landingMessageTemplateDifficultyValue)
        )
        return (
          this.scenarioDetailsLookup['difficultyTypes'].find(
            (item) => item.value === maxDifficulty.toString()
          )?.text || ''
        )
      }
      return ''
    },
    getMethodText() {
      return (
        this.scenarioDetailsLookup.methodTypes.find(
          (item) => item.value === this.formValues.methodTypeId
        )?.text || ''
      )
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplate?.landingPages?.length > 1
        ? this.landingPageTemplate.landingPages[Number.parseInt(this.selectedTab) - 1].content || ''
        : this.landingPageTemplate.landingPages[0].content || ''
    }
  },
  created() {
    this.callForLanguages()
    if (this.isDuplicate) {
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--scenario-modal',
        backButton: 'btn-duplicate-back--scenario-modal',
        nextButton: 'btn-duplicate-next--scenario-modal',
        saveButton: 'btn-duplicate-save--scenario-modal'
      }
    }
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit) {
      this.isSubmitDisabled = true
      SmishingService.getSmishingScenario(this.scenarioId)
        .then((response) => {
          this.formValues = response.data.data
          this.formValues.name = `${this.formValues.name}`
          this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
          this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
          this.formValues.textTemplateId = response.data.data.textTemplateId
          this.landingPageTemplateResourceId = response.data.data.landingPageTemplateResourceId
          this.formValues.tags = this.formValues.tags || []
          this.mfaData.mfaSenderNumberResourceId = response.data.data.mfaSmsSenderNumberResourceId
          this.mfaData.mfaCallerPhoneNumber = response.data.data.mfaSmsSenderNumber
          this.mfaData.mfaTextTemplate = response.data.data.mfaTextTemplate
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
    } else this.isInitial = false
    if (!(this.isEdit || this.isDuplicate)) {
      const preferredLanguageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
      this.formValues.languageTypeResourceId = preferredLanguageTypeResourceId
    }
  }
}
</script>
