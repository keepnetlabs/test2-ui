<template>
  <div>
    <TrainingLibraryDeleteDialog v-bind="getDeleteDialog" />
    <TrainingLibraryTrainingPreviewDialog
      v-if="getTrainingPreviewDialog.status"
      v-bind="getTrainingPreviewDialog"
    />
  </div>
</template>

<script>
import TrainingLibraryDeleteDialog from '@/components/TrainingLibrary/TrainingLibraryDeleteDialog/TrainingLibraryDeleteDialog.vue'
import { mapGetters } from 'vuex'
import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'

export default {
  name: 'TrainingLibraryCommonComponents',
  components: { TrainingLibraryTrainingPreviewDialog, TrainingLibraryDeleteDialog },
  computed: {
    ...mapGetters({
      getDeleteDialog: 'trainingLibrary/getDeleteDialog',
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog'
    })
  }
}
</script>
