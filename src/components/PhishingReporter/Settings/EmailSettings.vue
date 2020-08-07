<template>
  <v-container fluid tag="div" id="email-settings" class="email-settings">
    <v-list-item
      class="px-0 email-settings__list-item mt-0"
      style="max-width: 100%;"
      v-if="showHeader"
    >
      <v-list-item-content>
        <v-list-item-title class="email-settings__list-item--text email-settings__header"
          >Email Settings
        </v-list-item-title>
        <v-list-item-subtitle
          class="email-settings__list-item--text email-settings__sub-header mb-6"
          >Send a copy of reported emails as attachment
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <a
          href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
          class="other-settings__link"
          target="_blank"
          v-if="showHeaderLink"
        >
          Installation and configuration guide
        </a>
      </v-list-item-content>
    </v-list-item>
    <v-form ref="refForm" lazy-validation>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <v-checkbox
            v-model="formValues.isSendInformationEmail"
            class="other-settings__checkbox k-checkbox mt-2"
            color="#2196f3"
            label="Send information email for reported incidents"
            :readonly="!showForm"
          ></v-checkbox>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 email-settings__list-item mt-0">
        <v-list-item-content>
          <label class="email-settings__list-item--header" for="recipient-email-address"
            >Recipient Email Address</label
          >
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.to"
            :rules="
              showForm
                ? [
                    (v) => validations.mail(v, 'Invalid recipient email address'),
                    (v) => validations.maxLength(v, 255, 'It must between 1 - 255 characters')
                  ]
                : []
            "
            :readonly="!showForm"
            id="recipient-email-address"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header" for="cc">CC</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.cc"
            :rules="
              showForm
                ? [
                    (v) => validations.maxLength(v, 255, 'It must be maximum 55 characters'),
                    (v) => validations.mail(v, 'Invalid  email address')
                  ]
                : []
            "
            :readonly="!showForm"
            id="cc"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header" for="bcc">BCC</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.bcc"
            id="bcc"
            :readonly="!showForm"
            :rules="
              showForm
                ? [
                    (v) => validations.maxLength(v, 255, 'It must be maximum 55 characters'),
                    (v) => validations.mail(v, 'Invalid  email address')
                  ]
                : []
            "
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header" for="email-subject">Email Subject</label>
          <v-text-field
            placeholder="Suspicious Email"
            outlined
            dense
            class="k-textfield mt-2"
            v-model.trim="formValues.subject"
            id="email-subject"
            :rules="
              showForm
                ? [(v) => validations.maxLength(v, 255, 'It must be maximum 255 characters')]
                : []
            "
            :readonly="!showForm"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header" for="email-message">Email Message</label>
          <v-textarea
            placeholder="Please investigate the attached email"
            outlined
            dense
            no-resize
            class="mt-2"
            v-model.trim="formValues.content"
            :rules="
              showForm
                ? [(v) => validations.maxLength(v, 1000, 'It must maximum 1000 characters')]
                : []
            "
            :readonly="!showForm"
            id="email-message"
          ></v-textarea>
        </v-list-item-content>
      </v-list-item>
      <phishing-settings-footer
        v-if="showFooter"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
      />
    </v-form>
  </v-container>
</template>

<script>
import { maxLength, mail, required } from '../../../utils/validations'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'
export default {
  name: 'EmailSettings',
  components: {
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
    }
  },
  data() {
    return {
      formValues: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        content: '',
        IsSendInformationEmail: null
      },
      validations: {
        maxLength,
        mail,
        required
      }
    }
  },
  methods: {
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        return false
      }
    },
    getFormValues() {
      const result = this.$refs.refForm.validate()
      if (result) {
        return this.formValues
      } else {
        return false
      }
    },
    handleEmailAddressChange(value) {
      if (!value) {
        this.hasError = true
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
  }
}
</script>

<style lang="scss">
.email-settings {
  &__list-item {
    max-width: 554px;
    margin-top: -8px;
    &--text {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
    .v-list-item__content {
      padding: 0 !important;
      overflow: visible;
    }

    &--header {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    &--sub-header {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
    }
  }

  &__header {
    font-size: 24px;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    overflow: visible;
  }
  &__sub-header {
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    overflow: visible;
  }

  &__btn-util {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    max-height: 36px;
  }

  &__required__text {
    font-family: 'Open Sans', sans-serif !important;
    margin-top: -36px;
    z-index: 9;
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    margin-left: 10px;
    letter-spacing: normal;
    color: #474747 !important;
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }
}
</style>
