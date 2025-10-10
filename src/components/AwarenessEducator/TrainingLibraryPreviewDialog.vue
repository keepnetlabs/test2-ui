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
        :training-id="selectedRow.trainingId"
        :languages="selectedLanguages"
        :training-params="getTrainingParams"
      />
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import { EMITS } from '@/components/AwarenessEducator/utils'
import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
export default {
  name: 'TrainingLibraryPreviewDialog',
  components: {
    AppDialogFooterWithClose,
    TrainingLibraryPreview,
    AppDialog,
    DatatableLoading
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    trainingParams: {
      type: Object
    },
    callApi: {
      type: Boolean,
      default: true
    },
    defaultSelectedLanguages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isPreviewLoading: false,
      selectedLanguages: [],
      trainingDetails: null
    }
  },
  computed: {
    getTrainingParams() {
      if (!this.trainingParams || this.callApi) return this.trainingDetails
      return this.trainingParams
    }
  },
  watch: {
    defaultSelectedLanguages: {
      immediate: true,
      handler(val) {
        this.selectedLanguages = val
      }
    }
  },
  created() {
    if (this.callApi) this.callForLanguages()
  },
  methods: {
    callForLanguages() {
      this.isPreviewLoading = true
      AwarenessEducatorService.getLanguages()
        .then((res) => {
          this.selectedRow.trainingLanguageIds.forEach((lang) => {
            const language = res?.data?.data?.find((item) => item.id === lang)
            if (language)
              this.selectedLanguages.push({
                text: language.isoFriendlyName,
                value: language.id
              })
          })
        })
        .finally(this.callForTrainingDetail)
    },
    callForTrainingDetail() {
      AwarenessEducatorService.getTraining(this.selectedRow.trainingId).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingDetails = {
          ...data,
          languages: this.selectedLanguages.map((lang) => lang.text).join(', ')
        }
      })
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
