<template>
  <app-modal :status="status" icon-name="mdi-email" :title="getTitle">
    <template #overlay-body>
      <DefaultErrorDialog
        v-if="isShowQrCodeErrorDialog"
        :status="isShowQrCodeErrorDialog"
        title="Warning"
        error-message="You must insert {QRCODEURLIMAGE} merge tag to your email design for quishing campaign to work correctly"
        @on-close="toggleQrCodeErrorDialog"
      />
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
                  subtitle="Select the quishing technique for this template"
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
                  sub-title="Select a detection difficulty level for this quishing email"
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
                      <EmailTemplate
                        ref="refEmailTemplate"
                        class="email-template-languages-settings-template-preview-container"
                        :template-type="QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL"
                        :is-ai-assistant="true"
                        :is-phishing-template="isAttachmentBasedTemplate"
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
                        :isAIAllyEnabled="true"
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
                        @showErrorDialog="toggleQrCodeErrorDialog"
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
                            @on-language-removed="handleLanguageRemoved"
                          />
                        </template>
                      </EmailTemplate>
                    </FormGroup>
                  </v-form>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :step.sync="step"
        :disabled-statuses="getDisabledStatuses"
        :ids="footerButtonsIds"
        @on-cancel="changeNewEmailTemplateModalStatus"
        @on-back="backStep(-1)"
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
import {
  MERGED_TEXTS,
  defaultRedFlags,
  EMAIL_TEMPLATE_DETAIL_ACTION_TYPES
} from '@/components/PhishingScenarios/utils'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import QuishingService, {
  checkQuishingRedFlags,
  generateQuishingTemplateTranslation,
  getQuishingTemplateTranslation
} from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog.vue'
import InputLanguagesSettings from '@/components/Common/Inputs/InputLanguagesSettings.vue'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import { scrollToEmailTemplateContent } from '@/components/Company Settings/utils'
import { mapGetters } from 'vuex'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'
export default {
  name: 'NewQuishingEmailTemplatesModal',
  components: {
    DefaultErrorDialog,
    EditLanguagesLeavingDialog,
    InputLanguagePreview,
    InputLanguagesSettings,
    InputPhishingMethod,
    StepperFooter,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputTag,
    InputEntityName,
    InputDescription
  },
  mixins: [useSetAttachmentFile],
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
    emailTemplateId: {
      type: String
    },
    scenarioDetailsLookup: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-edit-email-templates-modal',
        backButton: 'btn-back--add-or-edit-email-templates-modal',
        nextButton: 'btn-next--add-or-edit-email-templates-modal',
        saveButton: 'btn-save--add-or-edit-email-templates-modal'
      },
      isShowQrCodeErrorDialog: false,
      isRenameModalVisible: false,
      isShowRedFlags: false,
      isRedFlagsLoading: false,
      isFlaggedStylesEnabled: false,
      redFlags: structuredClone(defaultRedFlags),
      lastRedFlags: {},
      attachmentName: '',
      languageOptions: [],
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      availableForRequests: [],
      tagSearch: '',
      labels,
      step: 1,
      Validations,
      initialFormValues: {},
      editedLanguages: [],
      languageItems: [],
      isGenerateWithAIDisabled: false,
      isGenerateWithAi: false,
      isAssistedByAI: false,
      isPlainText: true,
      showEditLanguagesLeavingDialog: false,
      selectedLanguages: [],
      activeLanguage: '',
      isEverythingLocalized: false,
      languagesPayload: [],
      initialDisabledLanguageIds: [],
      aiAssistantRemainingRights: 0,
      aiAssistantTotalRights: 0,
      selectedLanguagePayloadItemBeforeSave: null,
      beforeSaveLanguage: '',
      isDefault: false,
      timeoutId: null,
      isRelocalizeOperation: false,
      relocalizeLanguageName: '',
      isEnhanceWithAi: false,
      formValues: {
        name: '',
        canRemoveLanguages: false,
        description: '',
        categoryResourceId: 'WNZt0sCVCWB3',
        tags: [],
        difficultyResourceId: 'mT0CeYGgKsVb',
        aiAssistant: false,
        attachmentFiles: [],
        importedEmailAttachments: [],
        attachmentFilesFromApi: []
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      editItemsDisabled: false,
      methodItems: [
        {
          resourceId: 'WNZt0sCVCWB3',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Click Only',
          code: '1',
          description: null,
          orderNumber: 1
        },
        {
          resourceId: 'DYC0gugxJMjT',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Data Submission',
          code: '2',
          description: null,
          orderNumber: 2
        }
      ],
      difficultyItems: [
        {
          resourceId: 'mT0CeYGgKsVb',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Easy',
          code: '1',
          description: null,
          orderNumber: 1
        },
        {
          resourceId: 'Z5XeVlpw6Dps',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Medium',
          code: '2',
          description: null,
          orderNumber: 2
        },
        {
          resourceId: 'c4LCGEB9MayB',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Hard',
          code: '3',
          description: null,
          orderNumber: 3
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    translatedLanguageResourceIds() {
      return this.languagesPayload
        .filter((item) => item && item.isTranslated)
        .map((item) => item.languageTypeResourceId)
    },
    getSelectedLanguagePayload() {
      return (
        this.languagesPayload.find(
          (item) => item.languageTypeResourceId === this.activeLanguage
        ) || {}
      )
    },
    getTitle() {
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
    getMethodTypeId() {
      return this.methodItems?.find(
        (item) => item.resourceId === this.formValues.categoryResourceId
      )?.code
    },
    isAttachmentBasedTemplate() {
      return this.formValues.categoryResourceId === '7dLrW2kdBTDs'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    redFlagsText() {
      return this.isShowRedFlags ? 'Hide Red Flags' : 'Show Red Flags'
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
        submitButton: this.isSubmitDisabled || this.isRedFlagsLoading
      }
    },
    activeFileName() {
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
    activeFileName(newVal, oldVal) {
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
      QuishingService.getEmailTemplatePreviewContent(this.emailTemplateId).then((response) => {
        if (response?.data?.data?.template) {
          response.data.data.template = response?.data?.data?.template?.replaceAll(
            '{QRCODEURLIMAGE}',
            qrCodeString
          )
        }
        if (response?.data?.data?.languages?.length) {
          response.data.data.languages.forEach((lang) => {
            if (lang?.template) {
              lang.template = lang.template.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
            }
          })
        }
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
          isTranslated: true
        })
        this.selectedLanguages.push({
          text:
            this.languageOptions.find(
              (item) => item.value === this.formValues.languageTypeResourceId
            )?.text || this.formValues.languageTypeName,
          value: this.formValues.languageTypeResourceId
        })
        if (response?.data?.data?.languages?.length) {
          response.data.data.languages.forEach((item) => {
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
          this.languagesPayload.forEach((item) => {
            item.template = body
            item.subject = subject
            item.fromName = fromName
            item.fromAddress = from
            item.isTranslated = item.languageTypeResourceId === this.getCompanyPreferredLanguageId
          })
          if (this.selectedLanguagePayloadItemBeforeSave) {
            this.selectedLanguagePayloadItemBeforeSave.template = body
            this.selectedLanguagePayloadItemBeforeSave.subject = subject
          }
          if (attachments) {
            attachments = attachments.map((item) => ({
              ...item,
              fileName: item.name,
              isDeletable: true
            }))
            this.formValues.importedEmailAttachments = attachments
            this.formValues.attachmentFilesFromApi = structuredClone(attachments)
          }
          delete this.lastRedFlags[this.activeLanguage]
          this.redFlags = structuredClone(defaultRedFlags)
          this.isShowRedFlags = false
          e.target.value = ''
        })
      }
    },
    handleAttachmentRemove({ item, index }) {
      this.formValues.attachmentFilesToRemove = item.fileName
      const newAttachmentFilesFromApi = structuredClone(this.formValues.attachmentFilesFromApi)
      if (this.formValues.attachmentFiles && this.formValues.attachmentFiles.length === 1) {
        newAttachmentFilesFromApi.splice(index - 1, 1)
        this.formValues.importedEmailAttachments.splice(index - 1, 1)
      } else {
        newAttachmentFilesFromApi.splice(index, 1)
        this.formValues.importedEmailAttachments.splice(index, 1)
      }
      this.formValues.attachmentFilesFromApi = newAttachmentFilesFromApi
    },
    handleInitialTemplate(value) {
      this.initialFormValues.template = value
    },
    handleEditHtmlTemplate(value) {
      if (this.getSelectedLanguagePayload) {
        this.getSelectedLanguagePayload.template = value
      }
    },
    handleSaveTemplate(template) {
      if (
        this.getSelectedLanguagePayload &&
        template.trim() !== (this.getSelectedLanguagePayload.template || '').trim()
      ) {
        delete this.lastRedFlags[this.activeLanguage]
        this.redFlags = structuredClone(defaultRedFlags)
        this.isShowRedFlags = false
      }
    },
    handleGenerateEmailTemplateSuccess({ template, subject }) {
      if (this.getSelectedLanguagePayload) {
        this.getSelectedLanguagePayload.isTranslated = true
      }
      if (this.selectedLanguagePayloadItemBeforeSave) {
        this.selectedLanguagePayloadItemBeforeSave.template = template
        this.selectedLanguagePayloadItemBeforeSave.subject = subject
      }
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
          detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.ADD,
          isTranslated: false
        }
      })
    },
    handleLanguageRemoved({ languageName }) {
      const message = `The ${languageName} language has been removed.`
      this.$store.dispatch('common/createSnackBar', {
        message: message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
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
      if (!isFormValid) {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }
      if (this.isShowRedFlags) {
        this.isShowRedFlags = false
        this.isFlaggedStylesEnabled = false
        this.updateTemplateWithFlaggedStyles()
        this.languagesPayload.forEach((languagePayload) => {
          if (this._isValidLanguagePayload(languagePayload)) {
            languagePayload.template = this._removeRedFlagClassesAndAttributes(
              languagePayload.template
            )
          }
        })
      }
      // QR code merge tag substitution back for all language templates
      this.languagesPayload.forEach((lang) => {
        if (lang?.template) {
          lang.template = this._removeFlaggedStylesFromTemplate(
            lang.template.replaceAll(qrCodeString, '{QRCODEURLIMAGE}')
          )
        }
      })
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
        QuishingService.updateQuishingEmailTemplate(payload, this.emailTemplateId)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        payload.languages = this.setEmptyLanguagesPayload()
        QuishingService.createQuishingEmailTemplate(payload)
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
    setEmptyLanguagesPayload() {
      const preferredLanguagePayload = this.getPreferredLanguagePayload()
      return this.languagesPayload.map((item) => {
        return {
          ...item,
          fromName: item.fromName || preferredLanguagePayload.fromName,
          fromAddress: item.fromAddress || preferredLanguagePayload.fromAddress,
          subject: item.subject || preferredLanguagePayload.subject,
          template: item.template || preferredLanguagePayload.template,
          ccAddresses:
            item.ccAddresses && item.ccAddresses.length
              ? item.ccAddresses
              : preferredLanguagePayload.ccAddresses
        }
      })
    },
    getPreferredLanguagePayload() {
      let preferredLanguagePayload = this.languagesPayload.find(
        (item) =>
          item.languageTypeResourceId === this.scenarioDetailsLookup?.companyLanguageTypeResourceId
      )
      if (preferredLanguagePayload?.fromName && preferredLanguagePayload?.fromAddress)
        return preferredLanguagePayload
      preferredLanguagePayload = this.languagesPayload.find(
        (item) => item?.fromName && item?.fromAddress
      )
      return preferredLanguagePayload || this.languagesPayload[0] || {}
    },
    callForMergedTags() {
      QuishingService.getMergedTextForQuishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName || language.name,
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
    toggleQrCodeErrorDialog() {
      this.isShowQrCodeErrorDialog = !this.isShowQrCodeErrorDialog
    },
    handleEditModeClick() {
      this.$refs.refEmailTemplate.toggleShowGrapesModal()
    },
    handleGrapesModalStatus() {
      this.isFlaggedStylesEnabled = false
      this.updateTemplateWithFlaggedStyles()
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
      this.isGenerateWithAi = true
      this.isGenerateWithAIDisabled = true
      if (this.$refs.refEmailTemplate) this.$refs.refEmailTemplate.isEmailGenerating = true
      this.isRelocalizeOperation = true
      this.relocalizeLanguageName = language.text
      generateQuishingTemplateTranslation({ languages, template, subject })
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
    handleGenerateWithAI() {
      this.isGenerateWithAi = true
      this.isGenerateWithAIDisabled = true
      if (this.$refs.refEmailTemplate) this.$refs.refEmailTemplate.isEmailGenerating = true
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
      scrollToEmailTemplateContent()
      generateQuishingTemplateTranslation({
        languages: languagesToLocalize.map((item) => ({
          languageResourceId: item.value,
          languageName: item.text
        })),
        template,
        subject
      }).then((response) => {
        if (!response?.data?.data?.isSuccess) {
          this.resetGenerateWithAIDisabled()
          return
        }
        this.isEverythingLocalized = false
        this.askForEmailTemplateTranslation()
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
        this.resetGenerateWithAIDisabled(timeoutId)
        this.languagesPayload.forEach((lPayload) => {
          if (!lPayload.isTranslated) {
            lPayload.template = '<div style="height:300px"></div>'
          }
        })
        return
      }
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        getQuishingTemplateTranslation()
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

            if (this.isDefault && this.selectedLanguagePayloadItemBeforeSave) {
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
              languagePayload.template = item.template
              languagePayload.subject = item.subject || languagePayload.subject
              languagePayload.isTranslated = true
            })
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
      if (this.$refs.refEmailTemplate) this.$refs.refEmailTemplate.isEmailGenerating = false
      this.isSubmitDisabled = false
      this.isDefault = false
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
      const beforeTemplate = (
        this.selectedLanguagePayloadItemBeforeSave?.template || ''
      ).trim()
      const currentTemplate = (this.getSelectedLanguagePayload?.template || '').trim()
      if (JSON.stringify(beforeTemplate) === JSON.stringify(currentTemplate)) {
        this.activeLanguage = value
        this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
          JSON.stringify(this.getSelectedLanguagePayload)
        )
        return
      }
      if (this.$refs.refInputLanguagePreview?.$refs?.refSelect?.$refs?.refComponent) {
        this.$refs.refInputLanguagePreview.$refs.refSelect.$refs.refComponent.initialValue = this.activeLanguage
        this.$refs.refInputLanguagePreview.$refs.refSelect.$refs.refComponent.lazyValue = this.activeLanguage
      }
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
      if (selectedTemplateIndex !== -1 && this.selectedLanguagePayloadItemBeforeSave) {
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
      if (this.isRelocalizeOperation) {
        message = `The ${this.relocalizeLanguageName} localization has been updated.`
        this.isRelocalizeOperation = false
        this.relocalizeLanguageName = ''
      } else {
        if (data.length === 1) {
          const languageName = this.getLanguageNameById(data[0].languageResourceId)
          message = `The ${languageName} language was successfully localized.`
        } else {
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
      const language = this.selectedLanguages.find((lang) => lang.value === languageResourceId)
      if (language) return language.text
      for (const group of this.languageItems) {
        if (group.children) {
          const foundLang = group.children.find((lang) => lang.value === languageResourceId)
          if (foundLang) return foundLang.text
        }
      }
      return 'Unknown'
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
        this.isRedFlagsLoading = true
        if (this.$refs.refEmailTemplate) this.$refs.refEmailTemplate.isEmailGenerating = true
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
                this.selectedLanguages.find(
                  (lang) => lang.value === item.languageTypeResourceId
                )?.text || ''
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
                const redFlagServiceUrl =
                  'quishing-red-flag.keepnet-labs-ltd-business-profile4086.workers.dev'
                if (!e?.response || e?.response?.status === 0) {
                  this.$store.dispatch('common/createSnackBar', {
                    message: `Network error while reaching https://${redFlagServiceUrl}. Status Code: 0`,
                    color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                    icon: 'mdi-alert-circle'
                  })
                } else {
                  this.$store.dispatch('common/createSnackBar', {
                    message:
                      e?.response?.data?.detail ||
                      e?.response?.data?.message ||
                      `Network error while reaching https://${redFlagServiceUrl}. Status Code: ${
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
            const activeLanguageResult = results?.find(
              (result) => result?.languageTypeResourceId === this.activeLanguage
            )
            if (activeLanguageResult) {
              this.redFlags = structuredClone(activeLanguageResult.redFlags)
            }
            this.updateTemplateWithFlaggedStyles()
          })
          .finally(() => {
            if (this.$refs.refEmailTemplate) this.$refs.refEmailTemplate.isEmailGenerating = false
            this.isRedFlagsLoading = false
          })
      } else {
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
      const { templates = [], textfieldValues = {} } =
        this.lastRedFlags[this.activeLanguage] || {}
      const { fromName, fromAddress, subject, attachmentFileName } = textfieldValues
      const {
        fromName: fromCurrentName,
        fromAddress: fromCurrentAddress,
        subject: fromCurrentSubject
      } = this.getSelectedLanguagePayload
      if (fromName !== fromCurrentName) differentProperties.fromName = fromCurrentName
      if (fromAddress !== fromCurrentAddress) differentProperties.fromAddress = fromCurrentAddress
      if (subject !== fromCurrentSubject) differentProperties.subject = fromCurrentSubject
      if (this.activeFileName) {
        if (
          (attachmentFileName === '' && this.activeFileName) ||
          attachmentFileName !== this.activeFileName
        ) {
          differentProperties.attachmentFileName = this.activeFileName
        }
      }
      const templateExists = templates.find(
        (template) =>
          template.trim() === (this.selectedLanguagePayloadItemBeforeSave?.template || '').trim()
      )
      if (!templateExists) {
        differentProperties.template = this.getSelectedLanguagePayload.template
      }
      if (Object.keys(differentProperties).length === 0) return true
      return differentProperties
    },
    checkRedFlagsWithRetry(payload, maxRetries = 5, delay = 5000, currentAttempt = 1) {
      return new Promise((resolve, reject) => {
        checkQuishingRedFlags(payload)
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
        if (
          languagePayload.languageTypeResourceId === this.activeLanguage &&
          this.selectedLanguagePayloadItemBeforeSave
        ) {
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
      if (template.includes(FLAGGED_AREA_CSS.trim())) return template
      if (this._isFullHtmlTemplate(template)) {
        return this._injectCssIntoHead(template)
      } else {
        return this._prependCssToBodyContent(template)
      }
    },
    _injectCssIntoHead(template) {
      if (this._hasHeadTag(template)) {
        let templateWithCss = template.replace(/<\/head>/i, `${FLAGGED_AREA_CSS}</head>`)
        return this._injectScriptIntoBody(templateWithCss)
      }
      let templateWithCss = template.replace(
        /<html[\s\S]*?>/i,
        `$&<head>${FLAGGED_AREA_CSS}</head>`
      )
      return this._injectScriptIntoBody(templateWithCss)
    },
    _prependCssToBodyContent(template) {
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
          const newBody = doc.createElement('body')
          newBody.innerHTML = template
          newBody.insertAdjacentHTML('beforeend', script)
          doc.documentElement.appendChild(newBody)
          return doc.documentElement.outerHTML
        }
      } catch {
        return `${template}${script}`
      }
    },
    _removeFlaggedStylesFromTemplate(template) {
      if (!template) return template
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
      cleanedTemplate = cleanedTemplate.replaceAll(
        /<style[^>]*>[\s\S]*?\.flagged-area[\s\S]*?<\/style>/gi,
        ''
      )
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
      cleanedTemplate = cleanedTemplate.replaceAll(/\s?data-flag-tooltip=["'][^"']*["']/gi, '')
      return cleanedTemplate
    },
    _getPreventClickScript() {
      // eslint-disable-next-line no-use-before-define
      const method = `(function() {
            'use strict';

            function initializeEventPrevention() {
              const eventTypes = [
                'click', 'auxclick', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
                'keydown', 'keyup', 'keypress', 'submit', 'change',
                'focus', 'blur', 'input', 'select', 'dragstart',
                'contextmenu'
              ];

              eventTypes.forEach(eventType => {
                document.body.addEventListener(eventType, function(e) {
                  const flaggedElement = e.target.closest('.flagged-area');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, true);
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
