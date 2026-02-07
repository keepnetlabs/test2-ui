<template>
  <AppDialog
    title-id="text--scim-settings-success-popup-title"
    size="big"
    :icon="CONSTANTS.icon"
    :title="title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        {{ CONSTANTS.body }}
      </div>
      <div>
        <v-textarea
          v-model.trim="apiKey"
          disabled
          outlined
          readonly
          class="saml-settings-text-area-disabled mt-2"
          dense
          rows="2"
          no-resize
          hide-details
          placeholder="Enter the key from your provider"
          height="115"
        ></v-textarea>
      </div>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--scim-settings-success-popup"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleCopyToClipboard"
          >COPY TO CLIPBOARD AND QUIT
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { copyToClipboard } from '@/utils/functions'
export default {
  name: 'SCIMSuccessDialog',
  components: { AppDialog },
  props: {
    status: {
      type: Boolean
    },
    apiKey: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-check',
        body:
          'For security reasons, we can only show you this key once. Please make sure to store it somewhere safe!'
      },
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleCopyToClipboard() {
      copyToClipboard(this.apiKey)
        .then((isCopied) => {
          if (isCopied) {
            this.handleClose()
          }
        })
        .catch(() => {})
    }
  }
}
</script>
