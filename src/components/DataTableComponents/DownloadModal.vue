<template>
  <app-dialog
    size="big"
    :status="isShow"
    icon="mdi-download"
    :title="title"
    subtitle="Select file type"
    class-name="download-modal"
    @changeStatus="changeDownloadModalStatus"
  >
    <template v-slot:app-dialog-body>
      <div class="download-modal__body">
        <v-checkbox
          class="download-modal__checkbox"
          color="#2196f3"
          label="XLS"
          v-model="downloadType[0]"
        />
        <v-checkbox
          class="download-modal__checkbox"
          color="#2196f3"
          label="CSV"
          v-model="downloadType[1]"
        />
        <v-checkbox
          class="download-modal__checkbox"
          color="#2196f3"
          label="PDF"
          v-model="downloadType[2]"
        />
      </div>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="download-modal__footer">
        <v-btn
          class="ml-n4 download-modal__button"
          @click="changeDownloadModalStatus"
          color="#f56c6c"
          text
          >CANCEL</v-btn
        >
        <v-btn
          class="mr-n4 download-modal__button"
          @click="downloadEvent"
          color="#2196f3"
          text
          :disabled="
            !downloadType.some((item) => {
              return item === true
            })
          "
          >DOWNLOAD</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
export default {
  name: 'DownloadModal',
  components: {
    AppDialog
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Download Current Page'
    }
  },
  data() {
    return {
      downloadType: [false, false, false]
    }
  },
  methods: {
    changeDownloadModalStatus() {
      this.$emit('changeDownloadModalStatus', false)
    },
    downloadEvent() {
      const downloadTypes = []
      this.downloadType.map((item, index) => {
        if (item) {
          switch (index) {
            case 0:
              downloadTypes.push('XLS')
              break
            case 1:
              downloadTypes.push('CSV')
              break
            case 2:
              downloadTypes.push('PDF')
              break
            default:
              break
          }
        }
      })
      this.$emit('downloadEvent', downloadTypes)
      this.changeDownloadModalStatus()
    }
  }
}
</script>

<style lang="scss">
.download-modal {
  .k-dialog__body {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  &__body {
    margin-left: 70px;
    padding-top: 22px;
  }
  &__checkbox {
    padding-top: 0;
    margin-top: -5px !important;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
  }
  &__button {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
  }

  &__confirm {
  }
}
</style>
