<template>
  <AppDialog
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn--close-campaign-manager-preview-popup"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { getEmailTemplate } from '@/api/company'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'NotificationTemplatesPreviewDialog',
  components: { KEmailPreview, DatatableLoading, AppDialog },
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
      emailTemplate: null
    }
  },
  computed: {
    getTitle() {
      return 'Notification Template Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.isLoading = true
      getEmailTemplate(this.selectedRow.resourceId)
        .then((response) => {
          this.emailTemplate =
            response?.data?.data?.template?.replace(
              /{COMPANYLOGO}/g,
              this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''
            ) || ''
        })
        .finally(() => (this.isLoading = false))
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
