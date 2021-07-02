<template>
  <AppDialog
    class-name="matching-modal version-history"
    max-height
    icon="mdi-send"
    title-id="text--white-listing-directions-dialog-title"
    subtitle-id="text--white-listing-directions-dialog-subtitle"
    max-height-size="480px"
    size="big"
    :status="status"
    :title="labels.SendWhitelistingDirections"
    :subtitle="labels.SendWhitelistingDirectionsSubTitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        <v-form ref="refForm" on-submit="return false">
          <FormGroup title="Email Address">
            <InputEmail v-model.trim="email" placeholder="email@example.com" />
          </FormGroup>
        </v-form>
        <FormGroup title="Message">
          <div class="white-listing white-listing-in-dialog">
            <WhiteListingContent />
          </div>
        </FormGroup>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--white-listing-directions-dialog"
        confirm-button-id="btn-delete--white-listing-directions-dialog"
        :confirm-button-disabled="getConfirmButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import FormGroup from '@/components/SmallComponents/FormGroup'
import WhiteListingContent from '@/components/Company Settings/WhiteListingContent'
import labels from '@/model/constants/labels'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'WhiteListingDirectionsDialog',
  components: { AppDialogFooter, WhiteListingContent, FormGroup, InputEmail, AppDialog },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      email: '',
      labels
    }
  },
  computed: {
    getConfirmButtonDisabled() {
      const { $refs } = this
      return $refs && $refs.refForm && !$refs.refForm.validate()
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>
