<template>
  <AppDialog
    v-if="status"
    custom-size="1175"
    max-height
    max-height-size="1200"
    :status="status"
    icon="mdi-eye"
    size="ultraMaximum"
    title="Training Preview"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <TrainingPreview v-else :name="selectedRow.trainingName" :languages="selectedLanguages" />
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
import { EMITS } from './utils'
import TrainingPreview from '@/components/AwarenessEducator/TrainingPreview'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import AppDialog from '@/components/AppDialog'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingPreviewDialog',
  components: { AppDialog, DatatableLoading, TrainingPreview },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    languages: {
      type: Array
    }
  },
  data() {
    return {
      isPreviewLoading: false,
      templates: [],
      selectedLanguages: []
    }
  },
  created() {
    this.selectedLanguages = this.selectedRow.languages.reduce((acc, lang) => {
      const selectedLanguage = this.languages.find((language) => language.code === lang)
      if (selectedLanguage) acc.push(selectedLanguage)
      return acc
    }, [])
  },
  methods: {
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
