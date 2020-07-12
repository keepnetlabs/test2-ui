<template>
  <app-dialog
    :status="status"
    icon="mdi-download"
    title="Download Email"
    subtitle="This email file may be deleted by your anti-virus software. Setting a .zip password is suggested to prevent that "
    @changeStatus="$emit('changeDownloadModalStatus', false)"
    size="maximum"
    class-name="email-details__download-modal"
  >
    <template v-slot:app-dialog-body>
      <v-list-item class="px-0 py-0">
        <v-list-item-content class="py-0">
          <label class="add-in-settings__label" for="zip-password"
            >Set a password for the .zip file</label
          >
          <v-text-field
            :rules="[(v) => validations.required(v, 'Required')]"
            class="k-textfield mt-2"
            dense
            id="zip-password"
            outlined
            placeholder="Zip Password..."
            v-model="zipPassword"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn
          class="users__button"
          text
          color="#f56c6c"
          @click="$emit('changeDownloadModalStatus', false)"
          >CLOSE</v-btn
        >
        <v-btn class="users__button mr-n3" text color="#2196f3" @click="handleDownload"
          >DOWNLOAD</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import { required } from '../../utils/validations'
import { downloadMsgFiles } from '../../api/notifiedEmail'

export default {
  name: 'DownloadModal',
  props: {
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
      downloadMsgFiles(this.id, this.zipPassword)
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `mail-${this.id}.zip`
          link.click()
          this.$emit('changeDownloadModalStatus', false)
        })
        .catch((error) => {})
    }
  }
}
</script>

<style lang="scss"></style>
