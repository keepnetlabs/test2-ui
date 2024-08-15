<template>
  <v-card class="email-template__container" :style="'overflow-y:hidden'">
    <app-modal
      v-if="showGrapesModal"
      :status="showGrapesModal"
      icon-name="mdi-check"
      :title="labels.NotificationTemplate"
      z-index="9999"
      :style="{ 'z-index': '999999' }"
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
    <div
      :class="[
        'email-template__ai-assistant',
        templateType === 'landing' ? 'email-template__ai-assistant--landing' : ''
      ]"
    >
      <div
        class="email-template__ai-assistant-header cursor-pointer"
        @click="$emit('update:aiAssistant', !aiAssistant)"
      >
        <div class="email-template__ai-assistant-left">
          <div class="mr-4">
            <VIcon class="cursor-pointer" color="#757575">
              {{ aiAssistant ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </VIcon>
          </div>
          <div>
            <div class="email-template__ai-assistant-left-title">AI Assistant</div>
            <div class="email-template__ai-assistant-left-description">
              {{
                templateType === 'landing'
                  ? 'AI will generate an landing page based on your description. Describe what your landing page should be about'
                  : 'AI will generate an email based on your description. Describe what your email template should be about'
              }}
            </div>
          </div>
        </div>
        <div>
          <div v-if="!aiAssistant">
            <VBtn
              class="white--text btn-util email-template__ai-assistant-btn"
              rounded
              @click="handleGenerateEmail"
            >
              <VIcon class="cursor-pointer mr-1" color="#fff">
                mdi-creation
              </VIcon>
              USE AI Assistant
            </VBtn>
          </div>
          <VIcon v-else class="cursor-pointer" color="#757575">
            mdi-close
          </VIcon>
        </div>
      </div>
      <div v-if="aiAssistant" class="email-template__ai-assistant-content">
        <div class="d-flex gap-2">
          <div
            class="email-template__ai-assistant-content-badge"
            @click="handleAiAssistantBadgeClick(0)"
          >
            {{ templateType === 'landing' ? landingPageBadgeContents[0] : badgeContents[0] }}
          </div>
          <div
            class="email-template__ai-assistant-content-badge"
            @click="handleAiAssistantBadgeClick(1)"
          >
            {{ templateType === 'landing' ? landingPageBadgeContents[1] : badgeContents[1] }}
          </div>
          <div
            class="email-template__ai-assistant-content-badge"
            @click="handleAiAssistantBadgeClick(2)"
          >
            {{ templateType === 'landing' ? landingPageBadgeContents[2] : badgeContents[2] }}
          </div>
        </div>
        <div class="mt-2">
          <VTextarea
            v-model.trim="aiTemplateText"
            class="email-template__ai-assistant-textarea"
            outlined
            dense
            no-resize
            persistent-hint
            rows="2"
            height="76"
            :placeholder="getAITemplateTextAreaPlaceholder"
            :rules="[aiTemplateMaxLength]"
          >
            <template #append>
              <div
                class="email-template__ai-assistant-footer-text"
                :style="aiTemplateText.length > 500 ? { color: '#B83A3A', opacity: '1' } : ''"
              >
                <VTooltip v-if="aiTemplateText.length > 500" bottom max-width="300">
                  <template #activator="{ on }">
                    <VIcon style="font-size: 20px;" v-on="on" color="#B83A3A" small
                      >mdi-information</VIcon
                    >
                  </template>
                  <span
                    >Description cannot exceed the 500 character limit. Please shorten
                    description.</span
                  >
                </VTooltip>
                {{ aiTemplateText.length }} / 500 characters
              </div>
            </template>
          </VTextarea>
        </div>
        <div class="email-template__ai-assistant-footer">
          <div class="email-template__ai-assistant-footer-left">
            <div v-if="generatedTemplates.length > 1">
              <VIcon
                class="cursor-pointer"
                color="#757575"
                :disabled="activeGeneratedTemplateIndex < 1"
                @click="setActiveGeneratedTemplate(activeGeneratedTemplateIndex - 1)"
                >mdi-chevron-left</VIcon
              >
              <VIcon
                class="ml-1 cursor-pointer"
                color="#757575"
                :disabled="activeGeneratedTemplateIndex === generatedTemplates.length - 1"
                @click="setActiveGeneratedTemplate(activeGeneratedTemplateIndex + 1)"
                >mdi-chevron-right</VIcon
              >
              <span class="email-template__ai-assistant-footer-left-text"
                >Generated email {{ activeGeneratedTemplateIndex + 1 }} of
                {{ generatedTemplates.length }}</span
              >
            </div>
          </div>
          <div class="email-template__ai-assistant-footer-right">
            <div class="email-template__ai-assistant-right-text">
              <VTooltip v-if="aiAssistantRemainingRight === 0" bottom max-width="300">
                <template #activator="{ on }">
                  <VIcon class="mr-1" style="font-size: 20px;" v-on="on" color="#2196F3" small
                    >mdi-information</VIcon
                  >
                </template>
                <span
                  >Used the {{ aiAssistantTotalRight }} AI assistant template creation rights for
                  this month. New rights will be available next month.</span
                >
              </VTooltip>
              Remaining attempts:
              <span class="fw-600"
                >{{ aiAssistantRemainingRight }} / {{ aiAssistantTotalRight }}</span
              >
            </div>
            <VBtn
              class="white--text btn-util btn-download-add-in pl-4"
              color="#00bcd4"
              rounded
              :style="getGenerateEmailButtonStyle"
              @click="handleGenerateEmail"
            >
              {{ templateType === 'landing' ? 'Generate Landing Page' : 'Generate Email Template' }}
            </VBtn>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="['mx-4', isHorizontalFormGroups ? 'pt-4' : 'pt-4']"
      v-if="!onlyGrapes && showNameField"
    >
      <FormGroup
        title="Template Name:"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
        <InputEntityName
          id="input--notification-template-name"
          initialPlaceholder="Enter template name"
          entityName="template name"
          :value="name"
          :disabled="editItemsDisabled"
          @input="$emit('update:name', $event)"
        />
      </FormGroup>
    </div>
    <div :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : 'pt-6']" v-if="!onlyGrapes">
      <FormGroup
        title="Subject:"
        :sub-title="getSubjectSubtitle"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
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
    <div v-if="!onlyGrapes" :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : '']">
      <FormGroup
        title="From Name:"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
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
    <div v-if="!onlyGrapes" :class="['mx-6', isHorizontalFormGroups ? 'pt-2 pb-4' : '']">
      <FormGroup
        title="From Email Address:"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
        <InputEmail
          id="input--notification-template-from-email"
          :disabled="editItemsDisabled"
          :value="fromAddress"
          @input="$emit('update:fromAddress', $event)"
        />
      </FormGroup>
    </div>
    <div
      v-if="!onlyGrapes && isNotificationEnrollment"
      :class="['mx-4', isHorizontalFormGroups ? 'pt-2' : '']"
    >
      <FormGroup title="CC" style="max-width: unset;">
        <KSelect
          :value="ccAddresses"
          id="input--threat-sharing-incident-share-email"
          type="combobox"
          :items="[]"
          placeholder="Enter an email address"
          multiple
          dense
          deletable-chips
          autocomplete="disabled"
          small-chips
          outlined
          class="pop-up-card__invite-member"
          hint="Press enter to separate email addresses"
          :rules="[ccEmailRules.email]"
          @input="$emit('update:ccAddresses', $event)"
        ></KSelect>
      </FormGroup>
    </div>
    <div :class="[isHorizontalFormGroups ? 'k-form-group k-form-group--horizontal' : '']">
      <div
        :class="['d-flex mx-4 align-center', isHorizontalFormGroups ? 'v-list-item__content' : '']"
        v-if="isPhishingTemplate && !onlyGrapes"
      >
        <label
          :class="[
            'mr-4',
            isHorizontalFormGroups ? 'k-form-group__title--horizontal mb-4' : 'mb-6'
          ]"
          style="font-weight: 600; font-size: 20px;"
          >Attach File:</label
        >
        <k-file-upload
          v-if="!attachments.length"
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
          v-else
          :class="['email-template__attachment-list', isHorizontalFormGroups ? 'ml-0' : '']"
          :style="
            isHorizontalFormGroups
              ? {}
              : { display: 'flex', 'align-self': 'start', 'flex-wrap': 'wrap' }
          "
        >
          <div v-for="(item, index) in attachments" :key="index">
            <div class="attachment-wrapper" style="position: relative;">
              <div
                :class="['attachment blue-attach mr-2', isHorizontalFormGroups ? 'full-width' : '']"
                :id="'email-template-' + item.name"
              >
                <AttachmentsPreview
                  :deletable="item.isDeletable"
                  :att="item"
                  :index="index"
                  :isEmailTemplate="true"
                  :isAttachmentNameFullWidth="isHorizontalFormGroups"
                  @on-delete="handleFileDelete"
                />
              </div>
              <div v-if="!item.isDeletable" class="attachment-delete-wrapper">
                <v-menu bottom left offset-y transition="scale-transition">
                  <template #activator="{ on }">
                    <v-btn v-on="on" class="btn-hover" icon outlined>
                      <v-icon>mdi-dots-vertical</v-icon>
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
    </div>
    <v-divider v-if="!onlyGrapes" class="email-template__divider mb-6" />
    <div v-if="isEmailGenerating">
      <EmailTemplatesAILoader :title="getLoaderTitle" />
    </div>
    <div v-else id="email-template-content">
      <v-btn
        id="btn-edit--notification-template-email-template"
        style="text-transform: none;"
        :disabled="editItemsDisabled"
        rounded
        color="#2196f3"
        class="email-template-preview__button"
        @click="editHtmlTemplate"
      >
        <v-icon class="mr-2 text-h6">mdi-pencil</v-icon> Edit Content
      </v-btn>
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
          <quishing-email-template-default
            v-else-if="templateType === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL"
            ref="refPreview"
            :email-template-logo="emailTemplateLogo"
          />
          <email-template-default
            v-else
            ref="refPreview"
            :email-template-logo="emailTemplateLogo"
          />
        </template>
      </div>
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
import QuishingEmailTemplateDefault from '@/components/EmailTemplates/QuishingEmailTemplateDefault.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import EmailTemplatesAILoader from '@/components/EmailTemplates/EmailTemplatesAILoader.vue'
import {
  generateAIEmailTemplate,
  generateAILandingPageTemplate,
  getGeneratedAIEmailTemplate,
  getGeneratedAILandingPageTemplate
} from '@/api/phishingsimulator'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'EmailTemplate',
  components: {
    EmailTemplatesAILoader,
    KSelect,
    QuishingEmailTemplateDefault,
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
    'name',
    'fromAddress',
    'fromName',
    'subject',
    'ccAddresses',
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
    'isEnrollmentCategorySelected',
    'isNotificationEnrollment',
    'isHorizontalFormGroups',
    'showNameField',
    'isAiAssistant',
    'aiAssistant',
    'aiAssistantRemainingRight',
    'aiAssistantTotalRight',
    'languageTypeResourceId',
    'isAssistedByAITemplate',
    'methodTypeId',
    'prompt'
  ],
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      isEmailGenerating: false,
      badgeContents: [
        'Phishing simulation email prompting the user to change their bank account password due to suspicious activity.',
        'Phishing simulation email asking the user to verify their email account because of unusual login attempts.',
        'Phishing simulation email informing the user to download from attachment a critical software update to avoid security risks.'
      ],
      landingPageBadgeContents: [
        'Landing page that allows the user to update their bank account password due to security concerns.',
        'Landing page where the user can change their email account password.',
        'Landing page where the user can update their online service password.'
      ],
      timeoutId: null,
      previewTemplate: null,
      aiTemplateText: '',
      initialTemplate: null,
      labels,
      showGrapesModal: false,
      grapeJsKey: `${createRandomCryptStringNumber()}-key`,
      Validations,
      attachmentListKey: `${createRandomCryptStringNumber()}-key`,
      aiTemplateMaxLength: (v) =>
        Validations.maxLength(
          v,
          500,
          'Description cannot exceed the 500 character limit. Please shorten description',
          500
        ),
      ccEmailRules: {
        email: (v) => {
          if (v.length > 0) {
            let booReturn = true
            for (let i = 0; i < v.length; i++) {
              const chip = document.getElementsByClassName('v-chip--select')[i]
              if (!chip) continue
              if (!Validations.email(v[i], '')) {
                booReturn = false
                chip.style.borderColor = '#ff5252'
                chip.style.color = '#ff5252'
                if (v.length === 1) {
                  return v[i] + ' email address is not valid'
                }
              } else {
                chip.style.borderColor = ''
                chip.style.color = 'rgba(0, 0, 0, 0.87)'
              }
            }
            return booReturn ? booReturn : 'One of the email addresses is not valid'
          } else {
            return true
          }
        }
      },
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
        (v) => Validations.maxLength(v, 512, labels.getMaxLengthMessage(labels.Subject, 512))
      ],
      senderNameRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.FromName), 40)
      ],
      generatedTemplates: [],
      activeGeneratedTemplateIndex: -1
    }
  },
  computed: {
    ...mapGetters({ emailTemplateLogo: 'whitelabel/getEmailTemplateLogoUrl' }),
    getAITemplateTextAreaPlaceholder() {
      return this.templateType === 'landing'
        ? 'Provide a detailed description of your landing page content enter'
        : 'Provide a detailed description of your email template content enter'
    },
    getLoaderTitle() {
      return this.templateType === 'landing'
        ? 'AI Assisted Landing Page Generate in Progress'
        : 'AI Assisted Email Generate in Progress'
    },
    attachmentExtensions() {
      return this.extensions ? this.extensions : ['gif', 'jpg', 'jpeg', 'png', 'bmp']
    },
    attachments() {
      if (
        !!this.attachmentFiles &&
        this.attachmentFiles?.length &&
        !!this.importedEmailAttachments &&
        this.importedEmailAttachments?.length
      ) {
        return [...this.attachmentFiles, ...this.importedEmailAttachments]
      }
      if (!!this.attachmentFiles && this.attachmentFiles?.length) {
        return [...this.attachmentFiles]
      }
      return []
    },
    isMergeTagSubject() {
      return this.isNotificationTemplate && this.isEnrollmentCategorySelected
    },
    getSubjectSubtitle() {
      if (!this.isMergeTagSubject) return undefined
      return `Define a subject for the notification email. Use {ENROLLMENT_NAME} merge tag as a variable for the notification email subject`
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
    },
    prompt(val) {
      if (val !== this.aiTemplateText) this.aiTemplateText = val || ''
    },
    aiTemplateText(val) {
      this.$emit('update:prompt', val || '')
    }
  },
  mounted() {
    this.defaultTemplate = this.template || this.$refs.refPreview.$el.outerHTML
    this.setDefaultTemplate()
    this.$emit('handleInitialTemplate', this.defaultTemplate)
  },
  beforeDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  },
  methods: {
    handleGenerateEmail() {
      const generatedEmailIndex = this.generatedTemplates.findIndex(
        (item) => item.text === this.aiTemplateText
      )
      if (generatedEmailIndex !== -1) {
        this.activeGeneratedTemplateIndex = generatedEmailIndex
        this.$emit('update:template', this.generatedTemplates[generatedEmailIndex].content)
        return
      }
      this.isEmailGenerating = true
      document
        ?.querySelector('#email-template-content')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      const payload = {
        name: this.name,
        languageTypeResourceId: this.languageTypeResourceId,
        subject: this.subject,
        fromName: this.fromName,
        fromAddress: this.fromAddress,
        prompt: this.aiTemplateText,
        phishingTypeId: 1,
        methodTypeId: parseInt(this.methodTypeId)
      }
      this.$emit('update:isAssistedByAITemplate', true)
      this.$emit('update:aiAssistantRemainingRight', this.aiAssistantRemainingRight - 1)
      if (this.templateType === 'landing') {
        generateAILandingPageTemplate(payload).then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAILandingPageTemplate()
          }
        })
      } else {
        generateAIEmailTemplate(payload).then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAIEmailTemplate()
          }
        })
      }
    },
    callForGetGeneratedAIEmailTemplate() {
      getGeneratedAIEmailTemplate()
        .then((response) => {
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: response?.data?.data
          })
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1
          this.$emit('update:template', response?.data?.data)
          this.isEmailGenerating = false
        })
        .catch(() => {
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAIEmailTemplate(), 5000)
        })
    },
    callForGetGeneratedAILandingPageTemplate() {
      getGeneratedAILandingPageTemplate()
        .then((response) => {
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: response?.data?.data
          })
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1
          this.$emit('update:template', response?.data?.data)
          this.isEmailGenerating = false
          if (this.aiAssistantRemainingRight === 0) {
            this.$store.dispatch('common/createSnackBar', {
              message: `Used the ${this.aiAssistantTotalRight} AI assistant template creation rights for this month. New rights will be available next month.`,
              color: COMMON_CONSTANTS.INFOSNACKBARCOLOR,
              icon: 'mdi-information'
            })
          }
        })
        .catch(() => {
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAILandingPageTemplate(), 5000)
        })
    },
    setActiveGeneratedTemplate(index) {
      this.activeGeneratedTemplateIndex = index
      this.aiTemplateText = this.generatedTemplates[index].text
      this.$emit('update:template', this.generatedTemplates[index].content)
    },
    handleAiAssistantBadgeClick(index) {
      this.aiTemplateText =
        this.templateType === 'landing'
          ? this.landingPageBadgeContents[index]
          : this.badgeContents[index]
    },
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
      this.$emit('template-edit', this.showGrapesModal)
    },
    saveGrapeJs() {
      const template = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      if (
        this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT ||
        this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL
      ) {
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
