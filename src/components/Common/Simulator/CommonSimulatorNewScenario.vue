<template>
  <AppModal
    :status="status"
    :icon-name="getModalIcon"
    :title="getModalTitle"
    class="common-simulator-new-scenario"
    footer-class="common-simulator-new-scenario__footer"
    :showFooter="!isTemplateEditing"
  >
    <template #overlay-body>
      <VNavigationDrawer
        v-click-outside="handleClickOutsideNewEmailTemplateModal"
        v-if="isOpenEmailTemplateDrawer"
        v-model="isOpenEmailTemplateDrawer"
        class="k-navigation-drawer"
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
          :selected-method-text="getSelectedMethodText"
          @changeNewEmailTemplateModalStatus="handleCloseNewEmailTemplateModal"
        />
      </VNavigationDrawer>
      <VNavigationDrawer
        v-click-outside="handleClickOutsideNewLandingPageTemplateModal"
        v-if="isOpenLandingPageDrawer"
        v-model="isOpenLandingPageDrawer"
        class="k-navigation-drawer"
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
          :selected-method-text="getSelectedMethodText"
          @changeNewEmailTemplateModalStatus="handleCloseNewLandingPageTemplateModal"
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
                <FormGroup
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
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <EmailTemplateListPreview
                    v-if="step === 2"
                    ref="refEmailTemplateListPreview"
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
                  />
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="isAttachmentBasedScenario ? 10 : 3">
            <div class="email-settings">
              <ConfigureCompanyStepHeader
                :title="labels.SelectLandingPageTemplate"
                :subtitle="getStep3Subtitle"
              />
              <v-list-item style="margin-top: -10px;">
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
                          {{ isQuishingTypeIndividualPrintOut ? '$pdf-file' : 'mdi-email' }}
                        </v-icon>
                        {{
                          isQuishingTypeIndividualPrintOut
                            ? 'Individual printout that will be given to users'
                            : 'Email that will be sent to users'
                        }}
                      </div>
                      <div>
                        <v-btn
                          class="campaign-manager-summary-card__button"
                          rounded
                          outlined
                          color="#2196f3"
                          @click="showTemplate1 = !showTemplate1"
                        >
                          <v-icon style="font-size: 20px; margin-right: 4px;">mdi-eye</v-icon>
                          Preview
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
                            <VTooltip
                              v-if="
                                summaryData.emailTemplate &&
                                summaryData.emailTemplate.isAssistedByAI
                              "
                              bottom
                            >
                              <template #activator="{ on }">
                                <VIcon v-on="on" color="#2196F3" style="margin-top: -2px;" small
                                  >mdi-creation</VIcon
                                >
                              </template>
                              <span>This template was generated with AI</span>
                            </VTooltip>
                          </div>
                          <div
                            v-if="!isQuishingTypeIndividualPrintOut"
                            class="template-summary__sub-title mt-2"
                          >
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
                            {{ getSummaryDifficulty }}
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
                            {{ getSummaryMethod }}
                          </v-chip>
                          <v-chip
                            v-if="!!summaryData"
                            class="template-list--item template-list--item__chip"
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
              <v-list-item v-if="!isAttachmentBasedScenario">
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          mdi-application
                        </v-icon>
                        {{ getLandingPageCardTitle }}
                      </div>
                      <div>
                        <v-btn
                          class="campaign-manager-summary-card__button"
                          rounded
                          outlined
                          color="#2196f3"
                          @click="showTemplate2 = !showTemplate2"
                        >
                          <v-icon style="font-size: 20px; margin-right: 4px;">mdi-eye</v-icon>
                          Preview
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            {{ showTemplate2 ? 'mdi-menu-up' : 'mdi-menu-down' }}
                          </v-icon></v-btn
                        >
                      </div>
                    </div>
                    <div v-if="summaryData.landingPageTemplate" class="summary-content">
                      <ElTabs
                        v-if="summaryData.landingPageTemplate.landingPages.length > 1"
                        v-model="selectedTab"
                      >
                        <ElTabPane
                          v-for="(template, index) in summaryData.landingPageTemplate.landingPages"
                          :key="index"
                          :name="`${index + 1}`"
                          :label="`Page ${index + 1}`"
                        >
                          <div class="d-flex justify-space-between">
                            <div class="d-flex flex-column" v-if="!!summaryData">
                              <div class="template-summary__title">
                                {{
                                  summaryData.landingPageTemplate &&
                                  summaryData.landingPageTemplate.name
                                }}
                                <VTooltip
                                  v-if="
                                    summaryData.landingPageTemplate &&
                                    (summaryData.landingPageTemplate.isAssistedByAI ||
                                      summaryData.landingPageTemplate.isAssistedbyAI)
                                  "
                                  bottom
                                >
                                  <template #activator="{ on }">
                                    <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
                                  </template>
                                  <span>This template was generated with AI</span>
                                </VTooltip>
                              </div>
                              <div class="template-summary__sub-title mt-2">
                                <b>{{ getURLText }}:</b>
                                {{ summaryData.landingPageTemplate.urlTemplate }}
                              </div>
                            </div>
                            <div class="d-flex" v-if="!!summaryData">
                              <v-chip
                                v-if="!!summaryData"
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
                                {{ getLandingPageDifficulty }}
                              </v-chip>
                              <v-chip
                                v-if="!!summaryData"
                                class="template-list--item template-list--item__chip p"
                                style="
                                  border-radius: 6px;
                                  height: 24px;
                                  font-weight: 600;
                                  font-size: 12px;
                                "
                              >
                                {{ getLandingPageMethod }}
                              </v-chip>
                              <v-chip
                                v-if="!!summaryData"
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
                                >{{
                                  summaryData.landingPageTemplate &&
                                  summaryData.landingPageTemplate.languageShortCode
                                }}
                              </v-chip>
                            </div>
                          </div>
                        </ElTabPane>
                      </ElTabs>
                      <div v-else class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!summaryData">
                          <div class="template-summary__title">
                            {{
                              summaryData.landingPageTemplate &&
                              summaryData.landingPageTemplate.name
                            }}
                            <VTooltip
                              v-if="
                                summaryData.landingPageTemplate &&
                                summaryData.landingPageTemplate.isAssistedByAI
                              "
                              bottom
                            >
                              <template #activator="{ on }">
                                <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
                              </template>
                              <span>This template was generated with AI</span>
                            </VTooltip>
                          </div>
                          <div class="template-summary__subtitle mt-2">
                            <b>{{ getLandingPageUrlLabel }}:</b>
                            {{ summaryData.landingPageTemplate.urlTemplate }}
                          </div>
                        </div>
                        <div class="d-flex" v-if="!!summaryData">
                          <v-chip
                            v-if="!!summaryData"
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
                            {{ getLandingPageDifficulty }}
                          </v-chip>
                          <v-chip
                            v-if="!!summaryData"
                            class="template-list--item template-list--item__chip p"
                            style="
                              border-radius: 6px;
                              height: 24px;
                              font-weight: 600;
                              font-size: 12px;
                            "
                          >
                            {{ getLandingPageMethod }}
                          </v-chip>
                          <v-chip
                            v-if="!!summaryData"
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
                            >{{
                              summaryData.landingPageTemplate &&
                              summaryData.landingPageTemplate.languageShortCode
                            }}
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
            ? 'You’re editing a template. Exit editing to continue.'
            : ''
        "
        :ids="footerButtonsIds"
        @on-cancel="changeNewScenarioModalStatus"
        @on-back="backStep"
        @on-next="nextStep(+1)"
        @on-submit="submit"
      />
    </template>
  </AppModal>
</template>
<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { createScenario, getScenario, getSummaryOfScenario, updateScenario } from '@/api/scenarios'
import { getEmailTemplatePreviewContent, getEmailTemplatesList } from '@/api/phishingsimulator'
import {
  getLandingPageFormDetails,
  getLandingPageList,
  getLandingPageTemplatePreviewContent
} from '@/api/landingPage'
import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview'
import LandingPageListPreview from '@/components/workshop/LandingPageTemplateListPreview'
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
import AppModal from '@/components/AppModal'
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
export default {
  name: 'CommonSimulatorNewScenario',
  components: {
    NewEmailTemplates,
    NewLandingPage,
    KSelect,
    InputPhishingMethod,
    ConfigureCompanyStepHeader,
    CampaignManagerSummaryCard,
    StepperFooter,
    KEmailPreview,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplateListPreview,
    LandingPageListPreview,
    InputSelectLanguage,
    InputTag,
    InputEntityName,
    InputDescription,
    AttachmentsPreview
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
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      landingPageData: null,
      isOpenLandingPageDrawer: false,
      isOpenEmailTemplateDrawer: false,
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
      showTemplate1: false,
      showTemplate2: false,
      languageOptions: [],
      isSubmitDisabled: false,
      availableForRequests: [],
      generalDifficultyTypeId: '',
      labels,
      step: 1,
      Validations,
      initialFormValues: {},
      quishingType: '',
      categoryText: '',
      formValues: {
        name: '',
        description: '',
        categoryId: '',
        methodTypeId: '1',
        difficultyTypeId: '1',
        emailTemplateId: null,
        landingPageTemplateId: null,
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
      landingPageTemplateResourceId: null,
      selectedEmailTemplate: null
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
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
    getLandingPageCardTitle() {
      return this.type === SCENARIO_TYPES.PHISHING
        ? 'Landing Page for users who clicked the phishing link'
        : 'Landing Page for users who clicked the QR code link'
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
        this.scenarioDetailsLookup.difficultyTypes.find(
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
      return obj
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
      const difficultyType = this.scenarioDetailsLookup.difficultyTypes.find(
        (item) => item.value === this.summaryData.landingPageTemplate.difficultyTypeId.toString()
      )?.text
      if (difficultyType === 'Easy') return '#217124'
      else if (difficultyType === 'Medium') return '#2196F3'
      else return '#F56C6C'
    },
    getDifficultyType() {
      return (
        this.scenarioDetailsLookup['difficultyTypes'].find(
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
    }
  },
  watch: {
    landingPageTemplateResourceId() {
      this.selectedTab = '1'
    },
    'formValues.methodTypeId'(val, oldVal) {
      if (val !== oldVal && !this.isInitial) this.resetLandingPageAndEmailTemplateSelection()
    },
    quishingType(val, oldVal) {
      if (val !== oldVal && !this.isInitial) this.resetLandingPageAndEmailTemplateSelection()
    }
  },
  created() {
    getLandingPageFormDetails().then((response) => {
      this.landingPageData = response.data.data
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
  methods: {
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
      this.createdEmailTemplateResourceId = createdResourceId
      if (document.querySelector('.k-navigation-drawer'))
        document.querySelector('.k-navigation-drawer').style.right = '-100%'
      if (forceUpdate && this?.$refs?.refEmailTemplateListPreview)
        this.$refs.refEmailTemplateListPreview.getTemplates(true, createdResourceId).then(() => {
          this.$refs.refEmailTemplateListPreview.setItemToFirstIndex(createdResourceId)
        })
      setTimeout(() => {
        this.toggleEmailTemplateDrawer()
      }, 250)
    },
    handleClickOutsideNewEmailTemplateModal() {
      if (this?.$refs?.newEmailTemplate?.$refs?.refEmailTemplate?.showGrapesModal) {
        this.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal = false
        return
      }
      this.handleCloseNewEmailTemplateModal()
    },
    handleClickOutsideNewLandingPageTemplateModal() {
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
    handleCloseNewLandingPageTemplateModal(_, forceUpdate = false, createdResourceId = '') {
      this.createdLandingPageResourceId = createdResourceId
      document.querySelector('.k-navigation-drawer').style.right = '-100%'
      if (forceUpdate)
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
      if (currentStep === 2 && !this.isAttachmentBasedScenario) {
        if (!!this.formValues.emailTemplateId || !!this.emailTemplateResourceId) {
          this.step += 1
        }
      }
      if (currentStep === 2 && this.isAttachmentBasedScenario) {
        if (!!this.formValues.emailTemplateId || !!this.emailTemplateResourceId) {
          this.isSubmitDisabled = true
          this.getEmailTemplateApiFuncs
            .content(this.emailTemplateResourceId)
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
              )?.description
              data.landingPageTemplate.languageShortCode = this.languageOptions.find(
                (language) => language.value === data?.landingPageTemplate?.languageTypeResourceId
              )?.description
              this.emailDifficultyChipColor = this.getDifficultyColor(
                this.selectedEmailTemplate?.difficultyName || ''
              )
              this.summaryData = data
              this.generalDifficultyTypeId = response.data.data.difficultyTypeId.toString()
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
            return
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
            return
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
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
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
    }
  }
}
</script>
