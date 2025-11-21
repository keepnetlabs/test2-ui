<template>
  <div>
    <AppModal
      :status="status"
      :icon-name="getModalIcon"
      :title="getModalTitle"
      class="common-simulator-new-scenario"
      footer-class="common-simulator-new-scenario__footer"
      :showFooter="!isTemplateEditing"
      :should-remove-overflow="shouldRemoveOverflow"
      @closeOverlay="changeNewScenarioModalStatus"
    >
      <template #overlay-body>
        <EmailTemplateMultipleLanguagePreviewDialog
          v-if="showEmailTemplatePreviewDialog && !isQuishing"
          ref="emailTemplatePreviewDialog"
          :status="showEmailTemplatePreviewDialog"
          :selected-row="emailTemplatePreviewSelectedRow"
          :type="type"
          :languages="languageOptions"
          :api-func="getEmailTemplateApiFuncs.content"
          is-nested
          :should-control-html-overflow="false"
          @on-close="showEmailTemplatePreviewDialog = false"
        />
        <CommonSimulatorEmailTemplatePreviewDialog
          v-if="showEmailTemplatePreviewDialog && isQuishing"
          :status="showEmailTemplatePreviewDialog"
          :selected-row="emailTemplatePreviewSelectedRow"
          :type="type"
          :is-individual-printout-template="isQuishingTypeIndividualPrintOut"
          :languages="languageOptions"
          :api-func="getEmailTemplateApiFuncs.content"
          is-nested
          :should-control-html-overflow="false"
          @on-close="showEmailTemplatePreviewDialog = false"
        />
        <CommonSimulatorLandingPageTemplatesPreviewDialog
          v-if="showLandingPagePreviewDialog"
          ref="landingPagePreviewDialog"
          :status="showLandingPagePreviewDialog"
          :selected-row="landingPagePreviewSelectedRow"
          :type="type"
          :languages="languageOptions"
          :api-func="getLandingPageApiFuncs.content"
          is-nested
          :should-control-html-overflow="false"
          @on-close="showLandingPagePreviewDialog = false"
        />
        <VNavigationDrawer
          v-click-outside="handleClickOutsideNewLandingPageTemplateModal"
          v-if="isOpenLandingPageDrawer"
          v-model="isOpenLandingPageDrawer"
          class="k-navigation-drawer k-navigation-drawer--landing-page"
          fixed
          overlay-color="rgba(0, 0, 0, 0.17)"
          overlay-opacity="1"
          right
          width="calc(100% - 72px)"
          height="100%"
        >
          <NewLandingPage
            v-if="isOpenLandingPageDrawer"
            ref="newLandingPage"
            :status="isOpenLandingPageDrawer"
            :is-a-i-ally-enabled="true"
            :should-remove-overflow="false"
            :show-leaving-dialog="false"
            :landing-page-data="landingPageData"
            :email-template-id="createdLandingPageResourceId"
            :is-edit="!!createdLandingPageResourceId"
            :is-edit-from-preview="!!createdLandingPageResourceId"
            :selected-method-text="getSelectedMethodText"
            @changeNewEmailTemplateModalStatus="handleCloseNewLandingPageTemplateModal"
          />
        </VNavigationDrawer>
        <VNavigationDrawer
          v-click-outside="handleClickOutsideNewEmailTemplateModal"
          v-if="isOpenEmailTemplateDrawer"
          v-model="isOpenEmailTemplateDrawer"
          class="k-navigation-drawer k-navigation-drawer--email-template"
          fixed
          overlay-color="rgba(0, 0, 0, 0.17)"
          overlay-opacity="1"
          right
          width="calc(100% - 72px)"
          height="100%"
        >
          <NewEmailTemplates
            v-if="isOpenEmailTemplateDrawer"
            ref="newEmailTemplate"
            is-a-i-ally-enabled
            :status="isOpenEmailTemplateDrawer"
            :should-remove-overflow="false"
            :show-leaving-dialog="false"
            :email-template-id="createdEmailTemplateResourceId"
            :is-edit="!!createdEmailTemplateResourceId"
            :is-edit-from-preview="!!createdEmailTemplateResourceId"
            :selected-method-text="getSelectedMethodText"
            :scenario-details-lookup="scenarioDetailsLookup"
            @changeNewEmailTemplateModalStatus="handleCloseNewEmailTemplateModal"
          />
        </VNavigationDrawer>
        <v-stepper light v-model="step" class="k-stepper">
          <v-stepper-header class="k-stepper__header">
            <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
              >Scenario Info</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2">{{
              isQuishing ? labels.QuishingTemplate : labels.EmailTemplate
            }}</v-stepper-step>
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
              :step="maxStep"
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
                  <FormGroup title="Description" sub-title="Describe the scenario briefly">
                    <InputDescription
                      v-model.trim="formValues.description"
                      id="input--new-phishing-scenarios-description"
                      entityName="description"
                      initialPlaceholder="Enter description"
                      rows="2"
                      height="100"
                      :maxLength="300"
                    />
                  </FormGroup>
                  <FormGroup
                    v-if="isPhishing"
                    has-hint
                    title="Category"
                    sub-title="Select the phishing category for this scenario"
                  >
                    <KSelect
                      :value="formValues.categoryId"
                      id="input--category-scenario"
                      outlined
                      dense
                      persistent-hint
                      placeholder="Select category"
                      hint="*Required"
                      :rules="[(v) => Validations.required(v, labels.Required)]"
                      :items="getCategoryItems"
                      @change="handleCategoryChange"
                    />
                  </FormGroup>
                  <FormGroup
                    v-if="isQuishing"
                    has-hint
                    title="Quishing Type"
                    sub-title="Select the quishing type for this scenario"
                  >
                    <KSelect
                      v-model.trim="quishingType"
                      id="input--quishing-type-scenario"
                      outlined
                      dense
                      persistent-hint
                      placeholder="Select a quishing type"
                      hint="*Required"
                      :rules="[(v) => Validations.required(v, labels.Required)]"
                      :items="quishingTypeItems"
                    />
                  </FormGroup>
                  <InputPhishingMethod
                    v-model.trim="formValues.methodTypeId"
                    item-text-key="text"
                    item-value-key="value"
                    :type="type"
                    :max-length="256"
                    :subtitle="getInputPhishingMethodSubtitle"
                    :items="getMethodTypes"
                  />

                  <InputSelectRoles
                    v-if="isPhishing"
                    v-model="formValues.roleResourceIds"
                    :items="availableRoleOptions"
                    :loading="rolesLoading"
                  />

                  <FormGroup
                    v-if="!isPhishing"
                    has-hint
                    title="Language"
                    sub-title="Select the language you are writing this webpage template in"
                  >
                    <InputSelectLanguage
                      v-model="formValues.languageTypeResourceId"
                      v-bind="commonRules"
                      item-text="text"
                      item-value="value"
                      required
                      :items="languageOptions"
                      :menu-props="{ offsetY: true }"
                    />
                  </FormGroup>
                  <FormGroup title="Tags" sub-title="Define tags for the scenario">
                    <InputTag
                      v-model="formValues.tags"
                      ref="refTags"
                      id="input--action-tags-new-scenario"
                      :items="[]"
                      class="hide-caret"
                    />
                  </FormGroup>
                  <MakeAvailableFor
                    v-model="availableForRequests"
                    ref="refMakeAvailableFor"
                    sub-title="Select companies that should see this scenario in their libraries"
                  />
                </v-form>
              </div>
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <div class="email-settings">
                <ConfigureCompanyStepHeader :title="getStep2Title" :subtitle="getStep2Subtitle" />
                <v-list-item style="margin-top: -10px; padding-left: 0 !important;">
                  <v-list-item-content>
                    <EmailTemplateListPreview
                      v-if="step === 2"
                      ref="refEmailTemplateListPreview"
                      show-language-field
                      select-language-width="250px"
                      :show-email-template-edit-button="isPhishing"
                      :type="type"
                      :scenarioDetailsLookup="scenarioDetailsLookup"
                      :emailTemplateResourceId="emailTemplateResourceId"
                      :category-resource-id="formValues.methodTypeId"
                      :api-funcs="getEmailTemplateApiFuncs"
                      :quishing-type="quishingType"
                      :isAttachmentBasedScenario="isAttachmentBasedScenario"
                      :languages="languageOptions"
                      @initialEmailTemplateId="getInitialEmailTemplateId"
                      @selectedEmailTemplateChange="selectedEmailTemplateChange"
                      @selectedEmailTemplateResourceId="selectedEmailTemplateResourceId"
                      @loading="isSubmitDisabled = $event"
                      @template-edit="handleTemplateEdit"
                      @edit-mode="handleEditModeChange"
                      @on-create-email-template="toggleEmailTemplateDrawer"
                      @on-edit-email-template="handleEditEmailTemplate"
                    />
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-stepper-content>
            <v-stepper-content
              class="k-stepper__content"
              :step="isAttachmentBasedScenario ? 10 : 3"
            >
              <div class="email-settings">
                <ConfigureCompanyStepHeader
                  :title="labels.SelectLandingPageTemplate"
                  :subtitle="getStep3Subtitle"
                />
                <v-list-item style="margin-top: -10px; padding-left: 0 !important;">
                  <v-list-item-content>
                    <LandingPageListPreview
                      v-if="!isAttachmentBasedScenario && step === 3"
                      ref="refLandingPageTemplateListPreview"
                      :scenarioDetailsLookup="scenarioDetailsLookup"
                      :landingPageTemplateResourceId="landingPageTemplateResourceId"
                      :category-resource-id="formValues.methodTypeId"
                      :method="getSelectedMethod"
                      :is-method-mfa="isMethodMfa"
                      :mfa-data="mfaData"
                      :type="type"
                      :api-funcs="getLandingPageApiFuncs"
                      :languages="languageOptions"
                      @initialLandingPageTemplateId="getInitialLandingPageTemplateId"
                      @selectedLandingPageChange="selectedLandingPageChange"
                      @selectedLandingPageTemplateResourceId="selectedLandingPageTemplateResourceId"
                      @loading="isSubmitDisabled = $event"
                      @template-edit="handleTemplateEdit"
                      @edit-mode="handleLandingPageEditModeChange"
                      @on-create-landing-page-template="toggleLandingPageDrawer"
                      @on-edit-landing-page-template="handleEditLandingPageTemplate"
                  /></v-list-item-content>
                </v-list-item>
              </div>
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content summary-step" :step="maxStep">
              <div class="email-settings">
                <ConfigureCompanyStepHeader
                  class="mb-8"
                  :title="labels.ScenarioSummary"
                  :subtitle="labels.ScenarioSummarySub"
                />
                <div :style="getLastStepContainerStyle">
                  <CampaignManagerSummaryCard
                    icon="mdi-information"
                    :class="!isMethodMfa ? 'common-simulator-new-scenario-campaign-info' : ''"
                    :title="labels.ScenarioInfo"
                    :items="getScenarioInfoItems"
                  >
                    <template v-if="isPhishing" #Roles="{ props }">
                      <div class="campaign-manager-summary-card__body-item-key">
                        {{ props.key.slice(0, 1).toUpperCase() + props.key.slice(1) }}
                      </div>
                      <div class="campaign-manager-summary-card__body-item-value roles-summary">
                        <span
                          v-if="!displayRoleSummary.visible.length && !displayRoleSummary.hasExtra"
                          class="roles-summary__empty"
                        >
                          {{ props.val }}
                        </span>
                        <template v-else>
                          <span class="roles-summary__text">
                            {{ displayRoleSummary.visible.join(', ') }}
                          </span>
                          <span
                            v-if="displayRoleSummary.hasExtra && displayRoleSummary.visible.length"
                          >
                            ,
                          </span>
                          <VTooltip bottom v-if="displayRoleSummary.hasExtra">
                            <template #activator="{ on, attrs }">
                              <span class="roles-summary__more" v-bind="attrs" v-on="on">
                                +{{ displayRoleSummary.remainingCount }}
                              </span>
                            </template>
                            <span class="roles-summary__tooltip">
                              {{ displayRoleSummary.extra.join(', ') }}
                            </span>
                          </VTooltip>
                        </template>
                      </div>
                    </template>
                  </CampaignManagerSummaryCard>
                  <CampaignManagerSummaryCard
                    v-if="isMethodMfa && step === 4"
                    icon="mdi-cog"
                    :title="labels.MFASettings"
                    :items="getMfaSettingsItems"
                  />
                </div>
                <v-list-item class="pl-0">
                  <v-list-item-content>
                    <div class="summary">
                      <div class="summary-header py-4 px-6">
                        <div style="color: #2196f3;">
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            {{ isQuishingTypeIndividualPrintOut ? '$pdf-file' : 'mdi-email' }}
                          </v-icon>
                          <span>
                            {{
                              isQuishingTypeIndividualPrintOut
                                ? 'Individual printout:'
                                : 'Email Template:'
                            }}
                          </span>
                          <span>{{
                            summaryData.emailTemplate && summaryData.emailTemplate.name
                          }}</span>
                        </div>
                        <div>
                          <v-btn
                            class="campaign-manager-summary-card__button pr-4"
                            rounded
                            outlined
                            color="#2196f3"
                            @click="showEmailTemplatePreviewDialog = true"
                          >
                            <v-icon style="font-size: 20px; margin-right: 4px;">mdi-eye</v-icon>
                            Preview
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="pl-0" v-if="!isAttachmentBasedScenario">
                  <v-list-item-content>
                    <div class="summary">
                      <div class="summary-header py-4 px-6">
                        <div style="color: #2196f3;">
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            mdi-application
                          </v-icon>
                          <span>Landing Page: </span>
                          <span>{{
                            summaryData.landingPageTemplate && summaryData.landingPageTemplate.name
                          }}</span>
                        </div>
                        <div>
                          <v-btn
                            class="campaign-manager-summary-card__button pr-4"
                            rounded
                            outlined
                            color="#2196f3"
                            @click="showLandingPagePreviewDialog = true"
                          >
                            <v-icon style="font-size: 20px; margin-right: 4px;">mdi-eye</v-icon>
                            Preview
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <div class="k-overlay__footer k-navigation-drawer__footer">
          <StepperFooter
            :max-step="maxStep"
            :step.sync="step"
            :disabled-statuses="{
              nextButton:
                isSubmitDisabled || isEmailTemplateInEditMode || isLandingPageTemplateInEditMode,
              submitButton:
                isSubmitDisabled || isEmailTemplateInEditMode || isLandingPageTemplateInEditMode
            }"
            :disabledNextButtonTooltipText="
              isEmailTemplateInEditMode || isLandingPageTemplateInEditMode
                ? 'Please save or discard your changes to the template before proceeding.'
                : ''
            "
            :ids="footerButtonsIds"
            @on-cancel="changeNewScenarioModalStatus"
            @on-back="backStep"
            @on-next="nextStep(+1)"
            @on-submit="submit"
          />
        </div>
      </template>
    </AppModal>
  </div>
</template>
<script>
import labels from '@/model/constants/labels'
import AppModal from '@/components/AppModal'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { createScenario, getScenario, getSummaryOfScenario, updateScenario } from '@/api/scenarios'
import {
  getEmailTemplatePreviewContent,
  getEmailTemplatesList,
  getPhishingScenarioRoles
} from '@/api/phishingsimulator'
import {
  getLandingPageFormDetails,
  getLandingPageList,
  getLandingPageTemplatePreviewContent
} from '@/api/landingPage'
import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview'
import LandingPageListPreview from '@/components/workshop/LandingPageTemplateListPreview'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import {
  SCENARIO_DIFFICULTIES,
  SCENARIO_METHOD_TYPES,
  SCENARIO_METHODS
} from '@/components/PhishingScenarios/utils'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import {
  getDifficultyColor,
  quishingTypeItems,
  SCENARIO_TYPES
} from '@/components/Common/Simulator/utils'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { mapGetters } from 'vuex'
import NewLandingPage from '@/components/LandingPage/NewLandingPage.vue'
import NewEmailTemplates from '@/components/PhishingScenarios/NewEmailTemplates.vue'
import EmailTemplateMultipleLanguagePreviewDialog from '@/components/Common/Simulator/EmailTemplates/EmailTemplateMultipleLanguagePreviewDialog.vue'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import InputSelectRoles from '@/components/Common/Inputs/InputSelectRoles.vue'
export default {
  name: 'CommonSimulatorNewScenario',
  components: {
    AppModal,
    EmailTemplateMultipleLanguagePreviewDialog,
    CommonSimulatorEmailTemplatePreviewDialog,
    CommonSimulatorLandingPageTemplatesPreviewDialog,
    NewEmailTemplates,
    NewLandingPage,
    KSelect,
    InputPhishingMethod,
    ConfigureCompanyStepHeader,
    CampaignManagerSummaryCard,
    StepperFooter,
    FormGroup,
    MakeAvailableFor,
    EmailTemplateListPreview,
    LandingPageListPreview,
    InputSelectLanguage,
    InputTag,
    InputEntityName,
    InputDescription,
    InputSelectRoles
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
    roleItems: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    shouldRemoveOverflow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      drawerModel: this.status,
      languagePreview: '',
      landingPageData: null,
      isOpenLandingPageDrawer: false,
      isOpenEmailTemplateDrawer: false,
      showEmailTemplatePreviewDialog: false,
      showLandingPagePreviewDialog: false,
      isTemplateEditing: false,
      isEmailTemplateInEditMode: false,
      isLandingPageTemplateInEditMode: false,
      createdEmailTemplateResourceId: '',
      createdLandingPageResourceId: '',
      quishingTypeItems,
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
      languageOptions: [],
      isSubmitDisabled: false,
      availableForRequests: [],
      generalDifficultyTypeId: '',
      labels,
      step: 1,
      Validations,
      initialFormValues: {},
      quishingType: '',
      selectedTemplateLanguages: [],
      categoryText: '',
      availableRoleOptions: [],
      rolesLoading: false,
      selectedRolesDetails: [],
      formValues: {
        name: '',
        description: '',
        categoryId: '',
        methodTypeId: '1',
        difficultyTypeId: '1',
        emailTemplateId: null,
        landingPageTemplateId: null,
        languageTypeResourceId: '862249c19aad',
        tags: [],
        roleResourceIds: []
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
      landingPageTemplateResourceId: null,
      selectedEmailTemplate: null,
      phishingEmailTemplates: []
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    getSelectedMethodText() {
      let selectedMethod = this.getMethodText
      if (selectedMethod.startsWith('Click')) selectedMethod = 'Click Only'
      return selectedMethod
    },
    getURLText() {
      return this.isQuishing ? labels.QuishingLink : labels.URL.toUpperCase()
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    },
    getCategoryItems() {
      return this.scenarioDetailsLookup?.categories || []
    },
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false
      return (
        this.quishingType.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    },
    getEmailTemplateApiFuncs() {
      if (this.type === SCENARIO_TYPES.PHISHING) {
        return {
          list: getEmailTemplatesList,
          content: getEmailTemplatePreviewContent
        }
      } else if (this.isQuishingTypeIndividualPrintOut) {
        return {
          list: QuishingService.getEmailTemplatesList,
          content: QuishingService.getQuishingTemplatePreviewContent
        }
      }
      return {
        list: QuishingService.getEmailTemplatesList,
        content: QuishingService.getEmailTemplatePreviewContent
      }
    },
    getLandingPageApiFuncs() {
      return this.type === SCENARIO_TYPES.PHISHING
        ? {
            list: getLandingPageList,
            content: getLandingPageTemplatePreviewContent
          }
        : {
            list: QuishingService.getLandingPageList,
            content: QuishingService.getLandingPageTemplatePreviewContent
          }
    },
    getInputPhishingMethodSubtitle() {
      return this.type === SCENARIO_TYPES.PHISHING
        ? 'Select the phishing technique for this template'
        : 'Select the quishing technique for this template'
    },
    getLandingPageUrlLabel() {
      return this.type === SCENARIO_TYPES.PHISHING ? labels.PhishingURL : labels.QuishingURL
    },
    maxStep() {
      return this.isAttachmentBasedScenario ? 3 : 4
    },
    getLastStepContainerStyle() {
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
    getSummaryDifficulty() {
      return (
        SCENARIO_DIFFICULTIES.find(
          (item) => item.value === this.summaryData.emailTemplate.difficultyResourceId
        )?.text || ''
      )
    },
    getSummaryMethod() {
      return (
        SCENARIO_METHODS.find(
          (item) => item.value === this.summaryData.emailTemplate.categoryResourceId
        )?.text || ''
      )
    },
    getLandingPageDifficulty() {
      return (
        this?.scenarioDetailsLookup?.difficultyTypes?.find(
          (item) => item.value === this.summaryData.landingPageTemplate.difficultyTypeId.toString()
        )?.text || ''
      )
    },
    getLandingPageMethod() {
      return this.getMethodTypes.find(
        (item) => item.value === this.summaryData.landingPageTemplate.methodTypeId.toString()
      ).text
    },
    getMethodTypes() {
      return this.scenarioDetailsLookup?.methodTypes || []
    },
    isMethodMfa() {
      return this.formValues.methodTypeId === '4'
    },
    getScenarioInfoItems() {
      const obj = {
        Name: this.formValues.name,
        Difficulty: this.getDifficultyType,
        Method: this.getMethodText,
        Category: this.categoryText
      }
      if (this.isQuishing) {
        obj['Quishing Type'] = this.quishingType
        delete obj['Category']
      }
      if (this.isPhishing) {
        obj.Roles = this.getSelectedRolesText
      }
      return obj
    },
    selectedRoleNames() {
      if (!this.isPhishing) return []
      const names = (this.selectedRolesDetails || [])
        .map((role) => role?.name || role?.text || role?.roleName)
        .filter(Boolean)
      return [...new Set(names)]
    },
    displayRoleSummary() {
      const names = this.selectedRoleNames
      const visible = names.slice(0, 3)
      const extra = names.length > 3 ? names.slice(3) : []
      return {
        visible,
        extra,
        hasExtra: extra.length > 0,
        remainingCount: extra.length
      }
    },
    getSelectedRolesText() {
      if (!this.isPhishing) return ''
      const names = this.selectedRoleNames
      if (names.length) {
        return names.join(', ')
      }
      if (
        Array.isArray(this.formValues.roleResourceIds) &&
        this.formValues.roleResourceIds.length
      ) {
        const count = this.formValues.roleResourceIds.length
        return `${count} role${count > 1 ? 's' : ''}`
      }
      return 'Not selected'
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
      if (
        SCENARIO_METHODS[Number(this.formValues?.methodTypeId) - 1].text ===
        SCENARIO_METHOD_TYPES.MFA
      ) {
        return this.selectedEmailTemplate.categoryName === labels.ClickOnly
          ? SCENARIO_METHOD_TYPES.CLICK_ONLY
          : this.selectedEmailTemplate.categoryName
      } else return SCENARIO_METHODS[Number(this.formValues?.methodTypeId) - 1].text
    },
    getStep2Title() {
      return this.isQuishingTypeIndividualPrintOut
        ? labels.SelectIndividualPrintoutTemplate
        : labels.SelectEmailTemplate
    },
    getStep2Subtitle() {
      const type = this.isQuishingTypeIndividualPrintOut
        ? 'individual printout template'
        : 'email template'
      const mTypeText =
        this.scenarioDetailsLookup?.methodTypes?.find(
          (mType) => mType.value === this.formValues.methodTypeId
        )?.text || ''
      if (mTypeText === SCENARIO_METHOD_TYPES.CLICK_ONLY)
        return `Choose your click only type ${type}`
      else if (mTypeText === SCENARIO_METHOD_TYPES.DATA_SUBMISSION)
        return `Choose your data submission type ${type}`
      else if (mTypeText === SCENARIO_METHOD_TYPES.ATTACHMENT)
        return `Choose your attachment type ${type}`
      else return `Choose your click only or data submission type ${type}`
    },
    getStep3Subtitle() {
      const mTypeText =
        this.scenarioDetailsLookup?.methodTypes?.find(
          (mType) => mType.value === this.formValues.methodTypeId
        )?.text || ''
      if (mTypeText === SCENARIO_METHOD_TYPES.CLICK_ONLY)
        return 'Choose your click only type landing page'
      else if (mTypeText === SCENARIO_METHOD_TYPES.DATA_SUBMISSION)
        return 'Choose your data submission type landing page'
      else if (mTypeText === SCENARIO_METHOD_TYPES.MFA)
        return this?.selectedEmailTemplate?.categoryName === 'Click Only'
          ? 'Choose your click only type landing page'
          : 'Choose your data submission type landing page'
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
      if (this.type === SCENARIO_TYPES.PHISHING) {
        if (!this.isEdit) return 'New Phishing Scenario'
        return this.isDuplicate ? 'Duplicate Phishing Scenario' : 'Edit Phishing Scenario'
      }
      if (!this.isEdit) return 'New Quishing Scenario'
      return this.isDuplicate ? 'Duplicate Quishing Scenario' : 'Edit Quishing Scenario'
    },
    getModalIcon() {
      if (this.type === SCENARIO_TYPES.PHISHING) {
        return 'mdi-hook'
      }
      return '$qr-code-selected'
    },
    getPhishingFile() {
      return this.summaryData?.emailTemplate?.phishingFileName
        ? {
            name: this.summaryData?.emailTemplate?.phishingFileName
          }
        : null
    },
    getLandingPageDifficultyColor() {
      const difficultyType = this?.scenarioDetailsLookup?.difficultyTypes?.find(
        (item) => item.value === this.summaryData.landingPageTemplate.difficultyTypeId.toString()
      )?.text
      if (difficultyType === 'Easy') return '#217124'
      else if (difficultyType === 'Medium') return '#2196F3'
      else return '#F56C6C'
    },
    getDifficultyType() {
      return (
        this?.scenarioDetailsLookup?.difficultyTypes?.find(
          (item) => item.value === this.generalDifficultyTypeId
        )?.text || ''
      )
    },
    getMethodText() {
      return (
        this.scenarioDetailsLookup?.methodTypes?.find(
          (item) => item.value === this.formValues.methodTypeId
        )?.text || ''
      )
    },
    getCurrentLandingPageTemplate() {
      return this.summaryData.landingPageTemplate?.landingPages?.length > 1
        ? this.summaryData.landingPageTemplate.landingPages[parseInt(this.selectedTab) - 1]
            .content || ''
        : this.summaryData.landingPageTemplate.landingPages[0].content || ''
    },
    emailTemplatePreviewSelectedRow() {
      if (!this.summaryData?.emailTemplate) return {}
      return {
        ...this.summaryData.emailTemplate,
        resourceId: this.emailTemplateResourceId || this.summaryData.emailTemplate.resourceId
      }
    },
    landingPagePreviewSelectedRow() {
      if (!this.summaryData?.landingPageTemplate) return {}
      return {
        ...this.summaryData.landingPageTemplate,
        resourceId:
          this.landingPageTemplateResourceId || this.summaryData.landingPageTemplate.resourceId
      }
    }
  },
  watch: {
    status(val) {
      this.drawerModel = val
    },
    drawerModel(val) {
      if (!val && this.status) {
        this.changeNewScenarioModalStatus()
      }
    },
    landingPageTemplateResourceId() {
      this.selectedTab = '1'
    },
    'formValues.methodTypeId'(val, oldVal) {
      if (val !== oldVal && !this.isInitial) this.resetLandingPageAndEmailTemplateSelection()
    },
    'formValues.roleResourceIds'(val) {
      if (!this.availableRoleOptions.length) return
      this.selectedRolesDetails = this.getRoleDetailsFromIds(val)
    },
    roleItems: {
      handler(newItems) {
        if (!this.isPhishing) return
        if (!Array.isArray(newItems)) return
        if (newItems.length) {
          this.availableRoleOptions = [...newItems]
          const currentIds = this.formValues.roleResourceIds
          this.selectedRolesDetails = this.getRoleDetailsFromIds(currentIds)
          this.rolesLoading = false
        } else {
          this.availableRoleOptions = []
          if (!this.rolesLoading) this.selectedRolesDetails = []
        }
      },
      deep: true
    },
    quishingType(val, oldVal) {
      if (val !== oldVal && !this.isInitial) this.resetLandingPageAndEmailTemplateSelection()
    }
  },
  created() {
    this.initializeRoleOptions()
    getLandingPageFormDetails().then((response) => {
      const domainRecords = response?.data?.data?.domainRecords?.map((item) => {
        return {
          text: item.domain,
          value: item.id.toString(),
          extraDatas: [
            {
              text: item.urlSchemaType,
              value: item.urlSchemaTypeId.toString()
            },
            { text: item.isStopBotActivity, value: item.isStopBotActivity }
          ]
        }
      })
      this.landingPageData = { ...response.data.data, domainRecords }
    })
    if (this.isDuplicate) this.setFooterDuplicateIds()
    this.callForLanguages()
    if (this.isEdit) {
      this.callForScenario()
    } else {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      this.isInitial = false
    }
    if (!(this.isEdit || this.isDuplicate))
      this.formValues.languageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
  },
  beforeDestroy() {
    // Mixin tarafından HTML overflow kontrolü yapılıyor
  },
  methods: {
    handleClickOutside(event) {
      // SnackBar tıklanırsa ignore et
      if (event && event.target) {
        const snackbarElement = event.target.closest(
          '.v-snack__wrapper, .v-snackbar, .v-snackbar__wrapper, .v-snackbar__content, [data-snackbar]'
        )
        if (snackbarElement) {
          return
        }

        // V-menu açıksa ignore et
        const menuElement = event.target.closest('.v-menu__content, .v-list')
        if (menuElement) {
          return
        }

        // GrapesJS modal açıksa ignore et
        const grapesModalElement = event.target.closest(
          '.grapes-container-modal, #gjsNewsletterModal, #threat-sharing-post-incident-grapesjs-modal, .gjs-editor'
        )
        if (grapesModalElement) {
          return
        }

        // Leaving dialog butonlarına tıklanırsa ignore et
        const leavingDialogButton = event.target.closest(
          '#btn-continue-editing--leaving-popup, #btn-quit--leaving-popup, [id*="leaving-popup"], .k-dialog__button'
        )
        if (leavingDialogButton) {
          return
        }

        // Leaving dialog açıksa ignore et (AppDialog içindeki tüm elementler)
        const leavingDialogElement = event.target.closest('.v-dialog, [role="dialog"], .app-dialog')
        if (leavingDialogElement) {
          return
        }
      }

      // Leaving dialog zaten açıksa ignore et
      if (this.$store.state.common?.isShowLeavingDialog) {
        return
      }

      // Preview dialog'lar açıksa, bunları kapat (aynı animasyonla)
      if (this.showEmailTemplatePreviewDialog) {
        this.$refs.emailTemplatePreviewDialog?.closeDrawer()
        return
      }
      if (this.showLandingPagePreviewDialog) {
        this.$refs.landingPagePreviewDialog?.closeDrawer()
        return
      }

      // EmailTemplateListPreview'deki preview dialog açıksa
      if (this.$refs.refEmailTemplateListPreview?.isTemplateDetails) {
        this.$refs.refEmailTemplateListPreview.$refs.emailTemplatePreviewDialog?.closeDrawer()
        return
      }

      // LandingPageTemplateListPreview'deki preview dialog açıksa
      if (this.$refs.refLandingPageTemplateListPreview?.isTemplateDetails) {
        this.$refs.refLandingPageTemplateListPreview.$refs.landingPagePreviewDialog?.closeDrawer()
        return
      }

      // Email template drawer açıksa ignore et
      if (this.isOpenEmailTemplateDrawer) {
        // GrapesJS modal açıksa ignore et
        if (this?.$refs?.newEmailTemplate?.$refs?.refEmailTemplate?.showGrapesModal) {
          return
        }
        return
      }

      // Landing page drawer açıksa ignore et
      if (this.isOpenLandingPageDrawer) {
        // GrapesJS modal açıksa ignore et
        if (this?.$refs?.newLandingPage?.$refs?.refEmailTemplate?.[0]?.showGrapesModal) {
          return
        }
        return
      }

      // Drawer'ı kapat
      this.changeNewScenarioModalStatus()
    },
    initializeRoleOptions() {
      if (!this.isPhishing) return
      if (Array.isArray(this.roleItems) && this.roleItems.length) {
        this.availableRoleOptions = [...this.roleItems]
        const currentIds = this.formValues.roleResourceIds
        this.selectedRolesDetails = this.getRoleDetailsFromIds(currentIds)
        this.rolesLoading = false
      } else {
        this.fetchRoleOptions()
      }
    },
    async fetchRoleOptions() {
      if (!this.isPhishing) return
      this.rolesLoading = true
      try {
        const response = await getPhishingScenarioRoles()
        this.availableRoleOptions = response?.data?.data || []
      } catch (error) {
        this.availableRoleOptions = []
        // eslint-disable-next-line no-console
        console.error('Error fetching scenario roles:', error)
      } finally {
        const currentIds = this.formValues.roleResourceIds
        if (Array.isArray(currentIds) && currentIds.length && this.availableRoleOptions.length) {
          const mappedRoles = this.getRoleDetailsFromIds(currentIds)
          if (mappedRoles.length) {
            this.selectedRolesDetails = mappedRoles
          }
        } else if (!Array.isArray(currentIds) || !currentIds.length) {
          this.selectedRolesDetails = []
        }
        this.rolesLoading = false
      }
    },
    getRoleDetailsFromIds(ids = []) {
      if (!Array.isArray(ids) || !ids.length) return []
      if (!Array.isArray(this.availableRoleOptions) || !this.availableRoleOptions.length) return []
      return ids
        .map((id) => this.availableRoleOptions.find((role) => role.resourceId === id))
        .filter(Boolean)
    },
    checkIsRedFlaggedTemplate(html) {
      if (typeof html !== 'string') return false
      return html.includes('data-redflag')
    },
    getDifficultyColor,
    handleTemplateEdit(val) {
      this.isTemplateEditing = val
    },
    handleEditModeChange(val) {
      this.isEmailTemplateInEditMode = val
    },
    handleLandingPageEditModeChange(val) {
      this.isLandingPageTemplateInEditMode = val
    },
    handleCategoryChange(categoryId) {
      this.formValues.categoryId = categoryId
      this.categoryText =
        this.scenarioDetailsLookup?.categories?.find((item) => item.value === categoryId)?.text ||
        ''
    },
    handleCloseNewEmailTemplateModal(_, forceUpdate = false, createdResourceId = '') {
      const isEditMode = !!this.createdEmailTemplateResourceId
      const isSaveAsNew = isEditMode && !!createdResourceId
      const resourceIdToUse = createdResourceId || this.createdEmailTemplateResourceId

      if (forceUpdate && this?.$refs?.refEmailTemplateListPreview) {
        // Clear list to avoid duplicates
        if (isEditMode && !isSaveAsNew) {
          this.$refs.refEmailTemplateListPreview.listData = []
          this.$refs.refEmailTemplateListPreview.defaultListData = []
        }
        this.$refs.refEmailTemplateListPreview.getTemplates(true, resourceIdToUse).then(() => {
          this.$refs.refEmailTemplateListPreview.setItemToFirstIndex(resourceIdToUse)
        })
      }

      if (isEditMode && !isSaveAsNew) {
        // Edit mode: Close drawer and keep same template selected
        this.createdEmailTemplateResourceId = null
        if (document.querySelector('.k-navigation-drawer--email-template'))
          document.querySelector('.k-navigation-drawer--email-template').style.right = '-100%'
        setTimeout(() => {
          this.toggleEmailTemplateDrawer()
        }, 250)
        return
      }
      // Save As New or Create mode: Close drawer and select new template
      this.createdEmailTemplateResourceId = isSaveAsNew ? null : createdResourceId
      if (document.querySelector('.k-navigation-drawer--email-template'))
        document.querySelector('.k-navigation-drawer--email-template').style.right = '-100%'
      setTimeout(() => {
        this.toggleEmailTemplateDrawer()
      }, 250)
    },
    handleCloseNewLandingPageTemplateModal(_, forceUpdate = false, createdResourceId = '') {
      this.createdLandingPageResourceId = createdResourceId
      if (document.querySelector('.k-navigation-drawer--landing-page'))
        document.querySelector('.k-navigation-drawer--landing-page').style.right = '-100%'
      if (forceUpdate && this?.$refs?.refLandingPageTemplateListPreview)
        this.$refs.refLandingPageTemplateListPreview
          .getTemplates(true, createdResourceId)
          .then(() => {
            this.$refs.refLandingPageTemplateListPreview.setItemToFirstIndex(createdResourceId)
          })
      setTimeout(() => {
        this.toggleLandingPageDrawer()
      }, 250)
    },
    toggleLandingPageDrawer() {
      this.isOpenLandingPageDrawer = !this.isOpenLandingPageDrawer
    },
    toggleEmailTemplateDrawer() {
      this.isOpenEmailTemplateDrawer = !this.isOpenEmailTemplateDrawer
      if (!this.isOpenEmailTemplateDrawer) {
        this.createdEmailTemplateResourceId = null
      }
    },
    handleEditEmailTemplate(selectedRow) {
      this.createdEmailTemplateResourceId = selectedRow?.resourceId || null
      if (!this.isOpenEmailTemplateDrawer) {
        this.isOpenEmailTemplateDrawer = true
      }
    },
    handleEditLandingPageTemplate(selectedRow) {
      this.createdLandingPageResourceId = selectedRow?.resourceId || null
      if (!this.isOpenLandingPageDrawer) {
        this.isOpenLandingPageDrawer = true
      }
    },
    handleClickOutsideNewEmailTemplateModal(event) {
      // Leaving dialog açıksa ignore et
      if (this.$store.state.common?.isShowLeavingDialog) {
        return
      }

      // SnackBar tıklanırsa ignore et
      if (event && event.target) {
        const snackbarElement = event.target.closest(
          '.v-snack__wrapper, .v-snackbar, .v-snackbar__wrapper, .v-snackbar__content, [data-snackbar]'
        )
        if (snackbarElement) {
          return
        }

        // Leaving dialog butonlarına tıklanırsa ignore et
        const leavingDialogButton = event.target.closest(
          '#btn-continue-editing--leaving-popup, #btn-quit--leaving-popup, [id*="leaving-popup"], .k-dialog__button, .app-dialog, .v-dialog'
        )
        if (leavingDialogButton) {
          return
        }
      }

      if (this?.$refs?.newEmailTemplate?.$refs?.refEmailTemplate?.showGrapesModal) {
        this.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal = false
        return
      }
      this.handleCloseNewEmailTemplateModal()
    },
    handleClickOutsideNewLandingPageTemplateModal(event) {
      // Leaving dialog açıksa ignore et
      if (this.$store.state.common?.isShowLeavingDialog) {
        return
      }

      // SnackBar tıklanırsa ignore et
      if (event && event.target) {
        const snackbarElement = event.target.closest(
          '.v-snack__wrapper, .v-snackbar, .v-snackbar__wrapper, .v-snackbar__content, [data-snackbar]'
        )
        if (snackbarElement) {
          return
        }

        // Leaving dialog butonlarına tıklanırsa ignore et
        const leavingDialogButton = event.target.closest(
          '#btn-continue-editing--leaving-popup, #btn-quit--leaving-popup, [id*="leaving-popup"], .k-dialog__button, .app-dialog, .v-dialog'
        )
        if (leavingDialogButton) {
          return
        }
      }

      if (
        this?.$refs?.newLandingPage?.$refs?.refEmailTemplate[0] &&
        this?.$refs?.newLandingPage?.$refs?.refEmailTemplate[0].showGrapesModal
      ) {
        this.$refs.newLandingPage.$refs.refEmailTemplate[0].showGrapesModal = false
        return
      }
      if (this?.$refs?.newLandingPage?.isPageAddMenuOpen?.some(Boolean)) return
      this.handleCloseNewLandingPageTemplateModal()
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
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING ? getScenario : QuishingService.getScenario
      apiFunc(this.scenarioId)
        .then((response) => {
          this.formValues = { ...response.data.data }
          this.formValues.name = `${this.formValues.name}`
          this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
          this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
          if (this.type === SCENARIO_TYPES.PHISHING) {
            this.formValues.categoryId = this.scenarioDetailsLookup?.categories?.find(
              (item) => item.text === response?.data?.data?.category
            )?.value
            this.categoryText =
              this.scenarioDetailsLookup?.categories?.find(
                (item) => item.value === this.formValues.categoryId
              )?.text || ''
            delete this.formValues.category
          }
          const emailTemplateResourceId = this.isQuishing
            ? response.data.data.templateResourceId
            : response.data.data.emailTemplateResourceId
          this.formValues.emailTemplateId = emailTemplateResourceId
          this.emailTemplateResourceId = emailTemplateResourceId
          this.landingPageTemplateResourceId = response.data.data.landingPageTemplateResourceId
          this.formValues.tags = this.formValues.tags || []
          this.$set(
            this.formValues,
            'roleResourceIds',
            response.data.data.roles?.map((role) => role.resourceId) || []
          )
          delete this.formValues.roles
          this.selectedRolesDetails = this.availableRoleOptions.length
            ? this.getRoleDetailsFromIds(this.formValues.roleResourceIds) || []
            : response.data.data.roles || []
          this.mfaData.mfaSenderNumberResourceId = response.data.data.mfaSmsSenderNumberResourceId
          this.mfaData.mfaCallerPhoneNumber = response.data.data.mfaSmsSenderNumber
          this.mfaData.mfaTextTemplate = response.data.data.mfaTextTemplate
          const availableForList = response?.data?.data?.availableForList
          if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
          this.availableForRequests = getAvailableForValueFromList(availableForList)
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isFetched = true
          if (this.isQuishing) this.quishingType = response.data.data.templateType
        })
        .finally(() => {
          this.isSubmitDisabled = false
          this.isInitial = false
        })
    },
    getInitialEmailTemplateId(id) {
      this.initialFormValues.emailTemplateId = id
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
    selectedEmailTemplateChange(id, item) {
      this.formValues.emailTemplateId = id
      this.selectedEmailTemplate = item
    },
    selectedLandingPageChange(id) {
      this.formValues.landingPageTemplateId = id
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName || language.name,
            languageTypeName: language.name,
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
      if (currentStep === 2 && !this.isAttachmentBasedScenario) {
        if (!!this.formValues.emailTemplateId || !!this.emailTemplateResourceId) {
          this.step += 1
        }
      }
      if (currentStep === 2 && this.isAttachmentBasedScenario) {
        if (!!this.formValues.emailTemplateId || !!this.emailTemplateResourceId) {
          this.isSubmitDisabled = true
          if (this.isPhishing) {
            this.phishingEmailTemplates = []
            this.selectedTemplateLanguages = []
            if (this.summaryData.emailTemplate)
              this.summaryData.emailTemplate.languageShortCode = []
          }
          this.getEmailTemplateApiFuncs
            .content(this.emailTemplateResourceId)
            .then((response) => {
              const emailTemplateData = {
                ...response.data.data,
                languageShortCode: this.languageOptions.find(
                  (language) => language.value === response?.data?.data?.languageTypeResourceId
                )?.text
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
              this.summaryData.emailTemplate.fromEmailAddress = this.summaryData.emailTemplate.fromAddress
              this.summaryData.emailTemplate.cc = this.summaryData.emailTemplate.ccAddresses
              this.setPhishingEmailTemplates(this.summaryData)
              this.step += 1
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      }
      if (currentStep === 3 && !this.isAttachmentBasedScenario) {
        if (!this.$refs?.refLandingPageTemplateListPreview?.validateMfaForm()) return
        if (!!this.formValues.landingPageTemplateId || !!this.landingPageTemplateResourceId) {
          this.isSubmitDisabled = true
          this.mfaData = this.$refs?.refLandingPageTemplateListPreview?.mfaData
          const apiFunc =
            this.type === SCENARIO_TYPES.PHISHING
              ? getSummaryOfScenario
              : QuishingService.getSummaryOfScenario
          let params = [this.emailTemplateResourceId, this.landingPageTemplateResourceId]
          if (this.isQuishing) params.push(this.quishingType.toLowerCase())
          if (this.isPhishing) {
            this.phishingEmailTemplates = []
            this.selectedTemplateLanguages = []
            if (this.summaryData.emailTemplate)
              this.summaryData.emailTemplate.languageShortCode = []
          }
          apiFunc(...params)
            .then((response) => {
              const {
                data: { data }
              } = response
              if (this.isQuishing) {
                if (this.isQuishingTypeIndividualPrintOut)
                  data.emailTemplate = data.quishingTemplate
                data.emailTemplate.template = data.emailTemplate.template?.replaceAll(
                  '{QRCODEURLIMAGE}',
                  qrCodeString
                )
              }
              data.emailTemplate.languageShortCode = this.languageOptions.find(
                (language) => language.value === data?.emailTemplate?.languageTypeResourceId
              )?.text
              data.landingPageTemplate.languageShortCode = this.languageOptions.find(
                (language) => language.value === data?.landingPageTemplate?.languageTypeResourceId
              )?.text

              this.emailDifficultyChipColor = this.getDifficultyColor(
                this.selectedEmailTemplate?.difficultyName || ''
              )
              if (data?.landingPageTemplate?.landingPages?.length) {
                data.landingPageTemplate.landingPages.forEach((item) => {
                  if (item.content) {
                    let logo =
                      localStorage.getItem('isSelectCompany') === 'true'
                        ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
                        : this.$store.state.auth.logoUrl || ''
                    if (!logo) logo = this?.$store?.state?.whitelabel.mainLogoUrl || ''
                    item.content = item.content.replace(/\{COMPANYLOGO\}/g, logo)
                  }
                })
              }
              this.summaryData = data
              this.generalDifficultyTypeId = response.data.data.difficultyTypeId.toString()
              this.summaryData.emailTemplate.fromEmailAddress = this.summaryData.emailTemplate.fromAddress
              this.summaryData.emailTemplate.cc = this.summaryData.emailTemplate.ccAddresses
              // Set template resource IDs from API response
              this.emailTemplateResourceId = data.emailTemplate.resourceId
              this.landingPageTemplateResourceId = data.landingPageTemplate.resourceId
              this.setPhishingEmailTemplates(data)
              this.step += 1
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      }
    },
    backStep() {
      if (this.step === 2 && this.isEmailTemplateInEditMode) {
        const { editData, initialEditData } = this.$refs.refEmailTemplateListPreview
        const isChanged = isDifferent(editData, initialEditData)
        if (!isChanged) {
          if (this.$refs?.refEmailTemplateListPreview)
            this.$refs.refEmailTemplateListPreview.isEditMode = false
          this.isSubmitDisabled = false
          this.isEmailTemplateInEditMode = false
          this.step -= 1
          return
        }
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            if (this.$refs?.refEmailTemplateListPreview)
              this.$refs.refEmailTemplateListPreview.isEditMode = false
            this.isSubmitDisabled = false
            this.isEmailTemplateInEditMode = false
            this.step -= 1
          }
        })
      } else if (
        !this.isAttachmentBasedScenario &&
        this.step === 3 &&
        this.isLandingPageTemplateInEditMode
      ) {
        const { editData, initialEditData } = this.$refs.refLandingPageTemplateListPreview
        const isChanged = isDifferent(editData, initialEditData)
        if (!isChanged) {
          if (this.$refs?.refLandingPageTemplateListPreview)
            this.$refs.refLandingPageTemplateListPreview.isEditMode = false
          this.isSubmitDisabled = false
          this.isLandingPageTemplateInEditMode = false
          this.step -= 1
          return
        }
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            if (this.$refs?.refLandingPageTemplateListPreview)
              this.$refs.refLandingPageTemplateListPreview.isEditMode = false
            this.isSubmitDisabled = false
            this.isLandingPageTemplateInEditMode = false
            this.step -= 1
          }
        })
      } else {
        this.step -= 1
        this.isSubmitDisabled = false
      }
    },
    submit() {
      this.isSubmitDisabled = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
      }
      const payload = {
        ...this.formValues,
        mfaSenderNumberResourceId: this.mfaData?.mfaSenderNumberResourceId || '',
        mfaTextTemplate: this.mfaData?.mfaTextTemplate || '',
        availableForRequests: this.availableForRequests
      }
      if (!this.isPhishing) {
        delete payload.categoryId
        delete payload.category
      } else {
        delete payload.languageTypeResourceId
      }
      if (this.isQuishing) {
        payload.templateType = this.quishingType
        payload.templateResourceId = this.emailTemplateResourceId
        delete payload.emailTemplateId
        delete payload.emailTemplateResourceId
      }
      if (this.isEdit && !this.isDuplicate) {
        const apiFunc =
          this.type === SCENARIO_TYPES.PHISHING ? updateScenario : QuishingService.updateScenario
        apiFunc(payload, this.scenarioId)
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        const apiFunc =
          this.type === SCENARIO_TYPES.PHISHING ? createScenario : QuishingService.createScenario
        apiFunc(payload)
          .then((response) => {
            this.$emit('changeNewScenarioModalStatus', false, true)
            this.$emit('on-new-item-created', response?.data?.data?.resourceId)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    },
    resetLandingPageAndEmailTemplateSelection() {
      this.formValues.emailTemplateId = null
      this.formValues.landingPageTemplateId = null
      this.landingPageTemplateId = null
      this.landingPageTemplateResourceId = null
      this.emailTemplateResourceId = null
    },
    setPhishingEmailTemplates(data) {
      if (!this.isPhishing) {
        if (this.isQuishing) {
          // Array'i temizle, tekrar dolduracağız
          this.selectedTemplateLanguages = []
          this.languagePreview = data.emailTemplate.languageTypeResourceId
          this.selectedTemplateLanguages.push({
            text:
              this.languageOptions.find(
                (language) => language.value === data.emailTemplate.languageTypeResourceId
              )?.text || data.emailTemplate.languageTypeName,
            value: data.emailTemplate.languageTypeResourceId
          })
        }
        return
      }
      this.selectedTemplateLanguages.push({
        text:
          this.languageOptions.find(
            (language) => language.value === data.emailTemplate.languageTypeResourceId
          )?.text || data.emailTemplate.languageTypeName,
        value: data.emailTemplate.languageTypeResourceId
      })
      this.languagePreview = this.selectedTemplateLanguages[0].value
      if (!data?.emailTemplate?.languages?.length) return
      this.phishingEmailTemplates.push({
        fromName: data.emailTemplate.fromName,
        subject: data.emailTemplate.subject,
        fromEmailAddress: data.emailTemplate.fromAddress,
        cc: data.emailTemplate.ccAddresses,
        template: data.emailTemplate.template,
        language:
          this.languageOptions.find(
            (language) => language.value === data.emailTemplate.languageTypeResourceId
          )?.text || data.emailTemplate.languageTypeName,
        languageType: data.emailTemplate.languageTypeResourceId,
        languageShortCode: data.emailTemplate.languageShortCode
      })
      data.emailTemplate.languages.forEach((item) => {
        this.phishingEmailTemplates.push({
          fromName: item.fromName,
          subject: item.subject,
          fromEmailAddress: item.fromAddress,
          cc: item.ccAddresses,
          template: item.template,
          language:
            this.languageOptions.find((language) => language.value === item.languageTypeResourceId)
              ?.text || item.languageTypeName,
          languageType: item.languageTypeResourceId,
          languageShortCode: this.languageOptions.find(
            (language) => language.value === item.languageTypeResourceId
          )?.text
        })
        this.selectedTemplateLanguages.push({
          text:
            this.languageOptions.find((language) => language.value === item.languageTypeResourceId)
              ?.text || item.languageTypeName,
          value: item.languageTypeResourceId
        })
      })
      this.summaryData.emailTemplate.languageShortCode = [
        ...this.phishingEmailTemplates.map((item) => item.languageShortCode)
      ]
      this.handleEmailTemplatePreviewLanguageChange(this.languagePreview)
    },
    handleEmailTemplatePreviewLanguageChange(value) {
      const findedTemplate = this.phishingEmailTemplates.find(
        (template) => template.languageType === value
      )
      if (!findedTemplate) return
      this.summaryData.emailTemplate = {
        ...this.summaryData.emailTemplate,
        template: findedTemplate.template,
        languageTypeResourceId: value,
        languageTypeName: findedTemplate.language,
        fromName: findedTemplate.fromName,
        fromEmailAddress: findedTemplate.fromEmailAddress,
        subject: findedTemplate.subject,
        cc: findedTemplate.cc
      }
    }
  }
}
</script>
