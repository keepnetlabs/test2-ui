<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="670"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="vishing-template-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <div v-else class="template-preview pt-3">
        <div class="template-preview__text">
          <div>
            <span class="template-preview__text--body">{{ templateName }}</span>
          </div>
        </div>
        <div class="template-preview__steps">
          <div v-for="(step, index) in steps" :key="index">
            <VishingTemplatePreviewStep :step="step" :index="index" />
            <hr v-if="index !== steps.length - 1" />
          </div>
        </div>
      </div>
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
import AppDialog from '@/components/AppDialog'
import { getVishingTemplatePreview } from '@/api/vishing'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import VishingTemplatePreviewStep from '@/components/VishingTemplates/VishingTemplatePreviewStep'
export default {
  name: 'VishingTemplatePreview',
  components: {
    DatatableLoading,
    AppDialog,
    VishingTemplatePreviewStep
  },
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
      isLoading: false,
      labels,
      timeoutId: '',
      steps: [],
      templateName: ''
    }
  },
  computed: {
    getTitle() {
      return 'Vishing Template Preview'
    },
    getSubtitle() {
      return this.selectedRow.name
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForData() {
      this.isLoading = true
      getVishingTemplatePreview(this.selectedRow.resourceId)
        .then((response) => {
          this.templateName = response.name
          this.steps = response.steps
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.isLoading = false
          }, 500)
        })
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
