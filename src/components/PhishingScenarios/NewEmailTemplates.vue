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
                      <EmailTemplate
                        ref="refEmailTemplate"
                        class="email-template-languages-settings-template-preview-container"
                        :is-ai-assistant="true"
                        :is-phishing-template="true"
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
                        fileUploadHint="Only word, excel, powerpoint, html files. Max. file size 5MB"
                        @setAttachmentFile="setAttachmentFile"
                        @handleAttachmentRemove="handleAttachmentRemove"
                        @handleEditHtmlTemplate="handleEditHtmlTemplate"
                        @handleInitialTemplate="handleInitialTemplate"
                        @handleRenameAttachment="handleRenameAttachment"
                        @handleDeleteAttachment="handleDeleteAttachment"
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
                            :is-generate-with-a-i-disabled="isGenerateWithAIDisabled"
                            :language-items="languageItems"
                            :show-red-flags="isShowRedFlags"
                            @input="handleSelectedLanguagesChange"
                            @on-generate-with-ai="handleGenerateWithAI"
                            @on-edit-mode-click="handleEditModeClick"
                            @on-upload-email-button-click="handleUploadEmailButtonClick"
                            @on-show-red-flags-click="handleShowRedFlagsClick"
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
        :disabled-statuses="{
          nextButton: !isDefault && isSubmitDisabled,
          submitButton: isSubmitDisabled
        }"
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
import {
  createPhishingEmailTemplate,
  getEmailTemplatePreviewContent,
  getMergedTextForPhishing,
  updatePhishingEmailTemplate,
  generateEmailTemplateTranslation,
  getEmailTemplateTranslation
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import EditLanguagesLeavingDialog from '@/components/PhishingScenarios/EditLanguagesLeavingDialog.vue'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import { parseEmailOrMessageFile } from '@/api/file'
import StepperFooter from '@/components/Stepper/StepperFooter'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import { mapGetters } from 'vuex'
import {
  getEmailTemplateMethodItems,
  EMAIL_TEMPLATE_DETAIL_ACTION_TYPES,
  EMAIL_TEMPLATE_DIFFICULTY_ITEMS,
  MERGED_TEXTS
} from './utils'
import InputLanguagesSettings from '@/components/Common/Inputs/InputLanguagesSettings.vue'
import InputLanguagePreview from '../Common/Inputs/InputLanguagePreview.vue'
import { scrollToEmailTemplateContent } from '@/components/Company Settings/utils'
import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'
export default {
  name: 'NewEmailTemplates',
  components: {
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
    let methodItems = JSON.parse(JSON.stringify(getEmailTemplateMethodItems()))
    let categoryResourceId = 'WNZt0sCVCWB3'
    if (this.selectedMethodText) {
      if (this.selectedMethodText === 'MFA') {
        methodItems = methodItems.filter((mItem) => mItem.name !== 'Attachment')
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
      isPlainText: false,
      isRenameModalVisible: false,
      showEditLanguagesLeavingDialog: false,
      isShowRedFlags: false,
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
      Validations,
      initialFormValues: {},
      formValues: {
        name: '',
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
      timeoutId: null
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getSelectedLanguagePayload() {
      return (
        this.languagesPayload.find((item) => item.languageTypeResourceId === this.activeLanguage) ||
        {}
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
    isAttachmentBasedTemplate() {
      return this.formValues.categoryResourceId === '7dLrW2kdBTDs'
    },
    getMethodTypeId() {
      return this.methodItems?.find(
        (item) => item.resourceId === this.formValues.categoryResourceId
      )?.code
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    }
  },
  watch: {
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
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
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
          localizationResourceId: this.formValues.localizationResourceId
        })
        this.selectedLanguages.push({
          text: this.formValues.languageTypeName,
          value: this.formValues.languageTypeResourceId
        })
        if (response?.data?.data?.languages.length) {
          response?.data?.data?.languages.forEach((item) => {
            this.selectedLanguages.push({
              text: item.languageTypeName,
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
              resourceId: item.resourceId
            })
          })
        }
        this.activeLanguage = this.formValues.languageTypeResourceId
        this.editedLanguages = JSON.parse(JSON.stringify(this.languagesPayload))
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
        this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
          JSON.stringify(this.getSelectedLanguagePayload)
        )
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
    setLanguageItems() {
      const languageTypes = this.scenarioDetailsLookup?.languageTypes || []
      const preferredLanguageTypes = this.scenarioDetailsLookup?.preferredLanguageTypes || []
      const companyLanguageTypeResourceId =
        this.scenarioDetailsLookup?.companyLanguageTypeResourceId || ''
      const languageItems = []
      languageItems.push({
        value: 1,
        text: 'Preferred Languages',
        children: preferredLanguageTypes
      })
      languageItems.push({
        value: 5,
        text: 'All Languages',
        children: languageTypes.filter(
          (item) => !preferredLanguageTypes?.find((pItem) => pItem.value === item.value)
        )
      })
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
          })
          if (attachments) {
            attachments = attachments.map((item) => ({
              ...item,
              fileName: item.name,
              isDeletable: true
            }))
            this.formValues.importedEmailAttachments = attachments
            this.formValues.attachmentFilesFromApi = JSON.parse(JSON.stringify(attachments))
          }
        })
      }
    },
    handleAttachmentRemove({ item, index }) {
      this.formValues.attachmentFilesToRemove = item.fileName
      const newAttachmentFilesFromApi = JSON.parse(
        JSON.stringify(this.formValues.attachmentFilesFromApi)
      )
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
    handleSelectedLanguagesChange(languages) {
      this.languagesPayload = languages.map((language) => {
        const item = this.languagesPayload.find(
          (item) => item.languageTypeResourceId === language.value
        )
        if (item) return item
        return {
          languageTypeResourceId: language.value,
          subject: '',
          fromName: '',
          fromAddress: '',
          ccAddresses: [],
          template: this.initialFormValues.template,
          prompt: '',
          toneResourceId: '',
          localizationResourceId: '',
          detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.ADD
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
    callForMergedTags() {
      getMergedTextForPhishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
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
            text: language.name,
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
    handleGenerateWithAI() {
      this.isGenerateWithAi = true
      this.isGenerateWithAIDisabled = true
      this.$refs.refEmailTemplate.isEmailGenerating = true
      let template = this.getSelectedLanguagePayload.template
      let subject = this.getSelectedLanguagePayload.subject
      this.isSubmitDisabled = true
      scrollToEmailTemplateContent()
      generateEmailTemplateTranslation({
        languages: this.selectedLanguages
          .filter((item) => this.isDefault || item.value !== this.activeLanguage)
          .map((item) => ({
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
        this.askForEmailTemplateTranslation()
      })
    },
    askForEmailTemplateTranslation(count = 0, maxCount = 20, timeoutId = 0) {
      if (count >= maxCount) {
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
            data.forEach((item) => {
              const languagePayload = this.languagesPayload.find(
                (language) => language.languageTypeResourceId === item.languageResourceId
              )
              if (!languagePayload) return
              languagePayload.template = item.template
              languagePayload.subject = item.subject || languagePayload.subject
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
                  if (selectedElement.classList.contains('executive-widget-container--active'))
                    selectedElement.classList.remove('executive-widget-container--active')
                  setTimeout(
                    () => selectedElement.classList.add('executive-widget-container--active'),
                    500
                  )
                }
              })
            })
            this.resetGenerateWithAIDisabled(timeoutId)
          })
          .catch(() => {
            this.askForEmailTemplateTranslation(count + 1, maxCount, timeoutId)
          })
      }, 5000)
    },
    resetGenerateWithAIDisabled(timeoutId) {
      this.isGenerateWithAi = false
      this.isGenerateWithAIDisabled = false
      this.$refs.refEmailTemplate.isEmailGenerating = false
      this.isSubmitDisabled = false
      this.isDefault = false
      clearTimeout(timeoutId)
    },
    handleActiveLanguageChange(value) {
      if (
        JSON.stringify(this.selectedLanguagePayloadItemBeforeSave) ===
        JSON.stringify(this.getSelectedLanguagePayload)
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
    handleShowRedFlagsClick() {
      this.isShowRedFlags = !this.isShowRedFlags
    }
  }
}
</script>
