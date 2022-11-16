<template>
  <app-dialog
    size="big"
    :status="status"
    v-if="status"
    icon="mdi-email"
    :title="'Send Welcome Email To New User'"
    subtitle="Send membership and login information"
    class-name="send-welcome-email"
    max-height-size="600px"
    max-height
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body>
      <v-form ref="refForm" lazy-validation>
        <form-group title="SMTP Settings" sub-title="Select SMTP profile">
          <k-select
            v-model="formValues.smtp"
            placeholder="Select Option"
            outlined
            dense
            :items="smtpItems"
          ></k-select>
        </form-group>
        <form-group title="From Name" sub-title="Enter a name to show as sender name">
          <v-text-field
            v-model.trim="formValues.fromName"
            outlined
            dense
            placeholder="Enter from name"
          ></v-text-field>
        </form-group>
        <form-group
          title="From Email Address"
          sub-title="Enter email address to show as sender email address"
        >
          <InputEmail
            v-model.trim="formValues.fromEmailAddress"
            :persistent-hint="false"
            :hint="null"
            :rules="[
              (v) => Validations.startsWithSpace(v, 'Cannot start with space'),
              (v) => Validations.email(v, 'Invalid email address'),
              (v) => Validations.minLength(v, 8, 'Minimum 8 characters'),
              (v) => Validations.maxLength(v, 254, 'Email address cannot exceed 254 characters')
            ]"
          />
        </form-group>
        <form-group title="Subject">
          <v-text-field
            v-model.trim="formValues.subject"
            placeholder="Enter subject"
            outlined
            dense
          ></v-text-field>
        </form-group>
        <form-group title="Choose time">
          <v-radio-group
            v-model="formValues.chooseTime"
            class="send-welcome-email__radio-group"
            hide-details
          >
            <v-radio value="SendImmediately" label="Send immediately" color="#2196f3"></v-radio>
            <v-radio value="Schedule" label="Schedule" color="#2196f3"></v-radio>
          </v-radio-group>
        </form-group>
        <form-group>
          <InputDate
            v-model="formValues.date"
            type="datetime"
            class="send-welcome-email__date-picker"
          />
        </form-group>
      </v-form>
    </template>
    <template #app-dialog-footer>
      <div class="send-welcome-email__footer">
        <v-btn
          color="#00bcd4"
          class="send-welcome-email__footer-button ml-n4"
          text
          @click="closeOverlay"
          >I’LL DO IT LATER</v-btn
        >
        <v-btn
          color="#2196f3"
          class="send-welcome-email__footer-button mr-n4"
          text
          @click="handleSend"
          >SEND</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as Validations from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputDate from '@/components/Common/Inputs/InputDate'
import InputEmail from '@/components/Common/Inputs/InputEmail'
export default {
  name: 'SendWelcomeEmailToNewUserModal',
  components: {
    KSelect,
    AppDialog,
    FormGroup,
    InputDate,
    InputEmail
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Validations: Validations,
      formValues: {
        smtp: '',
        fromName: '',
        fromEmailAddress: '',
        subject: '',
        chooseTime: 'SendImmediately',
        date: ''
      },
      smtpItems: []
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    handleSend() {
      this.$emit('sendEmail')
    }
  }
}
</script>
