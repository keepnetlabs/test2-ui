<template>
  <AppDialog
    v-if="status"
    :status="status"
    icon="mdi-account-multiple-plus"
    title="Invite Members"
    subtitle="Bring new members to the community"
    size="big"
    title-id="text--threat-sharing-right-invite-members-popup-title"
    subtitle-id="text--threat-sharing-right-invite-members-popup-subtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <v-form ref="inviteModal">
        <KSelect
          v-model.trim="emails"
          type="combobox"
          :items="[]"
          custom-menu-class="menu--threat-sharing-right-menu-invite-members"
          placeholder="Enter email addresses of the companies to be invited (max. 5)"
          multiple
          dense
          deletable-chips
          autocomplete="off"
          small-chips
          outlined
          :no-data-text="'Enter email addresses of the companies to be invited (max. 5)'"
          :rules="[inviteMembers.limit, inviteMembers.email, inviteMembers.required]"
          class="pop-up-card__invite-member"
          hint="Press enter to separate email addresses"
          @change="handleEmailChange"
        ></KSelect>
      </v-form>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="threat-sharing-right-column-invite-member-modal-cancel"
        confirm-button-id="threat-sharing-right-column-invite-member-modal-invite-all"
        action-button-text="Invite All"
        :confirm-button-disabled="inviteAllButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="inviteMember"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import KSelect from '@/components/Common/Inputs/KSelect'
import { inviteToCommunity } from '@/api/threatSharing'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import * as Validations from '@/utils/validations'
export default {
  name: 'RightColumnInviteUsersDialog',
  components: { AppDialogFooter, KSelect, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emails: [],
      inviteAllButtonDisabled: false,
      inviteMembers: {
        limit: (v) => (v && v.length <= 5) || 'You have reached to max limit',
        required: (v) => (v && v.length >= 1) || 'Required',
        email: Validations.isEmailChip
      }
    }
  },
  methods: {
    inviteMember() {
      if (this.$refs.inviteModal.validate()) {
        this.inviteAllButtonDisabled = true
        inviteToCommunity(this.$route.params.id, {
          emailArray: this.emails
        })
          .then((response) => {
            response.data.data.map((item) => {
              if (item.result === 'Failed') {
                this.$store.dispatch('common/createSnackBar', {
                  color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                  message: `${item['resultText']}: ${item['email']} `
                })
              } else {
                this.$store.dispatch('common/createSnackBar', {
                  color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                  message: `${item['resultText']}: (${item['email']})`
                })
              }
            })
            this.emails = []
            this.handleClose()
          })
          .finally(() => (this.inviteAllButtonDisabled = false))
      }
    },
    handleClose() {
      this.$emit('on-close', false)
    },
    handleEmailChange(val) {
      let newVal = val.map((item) => item.trim())
      this.emails = newVal
      return newVal
    }
  }
}
</script>
