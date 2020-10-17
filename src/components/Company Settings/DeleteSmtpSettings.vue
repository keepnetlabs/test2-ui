<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete SMTP Setting?"
    :subtitle="getSubtitle"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      This Smtp Settings template will be deleted. All data will be lost.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#f56c6c" @click="handleCloseDialog">CANCEL</v-btn>
        <v-btn class="users__button" text color="#2196f3" @click="handleDelete">DELETE</v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'DeleteSmtpSettings',
  components: {
    AppDialog
  },
  props: {
    data: {
      type: Object
    },
    status: {
      type: Boolean
    }
  },
  computed: {
    getSubtitle() {
      return this.data && this.data.name
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeOverlay')
    },
    handleDelete() {
      this.$emit('handleDelete', this.data)
    }
  }
}
</script>
