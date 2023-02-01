<template>
  <v-container fluid tag="div" id="email-settings" class="email-settings">
    <v-list-item
      v-if="showHeader"
      class="px-0 email-settings__list-item mt-0 mr-2 email-settings__header-container"
    >
      <v-list-item-content>
        <v-list-item-title class="email-settings__list-item--text email-settings__header"
          >Email Settings
        </v-list-item-title>
        <v-list-item-subtitle class="email-settings__list-item--text email-settings__sub-header"
          >Send a copy of reported emails as attachment
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-form class="email-settings__form" ref="refForm" lazy-validation>
      <v-list-item class="px-0 email-settings__list-item email-settings__checkbox-container">
        <v-list-item-content>
          <v-checkbox
            v-model="formValues.isSendInformationEmail"
            id="input--phishing-reporter-is-send-email"
            class="other-settings__checkbox k-checkbox"
            color="#2196f3"
            label="Send information email for reported incidents"
            :readonly="!showForm"
            hide-details
          ></v-checkbox>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Recipient Email Address</label>
          <InputEmail
            v-model.trim="formValues.to"
            id="input--phishing-reporter-recipient-email-address"
            class="k-textfield mt-2"
            :required="isRecipientEmailRequired"
            :persistent-hint="isRecipientEmailRequired"
            :hint="recipientEmailHint"
            :rules="recipientEmailRules"
            :readonly="!showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">CC</label>
          <InputEmail
            v-model.trim="formValues.cc"
            id="input--phishing-reporter-cc-email-address"
            class="k-textfield mt-2"
            :persistent-hint="false"
            :required="false"
            :hint="null"
            :rules="ccEmailRules"
            :readonly="!showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">BCC</label>
          <InputEmail
            v-model.trim="formValues.bcc"
            id="input--phishing-reporter-bcc-email-address"
            class="k-textfield mt-2"
            :readonly="!showForm"
            :persistent-hint="false"
            :required="false"
            :hint="null"
            :rules="ccEmailRules"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item" style="max-width: 800px !important;">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Email Subject</label>
          <div class="d-flex">
            <InputEmail
              v-model.trim="formValues.subject"
              id="input--phishing-reporter-email-subject"
              :class="['k-textfield mt-2', getSubjectTextFieldOrder]"
              style="max-width: 430px;"
              placeholder="Suspicious Email"
              :required="isRecipientEmailRequired"
              :persistent-hint="isRecipientEmailRequired"
              :hint="recipientEmailHint"
              :rules="emailSubjectRules"
              :readonly="!showForm"
            />
            <div :class="['email-settings__subject mt-n3', getSubjectMergeTagOrder]">
              <span>{SUBJECT}</span>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-icon v-on="on">mdi-information</v-icon>
                </template>
                <span>The merge tag for a reported email’s subject.</span>
              </v-tooltip>
            </div>
            <div
              v-if="!isShowSubjectSaveButton"
              class="email-settings__change-order order-2"
              @click="handleChangeOrder"
            >
              <v-icon class="cursor-pointer" color="#2196f3">mdi-swap-horizontal</v-icon>
              <div class="ml-2 new-integration__api-key__text">Change order</div>
            </div>
            <div
              v-else
              class="ml-6 email-settings__change-order order-2"
              @click="handleSubjectSave"
            >
              <div class="new-integration__api-key__text">Save</div>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Email Message</label>
          <v-textarea
            v-model.trim="formValues.content"
            placeholder="Please investigate the attached email"
            id="input--phishing-reporter-recipient-email-message"
            outlined
            dense
            no-resize
            class="mt-2"
            :required="isRecipientEmailRequired"
            :persistent-hint="isRecipientEmailRequired"
            :hint="recipientEmailHint"
            :rules="emailMessageRules"
            :readonly="!showForm"
          ></v-textarea>
        </v-list-item-content>
      </v-list-item>
      <phishing-settings-footer
        v-if="showFooter"
        class-name="mt-3"
        :save-disable="saveDisable"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
      />
    </v-form>
  </v-container>
</template>

<script>
import * as validations from '@/utils/validations'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'EmailSettings',
  components: {
    InputEmail,
    PhishingSettingsFooter
  },
  watch: {
    formData: {
      handler(data) {
        const { to, cc, bcc, subject, content } = data
        this.formValues.to = to || ''
        this.formValues.cc = cc || ''
        this.formValues.bcc = bcc || ''
        this.formValues.subject = subject || ''
        this.formValues.content = content || ''
      }
    }
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showHeaderLink: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showForm: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: null
    },
    saveDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      validations,
      formValues: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        content: '',
        isSendInformationEmail: null
      },
      isShowSubjectSaveButton: false,
      subjectIndex: 1
    }
  },
  computed: {
    getSubjectTextFieldOrder() {
      return this.subjectIndex === 1 ? 'order-1' : 'order-0'
    },
    getSubjectMergeTagOrder() {
      return this.subjectIndex === 1 ? 'mr-2 order-0' : 'ml-2 order-1'
    },
    isRecipientEmailRequired() {
      return this.showForm ? !!this.formValues.isSendInformationEmail : false
    },
    recipientEmailHint() {
      if (this.showForm) return this.formValues.isSendInformationEmail ? '*Required' : null
      return null
    },
    recipientEmailRules() {
      if (this.showForm) {
        return this.formValues.isSendInformationEmail
          ? [
              (v) => validations.mail(v, labels.InvalidEmailAddress),
              (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
              (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress),
              (v) => validations.required(v, labels.Required)
            ]
          : [
              (v) => validations.mail(v, labels.InvalidEmailAddress),
              (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
              (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress)
            ]
      }
      return []
    },
    ccEmailRules() {
      return this.showForm
        ? [
            (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
            (v) => validations.mail(v, labels.InvalidEmailAddress),
            (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress)
          ]
        : []
    },
    emailSubjectRules() {
      if (this.showForm) {
        return this.formValues.isSendInformationEmail
          ? [
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Email subject')),
              (v) => validations.required(v, labels.Required)
            ]
          : [(v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Email subject'))]
      }
      return []
    },
    emailMessageRules() {
      if (this.showForm) {
        return this.formValues.isSendInformationEmail
          ? [
              (v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Message', 256)),
              (v) => this.validations.required(v, labels.Required)
            ]
          : [(v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Message', 256))]
      }
      return []
    }
  },
  methods: {
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        const el = this.$refs.refForm.$el.querySelector('.error--text')
        scrollToComponent(el)
        return false
      }
    },
    getCurrentValues() {
      return this.formValues
    },
    getFormValues() {
      const result = this.$refs.refForm.validate()
      if (result) {
        return this.formValues
      } else {
        return false
      }
    },
    handleChangeOrder() {
      this.subjectIndex = Number(!this.subjectIndex)
      this.toggleShowSubjectSaveButtonStatus()
    },
    toggleShowSubjectSaveButtonStatus() {
      this.isShowSubjectSaveButton = !this.isShowSubjectSaveButton
    },
    handleSubjectSave() {
      this.toggleShowSubjectSaveButtonStatus()
    }
  },
  created() {
    if (this.formData) {
      const { to, cc, bcc, subject, content, isSendInformationEmail } = this.formData
      this.formValues.to = to || ''
      this.formValues.cc = cc || ''
      this.formValues.bcc = bcc || ''
      this.formValues.subject = subject || ''
      this.formValues.content = content || ''
      this.formValues.isSendInformationEmail = isSendInformationEmail
    }
    this.$emit('getInitialFormValues', this.formValues)
  }
}
</script>
