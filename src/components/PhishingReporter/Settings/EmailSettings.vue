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
      <v-list-item-content>
        <a
          href="https://doc.keepnetlabs.com/beta-modules/incident-responder#2-phishing-reporter"
          class="other-settings__link"
          target="_blank"
          v-if="showHeaderLink"
        >
          Installation and configuration guide
        </a>
      </v-list-item-content>
    </v-list-item>
    <v-form class="email-settings__form" ref="refForm" lazy-validation>
      <v-list-item class="px-0 email-settings__list-item email-settings__checkbox-container">
        <v-list-item-content>
          <v-checkbox
            v-model="formValues.isSendInformationEmail"
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
            :required="showForm ? !!formValues.isSendInformationEmail : false"
            :persistent-hint="showForm ? !!formValues.isSendInformationEmail : false"
            :hint="showForm ? (formValues.isSendInformationEmail ? '*Required' : null) : null"
            :rules="
              showForm
                ? formValues.isSendInformationEmail
                  ? [
                      (v) => validations.mail(v, labels.InvalidEmailAddress),
                      (v) =>
                        validations.maxLength(
                          v,
                          320,
                          labels.getMaxLengthMessage(labels.Email, 320)
                        ),
                      (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : [
                      (v) => validations.mail(v, labels.InvalidEmailAddress),
                      (v) =>
                        validations.maxLength(
                          v,
                          320,
                          labels.getMaxLengthMessage(labels.Email, 320)
                        ),
                      (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress)
                    ]
                : []
            "
            :readonly="!showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">CC</label>
          <InputEmail
            class="k-textfield mt-2"
            v-model.trim="formValues.cc"
            :persistent-hint="false"
            :required="false"
            :hint="null"
            :rules="
              showForm
                ? [
                    (v) =>
                      validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
                    (v) => validations.mail(v, labels.InvalidEmailAddress),
                    (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress)
                  ]
                : []
            "
            :readonly="!showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">BCC</label>
          <InputEmail
            class="k-textfield mt-2"
            v-model.trim="formValues.bcc"
            :readonly="!showForm"
            :persistent-hint="false"
            :required="false"
            :hint="null"
            :rules="
              showForm
                ? [
                    (v) =>
                      validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
                    (v) => validations.mail(v, labels.InvalidEmailAddress),
                    (v) => validations.controlEmailLength(v, labels.InvalidEmailAddress)
                  ]
                : []
            "
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Email Subject</label>
          <InputEmail
            placeholder="Suspicious Email"
            class="k-textfield mt-2"
            v-model.trim="formValues.subject"
            :required="showForm ? !!formValues.isSendInformationEmail : false"
            :persistent-hint="showForm ? !!formValues.isSendInformationEmail : false"
            :hint="showForm ? (formValues.isSendInformationEmail ? '*Required' : null) : null"
            :rules="
              showForm
                ? formValues.isSendInformationEmail
                  ? [
                      (v) =>
                        this.validations.maxLength(
                          v,
                          64,
                          labels.getMaxLengthMessage('Email subject')
                        ),
                      (v) => this.validations.required(v, labels.Required)
                    ]
                  : [
                      (v) =>
                        this.validations.maxLength(
                          v,
                          64,
                          labels.getMaxLengthMessage('Email subject')
                        )
                    ]
                : []
            "
            :readonly="!showForm"
          ></InputEmail>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header">Email Message</label>
          <v-textarea
            placeholder="Please investigate the attached email"
            outlined
            dense
            no-resize
            class="mt-2"
            :required="showForm ? !!formValues.isSendInformationEmail : false"
            :persistent-hint="showForm ? !!formValues.isSendInformationEmail : false"
            :hint="showForm ? (formValues.isSendInformationEmail ? '*Required' : null) : null"
            v-model.trim="formValues.content"
            :rules="
              showForm
                ? formValues.isSendInformationEmail
                  ? [
                      (v) =>
                        this.validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('Message', 256)
                        ),
                      (v) => this.validations.required(v, labels.Required)
                    ]
                  : [
                      (v) =>
                        this.validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('Message', 256)
                        )
                    ]
                : []
            "
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
  }
}
</script>

<style lang="scss">
.email-settings {
  &__list-item {
    max-width: 554px;
    //margin-top: -2px;
    .v-text-field.v-text-field--enclosed .v-text-field__details {
      margin-bottom: 6px;
    }
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

  &__form {
    .email-settings__list-item {
      margin-bottom: 3px;
    }
  }

  &__checkbox {
    z-index: 6;
  }

  &__checkbox-container {
    padding-top: 14px !important;
    padding-bottom: 6px !important;
    margin-top: 0 !important;
  }

  &__header {
    font-size: 24px !important;
    line-height: 1.29 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    overflow: visible;
    opacity: 0.9;
    &-container {
      max-width: 100% !important;
    }
  }
  &__sub-header {
    font-size: 14px;
    line-height: 1.5 !important;
    opacity: 0.9;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    overflow: visible;
  }

  &__btn-util {
    font-size: 14px;
    font-weight: 600;
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
