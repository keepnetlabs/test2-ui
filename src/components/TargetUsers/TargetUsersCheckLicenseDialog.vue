<template>
  <app-dialog
    v-if="status"
    icon="mdi-license"
    title="License Warning"
    subtitle="License limit exceeded"
    title-id="text--target-users-license-warning-popup-title"
    subtitle-id="text--target-users-license-warning-popup-subtitle"
    :status="status"
    :body="dialogBody"
    @changeStatus="closeDialog"
  >
    <template #app-dialog-footer>
      <slot name="footer">
        <div class="d-flex justify-end">
          <v-btn text color="#2196f3" class="k-dialog__button" @click="closeDialog">
            {{ labels.OK }}
          </v-btn>
        </div>
      </slot>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
export default {
  name: 'TargetUsersCheckLicenseDialog',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    dialogBody: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-overlay')
    }
  }
}
</script>
