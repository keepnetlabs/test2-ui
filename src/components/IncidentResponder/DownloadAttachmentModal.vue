<template>
  <app-dialog
    :status="status"
    :title="labels.DownloadAttachmentTitle"
    icon="mdi-download"
    size="maximum"
    class-name="email-details__download-modal"
    title-id="text--incident-responder-email-details-download-attachment-title"
    @changeStatus="$emit('changeDownloadModalStatus', false)"
  >
    <template #app-dialog-body>
      <p id="text--incident-responder-email-details-download-attachment-subtitle">
        {{ labels.DownloadAttachmentSubtitle }}
      </p>
      <v-list-item class="px-0 py-0">
        <v-list-item-content class="py-0">
          <label
            id="label--email-details-download-modal-zip-password"
            class="add-in-settings__label"
            for="input--email-details-zip-password"
            >Set a password for the .zip file</label
          >
          <v-text-field
            v-model="zipPassword"
            id="input--email-details-zip-password"
            :rules="[(v) => validations.required(v, 'Required')]"
            class="k-textfield mt-2"
            dense
            outlined
            placeholder="Zip Password..."
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn
          id="btn-close--email-details-zip-password"
          class="users__button"
          text
          color="#f56c6c"
          @click="$emit('changeDownloadModalStatus', false)"
          >CLOSE</v-btn
        >
        <v-btn
          id="btn-download--email-details-zip-password"
          class="users__button mr-n3"
          text
          color="#2196f3"
          @click="handleDownload"
          >DOWNLOAD</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import { required } from '@/utils/validations'
import { downloadAttachment } from '@/api/notifiedEmail'
import labels from '@/model/constants/labels'

export default {
  name: 'DownloadAttachmentModal',
  props: {
    attachment: {
      type: Object
    },
    status: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      labels,
      zipPassword: 'infected',
      validations: {
        required
      }
    }
  },
  components: {
    AppDialog
  },
  methods: {
    handleDownload() {
      const payload = {
        resourceId: this.id,
        zipPassword: this.zipPassword
      }
      downloadAttachment(payload).then((response) => {
        if (response?.data && response?.data instanceof Blob) {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `attachment-${this.attachment.name}.zip`
          link.click()
          this.$emit('changeDownloadModalStatus', false)
        }
      })
    }
  }
}
</script>
