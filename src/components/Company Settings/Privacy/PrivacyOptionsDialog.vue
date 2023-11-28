<template>
  <AppDialog
    title-id="text--privacy-options-popup-title"
    subtitle-id="privacy-options-popup-subtitle"
    size="big"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <p class="mb-2 fs-medium text-primary-color">
        Keeping user entered data including passwords as it is, violates many regulations and
        mandates. Do you confirm your acceptance of the responsibility for keeping user entered data
        as it is obtained from phishing attack simulations?
      </p>
      <VCheckbox
        v-model="isConfirm"
        hide-details
        :ripple="false"
        color="#2196f3"
        label="I confirm that I’ve read and agree"
        @click.stop
      />
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--scheduled-sync-popup"
        confirm-button-id="btn-delete-scheduled-sync-popup"
        :confirm-button-disabled="!isConfirm"
        @handleClose="handleClose"
        @handleConfirm="handleSuccess"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import LDAPService from '@/api/ldap'
export default {
  name: 'PrivacyOptionsDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-shield-alert',
        title: 'Privacy Options',
        subtitle: 'Display user entered data including passwords as it is'
      },
      isConfirm: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleSuccess() {
      this.$emit('on-success')
    }
  }
}
</script>
