<template>
  <KContainer id="enrollments">
    <ElTabs v-model="tab">
      <ElTabPane label="Enrollments" name="enrollments" id="enrollments-content">
        <EnrollmentsSubTabs
          v-if="tab === 'enrollments'"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
          :categories="categories"
          :target-audiences="targetAudiences"
        />
      </ElTabPane>
      <ElTabPane label="Trash" name="trash" id="trash-content">
        <Trash v-if="tab === 'trash'" />
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import Trash from '@/components/AwarenessEducator/Enrollments/Trash'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'Enrollments',
  components: {
    EnrollmentsSubTabs,
    KContainer,
    Trash
  },
  data() {
    return {
      loading: false,
      isStopAutoEnrollDialogVisible: false,
      isStopReminderDialogVisible: false,
      tab: 'enrollments',
      isShowSendEnrollmentDialog: false,
      isShowDeleteEnrollmentsDialog: false,
      selectedRow: null,
      isShowStopEnrollmentDialog: false,
      isShowEditEnrollmentModal: false,
      isShowPreviewDialog: false,
      enrollmentStatusEnum: []
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages',
      categories: 'trainingLibraryHelpers/getCategories',
      targetAudiences: 'trainingLibraryHelpers/getTargetAudiences'
    })
  },
  created() {
    this.callForFormDetails()
    this.callForLanguages()
    this.callForCategories()
    this.callForTargetAudiences()
  },
  methods: {
    ...mapActions({
      callForLanguages: 'trainingLibraryHelpers/callForLanguages',
      callForCategories: 'trainingLibraryHelpers/callForCategories',
      callForTargetAudiences: 'trainingLibraryHelpers/callForTargetAudiences'
    }),
    callForFormDetails() {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        this.enrollmentStatusEnum =
          response?.data?.data?.enumNameValuePairs?.EnrollmentStatusEnum || []
      })
    }
  }
}
</script>
