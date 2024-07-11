<template>
  <AppDialog
    v-if="status"
    custom-size="600"
    :status="status"
    icon="mdi-eye"
    max-height
    max-height-size="1200"
    title="Category Preview"
    :subtitle="campaignName"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="campaign-manager-report-summary__categories">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="campaign-manager-report-summary__category-item"
        >
          {{ category }}
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog.vue'
// import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
export default {
  name: 'TrainingLibraryPreviewDialog',
  components: {
    AppDialogFooterWithClose,
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    campaignName: {
      type: String
    },
    categories: {
      type: Array
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
