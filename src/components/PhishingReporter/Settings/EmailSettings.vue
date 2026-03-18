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
          >Configure how reported emails are processed and shared.
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-form class="email-settings__form" ref="refForm" lazy-validation>
      <!-- Platform Email Analysis -->
      <div class="email-settings__card mt-6">
        <div class="email-settings__card-title">Platform Email Analysis</div>
        <div class="email-settings__card-subtitle">
          Automatically analyze reported emails with Incident Responder.
        </div>
        <div class="email-settings__information mt-4 mb-0">
          <div>
            <VIcon color="#2196f3">mdi-alert-circle</VIcon>
          </div>
          <div class="email-settings__information-text">
            Platform emails (simulations, trainings, notifications) are always reportable for metrics.
          </div>
        </div>
        <div class="email-settings__switch-row mt-4">
          <v-tooltip bottom :disabled="getIncidentResponderNotifiedEmailPermission" max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  v-model="sendUsACopyModel"
                  id="input--phishing-reporter-is-send-copy"
                  color="#2196f3"
                  hide-details
                  :disabled="!getIncidentResponderNotifiedEmailPermission"
                  :readonly="!showForm"
                ></v-switch>
              </div>
            </template>
            <span>An Incident Responder license is required. Your company must purchase it to access this feature.</span>
          </v-tooltip>
          <div class="email-settings__switch-content">
            <div class="email-settings__switch-label">
              Send reported emails to platform for analysis
            </div>
            <div class="email-settings__switch-description">
              Reported emails are analyzed using your configured integrations, rules, and playbooks.
            </div>
          </div>
        </div>
      </div>
      <!-- Microsoft 365 Defender Integration -->
      <div :class="['email-settings__card mt-6', { 'email-settings__card--expanded': formValues.isMicrosoftDefenderIntegrationEnabled }]">
        <div class="email-settings__card-title">Microsoft 365 Defender Integration</div>
        <div class="email-settings__card-subtitle">
          Forward reported emails to Microsoft 365 Defender for additional analysis.
        </div>
        <div class="email-settings__switch-row mt-4">
          <v-switch
            v-model="formValues.isMicrosoftDefenderIntegrationEnabled"
            id="input--phishing-reporter-microsoft-defender-integration"
            color="#2196f3"
            hide-details
            :readonly="!showForm"
          ></v-switch>
          <div class="email-settings__switch-content">
            <div class="email-settings__switch-label">
              Forward reported emails to Microsoft 365 Defender
            </div>
          </div>
        </div>
        <div
          v-if="formValues.isMicrosoftDefenderIntegrationEnabled"
          class="email-settings__information mt-4 mb-0"
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
      </div>
      <!-- Team Alerts -->
      <div :class="['email-settings__card mt-6', { 'email-settings__card--expanded': formValues.isSendInformationEmail }]">
        <div class="email-settings__card-title">Team Alerts</div>
        <div class="email-settings__card-subtitle">
          Alert your security teams when phishing is reported so they can investigate and respond.
        </div>
        <div class="email-settings__switch-row mt-4">
          <v-switch
            v-model="formValues.isSendInformationEmail"
            id="input--phishing-reporter-is-send-email"
            color="#2196f3"
            hide-details
            :readonly="!showForm"
          ></v-switch>
          <div class="email-settings__switch-content">
            <div class="email-settings__switch-label">
              Send information email for reported incidents
            </div>
          </div>
        </div>
        <div v-if="formValues.isSendInformationEmail" class="mt-4">
        <InputEmail
          v-model.trim="formValues.to"
          id="input--phishing-reporter-recipient-email-address"
          label="Primary Recipient"
          persistent-placeholder
          :required="isRecipientEmailRequired"
          :persistent-hint="isRecipientEmailRequired"
          :hint="recipientEmailHint"
          :rules="recipientEmailRules"
          :readonly="!showForm"
        />
        <InputEmail
          v-model.trim="formValues.cc"
          id="input--phishing-reporter-cc-email-address"
          label="CC"
          persistent-placeholder
          :persistent-hint="false"
          :required="false"
          :hint="null"
          :rules="ccEmailRules"
          :readonly="!showForm"
        />
        <InputEmail
          v-model.trim="formValues.bcc"
          id="input--phishing-reporter-bcc-email-address"
          label="BCC"
          persistent-placeholder
          :readonly="!showForm"
          :persistent-hint="false"
          :required="false"
          :hint="null"
          :rules="ccEmailRules"
        />
        <div class="email-settings__subject-field">
          <InputEmail
            v-model.trim="formValues.subject"
            id="input--phishing-reporter-email-subject"
            label="Email Subject"
            placeholder="Suspicious Email: {SUBJECT}"
            persistent-placeholder
            :required="isRecipientEmailRequired"
            :persistent-hint="isRecipientEmailRequired"
            :hint="recipientEmailHint"
            :rules="emailSubjectRules"
            :readonly="!showForm"
          />
          <div class="email-settings__subject-helper">
            Use {SUBJECT} merge tag as a variable for reported emails' subject
          </div>
        </div>
        <InputEmail
          v-model.trim="formValues.content"
          placeholder="Please investigate the attached email"
          id="input--phishing-reporter-recipient-email-message"
          label="Email Message"
          persistent-placeholder
          :required="isRecipientEmailRequired"
          :persistent-hint="isRecipientEmailRequired"
          :hint="recipientEmailHint"
          :rules="emailMessageRules"
          :readonly="!showForm"
        />
      </div>
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
    sendUsACopyModel: {
      get() {
        return this.getIncidentResponderNotifiedEmailPermission ? this.formValues.sendUsACopy : false
      },
      set(val) {
        this.formValues.sendUsACopy = val
      }
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
