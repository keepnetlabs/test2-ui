<template>
  <app-modal :status="status" icon-name="mdi-hook" :title="getModalTitle">
    <template v-slot:overlay-body>
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
                  <v-select
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
                  >
                    <template #item="{item}">
                      <div :class="['mail-configuration-select-sources__item-container']">
                        <div class="mail-configuration-select-sources__item">
                          <div class="mail-configuration-select-sources__item-left">
                            {{ item.text }}
                          </div>
                          <div class="mail-configuration-select-sources__item-right-platform">
                            {{
                              item.text === 'Click-Only'
                                ? 'See who fails for phishing links'
                                : item.text === 'Data Submission'
                                ? 'Gather information from users'
                                : 'Send a trackable file '
                            }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-select>
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
                    Select Email Template</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title">{{
                    getStep2Subtitle
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <EmailTemplateListPreview
                    v-if="step === 2"
                    :scenarioDetailsLookup="scenarioDetailsLookup"
                    ref="RefEmailTemplateListPreview"
                    :emailTemplateResourceId="emailTemplateResourceId"
                    :category-resource-id="formValues.methodTypeId"
                    @initialEmailTemplateId="getInitialEmailTemplateId"
                    @selectedEmailTemplateChange="selectedEmailTemplateChange"
                    @selectedEmailTemplateResourceId="selectedEmailTemplateResourceId"
                    @loading="isSubmitDisabled = $event"
                  ></EmailTemplateListPreview>
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
                    ref="RefEmailTemplateListPreview"
                    :scenarioDetailsLookup="scenarioDetailsLookup"
                    :landingPageTemplateResourceId="landingPageTemplateResourceId"
                    :category-resource-id="formValues.methodTypeId"
                    :method="getSelectedMethod"
                    @initialLandingPageTemplateId="getInitialLandingPageTemplateId"
                    @selectedLandingPageChange="selectedLandingPageChange"
                    @selectedLandingPageTemplateResourceId="selectedLandingPageTemplateResourceId"
                    @loading="isSubmitDisabled = $event"
                  ></LandingPageListPreview
                ></v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content
            class="k-stepper__content summary-step"
            :step="isAttachmentBasedScenario ? 3 : 4"
          >
            <div class="email-settings">
              <v-list-item>
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
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          {{ 'mdi-information' }}
                        </v-icon>
                        Scenario Info
                      </div>
                    </div>
                    <div class="summary-content">
                      <div class="summary-content-details">
                        <span class="summary-content__title">Name</span
                        ><span class="summary-content__body">{{ formValues.name }}</span>
                      </div>
                      <div class="summary-content-details">
                        <span class="summary-content__title">Method</span
                        ><span class="summary-content__body">{{
                          scenarioDetailsLookup.methodTypes.find(
                            (item) => item.value === formValues.methodTypeId
                          ).text
                        }}</span>
                      </div>
                      <div class="summary-content-details" style="border-bottom: none !important;">
                        <span class="summary-content__title">Difficulty</span
                        ><span class="summary-content__body">{{ getDifficultyType }}</span>
                      </div>
                    </div>
                    <div class="summary-content__collapsable"></div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          {{ 'mdi-email' }}
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
                            v-if="getPhishingFile"
                            class="attachment-wrapper mt-2 mb-0"
                            style="position: relative;"
                          >
                            <div class="attachment blue-attach mb-0">
                              <AttachmentsPreview
                                :deletable="false"
                                :att="getPhishingFile"
                                :isEmailTemplate="true"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="d-flex" v-if="!!summaryData">
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
                            v-if="!!summaryData && !!summaryData.emailTemplate"
                          >
                            {{
                              difficulties.find(
                                (item) =>
                                  item.value === summaryData.emailTemplate.difficultyResourceId
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
                            v-if="!!summaryData && !!summaryData.emailTemplate"
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
                      v-if="hasEmailAttachments"
                      class="summary-content"
                      style="display: flex; border: none; padding-top: 0; padding-bottom: 8px;"
                    >
                      <div
                        v-for="(att, ind) of summaryData.emailTemplate.attachments"
                        :key="ind + att.name"
                        class="preview-attch-wrapper"
                      >
                        <div class="attachment-wrapper">
                          <div
                            class="attachment blue-attach"
                            :id="'single-post-attachments-' + att.name"
                          >
                            <AttachmentsPreview
                              :deletable="false"
                              :att="att"
                              :isEmailTemplate="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="summary-content summary-content__collapsable"
                      v-if="showTemplate1"
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
                    <div v-if="summaryData.landingPageTemplate" class="summary-content">
                      <el-tabs
                        v-if="summaryData.landingPageTemplate.landingPages.length > 1"
                        v-model="selectedTab"
                      >
                        <el-tab-pane
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
                              </div>
                              <div class="template-summary__sub-title mt-2">
                                <b>URL:</b> {{ summaryData.landingPageTemplate.urlTemplate }}
                              </div>
                            </div>
                            <div class="d-flex" v-if="!!summaryData">
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
                                v-if="!!summaryData"
                              >
                                {{
                                  scenarioDetailsLookup.difficultyTypes.find(
                                    (item) =>
                                      item.value ===
                                      summaryData.landingPageTemplate.difficultyTypeId.toString()
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
                                v-if="!!summaryData"
                              >
                                {{
                                  scenarioDetailsLookup.methodTypes.find(
                                    (item) =>
                                      item.value ===
                                      summaryData.landingPageTemplate.methodTypeId.toString()
                                  ).text
                                }}
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
                        </el-tab-pane>
                      </el-tabs>
                      <div v-else class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!summaryData">
                          <div class="template-summary__title">
                            {{
                              summaryData.landingPageTemplate &&
                              summaryData.landingPageTemplate.name
                            }}
                          </div>
                          <div class="template-summary__sub-title mt-2">
                            <b>URL:</b> {{ summaryData.landingPageTemplate.urlTemplate }}
                          </div>
                        </div>
                        <div class="d-flex" v-if="!!summaryData">
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
                            v-if="!!summaryData"
                          >
                            {{
                              scenarioDetailsLookup.difficultyTypes.find(
                                (item) =>
                                  item.value ===
                                  summaryData.landingPageTemplate.difficultyTypeId.toString()
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
                            v-if="!!summaryData"
                          >
                            {{
                              scenarioDetailsLookup.methodTypes.find(
                                (item) =>
                                  item.value ===
                                  summaryData.landingPageTemplate.methodTypeId.toString()
                              ).text
                            }}
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
                      class="summary-content summary-content__collapsable"
                      v-if="showTemplate2"
                      style="border: none;"
                    >
                      <div class="summary-template">
                        <KEmailPreview
                          v-if="!!getCurrentLandingPageTemplate"
                          :html="getCurrentLandingPageTemplate"
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
        :disabled-statuses="{ nextButton: isSubmitDisabled, submitButton: isSubmitDisabled }"
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
import { createScenario, getScenario, getSummaryOfScenario, updateScenario } from '@/api/scenarios'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
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

export default {
  name: 'NewScenarios',
  components: {
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
  data() {
    return {
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
      methods: [
        { text: 'Click-Only', value: 'WNZt0sCVCWB3' },
        { text: 'Data Submission', value: 'DYC0gugxJMjT' },
        { text: 'Attachment', value: '7dLrW2kdBTDs' }
      ],
      difficulties: [
        { text: 'Easy', value: 'mT0CeYGgKsVb' },
        { text: 'Medium', value: 'Z5XeVlpw6Dps' },
        { text: 'Hard', value: 'c4LCGEB9MayB' }
      ],
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      availableForRequests: [],
      tagSearch: '',
      generalDifficultyTypeId: '',
      labels,
      step: 1,
      Validations: Validations,
      initialFormValues: {},
      formValues: {
        name: '',
        description: '',
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
      editItemsDisabled: false,
      methodItems: [],
      difficultyItems: [],
      emailTemplateResourceId: null,
      landingPageTemplateResourceId: null
    }
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
  methods: {
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
    getDifficultyColor(difficulty) {
      if (difficulty === 'Easy') {
        return '#217124'
      }

      if (difficulty === 'Medium') {
        return '#2196F3'
      }

      if (difficulty === 'Hard') {
        return '#F56C6C'
      }

      return '#217124'
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
                const difficultyColor = this.getDifficultyColor(
                  this.selectedEmailTemplate.difficultyName
                )
                this.emailDifficultyChipColor = difficultyColor
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
        if (!!this.formValues.landingPageTemplateId || !!this.landingPageTemplateResourceId) {
          this.isSubmitDisabled = true
          getSummaryOfScenario(this.emailTemplateResourceId, this.landingPageTemplateResourceId)
            .then((response) => {
              const {
                data: { data }
              } = response
              data.emailTemplate.languageShortCode = this.languageOptions.find(
                (language) => language.value === data?.emailTemplate?.languageTypeResourceId
              )?.description
              data.landingPageTemplate.languageShortCode = this.languageOptions.find(
                (language) => language.value === data?.landingPageTemplate?.languageTypeResourceId
              )?.description
              const difficultyColor = this.getDifficultyColor(
                this.selectedEmailTemplate.difficultyName
              )
              this.emailDifficultyChipColor = difficultyColor
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
      this.step -= 1
      this.isSubmitDisabled = false
    },
    submit() {
      this.isSubmitDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      const payload = {
        ...this.formValues,
        availableForRequests: this.availableForRequests
      }
      if (this.isEdit && !this.isDuplicate) {
        updateScenario(payload, this.scenarioId)
          .then(() => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        createScenario(payload)
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
        this.formValues.emailTemplateId = null
        this.formValues.landingPageTemplateId = null
        this.landingPageTemplateId = null
        this.landingPageTemplateResourceId = null
        this.emailTemplateResourceId = null
      }
    }
  },
  computed: {
    getSelectedMethod() {
      return this.formValues?.methodTypeId
        ? this.methods[Number(this.formValues?.methodTypeId) - 1].text
        : ''
    },
    getStep2Subtitle() {
      const mTypeText = this.scenarioDetailsLookup.methodTypes.find(
        (mType) => mType.value === this.formValues.methodTypeId
      )?.text
      if (mTypeText === 'Click-Only') return 'Choose your click only type email template'
      else if (mTypeText === 'Data Submission')
        return 'Choose your data submission type email template'
      else return 'Choose your attachment type email template'
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
    hasEmailAttachments() {
      return this.summaryData?.emailTemplate?.attachments?.length > 0
    },
    getModalTitle() {
      return !this.isEdit
        ? 'New Phishing Scenario'
        : this.isDuplicate
        ? 'Duplicate Phishing Scenario'
        : 'Edit Phishing Scenario'
    },
    getPhishingFile() {
      return this.summaryData?.emailTemplate?.phishingFileName
        ? {
            name: this.summaryData?.emailTemplate?.phishingFileName
          }
        : null
    },
    getLandingPageDifficultyColor() {
      return this.scenarioDetailsLookup.difficultyTypes.find(
        (item) => item.value === this.summaryData.landingPageTemplate.difficultyTypeId.toString()
      )?.text === 'Easy'
        ? '#217124'
        : this.scenarioDetailsLookup.difficultyTypes.find(
            (item) =>
              item.value === this.summaryData.landingPageTemplate.difficultyTypeId.toString()
          )?.text === 'Medium'
        ? '#2196F3'
        : '#F56C6C'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    getDifficultyType() {
      return (
        this.scenarioDetailsLookup['difficultyTypes'].find(
          (item) => item.value === this.generalDifficultyTypeId
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
  created() {
    if (this.isDuplicate) {
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--scenario-modal',
        backButton: 'btn-duplicate-back--scenario-modal',
        nextButton: 'btn-duplicate-next--scenario-modal',
        saveButton: 'btn-duplicate-save--scenario-modal'
      }
    }
    this.callForLanguages()
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    let _this = this
    if (this.isEdit) {
      this.isSubmitDisabled = true
      getScenario(this.scenarioId)
        .then((response) => {
          _this.formValues = response.data.data
          _this.formValues.name = `${this.formValues.name}`
          _this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
          _this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
          this.formValues.emailTemplateId = response.data.data.emailTemplateResourceId
          // this.formValues.landingPageTemplateId = response.data.data.landingPageTemplateResourceId
          this.emailTemplateResourceId = response.data.data.emailTemplateResourceId
          this.landingPageTemplateResourceId = response.data.data.landingPageTemplateResourceId
          this.formValues.tags = this.formValues.tags || []
          const availableForList = response?.data?.data?.availableForList
          if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
          if (this?.$refs?.refMakeAvailableFor && availableForList?.length) {
            const availableForListFromBackend = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
              availableForList
            )
            if (!availableForListFromBackend.length) {
              this.availableForRequests = [
                {
                  id: 'MyCompanyOnly',
                  label: 'My company only',
                  type: 'MyCompanyOnly',
                  resourceId: null
                }
              ]
            } else {
              this.availableForRequests = availableForListFromBackend
            }
          } else {
            this.availableForRequests = [
              {
                id: 'MyCompanyOnly',
                label: 'My company only',
                type: 'MyCompanyOnly',
                resourceId: null
              }
            ]
          }
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isFetched = true
        })
        .finally(() => {
          this.isSubmitDisabled = false
          this.isInitial = false
        })
    } else this.isInitial = false
  }
}
</script>
