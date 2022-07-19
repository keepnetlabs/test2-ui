<template>
  <v-container fluid tag="div" id="email-settings" class="email-settings">
    <v-list-item
      class="px-0 email-settings__list-item mt-0 mr-2 email-settings__header-container"
      v-if="showHeader"
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
            class="k-textfield mt-2"
            v-model.trim="formValues.to"
            id="input--phishing-reporter-recipient-email-address"
            :required="isRecipientEmailRequired"
            :persistent-hint="isRecipientEmailRequired"
            :hint="recipientEmailHint"
            :rules="recipientEamilRules"
            :readonly="!showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">CC</label>
          <InputEmail
            class="k-textfield mt-2"
            id="input--phishing-reporter-cc-email-address"
            v-model.trim="formValues.cc"
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
            class="k-textfield mt-2"
            id="input--phishing-reporter-bcc-email-address"
            v-model.trim="formValues.bcc"
            :readonly="!showForm"
            :persistent-hint="false"
            :required="false"
            :hint="null"
            :rules="ccEmailRules"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Email Subject</label>
          <InputEmail
            placeholder="Suspicious Email"
            class="k-textfield mt-2"
            id="input--phishing-reporter-email-subject"
            v-model.trim="formValues.subject"
            :required="isRecipientEmailRequired"
            :persistent-hint="isRecipientEmailRequired"
            :hint="recipientEmailHint"
            :rules="emailSubjectRules"
            :readonly="!showForm"
          ></InputEmail>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Email Message</label>
          <v-textarea
            placeholder="Please investigate the attached email"
            id="input--phishing-reporter-recipient-email-message"
            outlined
            dense
            no-resize
            class="mt-2"
            :required="isRecipientEmailRequired"
            :persistent-hint="isRecipientEmailRequired"
            :hint="recipientEmailHint"
            v-model.trim="formValues.content"
            :rules="emailMessageRules"
            :readonly="!showForm"
          ></v-textarea>
        </v-list-item-content>
      </v-list-item>
      <phishing-settings-footer
        v-if="showFooter"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
        class-name="mt-3"
        :saveDisable="saveDisable"
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
      formValues: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        content: '',
        isSendInformationEmail: null
      },
      validations: validations
    }
  },
  computed: {
    isRecipientEmailRequired() {
      return this.showForm ? !!this.formValues.isSendInformationEmail : false
    },
    recipientEmailHint() {
      return this.showForm ? (this.formValues.isSendInformationEmail ? '*Required' : null) : null
    },
    recipientEamilRules() {
      return this.showForm
        ? this.formValues.isSendInformationEmail
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
        : []
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
      return this.showForm
        ? this.formValues.isSendInformationEmail
          ? [
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Email subject')),
              (v) => validations.required(v, labels.Required)
            ]
          : [(v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Email subject'))]
        : []
    },
    emailMessageRules() {
      return this.showForm
        ? this.formValues.isSendInformationEmail
          ? [
              (v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Message', 256)),
              (v) => this.validations.required(v, labels.Required)
            ]
          : [(v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Message', 256))]
        : []
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
