<template>
  <AppDialog
    v-if="status"
    class="select-phone-numbers-modal"
    :status="true"
    icon="mdi-phone"
    title="Select Callback Phone Numbers"
    title-id="text--select-phone-numbers-modal-title"
    customSize="600"
    dialogBodyClass="select-phone-numbers-modal--body"
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <InputPhoneNumberComboBox
        style="margin-top: 0px !important;"
        title="Callback Phone Numbers"
        subTitle="Manage your callback phone numbers"
        is-smishing
        :defaultPhoneNumbers="phoneNumberItems"
        itemText="number"
        itemValue="providerNumberId"
        :value="selectedPhoneNumbers"
        @input="handleSelectedPhoneNumberChange"
      />
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

export default {
  name: 'SelectPhoneNumbersModal',
  components: {
    AppDialog,
    InputPhoneNumberComboBox
  },
  props: {
    isLoading: {
      type: Boolean
    },
    status: {
      type: Boolean
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
      return this.isLoading || this.selectedPhoneNumbers.length === 0
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
