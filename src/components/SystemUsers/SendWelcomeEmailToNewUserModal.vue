<template>
  <app-dialog
    size="big"
    :status="status"
    icon="mdi-email"
    :title="'Send Welcome Email To New User'"
    subtitle="Send membership and login information"
    @changeStatus="closeOverlay"
    class-name="send-welcome-email"
    max-height-size="600px"
    max-height
  >
    <template v-slot:app-dialog-body>
      <v-form ref="refForm" lazy-validation>
        <form-group title="SMTP Settings" sub-title="Select SMTP profile">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="smtpItems"
            v-model="formValues.smtp"
          ></v-select>
        </form-group>
        <form-group title="From Name" sub-title="Enter a name to show as sender name">
          <v-text-field
            placeholder="Enter from name"
            outlined
            dense
            v-model.trim="formValues.fromName"
          ></v-text-field>
        </form-group>
        <form-group
          title="From Email Address"
          sub-title="Enter email address to show as sender email address"
        >
          <v-text-field
            placeholder="Enter from email address"
            outlined
            dense
            v-model.trim="formValues.fromEmailAddress"
            :rules="[(v) => validations.mail(v, 'Invalid email address')]"
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
          <el-date-picker
            v-model="formValues.date"
            type="datetime"
            placeholder="11.08.2020 13:08 AM"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="send-welcome-email__date-picker"
          >
          </el-date-picker
        ></form-group>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="send-welcome-email__footer">
        <v-btn
          @click="closeOverlay"
          color="#00bcd4"
          class="send-welcome-email__footer-button ml-n4"
          text
          >I’LL DO IT LATER</v-btn
        >
        <v-btn
          @click="handleSend"
          color="#2196f3"
          class="send-welcome-email__footer-button mr-n4"
          text
          >SEND</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { mail } from '@/utils/validations'
export default {
  name: 'SendWelcomeEmailToNewUserModal',
  components: {
    AppDialog,
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
        smtp: '',
        fromName: '',
        fromEmailAddress: '',
        subject: '',
        chooseTime: 'SendImmediately',
        date: ''
      },
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
    handleSend() {
      this.$emit('sendEmail')
    }
  }
}
</script>

<style lang="scss">
.send-welcome-email {
  &__footer {
    display: flex;
    justify-content: space-between;
    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #00bcd4;
    }
  }
  &__radio-group {
    &.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
    }
  }

  &__date-picker {
    margin-left: 24px;
  }
}
</style>
