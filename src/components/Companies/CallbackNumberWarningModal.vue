<template>
  <AppDialog
    :status="status"
    icon="mdi-alert"
    title="Insufficient Callback Phone Numbers"
    id="callback-number-warning-modal"
    title-id="text--callback-number-warning-modal-title"
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body>
      There are <strong>{{ availableNumberCount }}</strong> callback phone numbers in the system.
      You can not choose Callback Simulator product license without callback phone numbers. Please
      get in touch with your support manager.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#2196F3" @click="closeOverlay">{{
          labels.Okay
        }}</v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
export default {
  name: 'CallbackNumberWarningModal',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    availableNumberCount: {
      type: Number
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
