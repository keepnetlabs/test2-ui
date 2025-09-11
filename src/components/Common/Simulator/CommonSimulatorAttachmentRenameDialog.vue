<template>
  <AppDialog :status="status" title="Rename The Attachment" @changeStatus="handleClose">
    <template #app-dialog-body>
      <v-form ref="refAttachmentNameForm" @submit.prevent>
        <v-text-field
          v-model.trim="attachmentName"
          v-bind="commonRules"
          id="input--new-email-templates-template-name"
          placeholder="Enter a name"
          hint="*Required"
          required
          outlined
          dense
          persistent-hint
          @keyup.enter="handleConfirm"
        />
      </v-form>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter @handleClose="handleClose" @handleConfirm="handleConfirm" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import AppDialog from '@/components/AppDialog.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'CommonSimulatorAttachmentRenameDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    defaultAttachmentName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      attachmentName: this.defaultAttachmentName,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName)),
          (v) => Validations.noDots(v, labels.CannotContainDots)
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      if (this.$refs.refAttachmentNameForm.validate()) {
        this.$emit('on-confirm', this.attachmentName)
      }
    }
  }
}
</script>
