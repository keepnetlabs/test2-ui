<template>
  <AppDialog
    v-if="status"
    custom-size="1230"
    max-height
    max-height-size="1200"
    :status="status"
    className="training-preview-dialog"
    icon="mdi-eye"
    size="ultraMaximum"
    title="Training Preview"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <TrainingLibraryPreview
        v-if="selectedLanguages.length"
        v-show="!isPreviewLoading"
        :is-loading.sync="isPreviewLoading"
        :name="selectedRow.trainingName"
        :training-id="selectedRow.trainingResourceId"
        :languages="selectedLanguages"
      />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import { EMITS } from '@/components/AwarenessEducator/utils'
import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingLibraryPreviewDialog',
  components: { TrainingLibraryPreview, AppDialog, DatatableLoading },
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
      isPreviewLoading: false,
      selectedLanguages: []
    }
  },
  created() {
    this.isPreviewLoading = true
    AwarenessEducatorService.getLanguages().then((res) => {
      this.selectedRow.trainingLanguages.forEach((lang) => {
        const language = res?.data?.data?.find((item) => item.id === lang)
        if (language)
          this.selectedLanguages.push({
            text: language.name,
            value: language.id
          })
      })
    })
  },
  methods: {
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
