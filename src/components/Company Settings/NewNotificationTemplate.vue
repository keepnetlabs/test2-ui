<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New Notification Template'"
    icon-name="mdi-email"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="Create New Notification Template"
        sub-title="Define notification template settings and create email template"
      />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name">
          <v-text-field
            placeholder="Enter template name"
            outlined
            dense
            v-model.trim="formValues.name"
          ></v-text-field>
        </form-group>
        <form-group title="Category">
          <k-select
            v-model.trim="formValues.category"
            :items="categoryItems"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
          />
        </form-group>
        <form-group title="SMTP">
          <k-select
            v-model.trim="formValues.smtp"
            :items="smtpItems"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
          />
        </form-group>
        <form-group title="From Email">
          <v-text-field
            placeholder="Enter from email"
            outlined
            dense
            :rules="[(v) => validations.mail(v, 'Invalid email address')]"
            v-model.trim="formValues.fromEmail"
          ></v-text-field>
        </form-group>
        <form-group title="From Name">
          <v-text-field
            placeholder="Enter from name"
            outlined
            dense
            v-model.trim="formValues.fromName"
          ></v-text-field>
        </form-group>
        <form-group title="Subject">
          <v-text-field
            placeholder="Enter subject"
            outlined
            dense
            v-model.trim="formValues.subject"
          ></v-text-field>
        </form-group>
        <form-group title="Email Template" class-name="email-template">
          <email-template />
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import {mail} from '@/utils/validations'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  name: 'NewNotificationTemplate',
  components: {
    KSelect,
    EmailTemplate,
    AppModal,
    AppModalBodyHeader,
    FormGroup
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
