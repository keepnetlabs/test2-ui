<template>
  <AppDialog
    v-if="status"
    className="deselect-phone-number-modal"
    :status="true"
    custom-size="480"
    icon="mdi-close"
    title="Unlink Callback Phone Number"
    title-id="text--deselect-phone-number-modal-title"
    dialogBodyClass="deselect-phone-number-modal--body"
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <p>
        Do you want to unlink this callback phone number from your profile? You can select other
        callback phone numbers using the “Select Phone Numbers” button, as many as allowed by your
        license limit.
      </p>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn
          id="btn-cancel--company-save-company-groups-popup"
          @click="changeStatus(false)"
          color="#f56c6c"
          class="delete-user__footer-button"
          text
          :disabled="isLoading"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-save--company-save-company-groups-popup"
          @click="confirm"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          :disabled="isLoading"
          >UNLINK</v-btn
        >
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'

export default {
  name: 'DeselectPhoneNumberModal',
  components: {
    AppDialog
  },
  props: {
    isLoading: {
      type: Boolean
    },
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    changeStatus() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
