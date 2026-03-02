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
                    <form-group
                      title="Email Template"
                      class-name="email-template mt-8 p-4"
                      onsubmit="return false"
                    >
                      <template #title>
                        <div class="d-flex align-center justify-space-between">
                          <div class="k-form-group__title">Email Template</div>
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
                      </template>
                      <email-template
                        ref="refEmailTemplate"
                        :template-type="QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL"
                        :active-block-manager-components="activeBlockManagerComponents"
                        :edit-items-disabled="editItemsDisabled"
                        :from-address.sync="formValues.fromAddress"
                        :from-name.sync="formValues.fromName"
                        :attachmentFiles.sync="formValues.attachmentFiles"
                        :importedEmailAttachments.sync="formValues.importedEmailAttachments"
                        :subject.sync="formValues.subject"
                        :template.sync="formValues.template"
                        :isAttachmentError="isAttachmentError"
                        :is-edit="!!isEdit"
                        :is-phishing-template="isAttachmentBasedTemplate"
                        :extensions="['doc', 'docx', 'html', 'htm', 'xls', 'xlsx', 'ppt', 'pptx']"
                        :size="5"
                        fileUploadHint="Only word, excel, powerpoint, html files. Max. file size 5MB"
                        @setAttachmentFile="setAttachmentFile"
                        @handleAttachmentRemove="handleAttachmentRemove"
                        @handleEditHtmlTemplate="formValues.template = $event"
                        @handleInitialTemplate="handleInitialTemplate"
                        @handleRenameAttachment="handleRenameAttachment"
                        @handleDeleteAttachment="handleDeleteAttachment"
                        @showErrorDialog="toggleQrCodeErrorDialog"
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
        :disabled-statuses="{
          nextButton: isSubmitDisabled,
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
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
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
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog.vue'
import { mapGetters } from 'vuex'
import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'
export default {
  name: 'NewQuishingEmailTemplatesModal',
  components: {
    DefaultErrorDialog,
    InputPhishingMethod,
    StepperFooter,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputSelectLanguage,
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
      formValues: {
        name: '',
        description: '',
        categoryResourceId: 'WNZt0sCVCWB3',
        tags: [],
        difficultyResourceId: 'mT0CeYGgKsVb',
        fromAddress: null,
        fromName: null,
        subject: null,
        template: null,
        attachmentFiles: [],
        importedEmailAttachments: [],
        attachmentFilesFromApi: [],
        languageTypeResourceId: '862249c19aad'
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
    getTitle() {
      if (this.isEdit && this.isDuplicate) {
        return 'Duplicate Email Template'
      }

      if (this.isEdit) {
        return 'Edit Email Template'
      }

      return 'New Email Template'
    },
    isAttachmentBasedTemplate() {
      return this.formValues.categoryResourceId === '7dLrW2kdBTDs'
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
        this.formValues = {
          ...response.data.data,
          description: response.data.data.description || '',
          attachmentFiles: response.data.data.phishingFile ? [response.data.data.phishingFile] : []
        }
        this.formValues.name = `${this.formValues.name}`
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        this.availableForRequests = getAvailableForValueFromList(
          response?.data?.data?.availableForList
        )
        if (this.formValues.attachments) {
          this.formValues.importedEmailAttachments = this.formValues.attachments.map((item) => ({
            ...item,
            isDeletable: true
          }))
          this.formValues.attachmentFilesFromApi = structuredClone(this.formValues.attachments)
        }
        if (response.data.data.phishingFileName) {
          this.formValues.attachmentFiles = [
            {
              fileName: response.data.data.phishingFileName,
              url: response.data.data.phishingFileUrl
            }
          ]
        }
        this.initialFormValues = structuredClone(this.formValues)
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
            this.formValues.attachmentFilesFromApi = structuredClone(attachments)
          }
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
      if (this.isAttachmentBasedTemplate && this.formValues.attachmentFiles.length === 0) {
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
      const payloadTemplate = this.formValues.template.replaceAll(qrCodeString, '{QRCODEURLIMAGE}')

      let payload = {
        ...this.formValues,
        template: payloadTemplate,
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
        )
      }
      delete payload.attachments
      if (this.isEdit && !this.isDuplicate) {
        QuishingService.updateQuishingEmailTemplate(payload, this.emailTemplateId)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        QuishingService.createQuishingEmailTemplate(payload)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
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
    }
  }
}
</script>
