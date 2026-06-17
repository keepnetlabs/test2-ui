<template>
  <app-modal
    :status="status"
    icon-name="mdi-email"
    :title="getTitle"
    :should-remove-overflow="shouldRemoveOverflow"
  >
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Template Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Email Settings</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="email-template-info">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Email Template Info</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this email template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refFormStep1" lazy-validation>
                <FormGroup title="Template Name" has-hint class-name="mt-8">
                  <InputEntityName
                    v-model.trim="formValues.name"
                    id="input--new-email-templates-template-name"
                    entityName="template name"
                    initialPlaceholder="Enter a name"
                    :disabled="editItemsDisabled"
                  />
                </FormGroup>
                <FormGroup title="Description" sub-title="Describe the template briefly">
                  <InputDescription
                    v-model.trim="formValues.description"
                    id="input--new-email-templates-description"
                    initialPlaceholder="Description"
                    rows="2"
                    height="100"
                    :maxLength="300"
                  />
                </FormGroup>
                <InputPhishingMethod
                  v-model.trim="formValues.categoryResourceId"
                  :disabled="selectedMethodText ? selectedMethodText !== 'MFA' : false"
                  :items="methodItems"
                />
                <form-group title="Tags" sub-title="Define tags for the template">
                  <InputTag
                    ref="refTags"
                    v-model="formValues.tags"
                    :items="[]"
                    :id="`input--action-tags`"
                    class="hide-caret"
                  />
                </form-group>
                <form-group
                  title="Difficulty"
                  sub-title="Select a detection difficulty level for this phishing email"
                  class-name="mb-6"
                >
                  <v-radio-group
                    v-model="formValues.difficultyResourceId"
                    class="send-welcome-email__radio-group mt-4"
                    hide-details
                    row
                    persistent-hint
                  >
                    <v-radio
                      v-for="item in difficultyItems"
                      :key="item.name"
                      :value="item.resourceId"
                      :label="item.name"
                      color="#2196f3"
                    ></v-radio>
                  </v-radio-group>
                </form-group>
                <make-available-for
                  v-if="isRenderMakeAvailableFor"
                  ref="refMakeAvailableFor"
                  v-model="availableForRequests"
                  open-direction="above"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <EditLanguagesLeavingDialog
                v-if="showEditLanguagesLeavingDialog"
                :status="showEditLanguagesLeavingDialog"
                :before-save-language="beforeSaveLanguage"
                @on-close="handleCloseEditLanguagesLeavingDialog"
                @on-discard="handleDiscardEditLanguagesLeavingDialog"
                @on-confirm="handleConfirmEditLanguagesLeavingDialog"
              />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Email Settings</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Create, edit, design, and localize your email templates across multiple
                    languages with ease.</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-form ref="refEmailTemplateContent" style="padding-right: 72px;">
                    <FormGroup
                      title=""
                      class-name="email-template mt-6 p-4"
                      onsubmit="return false"
                    >
                      <div>
                        <div v-show="false" class="mb-3">
                          <div>
                            <v-tooltip bottom opacity="1">
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  v-on="on"
                                  rounded
                                  outlined
                                  color="#2196f3"
                                  style="font-weight: 600;"
                                  @click="handleUploadEmailButtonClick"
                                >
                                  <v-icon style="font-size: 20px; margin-top: 1px;"
                                    >mdi-upload</v-icon
                                  >
                                  <span class="button-new__text">IMPORT EMAIL</span>
                                </v-btn>
                              </template>
                              <span class="tooltip-span">Only .eml or .msg files. Max. 5MB</span>
                            </v-tooltip>
                            <input
                              v-show="false"
                              ref="refInputFileUpload"
                              type="file"
                              @change="handleFileUpload"
                            />
                          </div>
                        </div>
                      </div>
                      <ElTabs
                        v-if="isBarrelTemplate"
                        v-model="barrelEditMode"
                        class="k-sub-tab barrel-mode-tabs mb-3"
                      >
                        <ElTabPane label="Lure Email" name="lure" />
                        <ElTabPane label="Payload Email" name="payload" />
                      </ElTabs>
                      <AlertBox
                        v-if="isBarrelTemplate"
                        class="bg-aqua-light mb-4 barrel-info-alert"
                        icon-color="#2196F3"
                        icon-name="mdi-information"
                        :text="
                          isBarrelPayloadMode
                            ? 'Payload email may contain links and the {PHISHINGURL} tag. Sender (From / CC) is inherited from the Lure email.'
                            : 'Lure email must not contain links or the {PHISHINGURL} tag.'
                        "
                        :slots="{ primaryAction: false, secondaryAction: false }"
                      />
                      <div
                        v-if="isBarrelTemplate && barrelError"
                        class="mb-4"
                        style="font-size: 12px; color: #d32f2f;"
                      >
                        {{ barrelError }}
                      </div>
                      <EmailTemplate
                        v-show="!isBarrelPayloadMode"
                        ref="refEmailTemplate"
                        class="email-template-languages-settings-template-preview-container"
                        :is-ai-assistant="true"
                        :is-phishing-template="true"
                        :is-red-flags-loading="isRedFlagsLoading"
                        :active-block-manager-components="activeBlockManagerComponents"
                        :edit-items-disabled="editItemsDisabled"
                        :from-address.sync="getSelectedLanguagePayload.fromAddress"
                        :cc-addresses.sync="getSelectedLanguagePayload.ccAddresses"
                        :from-name.sync="getSelectedLanguagePayload.fromName"
                        :attachmentFiles.sync="formValues.attachmentFiles"
                        :importedEmailAttachments.sync="formValues.importedEmailAttachments"
                        :subject.sync="getSelectedLanguagePayload.subject"
                        :template.sync="getSelectedLanguagePayload.template"
                        :ai-assistant.sync="formValues.aiAssistant"
                        :ai-assistant-remaining-right.sync="aiAssistantRemainingRights"
                        :ai-assistant-total-right="aiAssistantTotalRights"
                        :isAttachmentError="isAttachmentError"
                        :hide-phishing-url-merge-tag="isBarrelTemplate"
                        :use-lure-suggestions="isBarrelTemplate"
                        :is-edit="!!isEdit"
                        :is-show-red-flags="isShowRedFlags"
                        :red-flags="redFlags"
                        :is-attachment-based-scenario="isAttachmentBasedTemplate"
                        :isEmailTemplate="true"
                        :extensions="['doc', 'docx', 'html', 'htm', 'xls', 'xlsx', 'ppt', 'pptx']"
                        :size="5"
                        :language-type-resource-id.sync="
                          getSelectedLanguagePayload.languageTypeResourceId
                        "
                        :is-assisted-by-a-i-template.sync="isAssistedByAI"
                        :isAIAllyEnabled="isAIAllyEnabled"
                        :method-type-id="getMethodTypeId"
                        :prompt.sync="getSelectedLanguagePayload.prompt"
                        :toneResourceId.sync="getSelectedLanguagePayload.toneResourceId"
                        :localizationResourceId.sync="
                          getSelectedLanguagePayload.localizationResourceId
                        "
                        :language-options="languageOptions"
                        :selected-method="getSelectedMethod"
                        :is-plain-text.sync="isPlainText"
                        :is-generate-with-ai.sync="isGenerateWithAi"
                        :is-enhance-with-ai="isEnhanceWithAi"
                        fileUploadHint="Only word, excel, powerpoint, html files. Max. file size 5MB"
                        @setAttachmentFile="setAttachmentFile"
                        @handleAttachmentRemove="handleAttachmentRemove"
                        @handleEditHtmlTemplate="handleEditHtmlTemplate"
                        @handleInitialTemplate="handleInitialTemplate"
                        @handleRenameAttachment="handleRenameAttachment"
                        @handleDeleteAttachment="handleDeleteAttachment"
                        @template-edit="handleGrapesModalStatus"
                        @on-save-template="handleSaveTemplate"
                        @on-generate-email-template-success="handleGenerateEmailTemplateSuccess"
                      >
                        <template #template-header-left>
                          <InputLanguagePreview
                            :value="activeLanguage"
                            ref="refInputLanguagePreview"
                            style="max-width: 240px;"
                            hide-details
                            label="View/Edit Template"
                            :items="selectedLanguages"
                            :disabled="selectedLanguages.length === 0 || isGenerateWithAIDisabled"
                            @input="handleActiveLanguageChange"
                          />
                        </template>
                        <template #template-header-right>
                          <InputLanguagesSettings
                            v-model="selectedLanguages"
                            :active-language="activeLanguage"
                            :is-generate-with-a-i-disabled="isGenerateWithAIDisabled"
                            :can-remove-languages="formValues.canRemoveLanguages"
                            :initial-disabled-language-ids="initialDisabledLanguageIds"
                            :language-items="languageItems"
                            :translated-language-resource-ids="translatedLanguageResourceIds"
                            :from-address="getSelectedLanguagePayload.fromAddress"
                            :from-name="getSelectedLanguagePayload.fromName"
                            :subject="getSelectedLanguagePayload.subject"
                            :is-from-address-valid="isFromAddressFieldValid"
                            :company-preferred-language-id="getCompanyPreferredLanguageId"
                            :show-red-flags="isShowRedFlags"
                            @input="handleSelectedLanguagesChange"
                            @on-active-language-change="handleActiveLanguageChange"
                            @on-generate-with-ai="handleGenerateWithAI"
                            @on-edit-mode="handleEditModeClick"
                            @on-upload-email-button-click="handleUploadEmailButtonClick"
                            @on-show-red-flags-click="handleShowRedFlagsClick"
                            @on-relocalize-replace="handleRelocalizeReplace"
                            :is-show-check-with-a-i-button="isShowEnhanceWithAI"
                            :is-check-with-a-i-loading="isCheckWithAILoading"
                            :is-check-with-a-i-done="isCheckWithAIDone"
                            @on-check-with-ai="handleCheckWithAI"
                            @on-language-removed="handleLanguageRemoved"
                          />
                        </template>
                      </EmailTemplate>
                      <div
                        v-if="isBarrelTemplate && barrelPayloadEditorMounted"
                        v-show="isBarrelPayloadMode"
                        class="barrel-payload-panel"
                      >
                        <EmailTemplate
                          ref="refEmailTemplatePayload"
                          class="email-template-languages-settings-template-preview-container barrel-payload-editor"
                          :is-phishing-template="true"
                          :isEmailTemplate="true"
                          :show-edit-button="true"
                          :show-subject-field="true"
                          :hideNotificationTemplateSenderFields="true"
                          :is-ai-assistant="true"
                          :isAIAllyEnabled="isAIAllyEnabled"
                          :ai-assistant.sync="barrelPayloadAiAssistant"
                          :ai-assistant-remaining-right.sync="aiAssistantRemainingRights"
                          :ai-assistant-total-right="aiAssistantTotalRights"
                          :prompt.sync="barrelPayloadAi.prompt"
                          :toneResourceId.sync="barrelPayloadAi.toneResourceId"
                          :localizationResourceId.sync="barrelPayloadAi.localizationResourceId"
                          :language-type-resource-id="getSelectedLanguagePayload.languageTypeResourceId"
                          :from-name="getSelectedLanguagePayload.fromName"
                          :from-address="getSelectedLanguagePayload.fromAddress"
                          :language-options="languageOptions"
                          :selected-method="getSelectedMethod"
                          :is-attachment-based-scenario="false"
                          :is-show-red-flags="false"
                          :red-flags="null"
                          :is-red-flags-loading="false"
                          :is-plain-text.sync="barrelPayloadIsPlainText"
                          :is-edit="!!isEdit"
                          :edit-items-disabled="editItemsDisabled"
                          :active-block-manager-components="activeBlockManagerComponents"
                          :method-type-id="getMethodTypeId"
                          :subject.sync="getSelectedBarrelPayload.subject"
                          :template.sync="getSelectedBarrelPayload.template"
                        />
                      </div>
                    </FormGroup>
                  </v-form>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <AppDialog
        :status="showAIChangeLogDialog"
        icon="mdi-auto-fix"
        title="AI Enhancement Results"
        size="maximum"
        max-height
        max-height-size="460px"
        @changeStatus="showAIChangeLogDialog = $event"
      >
        <template #app-dialog-body>
          <div v-if="aiDifficulty" class="d-flex align-center mb-3">
            <span class="fw-600 mr-2" style="font-size: 13px;">Difficulty:</span>
            <span
              :style="{
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: aiDifficulty === 'DIFFICULTY_HIGH' ? '#F56C6C' : aiDifficulty === 'DIFFICULTY_MEDIUM' ? '#2196F3' : '#217124',
                border: '1px solid ' + (aiDifficulty === 'DIFFICULTY_HIGH' ? '#F56C6C' : aiDifficulty === 'DIFFICULTY_MEDIUM' ? '#2196F3' : '#217124')
              }"
            >
              {{ aiDifficulty === 'DIFFICULTY_HIGH' ? 'Hard' : aiDifficulty === 'DIFFICULTY_MEDIUM' ? 'Medium' : 'Easy' }}
            </span>
          </div>
          <div v-if="aiTags.length" class="d-flex align-center flex-wrap mb-3" style="gap: 6px;">
            <span class="fw-600 mr-2" style="font-size: 13px;">Tags:</span>
            <v-chip v-for="tag in aiTags" :key="tag" small class="ml-0">
              {{ tag }}
            </v-chip>
          </div>
          <v-divider v-if="aiDifficulty || aiTags.length" class="mb-3" />
          <div v-for="(item, index) in aiChangeLog" :key="index" class="d-flex align-start mb-3">
            <v-icon size="18" color="#2196f3" class="mr-2 mt-1" style="flex-shrink: 0;">mdi-check-circle</v-icon>
            <span style="font-size: 13px; line-height: 1.5;">{{ item }}</span>
          </div>
        </template>
        <template #app-dialog-footer>
          <AppDialogFooterWithClose @on-close="showAIChangeLogDialog = false" />
        </template>
      </AppDialog>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :step.sync="step"
        :disabled-statuses="getDisabledStatuses"
        :ids="footerButtonsIds"
        @on-cancel="changeNewEmailTemplateModalStatus"
      >
        <template #right-side>
          <BackButton
            v-if="step > 1"
            :id="footerButtonsIds.backButton"
            class="mr-6"
            @click="backStep(-1)"
          />
          <NextButton
            v-if="step !== 2"
            :id="footerButtonsIds.nextButton"
            :disabled="getDisabledStatuses.nextButton"
            @click="nextStep(+1)"
          />
          <VBtn
            v-if="step === 2 && isEditFromPreview"
            id="btn-save-as-new-email-template"
            color="#2196F3"
            outlined
            rounded
            class="mr-4"
            style="font-weight: 600;"
            :disabled="getDisabledStatuses.submitButton"
            @click="handleSaveAsNew"
          >
            {{ labels.SaveAsNew }}
          </VBtn>
          <SaveButton
            v-if="step === 2 && !isEditingSystemTemplate"
            :id="footerButtonsIds.saveButton"
            :disabled="getDisabledStatuses.submitButton"
            :label="isEditFromPreview ? labels.SaveChanges : labels.Save"
            @click="submit"
          />
        </template>
      </StepperFooter>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import {
  checkRedFlags,
  convertContentToFile,
  createPhishingEmailTemplate,
  fixEmailTemplateWithAI,
  getEmailTemplatePreviewContent,
  getMergedTextForPhishing,
  updatePhishingEmailTemplate,
  generateEmailTemplateTranslation,
  getEmailTemplateTranslation
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { scrollToComponent, isDifferent, FLAGGED_AREA_CSS } from '@/utils/functions'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import EditLanguagesLeavingDialog from '@/components/PhishingScenarios/EditLanguagesLeavingDialog.vue'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import { parseEmailOrMessageFile } from '@/api/file'
import StepperFooter from '@/components/Stepper/StepperFooter'
import BackButton from '@/components/Common/Buttons/BackButton'
import NextButton from '@/components/Common/Buttons/NextButton'
import SaveButton from '@/components/Common/Buttons/SaveButton'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import { mapGetters } from 'vuex'
import {
  defaultRedFlags,
  getEmailTemplateMethodItems,
  EMAIL_TEMPLATE_DETAIL_ACTION_TYPES,
  EMAIL_TEMPLATE_DIFFICULTY_ITEMS,
  MERGED_TEXTS,
  BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID
} from './utils'
import InputLanguagesSettings from '@/components/Common/Inputs/InputLanguagesSettings.vue'
import InputLanguagePreview from '../Common/Inputs/InputLanguagePreview.vue'
import { scrollToEmailTemplateContent } from '@/components/Company Settings/utils'
import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AppDialog from '@/components/AppDialog'
import AlertBox from '@/components/AlertBox'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'
import useIsTestEnvironment from '@/hooks/useIsTestEnvironment'
export default {
  name: 'NewEmailTemplates',
  components: {
    EditLanguagesLeavingDialog,
    InputLanguagePreview,
    InputLanguagesSettings,
    InputPhishingMethod,
    StepperFooter,
    BackButton,
    NextButton,
    SaveButton,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputTag,
    InputEntityName,
    InputDescription,
    AppDialog,
    AlertBox,
    AppDialogFooterWithClose
  },
  mixins: [useSetAttachmentFile, useIsTestEnvironment],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean
    },
    isEditFromPreview: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isEditingSystemTemplate: {
      type: Boolean,
      default: false
    },
    emailTemplateId: {
      type: String
    },
    isAIAllyEnabled: {
      type: Boolean
    },
    shouldRemoveOverflow: {
      type: Boolean,
      default: true
    },
    showLeavingDialog: {
      type: Boolean,
      default: true
    },
    selectedMethodText: {
      type: String,
      default: ''
    },
    scenarioDetailsLookup: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let methodItems = structuredClone(getEmailTemplateMethodItems())
    let categoryResourceId = 'WNZt0sCVCWB3'
    if (this.selectedMethodText) {
      if (this.selectedMethodText === 'MFA') {
        methodItems = methodItems.filter((mItem) => mItem.name !== 'Attachment')
      } else if (this.selectedMethodText === 'Double Barrel') {
        // Scenario method label is "Double Barrel"; map it to the Barrel template category.
        categoryResourceId = BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID
      } else {
        categoryResourceId = methodItems.find((mItem) => mItem.name === this.selectedMethodText)
          ?.resourceId
      }
    }
    return {
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-edit-email-templates-modal',
        backButton: 'btn-back--add-or-edit-email-templates-modal',
        nextButton: 'btn-next--add-or-edit-email-templates-modal',
        saveButton: 'btn-save--add-or-edit-email-templates-modal'
      },
      editedLanguages: [],
      languageItems: [],
      isGenerateWithAIDisabled: false,
      isGenerateWithAi: false,
      isAssistedByAI: false,
      isPlainText: true,
      isRenameModalVisible: false,
      showEditLanguagesLeavingDialog: false,
      isShowRedFlags: false,
      isRedFlagsLoading: false,
      attachmentName: '',
      languageOptions: [],
      selectedLanguages: [],
      activeLanguage: '',
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      availableForRequests: [],
      tagSearch: '',
      labels,
      step: 1,
      isEverythingLocalized: false,
      Validations,
      initialFormValues: {},
      formValues: {
        name: '',
        canRemoveLanguages: false,
        description: '',
        categoryResourceId,
        tags: [],
        difficultyResourceId: 'mT0CeYGgKsVb',
        aiAssistant: false,
        attachmentFiles: [],
        importedEmailAttachments: [],
        attachmentFilesFromApi: []
      },
      languagesPayload: [],
      barrelEditMode: 'lure',
      // The payload editor's email preview is an auto-sizing iframe; mounting it
      // while hidden (display:none) measures a 0/wrong height that never recovers
      // when shown. Mount it lazily the first time the Payload tab is opened (so
      // it sizes while visible), then keep it mounted via v-show.
      barrelPayloadEditorMounted: false,
      // Tracks the two-pass barrel translation. Backend exposes a single polling
      // job, so we translate the lure body first, then chain the payload body and
      // reuse the same poll loop. null for non-barrel templates (legacy behaviour).
      barrelTranslationPhase: null,
      // Source payload body ({ subject, template }) captured at translation start so the
      // chained payload pass uses the right source regardless of active-language changes.
      barrelPayloadTranslationSource: null,
      // Independent AI Ally state for the payload editor (separate from the lure so the
      // two panels don't share open/format state). Kept out of barrelPayload so it never
      // leaks into the saved {subject, template} payload.
      barrelPayloadAiAssistant: false,
      barrelPayloadIsPlainText: true,
      barrelPayloadAi: { prompt: '', toneResourceId: '', localizationResourceId: '' },
      barrelError: '',
      initialDisabledLanguageIds: [],
      aiAssistantRemainingRights: 0,
      aiAssistantTotalRights: 0,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      editItemsDisabled: false,
      methodItems,
      difficultyItems: EMAIL_TEMPLATE_DIFFICULTY_ITEMS,
      selectedLanguagePayloadItemBeforeSave: null,
      beforeSaveLanguage: '',
      isDefault: false,
      timeoutId: null,
      lastRedFlags: {},
      isRelocalizeOperation: false,
      relocalizeLanguageName: '',
      redFlags: structuredClone(defaultRedFlags),
      isFlaggedStylesEnabled: false,
      isCheckWithAILoading: false,
      isCheckWithAIDone: false,
      showAIChangeLogDialog: false,
      aiChangeLog: [],
      aiTags: [],
      aiDifficulty: '',
      isEnhanceWithAi: false
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    isShowEnhanceWithAI() {
      if (this.isTestEnvironment) return true
      return this.getCurrentCompany?.name === 'System' || this.getCurrentCompany?.companyName === 'System'
    },
    translatedLanguageResourceIds() {
      return this.languagesPayload
        .filter((item) => item && item.isTranslated)
        .map((item) => item.languageTypeResourceId)
    },
    getSelectedLanguagePayload() {
      return (
        this.languagesPayload.find((item) => item.languageTypeResourceId === this.activeLanguage) ||
        {}
      )
    },
    getTitle() {
      if (this.isEditingSystemTemplate) {
        return 'Duplicate Email Template'
      }

      if (this.isEdit && this.isDuplicate) {
        return 'Duplicate Email Template'
      }

      if (this.isEdit) {
        return 'Edit Email Template'
      }

      return 'New Email Template'
    },
    getSelectedMethod() {
      return this.methodItems?.find(
        (item) => item.resourceId === this.formValues.categoryResourceId
      )?.name
    },
    isAttachmentBasedTemplate() {
      return this.formValues.categoryResourceId === '7dLrW2kdBTDs'
    },
    isBarrelTemplate() {
      return this.formValues.categoryResourceId === BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID
    },
    isBarrelPayloadMode() {
      return this.isBarrelTemplate && this.barrelEditMode === 'payload'
    },
    // Active language's barrel payload ({ subject, template }). Every language item is
    // seeded with barrelPayload at creation, so this is a pure read (no side effects).
    getSelectedBarrelPayload() {
      return this.getSelectedLanguagePayload.barrelPayload || {}
    },
    getMethodTypeId() {
      return this.methodItems?.find(
        (item) => item.resourceId === this.formValues.categoryResourceId
      )?.code
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    isFromAddressFieldValid() {
      const v = (this.getSelectedLanguagePayload.fromAddress || '').trim()
      return this.Validations.email(v, '') === true
    },
    getCompanyPreferredLanguageId() {
      return this.scenarioDetailsLookup?.companyLanguageTypeResourceId || ''
    },
    getDisabledStatuses() {
      return {
        nextButton: !this.isDefault && this.isSubmitDisabled,
        submitButton: this.isSubmitDisabled || this.isRedFlagsLoading || this.isEmailGenerating
      }
    },
    activeFileName() {
      // Get first attachment file name from either attachmentFiles or importedEmailAttachments
      if (this.formValues.attachmentFiles && this.formValues.attachmentFiles.length > 0) {
        const firstFile = this.formValues.attachmentFiles[0]
        return firstFile?.fileName || firstFile?.name || ''
      }
      if (
        this.formValues.importedEmailAttachments &&
        this.formValues.importedEmailAttachments.length > 0
      ) {
        return this.formValues.importedEmailAttachments[0]?.fileName || ''
      }
      return ''
    }
  },
  watch: {
    'getSelectedLanguagePayload.template'() {
      if (this.isEnhanceWithAi) return
      if (this.isCheckWithAIDone) {
        this.isCheckWithAIDone = false
      }
    },
    activeFileName(newVal, oldVal) {
      // Attachment değiştiğinde mevcut red flag gösterimini kapat, stilleri kaldır ve cache'i temizle
      if (newVal !== oldVal) {
        this.isShowRedFlags = false
        this.isFlaggedStylesEnabled = false
        this.updateTemplateWithFlaggedStyles()
        this.lastRedFlags = {}
      }
    },
    selectedLanguages(val) {
      if (!val.length) {
        this.activeLanguage = ''
      } else if (this.activeLanguage) {
        const isInSelected = val.find((item) => item.value === this.activeLanguage)
        if (!isInSelected) {
          this.activeLanguage = val[0].value
          this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
            JSON.stringify(this.getSelectedLanguagePayload)
          )
        }
      } else {
        this.activeLanguage = val[0].value
      }
    },
    scenarioDetailsLookup: {
      immediate: true,
      handler(val) {
        if (!val || this.isDefault) return
        this.setLanguageItems()
      }
    },
    barrelEditMode(mode) {
      // Lazily mount the payload editor the first time its tab is opened so its
      // preview iframe measures height while visible (see barrelPayloadEditorMounted).
      if (mode === 'payload') this.barrelPayloadEditorMounted = true
    },
    'formValues.categoryResourceId'() {
      // Reset to lure editor whenever category changes (e.g. away from Barrel)
      this.barrelEditMode = 'lure'
      // Switching TO Double Barrel after the lure was already authored/localized leaves
      // the payload bodies empty. Seed each empty payload from that language's lure (same
      // template for both initially) — the lure is already in the right language, so this
      // is a copy, not a translation call.
      if (this.isBarrelTemplate) {
        this.$nextTick(() => this.seedBarrelPayloadFromLureIfNeeded())
      }
    }
  },
  created() {
    this.setFooterButtonIds()
    this.callForMergedTags()
    this.callForLanguages()
    if (!this.isEdit) {
      this.initialFormValues = structuredClone(this.formValues)
    }
    if (this.isEdit) {
      getEmailTemplatePreviewContent(this.emailTemplateId).then((response) => {
        this.formValues = {
          ...response.data.data,
          description: response.data.data.description || '',
          attachmentFiles: response.data.data.phishingFile ? [response.data.data.phishingFile] : []
        }
        this.formValues.name = `${this.formValues.name}`
        this.isAssistedByAI = this?.formValues?.isAssistedByAI
        this.isPlainText = !this?.formValues?.isPlainText
        this.$set(this.formValues, 'aiAssistant', this?.formValues?.isAssistedByAI || false)
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        this.availableForRequests = getAvailableForValueFromList(
          response?.data?.data?.availableForList
        )
        if (this.formValues.attachments) {
          this.formValues.importedEmailAttachments = this.formValues.attachments.map((item) => ({
            ...item,
            isDeletable: true
          }))
          this.formValues.attachmentFilesFromApi = JSON.parse(
            JSON.stringify(this.formValues.attachments)
          )
        }
        if (response.data.data.phishingFileName) {
          this.formValues.attachmentFiles = [
            {
              fileName: response.data.data.phishingFileName,
              url: response.data.data.phishingFileUrl
            }
          ]
        }
        this.languagesPayload.push({
          languageTypeResourceId: this.formValues.languageTypeResourceId,
          subject: this.formValues.subject,
          fromName: this.formValues.fromName,
          fromAddress: this.formValues.fromAddress,
          ccAddresses: this.formValues.ccAddresses || [],
          template: this.formValues.template,
          prompt: this.formValues.prompt,
          toneResourceId: this.formValues.toneResourceId,
          localizationResourceId: this.formValues.localizationResourceId,
          barrelPayload: {
            subject: this.formValues.barrelPayload?.subject || '',
            template: this.formValues.barrelPayload?.template || ''
          },
          isTranslated: true
        })
        this.selectedLanguages.push({
          text:
            this.languageOptions.find(
              (item) => item.value === this.formValues.languageTypeResourceId
            )?.text || this.formValues.languageTypeName,
          value: this.formValues.languageTypeResourceId
        })
        if (response?.data?.data?.languages.length) {
          response?.data?.data?.languages.forEach((item) => {
            this.selectedLanguages.push({
              text:
                this.languageOptions.find((lang) => lang.value === item.languageTypeResourceId)
                  ?.text || item.languageTypeName,
              value: item.languageTypeResourceId
            })
            this.languagesPayload.push({
              languageTypeResourceId: item.languageTypeResourceId,
              subject: item.subject,
              fromName: item.fromName,
              fromAddress: item.fromAddress,
              ccAddresses: item.ccAddresses || [],
              template: item.template,
              prompt: item.prompt,
              toneResourceId: item.toneResourceId,
              localizationResourceId: item.localizationResourceId,
              resourceId: item.resourceId,
              barrelPayload: {
                subject: item.barrelPayload?.subject || '',
                template: item.barrelPayload?.template || ''
              },
              isTranslated: true
            })
          })
        }
        this.activeLanguage = this.formValues.languageTypeResourceId
        this.editedLanguages = structuredClone(this.languagesPayload)
        this.initialFormValues = structuredClone(this.formValues)
        this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
          JSON.stringify(this.getSelectedLanguagePayload)
        )
        if (!this.formValues.canRemoveLanguages) {
          this.initialDisabledLanguageIds = [
            this.formValues.languageTypeResourceId,
            ...this.languagesPayload.map((item) => item.languageTypeResourceId)
          ]
        }
        // A template opened as Double Barrel may carry empty payload bodies (e.g. it was
        // authored as Click Only, then the scenario method switched to Double Barrel). The
        // category watcher does not fire for the mount-time value, so seed the payloads
        // from each language's (already-localized) lure here.
        this.seedBarrelPayloadFromLureIfNeeded()
      })
    }
    if (!(this.isEdit || this.isDuplicate)) {
      this.formValues.languageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
    }
  },
  beforeDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  },
  methods: {
    handleSaveTemplate(template) {
      if (template.trim() !== this.getSelectedLanguagePayload.template.trim()) {
        delete this.lastRedFlags[this.activeLanguage]
        this.redFlags = structuredClone(defaultRedFlags)
        this.isShowRedFlags = false
      }
    },
    handleGenerateEmailTemplateSuccess({ template, subject }) {
      this.getSelectedLanguagePayload.isTranslated = true
      this.selectedLanguagePayloadItemBeforeSave.template = template
      this.selectedLanguagePayloadItemBeforeSave.subject = subject
      // Coherence: once the lure is AI-generated, suggest a matching payload prompt (only
      // when the user hasn't written one) so the payload continues the SAME scenario —
      // now WITH the call-to-action/link the lure deliberately omits. Anchored on the
      // lure subject (clean theme), not the lure prompt (which instructs "no links").
      if (this.isBarrelTemplate && !(this.barrelPayloadAi.prompt || '').trim()) {
        this.barrelPayloadAi.prompt = this.buildBarrelPayloadPrompt(subject)
      }
    },
    // Builds a suggested AI prompt for the Double Barrel payload that follows up on the
    // lure scenario and explicitly asks for the link/CTA the lure omits.
    buildBarrelPayloadPrompt(lureSubject) {
      const theme = (lureSubject || '').trim()
      const reference = theme ? `the lure email "${theme}"` : 'the previous lure email'
      return (
        `Write the follow-up "payload" email for the same scenario as ${reference}. ` +
        'Reference that the recipient was already contacted, and now ask them to take ' +
        'action by clicking a link ({PHISHINGURL}). Keep the same sender persona and tone ' +
        'as the lure. Unlike the lure, this email MUST include the call-to-action link.'
      )
    },
    handleRelocalizeReplace({ language }) {
      const payload = this.languagesPayload.find(
        (p) => p.languageTypeResourceId === language.value
      ) || { subject: '', template: '' }
      const subject = payload.subject || this.getSelectedLanguagePayload.subject || ''
      const template = payload.template || this.getSelectedLanguagePayload.template || ''
      const languages = [
        {
          languageResourceId: language.value,
          languageName: language.text
        }
      ]
      // Barrel: re-localizing a language must also re-translate its payload body so it
      // doesn't go stale. Capture the target language's payload (fallback to active).
      this.barrelTranslationPhase = this.isBarrelTemplate ? 'lure' : null
      const targetBarrelPayload = payload.barrelPayload || {}
      const activeBarrelPayload = this.getSelectedBarrelPayload || {}
      this.barrelPayloadTranslationSource = {
        template: targetBarrelPayload.template || activeBarrelPayload.template || '',
        subject: targetBarrelPayload.subject || activeBarrelPayload.subject || ''
      }
      this.isGenerateWithAi = true
      this.isGenerateWithAIDisabled = true
      this.$refs.refEmailTemplate.isEmailGenerating = true
      // Set relocalize flag to differentiate from normal localization
      this.isRelocalizeOperation = true
      this.relocalizeLanguageName = language.text
      generateEmailTemplateTranslation({ languages, template, subject })
        .then((response) => {
          if (!response?.data?.data?.isSuccess) {
            this.resetGenerateWithAIDisabled()
            return
          }
          this.isEverythingLocalized = false
          this.askForEmailTemplateTranslation()
        })
        .catch(() => {
          this.resetGenerateWithAIDisabled()
        })
    },
    setLanguageItems() {
      const languageTypes = this.scenarioDetailsLookup?.languageTypes || []
      const preferredLanguageTypes = this.scenarioDetailsLookup?.preferredLanguageTypes || []
      const companyLanguageTypeResourceId =
        this.scenarioDetailsLookup?.companyLanguageTypeResourceId || ''
      const languageItems = []
      languageItems.push(
        {
          value: 1,
          text: 'Preferred Languages',
          children: preferredLanguageTypes
        },
        {
          value: 5,
          text: 'All Languages',
          children: languageTypes.filter(
            (item) => !preferredLanguageTypes?.find((pItem) => pItem.value === item.value)
          )
        }
      )
      this.languageItems = languageItems
      if (this.isEdit) return
      const findedLanguage = languageTypes?.find(
        (item) => item.value === companyLanguageTypeResourceId
      )
      if (!findedLanguage) return
      this.selectedLanguages.push({
        text: findedLanguage.text,
        value: companyLanguageTypeResourceId
      })
      this.$nextTick(() => {
        this.handleSelectedLanguagesChange(this.selectedLanguages)
        this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
          JSON.stringify(this.getSelectedLanguagePayload)
        )
        this.$refs?.refEmailTemplateContent?.resetValidation()
        if (this.getSelectedLanguagePayload.template && !this.isEdit) {
          this.isDefault = true
          this.handleGenerateWithAI()
        }
      })
    },
    handleEditHtmlTemplate(value) {
      this.getSelectedLanguagePayload.template = value
    },
    setFooterButtonIds() {
      if (!this.isDuplicate) return
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--email-templates-modal',
        backButton: 'btn-duplicate-back--email-templates-modal',
        nextButton: 'btn-duplicate-next--email-templates-modal',
        saveButton: 'btn-duplicate-save--email-templates-modal'
      }
    },
    handleDeleteAttachment() {
      this.formValues.attachmentFiles = []
      this.isAddedNewPhishingFile = false
    },
    handleRenameAttachment() {
      this.$emit('showRenameAttachmentModal')
    },
    handleUploadEmailButtonClick() {
      this?.$refs?.refInputFileUpload?.click()
    },
    replaceImportedEmailAnchorHrefs(template = '') {
      if (!template || typeof template !== 'string') return template
      return template.replace(/<a\b[^>]*>/gi, (anchorTag) =>
        anchorTag.replace(/\s+href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, (hrefAttribute) => {
          const [, prefix = ' href='] = hrefAttribute.match(/^(\s+href\s*=\s*)/i) || []
          return `${prefix}"{PHISHINGURL}"`
        })
      )
    },
    handleFileUpload(e) {
      const { files } = e.target
      if (files.length) {
        const formData = new FormData()
        formData.append('File', files[0])
        parseEmailOrMessageFile(formData).then((response) => {
          const {
            data: { data }
          } = response
          let { from, fromName, subject, attachments, body } = data
          body = this.replaceImportedEmailAnchorHrefs(body)
          this.languagesPayload.forEach((item) => {
            item.template = body
            item.subject = subject
            item.fromName = fromName
            item.fromAddress = from
            item.isTranslated = item.languageTypeResourceId === this.getCompanyPreferredLanguageId
          })
          this.selectedLanguagePayloadItemBeforeSave.template = body
          this.selectedLanguagePayloadItemBeforeSave.subject = subject
          if (attachments && attachments.length > 0) {
            // Only take the first attachment (system supports only 1 attachment)
            const backendAttachment = attachments[0]
            const firstAttachment = {
              ...backendAttachment,
              fileName: backendAttachment.name || backendAttachment.fileName,
              name: backendAttachment.name || backendAttachment.fileName,
              isDeletable: true
            }
            // Convert to File object if content exists (backend format)
            // Backend format: { name, contentType, content (base64), ... }
            if (firstAttachment.content && !(firstAttachment instanceof File)) {
              const fileObject = convertContentToFile(firstAttachment)
              // Keep original attachment data for UI, but use File object for API
              // Ensure fileObject is a valid File instance before assigning
              if (fileObject instanceof File) {
                firstAttachment.fileObject = fileObject
              }
            }
            // Add imported attachment directly to attachmentFiles (for UI display)
            this.$set(this.formValues, 'attachmentFiles', [firstAttachment])
            this.$set(
              this.formValues,
              'attachmentFilesFromApi',
              structuredClone([firstAttachment])
            )
            // Keep importedEmailAttachments for backend API
            // Use File object if available, otherwise use original attachment
            const attachmentForApi = firstAttachment.fileObject || firstAttachment
            this.$set(this.formValues, 'importedEmailAttachments', [attachmentForApi])
            // Set flags for imported attachment
            this.isPhishingFileModified = false
            this.isAddedNewPhishingFile = true
          }
          delete this.lastRedFlags[this.activeLanguage]
          this.redFlags = structuredClone(defaultRedFlags)
          this.isShowRedFlags = false
          // Reset the input file so the same file can be uploaded again
          e.target.value = ''
        })
      }
    },
    handleAttachmentRemove({ item, index }) {
      this.formValues.attachmentFilesToRemove = item.fileName
      const itemFileName = item?.fileName || item?.name

      // Remove from attachmentFiles (now contains imported attachments)
      if (this.formValues.attachmentFiles && this.formValues.attachmentFiles.length > 0) {
        const attachmentIndex = this.formValues.attachmentFiles.findIndex(
          (att) => (att?.fileName || att?.name) === itemFileName
        )
        if (attachmentIndex !== -1) {
          this.formValues.attachmentFiles.splice(attachmentIndex, 1)
        }
      }

      // Remove from importedEmailAttachments (for backward compatibility)
      if (
        this.formValues.importedEmailAttachments &&
        this.formValues.importedEmailAttachments.length > 0
      ) {
        const importedIndex = this.formValues.importedEmailAttachments.findIndex(
          (att) => (att?.fileName || att?.name) === itemFileName
        )
        if (importedIndex !== -1) {
          this.formValues.importedEmailAttachments.splice(importedIndex, 1)
        }
      }

      // Remove from attachmentFilesFromApi
      const newAttachmentFilesFromApi = JSON.parse(
        JSON.stringify(this.formValues.attachmentFilesFromApi)
      )
      if (this.formValues.attachmentFiles && this.formValues.attachmentFiles.length === 1) {
        newAttachmentFilesFromApi.splice(index - 1, 1)
      } else {
        newAttachmentFilesFromApi.splice(index, 1)
      }
      this.formValues.attachmentFilesFromApi = newAttachmentFilesFromApi
    },
    handleInitialTemplate(value) {
      this.initialFormValues.template = value
    },
    handleSelectedLanguagesChange(languages) {
      this.languagesPayload = languages.map((language) => {
        const item = this.languagesPayload.find(
          (item) => item.languageTypeResourceId === language.value
        )
        if (item) return item
        return {
          languageTypeResourceId: language.value,
          subject: this.getSelectedLanguagePayload.subject,
          fromName: this.getSelectedLanguagePayload.fromName,
          fromAddress: this.getSelectedLanguagePayload.fromAddress,
          ccAddresses: this.getSelectedLanguagePayload.ccAddresses || [],
          template: this.initialFormValues.template,
          prompt: '',
          toneResourceId: '',
          localizationResourceId: '',
          barrelPayload: { subject: '', template: '' },
          detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.ADD,
          isTranslated: false
        }
      })
    },
    handleLanguageRemoved({ languageName }) {
      this.showLanguageRemovedMessage(languageName)
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    changeNewEmailTemplateModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeNewEmailTemplateModalStatus', false)
      }
      if (!this.showLeavingDialog) return this.$emit('changeNewEmailTemplateModalStatus', false)
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewEmailTemplateModalStatus', false)
        }
      })
    },
    nextStep() {
      let isMakeAvailableForValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isMakeAvailableForValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refFormStep1.validate() && isMakeAvailableForValid) {
        this.step += 1
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
      }
    },
    backStep() {
      this.step -= 1
    },
    submit() {
      if (this.isAttachmentBasedTemplate && this?.formValues?.attachmentFiles?.length === 0) {
        this.isAttachmentError = 'Templates with attachment method must have an attachment file.'
        return
      }
      this.isSubmitDisabled = true
      let isMakeAvailableForValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isMakeAvailableForValid = refMakeAvailableFor.isAvailableForValid
      }
      const isFormValid = this.$refs.refEmailTemplateContent.validate() && isMakeAvailableForValid
      if (!isFormValid || !this.formValues.languageTypeResourceId) {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }
      if (!this.validateBarrelTemplate()) {
        this.isSubmitDisabled = false
        return
      }
      if (this.isShowRedFlags) {
        this.isShowRedFlags = false
        this.isFlaggedStylesEnabled = false
        this.updateTemplateWithFlaggedStyles()
        // Remove red flag classes and attributes before submit
        this.languagesPayload.forEach((languagePayload) => {
          if (this._isValidLanguagePayload(languagePayload)) {
            languagePayload.template = this._removeRedFlagClassesAndAttributes(
              languagePayload.template
            )
          }
        })
      }
      this.formValues.prompt = this?.$refs?.refEmailTemplate?.aiTemplateText
      let payload = {
        ...this.formValues,
        isDuplicated: this.isDuplicate,
        duplicatedTemplateResourceId: this.isDuplicate ? this.emailTemplateId : null,
        description: this.formValues.description || '',
        attachmentFiles: [
          ...this.formValues.attachmentFiles,
          ...this.formValues.importedEmailAttachments
        ],
        isAttachmentBasedTemplate: this.isAttachmentBasedTemplate,
        isPhishingFileModified: this.isPhishingFileModified,
        isAddedNewPhishingFile: this.isAddedNewPhishingFile,
        phishingFileName:
          !this.isAddedNewPhishingFile && !!this.formValues.attachmentFiles
            ? this.formValues.attachmentFiles[0]?.fileName
            : null,
        availableForRequests: this.$refs.refMakeAvailableFor.getAvailableForValues(
          this.availableForRequests
        ),
        isAssistedByAI: this.isAssistedByAI,
        isPlainText: !this.isPlainText,
        languages: this.languagesPayload
      }
      delete payload.attachments
      if (this.isEdit && !this.isDuplicate) {
        this.editedLanguages.forEach((item) => {
          const payloadLanguage = payload.languages.find(
            (language) => language.languageTypeResourceId === item.languageTypeResourceId
          )
          if (payloadLanguage) {
            const isEqual = JSON.stringify(item) === JSON.stringify(payloadLanguage)
            payloadLanguage.detailActionType = isEqual
              ? EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.NO_CHANGE
              : EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.EDIT
          } else {
            payload.languages.push({
              ...item,
              detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.DELETE
            })
          }
        })
        payload.languages = this.setEmptyLanguagesPayload()
        updatePhishingEmailTemplate(payload, this.emailTemplateId)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        payload.languages = this.setEmptyLanguagesPayload()
        createPhishingEmailTemplate(payload)
          .then((response) => {
            this.$emit(
              'changeNewEmailTemplateModalStatus',
              false,
              true,
              response?.data?.data?.resourceId
            )
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    },
    handleSaveAsNew() {
      if (this.isAttachmentBasedTemplate && this?.formValues?.attachmentFiles?.length === 0) {
        this.isAttachmentError = 'Templates with attachment method must have an attachment file.'
        return
      }
      this.isSubmitDisabled = true
      let isMakeAvailableForValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isMakeAvailableForValid = refMakeAvailableFor.isAvailableForValid
      }
      const isFormValid = this.$refs.refEmailTemplateContent.validate() && isMakeAvailableForValid
      if (!isFormValid || !this.formValues.languageTypeResourceId) {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }
      if (!this.validateBarrelTemplate()) {
        this.isSubmitDisabled = false
        return
      }
      if (this.isShowRedFlags) {
        this.isShowRedFlags = false
        this.isFlaggedStylesEnabled = false
        this.updateTemplateWithFlaggedStyles()
      }
      this.formValues.prompt = this?.$refs?.refEmailTemplate?.aiTemplateText
      const name =
        this.formValues.name === this.initialFormValues.name
          ? `${this.formValues.name} - Copy`
          : this.formValues.name
      let payload = {
        ...this.formValues,
        name,
        isDuplicated: true,
        duplicatedTemplateResourceId: this.emailTemplateId,
        description: this.formValues.description || '',
        attachmentFiles: [
          ...this.formValues.attachmentFiles,
          ...this.formValues.importedEmailAttachments
        ],
        isAttachmentBasedTemplate: this.isAttachmentBasedTemplate,
        isPhishingFileModified: this.isPhishingFileModified,
        isAddedNewPhishingFile: this.isAddedNewPhishingFile,
        phishingFileName:
          !this.isAddedNewPhishingFile && !!this.formValues.attachmentFiles
            ? this.formValues.attachmentFiles[0]?.fileName
            : null,
        availableForRequests: this.$refs.refMakeAvailableFor.getAvailableForValues(
          this.availableForRequests
        ),
        isAssistedByAI: this.isAssistedByAI,
        isPlainText: !this.isPlainText,
        languages: this.languagesPayload
      }
      delete payload.attachments
      payload.languages = this.setEmptyLanguagesPayload()
      createPhishingEmailTemplate(payload)
        .then((response) => {
          this.$emit(
            'changeNewEmailTemplateModalStatus',
            false,
            true,
            response?.data?.data?.resourceId
          )
        })
        .finally(() => {
          this.isSubmitDisabled = false
        })
    },
    callForMergedTags() {
      getMergedTextForPhishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
    },
    validateBarrelTemplate() {
      this.barrelError = ''
      if (!this.isBarrelTemplate) return true
      const linkRegex = /<a[\s>]/i
      // Lure body must not contain links or the {PHISHINGURL} merge tag
      const lureViolation = this.languagesPayload.find((lang) => {
        const lure = lang?.template || ''
        return linkRegex.test(lure) || lure.includes('{PHISHINGURL}')
      })
      if (lureViolation) {
        this.activeLanguage = lureViolation.languageTypeResourceId
        this.barrelEditMode = 'lure'
        this.barrelError = 'Lure email body must not contain links or the {PHISHINGURL} tag.'
        return false
      }
      // Payload subject and body are required for every language
      const payloadViolation = this.languagesPayload.find((lang) => {
        const bp = lang?.barrelPayload || {}
        return !bp.subject || !bp.subject.trim() || !bp.template || !bp.template.trim()
      })
      if (payloadViolation) {
        this.activeLanguage = payloadViolation.languageTypeResourceId
        this.barrelEditMode = 'payload'
        this.barrelError = 'Payload subject and body are required for every language.'
        return false
      }
      return true
    },
    setEmptyLanguagesPayload() {
      const preferredLanguagePayload = this.getPreferredLanguagePayload()
      return this.languagesPayload.map((item) => {
        return {
          ...item,
          fromName: item.fromName || preferredLanguagePayload.fromName,
          fromAddress: item.fromAddress || preferredLanguagePayload.fromAddress,
          subject: item.subject || preferredLanguagePayload.subject,
          template: item.template || preferredLanguagePayload.template,
          ccAddresses: item.ccAddresses.length
            ? item.ccAddresses
            : preferredLanguagePayload.ccAddresses
        }
      })
    },
    getPreferredLanguagePayload() {
      let preferredLanguagePayload = this.languagesPayload.find(
        (item) =>
          item.languageTypeResourceId === this.scenarioDetailsLookup.companyLanguageTypeResourceId
      )
      if (preferredLanguagePayload?.fromName && preferredLanguagePayload?.fromAddress)
        return preferredLanguagePayload
      preferredLanguagePayload = this.languagesPayload.find(
        (item) => item?.fromName && item?.fromAddress
      )
      return preferredLanguagePayload || this.languagesPayload[0]
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId
          })) || []
      })
    },
    getTagsComponent(item) {
      return MERGED_TEXTS[item]
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    },
    handleCheckWithAI() {
      const template = this.getSelectedLanguagePayload.template
      if (!template || !template.trim()) return
      this.isCheckWithAILoading = true
      this.isEnhanceWithAi = true
      this.$refs.refEmailTemplate.isEmailGenerating = true
      fixEmailTemplateWithAI({
        html: template,
        type: 'email_template'
      })
        .then((response) => {
          const result = response?.data?.data || response?.data
          if (result?.fixed_html) {
            this.getSelectedLanguagePayload.template = result.fixed_html
            this.selectedLanguagePayloadItemBeforeSave.template = result.fixed_html
          }
          if (result?.from_address) {
            this.getSelectedLanguagePayload.fromAddress = result.from_address
          }
          if (result?.from_name) {
            this.getSelectedLanguagePayload.fromName = result.from_name
          }
          if (result?.subject) {
            this.getSelectedLanguagePayload.subject = result.subject
          }
          if (result?.difficulty) {
            const difficultyMap = {
              DIFFICULTY_LOW: this.difficultyItems.find((d) => d.name === 'Easy')?.resourceId,
              DIFFICULTY_MEDIUM: this.difficultyItems.find((d) => d.name === 'Medium')?.resourceId,
              DIFFICULTY_HIGH: this.difficultyItems.find((d) => d.name === 'Hard')?.resourceId
            }
            const mappedDifficulty = difficultyMap[result.difficulty]
            if (mappedDifficulty) {
              this.formValues.difficultyResourceId = mappedDifficulty
            }
          }
          const existingTags = this.formValues.tags || []
          const existingTagsLower = existingTags.map((t) => t.toLowerCase())
          const newTags = (result?.tags || []).filter((tag) => !existingTagsLower.includes(tag.toLowerCase()))
          if (newTags.length) {
            this.formValues.tags = [...existingTags, ...newTags]
          }
          const changeLog = result?.change_log || []
          this.aiTags = newTags
          this.aiDifficulty = result?.difficulty || ''
          this.isCheckWithAIDone = true
          if (changeLog.length) {
            this.aiChangeLog = changeLog
            this.showAIChangeLogDialog = true
          } else {
            this.$store.dispatch('common/createSnackBar', {
              message: 'AI enhancement complete. No changes needed.',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle'
            })
          }
        })
        .catch((e) => {
          this.$store.dispatch('common/createSnackBar', {
            message:
              e?.response?.data?.detail ||
              e?.response?.data?.message ||
              'An error occurred while enhancing the template with AI.',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        })
        .finally(() => {
          this.isCheckWithAILoading = false
          this.isEnhanceWithAi = false
          this.$refs.refEmailTemplate.isEmailGenerating = false
        })
    },
    // Seeds barrel payload bodies from each language's lure when the template becomes
    // Double Barrel after the lure was already authored/localized (e.g. created as Click
    // Only, then switched to Barrel). The lure is already in the correct language, so this
    // is a plain copy (no translation call) and only fills payloads that are still empty —
    // never overwriting a payload the user has already diverged.
    seedBarrelPayloadFromLureIfNeeded() {
      if (!this.isBarrelTemplate) return
      this.languagesPayload.forEach((p) => {
        const lureBody = (p.template || '').trim()
        const payloadEmpty = !((p.barrelPayload && p.barrelPayload.template) || '').trim()
        if (!lureBody || !payloadEmpty) return
        if (!p.barrelPayload) {
          this.$set(p, 'barrelPayload', { subject: '', template: '' })
        }
        p.barrelPayload.template = p.template
        if (!(p.barrelPayload.subject || '').trim()) {
          p.barrelPayload.subject = p.subject || ''
        }
      })
    },
    handleGenerateWithAI() {
      this.isGenerateWithAi = true
      this.isGenerateWithAIDisabled = true
      this.$refs.refEmailTemplate.isEmailGenerating = true
      let template = this.getSelectedLanguagePayload.template
      let subject = this.getSelectedLanguagePayload.subject
      this.isSubmitDisabled = true
      const prevTemplate = (this.selectedLanguagePayloadItemBeforeSave?.template || '').trim()
      const currTemplate = (template || '').trim()
      const shouldFilterTranslated = prevTemplate === currTemplate
      const languagesToLocalize = shouldFilterTranslated
        ? this.selectedLanguages.filter((lang) => {
            const payload = this.languagesPayload.find(
              (p) => p.languageTypeResourceId === lang.value
            )
            return !(payload && payload.isTranslated)
          })
        : this.selectedLanguages
      const lureLanguages = languagesToLocalize.map((item) => ({
        languageResourceId: item.value,
        languageName: item.text
      }))
      // Barrel templates carry a second (payload) body. Translate the lure first, then
      // chain the payload pass once the lure poll completes (single backend job). The
      // chained pass mirrors the languages the lure actually localized — computed from
      // the poll's successLanguages — so it covers fresh templates whose payload still
      // holds the default body. Capture the payload source now so the chain is immune to
      // active-language changes during polling.
      this.barrelTranslationPhase = this.isBarrelTemplate ? 'lure' : null
      const activeBarrelPayload = this.getSelectedBarrelPayload || {}
      this.barrelPayloadTranslationSource = {
        template: activeBarrelPayload.template || '',
        subject: activeBarrelPayload.subject || ''
      }
      scrollToEmailTemplateContent()
      generateEmailTemplateTranslation({
        languages: lureLanguages,
        template,
        subject
      })
        .then((response) => {
          if (!response?.data?.data?.isSuccess) {
            this.resetGenerateWithAIDisabled()
            return
          }
          this.isEverythingLocalized = false
          this.askForEmailTemplateTranslation()
        })
        .catch(() => {
          this.resetGenerateWithAIDisabled()
        })
    },
    askForEmailTemplateTranslation(count = 0, maxCount = null, timeoutId = 0) {
      if (this.isEverythingLocalized) return
      const languagesLength = Array.isArray(this.selectedLanguages)
        ? this.selectedLanguages.length
        : 0
      const calculatedMax = Math.max((languagesLength || 1) * 20, 20)
      const effectiveMax = typeof maxCount === 'number' && maxCount > 0 ? maxCount : calculatedMax
      if (count >= effectiveMax) {
        const isPayloadPass = this.barrelTranslationPhase === 'payload'
        this.languagesPayload.forEach((lPayload) => {
          if (isPayloadPass) {
            if (lPayload.barrelPayload && !lPayload.barrelPayload.template) {
              lPayload.barrelPayload.template = '<div style="height:300px"></div>'
            }
          } else if (!lPayload.isTranslated) {
            lPayload.template = '<div style="height:300px"></div>'
          }
        })
        this.resetGenerateWithAIDisabled(timeoutId)
        return
      }
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        getEmailTemplateTranslation()
          .then((response) => {
            const {
              data: { data }
            } = response
            if (this.timeoutId) {
              clearTimeout(this.timeoutId)
            }

            this.isEverythingLocalized = true
            const errorLanguages = []
            const successLanguages = []
            data.forEach((item) => {
              if (item.error) {
                errorLanguages.push(item)
              } else {
                successLanguages.push(item)
              }
            })

            const isPayloadPass = this.barrelTranslationPhase === 'payload'
            if (this.isDefault && !isPayloadPass) {
              this.selectedLanguagePayloadItemBeforeSave.template = data[0]?.template
              this.selectedLanguagePayloadItemBeforeSave.subject = data[0]?.subject
            }
            errorLanguages.forEach((item) => {
              this.showLocalizationErrorMessage(item)
            })
            successLanguages.forEach((item) => {
              const languagePayload = this.languagesPayload.find(
                (language) => language.languageTypeResourceId === item.languageResourceId
              )
              if (!languagePayload) return
              if (isPayloadPass) {
                if (!languagePayload.barrelPayload) {
                  this.$set(languagePayload, 'barrelPayload', { subject: '', template: '' })
                }
                languagePayload.barrelPayload.template = item.template
                languagePayload.barrelPayload.subject =
                  item.subject || languagePayload.barrelPayload.subject
              } else {
                languagePayload.template = item.template
                languagePayload.subject = item.subject || languagePayload.subject
                languagePayload.isTranslated = true
                // First-open default localization: lure and payload hold the SAME default
                // body, so the single localized result applies to both — fill the payload
                // in this one pass instead of firing a second translate call.
                if (this.isDefault && this.isBarrelTemplate) {
                  if (!languagePayload.barrelPayload) {
                    this.$set(languagePayload, 'barrelPayload', { subject: '', template: '' })
                  }
                  languagePayload.barrelPayload.template = item.template
                  languagePayload.barrelPayload.subject =
                    item.subject || languagePayload.barrelPayload.subject
                }
              }
              this.$nextTick(() => {
                const modalContent = document.querySelector('.k-overlay__container')
                if (modalContent) {
                  modalContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start'
                  })
                  const selectedElement = document.querySelector(
                    '.input-languages-email-template-preview-select'
                  )
                  if (selectedElement?.classList?.contains('executive-widget-container--active'))
                    selectedElement.classList.remove('executive-widget-container--active')
                  setTimeout(
                    () => selectedElement?.classList?.add('executive-widget-container--active'),
                    500
                  )
                }
              })
            })
            // Barrel: after a MANUAL lure localization completes, chain the payload pass
            // through the same single backend poll job (lure and payload may differ once
            // edited). Skipped on first-open default localization (this.isDefault), where
            // the payload was already filled in the single pass above. Mirror EXACTLY the
            // languages whose lure just succeeded (this poll's successLanguages) so a
            // fresh template's default payload still localizes and lure-errored languages
            // are not left half-translated.
            const barrelPayloadSource = this.barrelPayloadTranslationSource
            const payloadLanguages =
              this.barrelTranslationPhase === 'lure' && !this.isDefault
                ? successLanguages
                    .map((item) => {
                      const lang = this.selectedLanguages.find(
                        (l) => l.value === item.languageResourceId
                      )
                      return lang
                        ? { languageResourceId: lang.value, languageName: lang.text }
                        : null
                    })
                    .filter(Boolean)
                : []
            const hasPayloadToTranslate =
              this.isBarrelTemplate &&
              (barrelPayloadSource?.template || '').trim() &&
              payloadLanguages.length
            if (hasPayloadToTranslate) {
              this.barrelTranslationPhase = 'payload'
              clearTimeout(timeoutId)
              generateEmailTemplateTranslation({
                languages: payloadLanguages,
                template: barrelPayloadSource.template,
                subject: barrelPayloadSource.subject
              })
                .then((response) => {
                  if (!response?.data?.data?.isSuccess) {
                    this.resetGenerateWithAIDisabled(timeoutId)
                    return
                  }
                  this.isEverythingLocalized = false
                  this.askForEmailTemplateTranslation()
                })
                .catch(() => {
                  this.resetGenerateWithAIDisabled(timeoutId)
                })
              return
            }
            // Final completion (non-barrel, payload pass done, or no payload to translate)
            this.barrelTranslationPhase = null
            // Show success snackbar with dynamic message based on language count
            this.showLocalizationSuccessMessage(data)
            this.resetGenerateWithAIDisabled(timeoutId)
            const lastData = data[data.length - 1]
            if (lastData) {
              this.handleActiveLanguageChange(lastData.languageResourceId)
            }
          })
          .catch(() => {
            this.askForEmailTemplateTranslation(count + 1, effectiveMax, timeoutId)
          })
      }, 5000)
    },
    resetGenerateWithAIDisabled(timeoutId) {
      this.isGenerateWithAi = false
      this.isGenerateWithAIDisabled = false
      this.$refs.refEmailTemplate.isEmailGenerating = false
      this.isSubmitDisabled = false
      this.isDefault = false
      this.barrelTranslationPhase = null
      this.barrelPayloadTranslationSource = null
      clearTimeout(timeoutId)
    },
    handleActiveLanguageChange(value) {
      if (this.isShowRedFlags) {
        if (this.lastRedFlags[value]) {
          this.redFlags = structuredClone(this.lastRedFlags[value]?.flags)
        } else {
          this.redFlags = structuredClone(defaultRedFlags)
          this.isFlaggedStylesEnabled = false
          this.updateTemplateWithFlaggedStyles()
          this.isShowRedFlags = false
        }
      } else {
        this.redFlags = structuredClone(defaultRedFlags)
        this.isFlaggedStylesEnabled = false
        this.updateTemplateWithFlaggedStyles()
        this.isShowRedFlags = false
      }
      if (
        JSON.stringify(this.selectedLanguagePayloadItemBeforeSave.template.trim()) ===
        JSON.stringify(this.getSelectedLanguagePayload.template.trim())
      ) {
        this.activeLanguage = value
        this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
          JSON.stringify(this.getSelectedLanguagePayload)
        )
        return
      }
      this.$refs.refInputLanguagePreview.$refs.refSelect.$refs.refComponent.initialValue = this.activeLanguage
      this.$refs.refInputLanguagePreview.$refs.refSelect.$refs.refComponent.lazyValue = this.activeLanguage
      this.showEditLanguagesLeavingDialog = true
      this.beforeSaveLanguage = value
    },
    handleCloseEditLanguagesLeavingDialog() {
      this.showEditLanguagesLeavingDialog = false
    },
    handleDiscardEditLanguagesLeavingDialog(beforeSaveLanguage) {
      this.showEditLanguagesLeavingDialog = false
      let selectedTemplateIndex = this.languagesPayload.findIndex(
        (item) => item.languageTypeResourceId === this.activeLanguage
      )
      if (selectedTemplateIndex !== -1) {
        this.$set(this.languagesPayload, selectedTemplateIndex, {
          ...this.selectedLanguagePayloadItemBeforeSave
        })
      }
      this.activeLanguage = beforeSaveLanguage
      this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
        JSON.stringify(this.getSelectedLanguagePayload)
      )
    },
    handleConfirmEditLanguagesLeavingDialog(beforeSaveLanguage) {
      this.showEditLanguagesLeavingDialog = false
      this.activeLanguage = beforeSaveLanguage
      this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
        JSON.stringify(this.getSelectedLanguagePayload)
      )
    },
    handleEditModeClick() {
      this.$refs.refEmailTemplate.toggleShowGrapesModal()
    },
    handleGrapesModalStatus() {
      this.isFlaggedStylesEnabled = false
      this.updateTemplateWithFlaggedStyles()
    },
    checkRedFlagsWithRetry(payload, maxRetries = 5, delay = 5000, currentAttempt = 1) {
      return new Promise((resolve, reject) => {
        checkRedFlags(payload)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (currentAttempt >= maxRetries) {
              reject(error)
              return
            }
            setTimeout(() => {
              this.checkRedFlagsWithRetry(payload, maxRetries, delay, currentAttempt + 1)
                .then(resolve)
                .catch(reject)
            }, delay)
          })
      })
    },
    handleShowRedFlagsClick() {
      this.isShowRedFlags = !this.isShowRedFlags
      this.isFlaggedStylesEnabled = !this.isFlaggedStylesEnabled
      if (this.isShowRedFlags) {
        const responseFlags = this.compareRedFlags()
        if (
          (typeof responseFlags === 'object' && Object.keys(responseFlags).length === 0) ||
          (typeof responseFlags === 'boolean' && responseFlags)
        ) {
          this.redFlags = structuredClone(this.lastRedFlags[this.activeLanguage].flags)
          this.updateTemplateWithFlaggedStyles()
          return
        }
        //differentProperties = responseFlags
        this.isRedFlagsLoading = true
        this.$refs.refEmailTemplate.isEmailGenerating = true
        const redFlagsPromises = this.languagesPayload
          .filter((item) => item.languageTypeResourceId === this.activeLanguage)
          .map((item) => {
            const payload = {
              template: item.template,
              subject: item.subject,
              fromName: item.fromName,
              fromEmail: item.fromAddress,
              cc: item.ccAddresses,
              attachmentFileName: this.activeFileName,
              language:
                this.selectedLanguages.find((lang) => lang.value === item.languageTypeResourceId)
                  ?.text || ''
            }
            return this.checkRedFlagsWithRetry(payload)
              .then((res) => {
                const { cc, fromEmail, fromName, subject, template, attachmentFileName } =
                  res?.data ?? {}
                const redFlags = {
                  ccAddresses: cc,
                  fromAddress: fromEmail,
                  fromName: fromName,
                  subject: subject,
                  attachmentFileName: attachmentFileName
                }

                // Update item template and store red flags data
                item.template = template
                this.lastRedFlags[item.languageTypeResourceId] = {
                  flags: structuredClone(redFlags),
                  templates: [],
                  textfieldValues: {
                    fromName: item.fromName,
                    fromAddress: item.fromAddress,
                    subject: item.subject,
                    attachmentFileName: this.activeFileName
                  }
                }

                return {
                  languageTypeResourceId: item.languageTypeResourceId,
                  redFlags,
                  template
                }
              })
              .catch((e) => {
                if (!e?.response || e?.response?.status === 0) {
                  this.$store.dispatch('common/createSnackBar', {
                    message: `Network error while reaching https://r-flg.keepnetlabs.com. Status Code: 0`,
                    color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                    icon: 'mdi-alert-circle'
                  })
                } else {
                  this.$store.dispatch('common/createSnackBar', {
                    message:
                      e?.response?.data?.detail ||
                      e?.response?.data?.message ||
                      `Network error while reaching https://r-flg.keepnetlabs.com. Status Code: ${
                        e?.response?.status || e?.response?.data?.status || 0
                      }`,
                    color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                    icon: 'mdi-alert-circle'
                  })
                }
                this.isShowRedFlags = false
                this.isFlaggedStylesEnabled = false
                this.redFlags = structuredClone(defaultRedFlags)
              })
          })

        Promise.all(redFlagsPromises)
          .then((results) => {
            // Set red flags for active language
            const activeLanguageResult = results?.find(
              (result) => result?.languageTypeResourceId === this.activeLanguage
            )
            if (activeLanguageResult) {
              this.redFlags = structuredClone(activeLanguageResult.redFlags)
            }

            this.updateTemplateWithFlaggedStyles()
          })
          .finally(() => {
            this.$refs.refEmailTemplate.isEmailGenerating = false
            this.isRedFlagsLoading = false
          })
      } else {
        // CSS stillerini template'den kaldır
        this.lastRedFlags[this.activeLanguage] = {
          flags: structuredClone(this.redFlags),
          templates: [],
          textfieldValues: {
            fromName: this.getSelectedLanguagePayload.fromName,
            fromAddress: this.getSelectedLanguagePayload.fromAddress,
            subject: this.getSelectedLanguagePayload.subject,
            attachmentFileName: this.activeFileName
          }
        }
        this.redFlags = structuredClone(defaultRedFlags)
        this.updateTemplateWithFlaggedStyles()
      }
    },
    compareRedFlags() {
      let differentProperties = {}
      if (Object.keys(this.lastRedFlags).length === 0) return false
      const { templates = [], textfieldValues = {} } = this.lastRedFlags[this.activeLanguage] || {}
      const { fromName, fromAddress, subject, attachmentFileName } = textfieldValues
      const {
        fromName: fromCurrentName,
        fromAddress: fromCurrentAddress,
        subject: fromCurrentSubject
      } = this.getSelectedLanguagePayload

      if (fromName !== fromCurrentName) {
        differentProperties.fromName = fromCurrentName
      }
      if (fromAddress !== fromCurrentAddress) {
        differentProperties.fromAddress = fromCurrentAddress
      }
      if (subject !== fromCurrentSubject) {
        differentProperties.subject = fromCurrentSubject
      }
      if (this.activeFileName) {
        if (
          (attachmentFileName === '' && this.activeFileName) ||
          attachmentFileName !== this.activeFileName
        ) {
          differentProperties.attachmentFileName = this.activeFileName
        }
      }
      const templateExists = templates.find(
        (template) => template.trim() === this.selectedLanguagePayloadItemBeforeSave.template.trim()
      )
      if (!templateExists) {
        differentProperties.template = this.getSelectedLanguagePayload.template
      }
      if (Object.keys(differentProperties).length === 0) {
        return true
      }

      return differentProperties
    },
    showLocalizationErrorMessage(item) {
      this.$store.dispatch('common/createSnackBar', {
        message: `${item.error}`,
        color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
        icon: 'mdi-alert-circle'
      })
    },
    showLocalizationSuccessMessage(data) {
      if (!data || !data.length || this.isDefault) return

      let message = ''

      // Check if this is a relocalize operation
      if (this.isRelocalizeOperation) {
        message = `The ${this.relocalizeLanguageName} localization has been updated.`
        // Reset relocalize flags
        this.isRelocalizeOperation = false
        this.relocalizeLanguageName = ''
      } else {
        // Normal localization
        if (data.length === 1) {
          // Single language: "The [LANGUAGE] language was successfully localized."
          const languageName = this.getLanguageNameById(data[0].languageResourceId)
          message = `The ${languageName} language was successfully localized.`
        } else {
          // Multiple languages: "+n languages were successfully localized."
          message = `${data.length} languages were successfully localized.`
        }
      }

      this.$store.dispatch('common/createSnackBar', {
        message: message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
      })
    },
    getLanguageNameById(languageResourceId) {
      // Find language name from selectedLanguages or languageItems
      const language = this.selectedLanguages.find((lang) => lang.value === languageResourceId)
      if (language) {
        return language.text
      }

      // If not found in selectedLanguages, search in languageItems
      for (const group of this.languageItems) {
        if (group.children) {
          const foundLang = group.children.find((lang) => lang.value === languageResourceId)
          if (foundLang) {
            return foundLang.text
          }
        }
      }

      return 'Unknown'
    },
    showLanguageRemovedMessage(languageName) {
      const message = `The ${languageName} language has been removed.`
      this.$store.dispatch('common/createSnackBar', {
        message: message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
      })
    },
    updateTemplateWithFlaggedStyles() {
      if (!Array.isArray(this.languagesPayload)) return

      this.languagesPayload.forEach((languagePayload) => {
        if (!this._isValidLanguagePayload(languagePayload)) return

        if (this.isFlaggedStylesEnabled) {
          languagePayload.template = this._addFlaggedStylesToTemplate(languagePayload.template)
        } else {
          languagePayload.template = this._removeFlaggedStylesFromTemplate(languagePayload.template)
          this.lastRedFlags[this.activeLanguage]?.templates?.push(languagePayload.template)
        }
        if (languagePayload.languageTypeResourceId === this.activeLanguage) {
          this.selectedLanguagePayloadItemBeforeSave.template = languagePayload.template
          this.selectedLanguagePayloadItemBeforeSave.subject = languagePayload.subject
        }
      })
    },

    _isValidLanguagePayload(payload) {
      return payload && typeof payload.template === 'string' && payload.template.trim()
    },

    _isFullHtmlTemplate(template) {
      const htmlRegex = /<html[\s\S]*?>|<head[\s\S]*?>/i
      return htmlRegex.test(template)
    },

    _hasHeadTag(template) {
      return /<head[\s\S]*?>/i.test(template)
    },
    _addFlaggedStylesToTemplate(template) {
      // Prevent duplicate CSS injection
      if (template.includes(FLAGGED_AREA_CSS.trim())) {
        return template
      }

      if (this._isFullHtmlTemplate(template)) {
        return this._injectCssIntoHead(template)
      } else {
        return this._prependCssToBodyContent(template)
      }
    },

    _injectCssIntoHead(template) {
      if (this._hasHeadTag(template)) {
        // CSS'i head'e ekle, script'i body'ye ekle
        let templateWithCss = template.replace(/<\/head>/i, `${FLAGGED_AREA_CSS}</head>`)
        return this._injectScriptIntoBody(templateWithCss)
      }
      // If no head tag, create one
      let templateWithCss = template.replace(
        /<html[\s\S]*?>/i,
        `$&<head>${FLAGGED_AREA_CSS}</head>`
      )
      return this._injectScriptIntoBody(templateWithCss)
    },

    _prependCssToBodyContent(template) {
      // CSS'i başa ekle, script'i body'ye ekle
      let templateWithCss = `${FLAGGED_AREA_CSS}${template}`
      return this._injectScriptIntoBody(templateWithCss)
    },

    _injectScriptIntoBody(template) {
      const script = this._getPreventClickScript()
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(template, 'text/html')
        const body = doc.querySelector('body')

        if (body) {
          body.insertAdjacentHTML('beforeend', script)
          return doc.documentElement.outerHTML
        } else {
          // Body yoksa oluştur ve script'i ekle
          const newBody = doc.createElement('body')
          newBody.innerHTML = template
          newBody.insertAdjacentHTML('beforeend', script)
          doc.documentElement.appendChild(newBody)
          return doc.documentElement.outerHTML
        }
      } catch (error) {
        return template + script
      }
    },

    _removeFlaggedStylesFromTemplate(template) {
      const cssToRemove = FLAGGED_AREA_CSS.trim()
      const scriptToRemove = this._getPreventClickScript().trim()

      let cleanedTemplate = template.replaceAll(new RegExp(this._escapeRegExp(cssToRemove), 'g'), '')
      cleanedTemplate = cleanedTemplate.replaceAll(
        new RegExp(this._escapeRegExp(scriptToRemove), 'g'),
        ''
      )

      return cleanedTemplate
    },

    _removeRedFlagClassesAndAttributes(template) {
      let cleanedTemplate = template

      // Remove <style> tags containing flagged-area CSS
      cleanedTemplate = cleanedTemplate.replaceAll(
        /<style[^>]*>[\s\S]*?\.flagged-area[\s\S]*?<\/style>/gi,
        ''
      )

      // Remove flagged-area and flagged-area-img classes from elements
      cleanedTemplate = cleanedTemplate.replaceAll(
        /\s?class=["']([^"']*)["']/gi,
        (match, classContent) => {
          if (!classContent) return match
          const cleanedClasses = classContent
            .split(/\s+/)
            .filter((cls) => cls !== 'flagged-area' && cls !== 'flagged-area-img')
            .join(' ')
            .trim()
          return cleanedClasses ? ` class="${cleanedClasses}"` : ''
        }
      )

      // Remove data-flag-tooltip attributes
      cleanedTemplate = cleanedTemplate.replaceAll(/\s?data-flag-tooltip=["'][^"']*["']/gi, '')

      return cleanedTemplate
    },

    _getPreventClickScript() {
      // eslint-disable-next-line no-use-before-define
      const method = `(function() {
            'use strict';

            function initializeEventPrevention() {
              // Tüm event türlerini tanımla
              const eventTypes = [
                'click', 'auxclick', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
                'keydown', 'keyup', 'keypress', 'submit', 'change',
                'focus', 'blur', 'input', 'select', 'dragstart',
                'contextmenu'
              ];

              // Her event türü için body listener ekle
              eventTypes.forEach(eventType => {
                document.body.addEventListener(eventType, function(e) {
                  const flaggedElement = e.target.closest('.flagged-area');
                    // Event'i tamamen engelle
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, true); // Capture phase
              });
              ['click', 'auxclick'].forEach(anchorEvent => {
                document.body.addEventListener(anchorEvent, function(e) {
                  const anchor = e.target.closest('a');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    try { anchor.setAttribute('data-blocked', 'true'); } catch (_) {}
                    return false;
                }, true);
              });
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initializeEventPrevention);
            } else {
              // DOM zaten hazırsa hemen çalıştır
              initializeEventPrevention();
            }
          })();`
      //@ts-ignore
      //eslint-disable-next-line no-use-before-define
      return '<script>' + method + '<\/script>'
    },

    _escapeRegExp(string) {
      return string.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
  }
}
</script>
