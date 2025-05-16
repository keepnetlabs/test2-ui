<template>
  <AppDialog
    v-if="status"
    title-id="text--campaign-manager-delete-popup-title"
    subtitle-id="text--campaign-manager-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> {{ content }} </template>
    <template #app-dialog-footer>
      <div :class="`d-flex download-buttons flex-row flex-wrap justify-space-between`">
        <v-btn type="button" text color="#F56C6C" class="k-dialog__button" @click="handleClose">
          Cancel
        </v-btn>
        <v-btn text color="#383B41" class="k-dialog__button" @click="handleDiscard">
          Discard Changes
        </v-btn>
        <v-btn text color="#2196F3" class="k-dialog__button" @click="handleConfirm">
          Save Changes
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'EditLanguagesLeavingDialog',
  components: { AppDialog },
  props: {
    beforeSaveLanguage: {
      type: String,
      default: ''
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-alert',
        title: labels.YourDataWillBeLost
      },
      content: 'You have unsaved changes in this language. If you switch, your edits will be lost.'
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleDiscard() {
      this.$emit('on-discard', this.beforeSaveLanguage)
    },
    handleConfirm() {
      this.$emit('on-confirm', this.beforeSaveLanguage)
    }
  }
}
</script>
