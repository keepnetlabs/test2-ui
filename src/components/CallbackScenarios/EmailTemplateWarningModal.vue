<template>
  <AppDialog
    type="delete"
    :status="status"
    icon="mdi-alert"
    title="Warning"
    :subtitle="templateName"
    id="callback-email-template-create-default-template-warning-popup"
    title-id="text--callback-email-template-create-default-template-warning-popup-title"
    subtitle-id="text--callback-email-template-create-default-template-warning-popup-subtitle"
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body
      >You must insert {PHISHING_CODE} ve {PHISHING_CALLBACK_PHONE} merge tag to your email design
      for phishing campaign to work correctly</template
    >
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn
          id="btn-delete--notification-template-close-default-template-warning-popup"
          class="users__button"
          text
          color="#2196F3"
          @click="closeOverlay"
          >{{ labels.Okay }}</v-btn
        >
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
export default {
  name: 'CallbackEmailTemplateWarningModal',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    templateName: {
      type: String
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  }
}
</script>
