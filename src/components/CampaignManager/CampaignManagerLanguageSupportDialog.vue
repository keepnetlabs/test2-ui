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
        <div v-if="!isCompanyNamesDifferent">
          <div>
            Selected scenarios don’t match users
            <strong class="text-primary-color fw-600">preferred languages </strong> ({{
              getMissingPreferredLanguages
            }}). The
            <span class="text-primary-color fw-600>"
              >company language is {{ getCompanyPreferredLanguage }}</span
            >, but no {{ getCompanyPreferredLanguage }} scenario is available either.
          </div>
          <div class="mt-3">
            <strong class="text-primary-color fw-600"
              >To proceed, select scenarios in users’ languages or in
              {{ getCompanyPreferredLanguage }}.</strong
            >
          </div>
        </div>
        <div v-else>
          <div>
            The selected scenarios do not match the
            <span class="fw-600 text-primary-color">preferred languages</span> of users ({{
              getMissingPreferredLanguages
            }}). Additionally, the
            <span class="fw-600 text-primary-color"
              >default languages of the selected companies</span
            >
            are missing:
          </div>
          <div class="my-3 fw-600 text-primary-color">{{ getMissingCompanyLanguages }}</div>
          <div class="fw-600 text-primary-color">
            To proceed, select scenarios in the users’ preferred languages or in the respective
            default languages of the selected companies.
          </div>
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
    },
    userCountDetailResponse: {
      type: Object
    }
  },
  data() {
    return {
      preferredLanguages: [],
      randomLanguages: []
    }
  },
  computed: {
    getCompanyPreferredLanguage() {
      if (!this.$store.getters['login/getCurrentCompany']) return
      return `${this.$store.getters['login/getCurrentCompany']?.preferredLanguageTypeName}`
    },
    getCompanyName() {
      if (!this.$store.getters['login/getCurrentCompany']) return
      return this.$store.getters['login/getCurrentCompany']?.name
    },
    isCompanyNamesDifferent() {
      return this.selectedTargetGroups.some((group) => group.companyName !== this.getCompanyName)
    },
    getMissingPreferredLanguages() {
      const preferredLanguagesLength = this.preferredLanguages.length
      if (preferredLanguagesLength > 1) {
        if (preferredLanguagesLength > 3)
          return `e.g., ${this.preferredLanguages.slice(0, 3).join(', ')}, and ${
            preferredLanguagesLength - 3
          } more`
        return `e.g., ${this.preferredLanguages.join(', ')}`
      }
      return this.preferredLanguages[0]
    },
    getMissingCompanyLanguages() {
      return this.randomLanguages.join(', ')
    }
  },
  created() {
    const data = this.userCountDetailResponse?.data?.data
    const preferredLanguages = new Set()
    const randomLanguages = new Set()
    data.map((row) => {
      if (row.hasPreferredLanguage) {
        const noPrefLanguages = row.hasPreferredLanguage.filter((r) => r.status === 'No')
        if (noPrefLanguages.length) {
          noPrefLanguages[0]?.hasPreferredLanguage?.map((lang) => {
            preferredLanguages.add(lang.status)
          })
        }
      }
      if (row.hasRandomLanguage) {
        const noRandomLanguages = row.hasRandomLanguage.filter((r) => r.status === 'Yes')
        if (noRandomLanguages.length) {
          noRandomLanguages[0]?.hasRandomLanguage?.map((lang) => {
            randomLanguages.add(lang.status)
          })
        }
      }
    })
    this.preferredLanguages = Array.from(preferredLanguages)
    this.randomLanguages = Array.from(randomLanguages)
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
