<template>
  <app-dialog
    :status="status"
    icon="mdi-send"
    title="Send Test Email"
    class-name="smtp-settings-test-email"
    subtitle="Test SMTP settings"
    custom-size="600"
    max-height-size="516px"
    id="smtp-settings-delete-popup"
    title-id="text--smtp-settings-test-email-popup-title"
    subtitle-id="text--smtp-settings-test-email-popup-subtitle"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      <v-form ref="refForm" lazy-validation>
        <form-group title="Send Test Email To" has-hint>
          <input-email v-model.trim="formValues.to" id="input--smtp-settings-test-email-to" />
        </form-group>
        <form-group title="Sender Email Address" has-hint>
          <input-email
            v-model.trim="formValues.from"
            id="input--smtp-settings-test-email-sender-email"
          />
        </form-group>
        <form-group title="Sender Name" has-hint>
          <v-text-field
            v-model.trim="formValues.fromName"
            id="input--smtp-settings-test-email-sender-name"
            outlined
            dense
            persistent-hint
            hint="*Required"
            placeholder="Enter sender name"
            :rules="[
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) => Validations.maxLength(v, 64, 'Sender Name')
            ]"
          />
        </form-group>
        <form-group title="Message" has-hint>
          <v-textarea
            v-model.trim="formValues.message"
            id="input--smtp-settings-test-email-message"
            rows="2"
            no-resize
            height="120"
            dense
            outlined
            hint="*Required"
            persistent-hint
            placeholder="Enter message"
            :rules="[
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) => Validations.maxLength(v, 300, 'Message')
            ]"
          ></v-textarea>
        </form-group>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--smtp-settings-test-email-popup"
        confirm-button-id="btn-confirm--smtp-settings-test-email-popup"
        action-button-text="SEND"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleConfirm"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import * as Validations from '@/utils/validations'
export default {
  name: 'TestEmailDialog',
  components: { InputEmail, FormGroup, AppDialogFooter, AppDialog },
  props: {
    isActionButtonDisabled: {
      type: Boolean
    },
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      Validations,
      formValues: {
        to: '',
        from: '',
        fromName: '',
        message: ''
      }
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeDialog')
    },
    handleConfirm() {
      if (this.$refs.refForm.validate()) {
        this.$emit('confirm', this.formValues)
      }
    }
  }
}
</script>

<style lang="scss">
.smtp-settings-test-email {
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 0;
  }
  .k-dialog__body {
    overflow-y: initial;
  }
}
</style>
