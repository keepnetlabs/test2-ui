<template>
  <app-modal
    :status="status"
    icon-name="mdi-email"
    :title="
      !isEdit
        ? 'New Email Template'
        : isDuplicate
        ? 'Duplicate Email Template'
        : 'Edit Email Template'
    "
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
                <form-group title="Template Name" has-hint class-name="mt-8">
                  <InputEntityName
                    v-model.trim="formValues.name"
                    id="input--new-email-templates-template-name"
                    entityName="template name"
                    initialPlaceholder="Enter a name"
                    :disabled="editItemsDisabled"
                  />
                </form-group>
                <form-group title="Description" sub-title="Describe the template briefly">
                  <InputDescription
                    v-model.trim="formValues.description"
                    id="input--new-email-templates-description"
                    initialPlaceholder="Description"
                    rows="2"
                    height="100"
                    :maxLength="300"
                  />
                </form-group>
                <form-group
                  title="Method"
                  sub-title="Select the phishing technique for this template"
                  has-hint
                >
                  <k-select
                    v-bind="commonRules"
                    v-model.trim="formValues.categoryResourceId"
                    :items="methodItems"
                    item-disabled="disabled"
                    item-text="name"
                    item-value="resourceId"
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
                            {{ item.name }}
                          </div>
                          <div class="mail-configuration-select-sources__item-right-platform">
                            {{
                              item.name === 'Click Only'
                                ? 'See who falls for phishing links'
                                : item.name === 'Data Submission'
                                ? 'Gather information from users'
                                : 'Send a trackable file '
                            }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </k-select>
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
                    <form-group
                      title="Email Template"
                      class-name="email-template mt-8 p-4"
                      onsubmit="return false"
                    >
                      <template #title>
                        <div style="display: flex; justify-content: space-between;">
                          <label class="k-form-group__title">Email Template</label>
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
                        :active-block-manager-components="activeBlockManagerComponents"
                        :edit-items-disabled="editItemsDisabled"
                        :from-address.sync="formValues.fromAddress"
                        :from-name.sync="formValues.fromName"
                        :attachmentFiles.sync="formValues.attachmentFiles"
                        :importedEmailAttachments.sync="formValues.importedEmailAttachments"
                        :subject.sync="formValues.subject"
                        :template.sync="formValues.template"
                        :is-edit="!!isEdit"
                        :is-phishing-template="isAttachmentBasedTemplate"
                        :extensions="['doc', 'docx', 'html', 'htm']"
                        :size="2"
                        fileUploadHint="Only word and html files. Max. file size 2MB"
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
import KSelect from '@/components/Common/Inputs/KSelect'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
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
import fullName from '@/components/GrapesJs/Newsletter/mergedTexts/fullName'
import userName from '@/components/GrapesJs/Newsletter/mergedTexts/userName'
import passwordURL from '@/components/GrapesJs/Newsletter/mergedTexts/passwordURL'
import postDate from '@/components/GrapesJs/Newsletter/mergedTexts/postDate'
import shareUserName from '@/components/GrapesJs/Newsletter/mergedTexts/shareUserName'
import companyName from '@/components/GrapesJs/Newsletter/mergedTexts/companyName'
import communityName from '@/components/GrapesJs/Newsletter/mergedTexts/communityName'
import communityDescription from '@/components/GrapesJs/Newsletter/mergedTexts/communityDescription'
import postTitle from '@/components/GrapesJs/Newsletter/mergedTexts/postTitle'
import postDesc from '@/components/GrapesJs/Newsletter/mergedTexts/postDesc'
import postUserName from '@/components/GrapesJs/Newsletter/mergedTexts/postUserName'
import postCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/postCompanyName'
import webUrl from '@/components/GrapesJs/Newsletter/mergedTexts/webUrl'
import postUrl from '@/components/GrapesJs/Newsletter/mergedTexts/postUrl'
import currentDate from '@/components/GrapesJs/Newsletter/mergedTexts/currentDate'
import description from '@/components/GrapesJs/Newsletter/mergedTexts/description'
import shareCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/shareCompanyName'
import link from '@/components/GrapesJs/Newsletter/mergedTexts/link'
import communityTitle from '@/components/GrapesJs/Newsletter/mergedTexts/communityTitle'
import communityUser from '@/components/GrapesJs/Newsletter/mergedTexts/communityUser'
import category from '@/components/GrapesJs/Newsletter/mergedTexts/category'
import communityDesc from '@/components/GrapesJs/Newsletter/mergedTexts/communityDesc'
import status from '@/components/GrapesJs/Newsletter/mergedTexts/status'
import activeUsers from '@/components/GrapesJs/Newsletter/mergedTexts/activeUsers'
import analysedEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysedEmail'
import foundEmailCount from '@/components/GrapesJs/Newsletter/mergedTexts/foundEmailCount'
import startedBy from '@/components/GrapesJs/Newsletter/mergedTexts/startedBy'
import startDate from '@/components/GrapesJs/Newsletter/mergedTexts/startDate'
import investigationName from '@/components/GrapesJs/Newsletter/mergedTexts/investigationName'
import invitedUserName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedUserName'
import invitedByCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedByCompanyName'
import communityUrl from '@/components/GrapesJs/Newsletter/mergedTexts/communityUrl'
import memberCount from '@/components/GrapesJs/Newsletter/mergedTexts/memberCount'
import communityIndustry from '@/components/GrapesJs/Newsletter/mergedTexts/communityIndustry'
import analysisEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysisEmail'
import owner from '@/components/GrapesJs/Newsletter/mergedTexts/owner'
import date from '@/components/GrapesJs/Newsletter/mergedTexts/date'
import reportBy from '@/components/GrapesJs/Newsletter/mergedTexts/reportBy'
import fromText from '@/components/GrapesJs/Newsletter/mergedTexts/from'
import to from '@/components/GrapesJs/Newsletter/mergedTexts/to'
import subject from '@/components/GrapesJs/Newsletter/mergedTexts/subject'
import attachment from '@/components/GrapesJs/Newsletter/mergedTexts/attachment'
import createDate from '@/components/GrapesJs/Newsletter/mergedTexts/createDate'
import senderIP from '@/components/GrapesJs/Newsletter/mergedTexts/senderIP'
import caseID from '@/components/GrapesJs/Newsletter/mergedTexts/caseID'
import userEmail from '@/components/GrapesJs/Newsletter/mergedTexts/userEmail'
import userAgent from '@/components/GrapesJs/Newsletter/mergedTexts/userAgent'
import actionDate from '@/components/GrapesJs/Newsletter/mergedTexts/actionDate'
import actionIP from '@/components/GrapesJs/Newsletter/mergedTexts/actionIP'
import productName from '@/components/GrapesJs/Newsletter/mergedTexts/productName'
import analysisDetailUrl from '@/components/GrapesJs/Newsletter/mergedTexts/analysisDetailUrl'
import investigationUrl from '@/components/GrapesJs/Newsletter/mergedTexts/investigationUrl'
import companyLogo from '@/components/GrapesJs/Newsletter/mergedTexts/companyLogo'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import dateEmailSent from '@/components/GrapesJs/Newsletter/mergedTexts/dateEmailSent'
import emailMergedText from '@/components/GrapesJs/Newsletter/mergedTexts/emailMergedText'
import firstName from '@/components/GrapesJs/Newsletter/mergedTexts/firstName'
import fromEmail from '@/components/GrapesJs/Newsletter/mergedTexts/fromEmail'
import fromName from '@/components/GrapesJs/Newsletter/mergedTexts/fromName'
import lastName from '@/components/GrapesJs/Newsletter/mergedTexts/lastName'
import phishingUrl from '@/components/GrapesJs/Newsletter/mergedTexts/phishingUrl'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import { parseEmailOrMessageFile } from '@/api/file'
import StepperFooter from '@/components/Stepper/StepperFooter'

export default {
  name: 'NewEmailTemplates',
  components: {
    StepperFooter,
    KSelect,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputSelectLanguage,
    InputTag,
    InputEntityName,
    InputDescription
  },
  data() {
    return {
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-edit-email-templates-modal',
        backButton: 'btn-back--add-or-edit-email-templates-modal',
        nextButton: 'btn-next--add-or-edit-email-templates-modal',
        saveButton: 'btn-save--add-or-edit-email-templates-modal'
      },
      isPhishingFileModified: false,
      isAddedNewPhishingFile: false,
      isRenameModalVisible: false,
      attachmentName: '',
      languageOptions: [],
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      nonEditableAvailableForRequests: [],
      availableForRequests: [],
      tagSearch: '',
      labels,
      step: 1,
      Validations: Validations,
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
        },
        {
          resourceId: '7dLrW2kdBTDs',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Attachment',
          code: '3',
          description: null,
          orderNumber: 3
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
    emailTemplateId: {
      type: String
    }
  },
  methods: {
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
        const fileExtension = file.name ? file.name.substring(file.name.length - 4) : ''
        if (fileExtension === '.doc') {
          newFile = new File([file], file.name, { type: 'application/msword' })
        } else if (fileExtension === 'docx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
        }
        this.formValues.attachmentFiles = Array.isArray(newFile) ? newFile : [newFile] || []
      } else {
        this.formValues.attachmentFiles = Array.isArray(file) ? file : [file] || []
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
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewEmailTemplateModalStatus', false)
        }
      })
    },
    nextStep() {
      let isValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refFormStep1.validate() && isValid) {
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
      this.isSubmitDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refEmailTemplateContent.validate() && isValid) {
        let payload = {
          ...this.formValues,
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
          updatePhishingEmailTemplate(payload, this.emailTemplateId)
            .then(() => {
              this.$emit('changeNewEmailTemplateModalStatus', false, true)
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        } else {
          createPhishingEmailTemplate(payload)
            .then(() => {
              this.$emit('changeNewEmailTemplateModalStatus', false, true)
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
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
      switch (item) {
        case '{FULLNAME}':
          return fullName
        case '{USERNAME}':
          return userName
        case '{PASSWORDURL}':
          return passwordURL
        case '{POSTDATE}':
          return postDate
        case '{SHAREUSERNAME}':
          return shareUserName
        case '{COMPANYNAME}':
          return companyName
        case '{COMMUNITYNAME}':
          return communityName
        case '{COMMUNITYDESCRIPTION}':
          return communityDescription
        case '{POSTTITLE}':
          return postTitle
        case '{POSTDESC}':
          return postDesc
        case '{POSTUSERNAME}':
          return postUserName
        case '{POSTCOMPANYNAME}':
          return postCompanyName
        case '{WEBURL}':
          return webUrl
        case '{POSTURL}':
          return postUrl
        case '{CURRENTDATE}':
          return currentDate
        case '{DESCRIPTION}':
          return description
        case '{SHARECOMPANYNAME}':
          return shareCompanyName
        case '{LINK}':
          return link
        case '{COMMUNITYTITLE}':
          return communityTitle
        case '{COMMUNITYUSER}':
          return communityUser
        case '{CATEGORY}':
          return category
        case '{COMMUNITYDESC}':
          return communityDesc
        case '{STATUS}':
          return status
        case '{ACTIVEUSERS}':
          return activeUsers
        case '{ANALYSEDEMAIL}':
          return analysedEmail
        case '{FOUNDEMAILCOUNT}':
          return foundEmailCount
        case '{STARTEDBY}':
          return startedBy
        case '{STARTDATE}':
          return startDate
        case '{INVESTIGATIONNAME}':
          return investigationName
        case '{INVITEDUSERNAME}':
          return invitedUserName
        case '{INVITEDBYCOMPANYNAME}':
          return invitedByCompanyName
        case '{COMMUNITYURL}':
          return communityUrl
        case '{MEMBERCOUNT}':
          return memberCount
        case '{COMMUNITYINDUSTRY}':
          return communityIndustry
        case '{ANALYSISEMAIL}':
          return analysisEmail
        case '{OWNER}':
          return owner
        case '{DATE}':
          return date
        case '{REPORTBY}':
          return reportBy
        case '{FROM}':
          return fromText
        case '{TO}':
          return to
        case '{SUBJECT}':
          return subject
        case '{ATTACHMENT}':
          return attachment
        case '{CREATEDATE}':
          return createDate
        case '{SENDERIP}':
          return senderIP
        case '{CASEID}':
          return caseID
        case '{USEREMAIL}':
          return userEmail
        case '{USERAGENT}':
          return userAgent
        case '{ACTIONDATE}':
          return actionDate
        case '{ACTIONIP}':
          return actionIP
        case '{PRODUCTNAME}':
          return productName
        case '{ANALYSISDETAILURL}':
          return analysisDetailUrl
        case '{INVESTIGATIONURL}':
          return investigationUrl
        case '{COMPANYLOGO}':
          return companyLogo
        case '{DATEMAILSENT}':
          return dateEmailSent
        case '{EMAIL}':
          return emailMergedText
        case '{FIRSTNAME}':
          return firstName
        case '{FROMEMAIL}':
          return fromEmail
        case '{FROMNAME}':
          return fromName
        case '{LASTNAME}':
          return lastName
        case '{PHISHINGURL}':
          return phishingUrl
        default:
          break
      }
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    }
  },

  computed: {
    isAttachmentBasedTemplate() {
      return this.formValues.categoryResourceId === '7dLrW2kdBTDs'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    }
  },
  created() {
    if (this.isDuplicate) {
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--email-templates-modal',
        backButton: 'btn-duplicate-back--email-templates-modal',
        nextButton: 'btn-duplicate-next--email-templates-modal',
        saveButton: 'btn-duplicate-save--email-templates-modal'
      }
    }
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
        const availableForList = response?.data?.data?.availableForList
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        if (this.$refs.refMakeAvailableFor && availableForList.length) {
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
          this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
            response.data.data.availableForList
          )
        }
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
  }
}
</script>
