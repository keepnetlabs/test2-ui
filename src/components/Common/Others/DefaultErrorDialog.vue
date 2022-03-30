<template>
  <app-dialog
    v-if="status"
    :status="status"
    title="Error Occurred"
    icon="mdi-alert"
    className="k-dialog-error"
    title-id="text--error-popup-title"
    :body="errorMessage"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--error-popup"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleCloseDialog"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'DefaultErrorDialog',
  components: { AppDialog },
  props: {
    status: {
      type: Boolean
    },
    errorMessage: {
      type: String
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('on-close')
    }
  }
}
</script>
