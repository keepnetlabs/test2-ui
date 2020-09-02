<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New Notification Template'"
    icon-name="mdi-email"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <v-list-item class="pl-0 pr-0 mt-8">
        <v-list-item-content>
          <v-list-item-title class="new-smtp-setting__title">
            Create New Notification Template
          </v-list-item-title>
          <v-list-item-subtitle class="new-smtp-setting__sub-title mb-6">
            Define notification template settings and create email template
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-form ref="refForm" lazy-validation>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">Template Name</label>
            <v-text-field
              placeholder="Enter template name"
              outlined
              dense
              v-model.trim="formValues.name"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">Category</label>
            <v-select
              v-model.trim="formValues.category"
              :items="categoryItems"
              class="new-integration__select"
              dense
              outlined
              placeholder="Select Category"
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">SMTP</label>
            <v-select
              v-model.trim="formValues.smtp"
              :items="smtpItems"
              class="new-integration__select"
              dense
              outlined
              placeholder="Select SMTP"
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">From Email</label>
            <v-text-field
              placeholder="default@email.com"
              outlined
              dense
              :rules="[(v) => validations.mail(v, 'Invalid email address')]"
              v-model.trim="formValues.fromEmail"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">From Name</label>
            <v-text-field
              placeholder="Enter from name"
              outlined
              dense
              v-model.trim="formValues.fromName"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">Subject</label>
            <v-text-field
              placeholder="Enter subject"
              outlined
              dense
              v-model.trim="formValues.subject"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="new-integration__footer-btn-cancel" @click="closeOverlay" rounded>
        CANCEL
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
        >
          SAVE
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import { mail } from '@/utils/validations'
export default {
  name: 'NewNotificationTemplate',
  components: {
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValues: {
        name: '',
        category: '',
        smtp: '',
        fromEmail: '',
        fromName: ''
      },
      categoryItems: [],
      smtpItems: [],
      validations: {
        mail
      }
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {}
  }
}
</script>

<style></style>
