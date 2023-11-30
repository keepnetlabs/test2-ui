<template>
  <AppDialog
    v-if="status"
    class="select-phone-numbers-modal"
    className="switch-dialog"
    :status="true"
    icon="mdi-phone"
    title="Select Callback Phone Numbers"
    title-id="text--select-phone-numbers-modal-title"
    customSize="600"
    dialogBodyClass="select-phone-numbers-modal--body"
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <FormGroup has-hint class="mt-6" title="Callback Phone Numbers" :sub-title="getSubtitle">
        <InputPhoneNumberComboBox
          ref="refComboBox"
          style="margin-top: 0px !important;"
          is-smishing
          :defaultPhoneNumbers="phoneNumberItems"
          itemText="number"
          itemValue="providerNumberId"
          :value="selectedPhoneNumbers"
          :rules="getRules"
          @input="handleSelectedPhoneNumberChange"
        />
      </FormGroup>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn
          id="btn-cancel--company-save-company-groups-popup"
          @click="changeStatus(false)"
          color="#f56c6c"
          class="delete-user__footer-button"
          text
          :disabled="isLoading"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-save--company-save-company-groups-popup"
          @click="confirm"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          :disabled="isDoneDisabled"
          >DONE</v-btn
        >
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import InputPhoneNumberComboBox from '@/components/Common/Inputs/InputPhoneNumberComboBox'
import CallbackService from '@/api/callback'
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  name: 'SelectPhoneNumbersModal',
  components: {
    AppDialog,
    InputPhoneNumberComboBox,
    FormGroup
  },
  props: {
    isLoading: {
      type: Boolean
    },
    status: {
      type: Boolean
    },
    selectablePhoneNumberCount: {
      type: Number
    }
  },
  data() {
    return {
      labels,
      phoneNumberItems: [],
      selectedPhoneNumbers: []
    }
  },
  created() {
    this.callPhoneNumbers()
  },
  computed: {
    isDoneDisabled() {
      return (
        this.isLoading ||
        this.selectedPhoneNumbers.length === 0 ||
        this.selectedPhoneNumbers.length > this.selectablePhoneNumberCount
      )
    },
    getSubtitle() {
      return `Select up to ${this.selectablePhoneNumberCount} callback phone number${
        this.selectablePhoneNumberCount > 1 ? 's' : ''
      }. You can always change your numbers in the Settings page.`
    },
    getRules() {
      return [
        (v) =>
          v.length <= this.selectablePhoneNumberCount ||
          `Based on your license settings, you can select maximum ${
            this.selectablePhoneNumberCount
          } callback phone number${this.selectablePhoneNumberCount > 1 ? 's' : ''}`
      ]
    }
  },
  methods: {
    callPhoneNumbers() {
      CallbackService.getAvailableCallbackNumbers().then((response) => {
        this.phoneNumberItems = response.data.data
      })
    },
    handleSelectedPhoneNumberChange(pns) {
      this.selectedPhoneNumbers = pns
    },
    changeStatus() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm', this.selectedPhoneNumbers)
    }
  }
}
</script>
