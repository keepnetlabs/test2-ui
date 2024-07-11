<template>
  <div>
    <EnrollmentsSubTabs
      is-trash
      :enrollment-status-enum="enrollmentStatusEnum"
      :languages="languages"
      :categories="categories"
      :target-audiences="targetAudiences"
    />
  </div>
</template>

<script>
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Trash',
  components: { EnrollmentsSubTabs },
  data() {
    return {
      enrollmentStatusEnum: [],
      isShowDeleteDialog: false,
      selectedRow: null
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages',
      categories: 'trainingLibraryHelpers/getCategories',
      targetAudiences: 'trainingLibraryHelpers/getTargetAudiences'
    })
  },
  methods: {
    toggleShowDeleteDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowDeleteDialog) this.selectedRow = null
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
