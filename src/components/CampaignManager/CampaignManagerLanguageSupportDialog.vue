<template>
  <AppDialog
    type="delete"
    title-id="text--campaign-manager-reports-delete-popup-title"
    subtitle-id="text--campaign-manager-reports-delete-popup-subtitle"
    icon="mdi-alert"
    title="Missing Language Support Detected!"
    custom-size="560"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        <div>
          The selected scenarios do not support some users'
          <strong class="text-primary-color fw-600">preferred language(s).</strong>
        </div>
        <div class="mt-3">
          To resolve this issue:
          <ul>
            <li>
              <strong class="text-primary-color fw-600"
                >Modify the scenario selection to include the company language{{
                  getLanguageText
                }}.</strong
              >
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-text="CLOSE"
        cancel-button-color="#383B41"
        action-button-text="Edit Scenarios"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'

export default {
  name: 'CampaignManagerLanguageSupportDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    targetGroupResourceIds: {
      type: Array
    },
    selectedTargetGroups: {
      type: Array
    }
  },
  computed: {
    getCompanyPreferredLanguage() {
      if (!this.$store.getters['login/getCurrentCompany']) return
      return ` (${this.$store.getters['login/getCurrentCompany']?.preferredLanguageTypeName})`
    },
    getCompanyName() {
      if (!this.$store.getters['login/getCurrentCompany']) return
      return this.$store.getters['login/getCurrentCompany']?.name
    },
    isCompanyNamesDifferent() {
      return this.selectedTargetGroups.some((group) => group.companyName !== this.getCompanyName)
    },
    getLanguageText() {
      if (this.isCompanyNamesDifferent) return this.targetGroupResourceIds.length > 1 ? '(s)' : ''
      return this.getCompanyPreferredLanguage
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>
