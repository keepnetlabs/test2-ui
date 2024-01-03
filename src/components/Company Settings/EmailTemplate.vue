<template>
  <v-card class="email-template__container" :style="'overflow-y:hidden'">
    <app-modal
      v-if="showGrapesModal"
      :status="showGrapesModal"
      icon-name="mdi-check"
      :title="labels.NotificationTemplate"
      z-index="9999"
      :show-header="false"
      :should-remove-overflow="false"
      @submit="saveGrapeJs"
      @closeOverlay="toggleShowGrapesModal"
    >
      <template #overlay-body>
        <GrapesNewsletterModal
          v-if="showGrapesModal"
          ref="grapesJsPostIncident"
          :htmlData="template"
          :key="grapeJsKey"
          :blockManagerComponents="activeBlockManagerComponents"
          :template-type="templateType"
          :isAttachmentBasedTemplate="isPhishingTemplate"
        />
      </template>
    </app-modal>
    <div class="mx-4 pt-4" v-if="!onlyGrapes">
      <FormGroup title="Subject" :sub-title="getSubjectSubtitle" style="max-width: unset;">
        <InputEntityName
          id="input--notification-template-subject"
          initialPlaceholder="Enter email subject"
          entityName="email subject"
          :value="subject"
          :disabled="editItemsDisabled"
          :initialRules="getSubjectRules"
          @input="$emit('update:subject', $event)"
        />
      </FormGroup>
    </div>
    <div v-if="!onlyGrapes" class="mx-4">
      <FormGroup title="From Name" style="max-width: unset;">
        <InputEntityName
          id="input--notification-template-sender-name"
          initialPlaceholder="Enter sender name"
          entityName="sender name"
          :value="fromName"
          :disabled="editItemsDisabled"
          :initialRules="senderNameRules"
          @input="$emit('update:fromName', $event)"
        />
      </FormGroup>
    </div>
    <div v-if="!onlyGrapes" class="mx-4">
      <FormGroup title="From Email" style="max-width: unset;">
        <InputEmail
          id="input--notification-template-from-email"
          :disabled="editItemsDisabled"
          :value="fromAddress"
          @input="$emit('update:fromAddress', $event)"
        />
      </FormGroup>
    </div>
    <div class="d-flex mx-4" v-if="isPhishingTemplate && !onlyGrapes">
      <label>Attach File</label>
      <k-file-upload
        id="input--email-template-upload"
        is-stand-alone
        class="mb-2"
        ref="refFileUpload"
        :hint="fileUploadHint"
        :extensions="attachmentExtensions"
        :is-show-file-progress="false"
        :value="attachmentFiles"
        :is-preview-visible="false"
        :size="size"
        :hasError="!!isAttachmentError"
        :errorText="isAttachmentError || ''"
        @inputFile="onFileChanged"
      />
      <div
        class="email-template__attachment-list"
        style="display: flex; align-self: start; flex-wrap: wrap;"
      >
        <div v-for="(item, index) in attachments" :key="index">
          <div class="attachment-wrapper" style="position: relative;">
            <div class="attachment blue-attach" :id="'email-template-' + item.name">
              <AttachmentsPreview
                :deletable="item.isDeletable"
                :att="item"
                :index="index"
                :isEmailTemplate="true"
                @on-delete="handleFileDelete"
              />
            </div>
            <div v-if="!item.isDeletable" class="attachment-delete-wrapper">
              <v-menu bottom left offset-y transition="scale-transition">
                <template #activator="{ on }">
                  <v-btn v-on="on" class="btn-hover" icon>
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list class="v-cart-dropdown-list el-table__action-buttons">
                  <v-list-item class="sub-menu-el datatable-row-action-list">
                    <v-list-item-title @click="handleRenameItem">
                      <span>Rename</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="sub-menu-el datatable-row-action-list">
                    <v-list-item-title @click="handleDeleteItem">
                      <span>Delete</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-divider v-if="!onlyGrapes" class="email-template__divider mb-6" />
    <v-btn
      id="btn-edit--notification-template-email-template"
      :disabled="editItemsDisabled"
      rounded
      color="#2196f3"
      class="email-template-preview__button"
      @click="editHtmlTemplate"
    >
      <v-icon class="mr-2 text-h6">mdi-pencil</v-icon> Edit</v-btn
    >
    <div class="email-template-preview" style="pointer-events: none;">
      <k-email-preview v-if="template" :key="template" ref="refPreview" :html="previewTemplate" />
      <template v-else>
        <landing-page-template-default
          v-if="templateType === 'landing'"
          ref="refPreview"
          :email-template-logo="emailTemplateLogo"
        />
        <individual-print-out-template-default
          v-else-if="templateType === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT"
          ref="refPreview"
          :email-template-logo="emailTemplateLogo"
        />
        <email-template-default v-else ref="refPreview" :email-template-logo="emailTemplateLogo" />
      </template>
    </div>
  </v-card>
</template>

<script>
import AppModal from '@/components/AppModal'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { createRandomCryptStringNumber, isDifferent } from '@/utils/functions'
import GrapesNewsletterModal from '@/components/GrapesJs/Newsletter/GrapesNewsletterModal'
import { mapGetters } from 'vuex'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import KEmailPreview from '@/components/KEmailPreview'
import EmailTemplateDefault from '@/components/EmailTemplates/EmailTemplateDefault'
import LandingPageTemplateDefault from '@/components/EmailTemplates/LandingPageTemplateDefault'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import IndividualPrintOutTemplateDefault from '@/components/EmailTemplates/IndividualPrintOutTemplateDefault.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  name: 'EmailTemplate',
  components: {
    IndividualPrintOutTemplateDefault,
    EmailTemplateDefault,
    LandingPageTemplateDefault,
    KEmailPreview,
    GrapesNewsletterModal,
    AppModal,
    InputEmail,
    KFileUpload,
    AttachmentsPreview,
    InputEntityName,
    FormGroup
  },
  props: [
    'fromAddress',
    'fromName',
    'subject',
    'template',
    'attachmentFiles',
    'activeBlockManagerComponents',
    'isEdit',
    'editItemsDisabled',
    'isPhishingTemplate',
    'setAttachmentFile',
    'importedEmailAttachments',
    'onlyGrapes',
    'templateType',
    'extensions',
    'fileUploadHint',
    'size',
    'isAttachmentError',
    'isNotificationTemplate',
    'isEnrollmentCategorySelected'
  ],
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      previewTemplate: null,
      initialTemplate: null,
      labels,
      showGrapesModal: false,
      grapeJsKey: `${createRandomCryptStringNumber()}-key`,
      Validations,
      attachmentListKey: `${createRandomCryptStringNumber()}-key`,
      mergeTags: [
        {
          text: 'Enrollment Name',
          value: '{ENROLLMENT_NAME}'
        }
      ],
      mergeTagRules: [
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          if (!matches?.length) return true
          const tags = this.mergeTags.map((tag) => tag.value)
          for (let i = 0; i < matches.length; i++) {
            if (!tags.includes(matches[i].toUpperCase())) {
              return `${matches[i]} is an incorrect merge tag. Please enter an existing merge tag.`
            }
          }
          return true
        },
        (v) => {
          if (!v) return true
          const regexp = new RegExp(
            `(${this.mergeTags.map((mergeTag) => mergeTag.value).join('|')})`,
            'gi'
          )
          const matches = v.match(regexp)
          if (!matches?.length) return true
          const mergeTags = this.mergeTags.map((tag) => tag.value)
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          )
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            'Only use uppercase letters for the merge tag'
          )
        }
      ],
      subjectRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Subject, 320))
      ],
      senderNameRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.FromName), 40)
      ]
    }
  },
  computed: {
    ...mapGetters({ emailTemplateLogo: 'whitelabel/getEmailTemplateLogoUrl' }),
    attachmentExtensions() {
      return this.extensions ? this.extensions : ['gif', 'jpg', 'jpeg', 'png', 'bmp']
    },
    attachments() {
      return [...this.attachmentFiles, ...this.importedEmailAttachments]
    },
    isMergeTagSubject() {
      return this.isNotificationTemplate && this.isEnrollmentCategorySelected
    },
    getSubjectSubtitle() {
      if (!this.isMergeTagSubject) return undefined
      return `Define a subject for the notification email. Use {ENROLLMENTNAME} merge tag as a variable for the notification email subject`
    },
    getSubjectRules() {
      if (this.isMergeTagSubject) {
        return [...this.subjectRules, ...this.mergeTagRules]
      }
      return this.subjectRules
    }
  },
  watch: {
    activeBlockManagerComponents() {
      this.grapeJsKey = `${createRandomCryptStringNumber()}-key`
    },
    template: {
      handler(val) {
        this.previewTemplate =
          val?.replace(/{COMPANYLOGO}/g, this?.$store?.state?.whitelabel.mainLogoUrl || '') || ''
      },
      immediate: true
    }
  },
  mounted() {
    this.defaultTemplate = this.template || this.$refs.refPreview.$el.outerHTML
    this.setDefaultTemplate()
    this.$emit('handleInitialTemplate', this.defaultTemplate)
  },
  methods: {
    handleRenameItem() {
      this.$emit('handleRenameAttachment')
    },
    handleDeleteItem() {
      this.$emit('handleDeleteAttachment')
    },
    setInitialTemplateData() {
      setTimeout(() => {
        this.initialTemplate = this.$refs?.grapesJsPostIncident?.getGrapesEditorContent?.() || ''
      }, 1000)
    },
    handleFileDelete(index) {
      this.$emit('handleAttachmentRemove', { item: this.attachments[index], index })
    },
    onFileChanged(file) {
      this.$emit('setAttachmentFile', file)
    },
    changeTabStatus(index) {
      this.tab = index
    },
    editHtmlTemplate() {
      this.toggleShowGrapesModal()
    },
    setDefaultTemplate() {
      this.$emit('update:template', this.defaultTemplate)
    },
    toggleShowGrapesModal(isSubmitted = false) {
      if (!this.showGrapesModal) {
        this.changeGrapesModalStatus()
        this.setInitialTemplateData()
        return
      }
      if (!this.$refs.grapesJsPostIncident) {
        return this.changeGrapesModalStatus()
      }
      const currentTemplate = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      const isChanged = isDifferent(currentTemplate, this.initialTemplate)
      if (!isChanged || isSubmitted) {
        this.destroyPostIncidentEditor()
      } else {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.destroyPostIncidentEditor()
          }
        })
      }
    },
    destroyPostIncidentEditor() {
      this?.$refs?.grapesJsPostIncident?.destroyEditor()
      this.changeGrapesModalStatus()
    },
    changeGrapesModalStatus() {
      this.showGrapesModal = !this.showGrapesModal
    },
    saveGrapeJs() {
      const template = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      if (this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT) {
        if (!template.includes(qrCodeString)) {
          return this.$emit('showErrorDialog')
        }
      }
      this.$emit('update:template', template)
      //this code has to be added otherwise grapesjs throws error
      setTimeout(() => {
        this.toggleShowGrapesModal(true)
      }, 100)
    }
  }
}
</script>
