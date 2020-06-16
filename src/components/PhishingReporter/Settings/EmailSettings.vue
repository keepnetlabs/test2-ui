<template>
  <v-container fluid tag="div" id="email-settings" class="email-settings">
    <v-list-item class="px-0 email-settings__list-item mt-n1" v-if="showHeader">
      <v-list-item-content>
        <v-list-item-title class="email-settings__list-item--text email-settings__header"
          >Send Suspicious Emails To
        </v-list-item-title>
        <v-list-item-subtitle
          class="email-settings__list-item--text email-settings__sub-header mb-6"
          >Send a copy of reported emails as attachment
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-form ref="refForm" lazy-validation>
      <v-list-item
        class="px-0 email-settings__list-item"
        :class="[!hasError && !formValues.to ? 'mb-2' : '']"
      >
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
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.mail(v, 'Invalid recipient email address'),
              (v) => validations.maxLength(v, 255, 'It must between 1 - 255 characters')
            ]"
            id="recipient-email-address"
            @input="handleEmailAddressChange"
            @blur="hasError = true"
            height="40"
          ></v-text-field>
          <div v-if="!hasError && !formValues.to" class="email-settings__required__text">
            *Required
          </div>
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
            :rules="[
              (v) => validations.maxLength(v, 255, 'It must be maximum 55 characters'),
              (v) => validations.mail(v, 'Invalid  email address')
            ]"
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
            :rules="[
              (v) => validations.maxLength(v, 255, 'It must be maximum 55 characters'),
              (v) => validations.mail(v, 'Invalid  email address')
            ]"
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
            :rules="[(v) => validations.maxLength(v, 255, 'It must be maximum 255 characters')]"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 email-settings__list-item">
        <v-list-item-content>
          <label class="email-settings__list-item--header" for="email-message">Email Message</label>
          <v-text-field
            placeholder="Please investigate the attached email"
            outlined
            dense
            class="k-textfield mt-2"
            v-model.trim="formValues.content"
            :rules="[(v) => validations.maxLength(v, 1000, 'It must maximum 1000 characters')]"
            id="email-message"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-btn
        @click="submit"
        rounded
        class="white--text email-settings__btn-util mt-3"
        color="#2196f3"
        style="margin-bottom: 6px;"
        v-if="showFooter"
      >
        SAVE CHANGES
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { maxLength, mail, required } from '../../../utils/validations'

export default {
  name: 'EmailSettings',
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
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
        content: ''
      },
      hasError: false,
      validations: {
        maxLength,
        mail,
        required
      }
    }
  },
  methods: {
    submit() {
      const result = this.$refs.refForm.validate()
      if (!result) {
        this.hasError = true
        return false
      } else {
        this.$emit('updateForm', this.formValues)
        return this.formValues
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
      const { to, cc, bcc, subject, content } = this.formData
      this.formValues.to = to || ''
      this.formValues.cc = cc || ''
      this.formValues.bcc = bcc || ''
      this.formValues.subject = subject || ''
      this.formValues.content = content || ''
    }
  }
}
</script>

<style lang="scss">
.email-settings {
  &__list-item {
    max-width: 554px;
    margin-top: -4px;
    &--text {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
    .v-list-item__content {
      padding: 0 !important;
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
  }
  &__sub-header {
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__btn-util {
    font-size: 14px;
    font-weight: 500;
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
