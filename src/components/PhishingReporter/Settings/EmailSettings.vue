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
      <div class="email-settings__information">
        <div>
          <VIcon color="#2196f3">mdi-alert-circle</VIcon>
        </div>
        <div class="email-settings__information-text">
          System users will always receive an information email for reported incidents. Using the
          checkbox above, you can send an information email to third parties.
        </div>
      </div>
      <FormGroup title="Recipient Email Address" :has-hint="isRecipientEmailRequired">
        <InputEmail
          v-model.trim="formValues.to"
          id="input--phishing-reporter-recipient-email-address"
          :required="isRecipientEmailRequired"
          :persistent-hint="isRecipientEmailRequired"
          :hint="recipientEmailHint"
          :rules="recipientEmailRules"
          :readonly="!showForm"
        />
      </FormGroup>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label
            for="input--phishing-reporter-cc-email-address"
            class="email-settings__list-item--header"
            >CC</label
          >
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
          <label
            for="input--phishing-reporter-bcc-email-address"
            class="email-settings__list-item--header"
            >BCC</label
          >
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
      <FormGroup
        title="Email Subject"
        sub-title="Define a subject for reported email notifications. Use {SUBJECT} merge tag as a variable for reported emails' subject"
        :has-hint="isRecipientEmailRequired"
      >
        <InputEmail
          v-model.trim="formValues.subject"
          id="input--phishing-reporter-email-subject"
          placeholder="Suspicious Email: {SUBJECT}"
          :required="isRecipientEmailRequired"
          :persistent-hint="isRecipientEmailRequired"
          :hint="recipientEmailHint"
          :rules="emailSubjectRules"
          :readonly="!showForm"
        />
      </FormGroup>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label
            for="input--phishing-reporter-recipient-email-message"
            class="email-settings__list-item--header"
            >Email Message</label
          >
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
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
export default {
  name: 'EmailSettings',
  components: {
    FormGroup,
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
      }
    }
  },
  computed: {
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
