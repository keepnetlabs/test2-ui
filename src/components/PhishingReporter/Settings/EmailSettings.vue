<template>
  <v-container fluid tag="div" id="email-settings" class="email-settings">
    <v-list-item class="px-0 list__item" v-if="showHeader">
      <v-list-item-content>
        <v-list-item-title class="list__item__text list__item__header">Send Suspicious Emails To
        </v-list-item-title>
        <v-list-item-subtitle class="list__item__text list__item__sub-header">Send a copy of
          reported emails as attachment
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-form ref="refForm" lazy-validation>
      <v-list-item class="px-0 list__item mt-4">
        <v-list-item-content>
          <label class="list__item__header" for="recipient-email-address">Recipient Email
            Address</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            class="email-settings__textfield mt-2"
            v-model="formValues.to"
            :rules="[v=> validations.required(v,'Required'),
            v=> validations.mail(v,'Invalid recipient email address'),v=>validations.maxLength(v,255,'It must between 1 - 255 characters')]"
            id="recipient-email-address"
            height="40"
          ></v-text-field>
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
            :rules="[v=> validations.mail(v,'Invalid to address'),  v=>validations.maxLength(v,255,'It must between 1 - 255 characters')]"
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
            :rules="[v=> validations.mail(v,'Invalid bcc address'),v=>validations.maxLength(v,255,'It must between 1 - 255 characters')]"
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
            :rules="[v=>validations.maxLength(v,255,'It must between 1 - 255 characters')]"
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
            :rules="[v=>validations.maxLength(v,1000,'It must between 1 - 1000 characters')]"
            id="email-message"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-btn @click="submit" rounded class="white--text btn-util" color="#2196f3" v-if="showFooter">
        SAVE CHANGES
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
  import {maxLength, mail, required} from "../../../utils/validations";

  export default {
    name: "EmailSettings",
    props: {
      showHeader: {
        type: Boolean,
        default: true
      },
      showFooter: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        formValues: {
          to: "",
          cc: "",
          bcc: "",
          subject: "",
          content: "",
        },
        validations: {
          maxLength,
          mail,
          required

        }
      }
    },
    methods: {
      submit() {
        return this.$refs.refForm.validate() && this.formValues
      }
    }
  }
</script>

<style scoped lang="scss">

  .email-settings {
    font-family: "Open Sans", sans-serif !important;

    &__textfield {
      font-family: "Open Sans", sans-serif !important;
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
    font-family: "Open Sans", sans-serif !important;
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
    margin-bottom: 6px;
  }

  ::v-deep .v-list-item__content {
    padding: 0 !important;
  }
</style>
