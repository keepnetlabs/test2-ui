<template>
  <v-container fluid tag="div" id="email-settings" class="email-settings">
    <v-list-item class="px-0 list__item" v-if="showHeader">
      <v-list-item-content>
        <v-list-item-title class="list__item__text list__item__header"
          >Send Suspicious Emails To
        </v-list-item-title>
        <v-list-item-subtitle class="list__item__text list__item__sub-header"
          >Send a copy of reported emails as attachment
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-form ref="refForm" lazy-validation>
      <v-list-item
        class="px-0 list__item mt-4"
        :class="[!hasError && !formValues.to ? 'mb-2' : '']"
      >
        <v-list-item-content>
          <label class="list__item__header" for="recipient-email-address"
            >Recipient Email Address</label
          >
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="email-settings__textfield mt-2"
            v-model="formValues.to"
            :rules="[
              v => validations.required(v, 'Required'),
              v => validations.mail(v, 'Invalid recipient email address'),
              v => validations.maxLength(v, 255, 'It must between 1 - 255 characters')
            ]"
            id="recipient-email-address"
            @input="handleEmailAddressChange"
            @blur="hasError = true"
            height="40"
          ></v-text-field>
          <div v-if="!hasError && !formValues.to" class="required__text">
            *Required
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 list__item">
        <v-list-item-content>
          <label class="list__item__header" for="cc">CC</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="email-settings__textfield mt-2"
            v-model="formValues.cc"
            id="cc"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 list__item">
        <v-list-item-content>
          <label class="list__item__header" for="bcc">BCC</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="email-settings__textfield mt-2"
            v-model="formValues.bcc"
            id="bcc"
            :rules="[v => validations.maxLength(v, 255, 'It must be maximum 55 characters')]"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 list__item">
        <v-list-item-content>
          <label class="list__item__header" for="email-subject">Email Subject</label>
          <v-text-field
            placeholder="Suspicious Email"
            outlined
            dense
            class="email-settings__textfield mt-2"
            v-model.trim="formValues.subject"
            id="email-subject"
            :rules="[v => validations.maxLength(v, 255, 'It must be maximum 255 characters')]"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 list__item">
        <v-list-item-content>
          <label class="list__item__header" for="email-message">Email Message</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="email-settings__textfield mt-2"
            v-model.trim="formValues.content"
            :rules="[v => validations.maxLength(v, 1000, 'It must maximum 1000 characters')]"
            id="email-message"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-btn
        @click="submit"
        rounded
        class="white--text btn-util mt-3"
        color="#2196f3"
        style="margin-bottom: 6px"
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

<style scoped lang="scss">
.email-settings {
  font-family: 'Open Sans', sans-serif !important;

  &__textfield {
    font-family: 'Open Sans', sans-serif !important;
    border-radius: 8px;
    background-color: #ffffff;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    max-width: 554px !important;
  }
}

.list__item {
  &__text {
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    font-stretch: normal;
    font-style: normal;
  }

  &__header {
    @extend .list__item__text;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  &__sub-header {
    @extend .list__item__text;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
  }
}

.v-list-item__content {
  padding: 5px 0 !important;
}

.btn-util {
  font-family: 'Open Sans', sans-serif !important;
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

::v-deep .v-list-item__content > *:not(:last-child) {
  // margin-bottom: 6px;
}

::v-deep .v-list-item__content {
  padding: 0 !important;
}

.required__text {
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
</style>
