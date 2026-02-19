<template>
  <AppDialog
    v-if="status"
    custom-size="950"
    max-height
    max-height-size="950"
    :status="status"
    icon="mdi-eye"
    size="ultraMaximum"
    :title="getTitle"
    :subtitle="getSubtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <KEmailPreview v-else ref="refPreview" :html="template" />
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
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { EMITS } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'CertificatePreviewDialog',
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
      isPreviewLoading: false,
      template: ''
    }
  },
  computed: {
    getTitle() {
      return 'Certificate Template Preview'
    },
    getSubtitle() {
      return this?.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.isPreviewLoading = true
      AwarenessEducatorService.getCertificate(this.selectedRow.id)
        .then((response) => {
          this.template =
            response?.data?.data?.template?.replaceAll(
              '{COMPANYLOGO}',
              this?.$store?.state?.whitelabel.mainLogoUrl || ''
            ) || ''
        })
        .finally(() => {
          this.isPreviewLoading = false
        })
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
