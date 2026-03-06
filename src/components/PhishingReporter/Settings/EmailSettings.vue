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
      <FormGroup
        class="mt-6"
        title="Send Us a Copy"
        sub-title="Controls whether reported emails, excluding those sent by the platform, are also sent to the platform for review."
      >
        <div class="email-settings__information mb-0" style="background-color: #F2F2F2;">
          <div>
            <v-switch
              v-model="formValues.sendUsACopy"
              id="input--phishing-reporter-is-send-copy"
              color="#2196f3"
              hide-details
              style="margin-top: -2px;"
              :readonly="!showForm"
            ></v-switch>
          </div>
          <div class="email-settings__information-text fw-600 fs-3-4 d-flex align-center">
            The platform will
            {{ formValues.sendUsACopy ? 'receive' : 'not receive' }} copies of reported emails.
          </div>
        </div>
        <div
          v-if="getIncidentResponderNotifiedEmailPermission"
          class="email-settings__information mt-2 mb-0"
          style="background-color: rgba(230, 162, 60, 0.2);"
        >
          <div>
            <VIcon color="#B6791D">mdi-alert</VIcon>
          </div>
          <div class="email-settings__information-text flex-column align-start justify-start">
            <div class="fw-600 fs-3-4">Important Incident Responder Notice</div>
            <div>
              {{ getImportantIncidentResponderNoticeText }}
            </div>
          </div>
        </div>
      </FormGroup>
      <FormGroup
        class="mt-6"
        title="Microsoft 365 Defender Integration"
        sub-title="Submit reported emails to Microsoft Defender (Submissions → User reported)."
      >
        <div class="email-settings__information email-settings__defender-toggle mb-0" style="background-color: #F2F2F2;">
          <div>
            <v-switch
              v-model="formValues.isMicrosoftDefenderIntegrationEnabled"
              id="input--phishing-reporter-microsoft-defender-integration"
              color="#2196f3"
              hide-details
              style="margin-top: -2px;"
              :readonly="!showForm"
            ></v-switch>
          </div>
          <div class="email-settings__defender-status d-flex flex-column align-start">
            <span class="email-settings__defender-status-title">
              Integration is {{ formValues.isMicrosoftDefenderIntegrationEnabled ? 'enabled' : 'disabled' }}.
            </span>
            <span class="email-settings__defender-status-subtitle">
              {{
                formValues.isMicrosoftDefenderIntegrationEnabled
                  ? 'Reported emails are submitted to Microsoft Defender.'
                  : 'Reported emails are not submitted to Microsoft Defender.'
              }}
            </span>
          </div>
        </div>
        <div
          v-if="formValues.isMicrosoftDefenderIntegrationEnabled"
          class="email-settings__information mt-2 mb-0"
          style="background-color: rgba(33, 150, 243, 0.15);"
        >
          <div>
            <VIcon color="#2196f3">mdi-alert-circle</VIcon>
          </div>
          <div class="email-settings__information-text flex-column align-start justify-start">
            To use this integration, configure a mailbox for user-reported submissions in Microsoft
            Defender and enter that address below.
          </div>
        </div>
        <FormGroup
          v-if="formValues.isMicrosoftDefenderIntegrationEnabled"
          class="mt-2 email-settings__defender-email-form"
          title="Defender Submission Email"
          :has-hint="isDefenderEmailRequired"
        >
          <InputEmail
            v-model.trim="formValues.defenderReportingEmailAddress"
            id="input--phishing-reporter-defender-submission-email"
            placeholder="Enter an email address"
            :required="isDefenderEmailRequired"
            :persistent-hint="isDefenderEmailRequired"
            :hint="defenderEmailHint"
            :rules="defenderEmailRules"
            :readonly="!showForm"
          />
        </FormGroup>
      </FormGroup>
      <FormGroup
        :class="formValues.isMicrosoftDefenderIntegrationEnabled ? 'mt-2' : 'mt-6'"
        title="Information Email"
      >
        <v-checkbox
          v-model="formValues.isSendInformationEmail"
          id="input--phishing-reporter-is-send-email"
          class="other-settings__checkbox k-checkbox my-2"
          color="#2196f3"
          label="Send information email for reported incidents"
          :readonly="!showForm"
          hide-details
        ></v-checkbox>
      </FormGroup>
      <div class="email-settings__information">
        <div>
          <VIcon color="#2196f3">mdi-alert-circle</VIcon>
        </div>
        <div class="email-settings__information-text">
          System users are notified automatically. Enable the checkbox to notify the addresses
          below.
        </div>
      </div>
      <div v-if="formValues.isSendInformationEmail">
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
      </div>
      <phishing-settings-footer
        v-if="showFooter"
        class-name="mt-3"
        :save-disable="saveDisable"
        :save-button-disabled="saveButtonDisabled"
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
import { mapGetters } from 'vuex'
export default {
  name: 'EmailSettings',
  components: {
    FormGroup,
    InputEmail,
    PhishingSettingsFooter
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
    },
    saveButtonDisabled: {
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
        isSendInformationEmail: null,
        sendUsACopy: true,
        isMicrosoftDefenderIntegrationEnabled: false,
        defenderReportingEmailAddress: ''
      },
      initialFormValues: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        content: '',
        isSendInformationEmail: null,
        sendUsACopy: true,
        isMicrosoftDefenderIntegrationEnabled: false,
        defenderReportingEmailAddress: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      getIncidentResponderNotifiedEmailPermission:
        'permissions/getIncidentResponderNotifiedEmailPermission'
    }),
    getImportantIncidentResponderNoticeText() {
      return this.formValues.sendUsACopy
        ? 'This setting is enabled, allowing analysis and response to reported threats.'
        : 'This setting is disabled, preventing analysis and response to reported threats.'
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
        const baseRules = [
          (v) => validations.mail(v, labels.InvalidEmailAddress),
          (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
          (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress),
          (v) => this.validateInformationEmailNotSameAsDefenderEmail(v)
        ]
        const requiredRules = this.formValues.isSendInformationEmail
          ? [...baseRules, (v) => validations.required(v, labels.Required)]
          : baseRules
        return requiredRules
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
    },
    isDefenderEmailRequired() {
      return this.showForm ? !!this.formValues.isMicrosoftDefenderIntegrationEnabled : false
    },
    defenderEmailHint() {
      if (this.showForm) return this.formValues.isMicrosoftDefenderIntegrationEnabled ? '*Required' : null
      return null
    },
    defenderEmailRules() {
      if (this.showForm && this.formValues.isMicrosoftDefenderIntegrationEnabled) {
        return [
          (v) => validations.mail(v, labels.InvalidEmailAddress),
          (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
          (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress),
          (v) => validations.required(v, labels.Required),
          (v) => this.validateDefenderEmailNotSameAsInformationEmail(v)
        ]
      }
      return []
    }
  },
  watch: {
    formData: {
      handler(data) {
        if (!data) return
        const {
          to,
          cc,
          bcc,
          subject,
          content,
          isSendInformationEmail,
          sendUsACopy,
          isMicrosoftDefenderIntegrationEnabled,
          defenderReportingEmailAddress
        } = data
        this.formValues.to = to || ''
        this.formValues.cc = cc || ''
        this.formValues.bcc = bcc || ''
        this.formValues.subject = subject || ''
        this.formValues.content = content || ''
        if (isSendInformationEmail !== undefined) this.formValues.isSendInformationEmail = isSendInformationEmail
        if (sendUsACopy !== undefined) this.formValues.sendUsACopy = sendUsACopy
        if (isMicrosoftDefenderIntegrationEnabled !== undefined)
          this.formValues.isMicrosoftDefenderIntegrationEnabled = isMicrosoftDefenderIntegrationEnabled
        this.formValues.defenderReportingEmailAddress = defenderReportingEmailAddress || ''
        this.initialFormValues = structuredClone(this.formValues)
      }
    },
    formValues: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.initialFormValues)) {
          this.$emit('formValuesChanged', val)
        }
      },
      deep: true
    },
    'formValues.isMicrosoftDefenderIntegrationEnabled'(enabled) {
      if (!enabled) {
        this.formValues.defenderReportingEmailAddress = ''
      }
    }
  },
  created() {
    if (this.formData) {
      const {
        to,
        cc,
        bcc,
        subject,
        content,
        isSendInformationEmail,
        sendUsACopy,
        isMicrosoftDefenderIntegrationEnabled,
        defenderReportingEmailAddress
      } = this.formData
      this.formValues.to = to || ''
      this.formValues.cc = cc || ''
      this.formValues.bcc = bcc || ''
      this.formValues.subject = subject || ''
      this.formValues.content = content || ''
      this.formValues.isSendInformationEmail = isSendInformationEmail
      this.formValues.sendUsACopy = sendUsACopy
      this.formValues.isMicrosoftDefenderIntegrationEnabled =
        isMicrosoftDefenderIntegrationEnabled ?? false
      this.formValues.defenderReportingEmailAddress = defenderReportingEmailAddress || ''
      this.initialFormValues = structuredClone(this.formValues)
    }
    this.initialFormValues = structuredClone(this.formValues)
    this.$emit('getInitialFormValues', this.formValues)
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
    validateDefenderEmailNotSameAsInformationEmail(value) {
      const defenderEmail = (value || '').trim().toLowerCase()
      const infoEmail = (this.formValues.to || '').trim().toLowerCase()
      if (defenderEmail && infoEmail && defenderEmail === infoEmail) {
        return labels.DefenderEmailSameAsInformationEmail
      }
      return true
    },
    validateInformationEmailNotSameAsDefenderEmail(value) {
      const infoEmail = (value || '').trim().toLowerCase()
      const defenderEmail = (
        this.formValues.defenderReportingEmailAddress || ''
      ).trim().toLowerCase()
      if (
        infoEmail &&
        defenderEmail &&
        this.formValues.isMicrosoftDefenderIntegrationEnabled &&
        infoEmail === defenderEmail
      ) {
        return labels.InformationEmailSameAsDefenderEmail
      }
      return true
    }
  }
}
</script>
