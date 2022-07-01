<template>
  <AppDialog
    v-if="status"
    custom-size="1600"
    max-height
    max-height-size="900"
    :status="status"
    icon="mdi-eye"
    size="ultraMaximum"
    :title="getTitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <TrainingPreview v-else :name="selectedRow.name" :templates="templates" />
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
export default {
  name: 'TrainingPreviewDialog',
  components: { AppDialog, DatatableLoading, TrainingPreview },
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
      templates: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {},
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
