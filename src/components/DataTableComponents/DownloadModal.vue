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
          label="XLSX"
          v-model="downloadType[0]"
          hide-details
          v-if="download.xls"
        />
        <v-checkbox
          class="download-modal__checkbox"
          color="#2196f3"
          label="CSV"
          v-model="downloadType[1]"
          hide-details
          v-if="download.csv"
        />
        <v-checkbox
          class="download-modal__checkbox"
          color="#2196f3"
          label="PDF"
          v-model="downloadType[2]"
          hide-details
          v-if="download.pdf"
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
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          :key="downloadButtonKey"
          class="mr-n4 download-modal__button"
          @click="downloadEvent"
          color="#2196f3"
          text
          :disabled="getDisabledStatusOfDelete"
          >DOWNLOAD</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'

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
    },
    download: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      downloadType: [false, false, false],
      downloadButtonKey: `button-key-${createRandomCryptStringNumber()}`
    }
  },
  computed: {
    getDisabledStatusOfDelete: {
      get() {
        return !this.downloadType.some(Boolean)
      }
    }
  },
  watch: {
    downloadType() {
      this.downloadButtonKey = `button-key-${createRandomCryptStringNumber()}`
    }
  },
  methods: {
    changeDownloadModalStatus() {
      this.$emit('changeDownloadModalStatus', false)
    },
    downloadEvent() {
      const downloadTypes = []
      this.downloadType.map((item, index) => {
        if (!item) return

        if (index === 0) {
          downloadTypes.push('XLS')
          return
        }
        if (index === 1) {
          downloadTypes.push('CSV')
          return
        }
        if (index === 2) {
          downloadTypes.push('PDF')
        }
      })
      this.$emit('downloadEvent', downloadTypes)
      this.changeDownloadModalStatus()
    }
  }
}
</script>
