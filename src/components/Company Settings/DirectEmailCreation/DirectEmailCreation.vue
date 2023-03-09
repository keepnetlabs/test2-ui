<template>
  <div id="direct-email-creation">
    <NewDirectEmailCreation
      v-if="isShowDirectEmailCreationModal"
      :status="isShowDirectEmailCreationModal"
      :is-initial="isMicrosoftEmailCreationInitial"
      @on-close="toggleNewDirectEmailCreationModal"
    />
    <CompanySettingsHeader
      :title="labels.DirectEmailCreationTitle"
      :sub-title="labels.DirectEmailCreationSubTitle"
    />
    <DirectEmailCreationTable @on-add="toggleNewDirectEmailCreationModal" />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import labels from '@/model/constants/labels'
import DirectEmailCreationTable from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreationTable.vue'
import NewDirectEmailCreation from '@/components/Company Settings/DirectEmailCreation/NewDirectEmailCreation.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'DirectEmailCreation',
  components: { NewDirectEmailCreation, DirectEmailCreationTable, CompanySettingsHeader },
  data() {
    return {
      labels,
      isShowDirectEmailCreationModal: false,
      isMicrosoftEmailCreationInitial: true
    }
  },
  created() {
    this.checkUrlForMicrosoft()
  },
  methods: {
    checkUrlForMicrosoft() {
      const { query = {} } = this.$route
      const { tenant = '', error = '', error_description = '' } = query
      this.isMicrosoftEmailCreationInitial = !tenant
      const errorMessage = error && error_description
      if (!this.isMicrosoftEmailCreationInitial || errorMessage) {
        if (errorMessage) {
          this.$store.dispatch('common/createSnackBar', {
            message: errorMessage,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        this.toggleNewDirectEmailCreationModal()
      }
    },
    toggleNewDirectEmailCreationModal() {
      this.isShowDirectEmailCreationModal = !this.isShowDirectEmailCreationModal
    }
  }
}
</script>
