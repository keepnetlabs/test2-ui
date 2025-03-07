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
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Email Settings</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Create your email template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-form ref="refEmailTemplateContent" style="padding-right: 72px;">
                    <FormGroup
                      class-name="mt-8"
                      title="Languages Settings"
                      sub-title="Choose a language for automatic localization; 178 languages are supported."
                    >
                      <InputLanguagesSettings />
                    </FormGroup>
                    <form-group
                      title="Email Template"
                      class-name="email-template mt-8 p-4"
                      onsubmit="return false"
                    >
                      <div>
                        <div class="d-flex align-baseline justify-space-between mb-3">
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
                        :is-ai-assistant="true"
                        :active-block-manager-components="activeBlockManagerComponents"
                        :edit-items-disabled="editItemsDisabled"
                        :from-address.sync="formValues.fromAddress"
                        :cc-addresses.sync="formValues.ccAddresses"
                        :from-name.sync="formValues.fromName"
                        :attachmentFiles.sync="formValues.attachmentFiles"
                        :importedEmailAttachments.sync="formValues.importedEmailAttachments"
                        :subject.sync="formValues.subject"
                        :template.sync="formValues.template"
                        :ai-assistant.sync="formValues.aiAssistant"
                        :ai-assistant-remaining-right.sync="aiAssistantRemainingRights"
                        :ai-assistant-total-right="aiAssistantTotalRights"
                        :isAttachmentError="isAttachmentError"
                        :is-edit="!!isEdit"
                        :is-phishing-template="isAttachmentBasedTemplate"
                        :isEmailTemplate="true"
                        :extensions="['doc', 'docx', 'html', 'htm', 'xls', 'xlsx', 'ppt', 'pptx']"
                        :size="5"
                        :language-type-resource-id.sync="formValues.languageTypeResourceId"
                        :is-assisted-by-a-i-template.sync="isAssistedByAI"
                        :isAIAllyEnabled="isAIAllyEnabled"
                        :method-type-id="getMethodTypeId"
                        :prompt.sync="formValues.prompt"
                        :toneResourceId.sync="formValues.toneResourceId"
                        :localizationResourceId.sync="formValues.localizationResourceId"
                        :language-options="languageOptions"
                        :selected-method="getSelectedMethod"
                        :is-plain-text.sync="isPlainText"
                        fileUploadHint="Only word, excel, powerpoint, html files. Max. file size 5MB"
                        @setAttachmentFile="setAttachmentFile"
                        @handleAttachmentRemove="handleAttachmentRemove"
                        @handleEditHtmlTemplate="formValues.template = $event"
                        @handleInitialTemplate="handleInitialTemplate"
                        @handleRenameAttachment="handleRenameAttachment"
                        @handleDeleteAttachment="handleDeleteAttachment"
                      />
                    </form-group>
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
        :disabled-statuses="{ nextButton: isSubmitDisabled, submitButton: isSubmitDisabled }"
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
  updatePhishingEmailTemplate
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import { parseEmailOrMessageFile } from '@/api/file'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { MERGED_TEXTS } from '@/components/PhishingScenarios/utils'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import { mapGetters } from 'vuex'
import { getEmailTemplateMethodItems } from './utils'
import InputLanguagesSettings from '@/components/Common/Inputs/InputLanguagesSettings.vue'
export default {
  name: 'NewEmailTemplates',
  components: {
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
      isAttachmentError: false,
      isAssistedByAI: false,
      isPlainText: false,
      isPhishingFileModified: false,
      isAddedNewPhishingFile: false,
      isRenameModalVisible: false,
      attachmentName: '',
      languageOptions: [],
      selectedLanguages: [],
      treeSelectLanguageOptions: [
        {
          id: 'PreferredLanguages',
          label: 'Preferred Languages',
          children: [
            {
              id: 'English',
              label: 'English'
            }
          ]
        },
        {
          id: 'AllLanguages',
          label: 'All Languages',
          children: [
            {
              id: 'Turkish',
              label: 'Turkish'
            }
          ]
        }
      ],
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
        fromAddress: null,
        ccAddresses: [],
        fromName: null,
        subject: null,
        template: null,
        aiAssistant: false,
        attachmentFiles: [],
        importedEmailAttachments: [],
        attachmentFilesFromApi: [],
        languageTypeResourceId: '862249c19aad',
        prompt: '',
        toneResourceId: '',
        localizationResourceId: ''
      },
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
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
    if (!(this.isEdit || this.isDuplicate)) {
      const preferredLanguageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
      this.formValues.languageTypeResourceId = preferredLanguageTypeResourceId
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
          this.formValues.fromAddress = from
          this.formValues.template = body
          this.formValues.subject = subject
          this.formValues.fromName = fromName
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
    setAttachmentFile(file) {
      if (Array.isArray(file) && file.length === 0) return
      if (file && !file.type) {
        let newFile = null
        let fileExtension = ''
        if (file?.name.includes('.')) {
          fileExtension = file?.name?.split('.')?.pop()
        }
        if (fileExtension === '.doc') {
          newFile = new File([file], file.name, { type: 'application/msword' })
        } else if (fileExtension === 'docx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
        } else if (fileExtension === 'ppt') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.ms-powerpoint'
          })
        } else if (fileExtension === 'pptx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          })
        }
        this.formValues.attachmentFiles = Array.isArray(newFile) ? newFile : [newFile] || []
        this.isAttachmentError = false
      } else {
        this.formValues.attachmentFiles = Array.isArray(file) ? file : [file] || []
        this.isAttachmentError = false
      }
      this.isPhishingFileModified = true
      this.isAddedNewPhishingFile = true
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
        isPlainText: !this.isPlainText
      }
      delete payload.attachments
      if (this.isEdit && !this.isDuplicate) {
        updatePhishingEmailTemplate(payload, this.emailTemplateId)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
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
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({ text: language.name, value: language.resourceId })) || []
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
    }
  }
}
</script>
