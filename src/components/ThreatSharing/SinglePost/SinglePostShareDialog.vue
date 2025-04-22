<template>
  <AppDialog
    :status="status"
    subtitle="Share this incident via email"
    icon="mdi-send"
    title="Share incident"
    size="big"
    title-id="text--threat-sharing-incident-single-post-share-popup-title"
    subtitle-id="text--threat-sharing-incident-single-post-share-popup-subtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <v-form ref="shareModal">
        <span style="letter-spacing: normal; color: rgba(0, 0, 0, 0.87);">Recipients</span>
        <KSelect
          v-model.trim="shareEmail"
          id="input--threat-sharing-incident-share-email"
          type="combobox"
          :items="[]"
          placeholder="Enter emails (max. 10)"
          multiple
          dense
          deletable-chips
          autocomplete="disabled"
          small-chips
          outlined
          :no-data-text="'Enter emails (max. 10)'"
          :rules="[shareEmailRules.limit, shareEmailRules.email, shareEmailRules.required]"
          class="pop-up-card__invite-member"
          hint="Press enter to separate email addresses"
        ></KSelect>
      </v-form>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="threat-sharing-single-post-share-modal-close"
        confirm-button-id="threat-sharing-single-post-share-modal-save"
        action-button-text="Send"
        :confirm-button-disabled="shareButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="shareIncident"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as Validations from '@/utils/validations'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { shareAPost } from '@/api/threatSharing'
export default {
  name: 'SinglePostShareDialog',
  components: { AppDialogFooter, KSelect, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    sharedIncitedId: {
      type: String
    }
  },
  data() {
    return {
      shareEmail: [],
      shareEmailRules: {
        limit: (v) => (v && v.length <= 10) || 'You have reached to max limit',
        required: (v) => (v && v.length >= 1) || 'Required',
        email: Validations.isEmailChip
      },
      shareButtonDisabled: false
    }
  },
  methods: {
    shareIncident() {
      if (this.$refs.shareModal.validate()) {
        this.shareButtonDisabled = true
        shareAPost(this.sharedIncitedId, {
          emailArray: this.shareEmail
        })
          .then(() => {
            this.handleClose()
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          })
          .finally(() => (this.shareButtonDisabled = false))
      }
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
