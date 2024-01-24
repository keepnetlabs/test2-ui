<template>
  <AppDialog
    v-if="status"
    class="exchange-phone-number-modal"
    className="switch-dialog"
    :status="true"
    icon="mdi-swap-horizontal"
    title="Exchange Callback Phone Number"
    :subtitle="selectedRow.callerPhoneNumber"
    title-id="text--exchange-phone-number-modal-title"
    customSize="600"
    dialogBodyClass="exchange-phone-number-modal--body"
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <InputCallerPhoneNumber
        style="margin-top: 0px !important;"
        title="Callback Phone Numbers"
        subTitle="Exchange the selected callback phone number with another one from the list."
        is-smishing
        :defaultPhoneNumbers="phoneNumbers"
        :value="selectedPhoneNumber"
        @input="handlePhoneNumberChange"
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
          :disabled="isExchangeDisabled"
          >EXCHANGE</v-btn
        >
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber'
import CallbackService from '@/api/callback'

export default {
  name: 'ExchangePhoneNumberModal',
  components: {
    AppDialog,
    InputCallerPhoneNumber
  },
  props: {
    isLoading: {
      type: Boolean
    },
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      phoneNumberItems: [],
      phoneNumbers: [],
      selectedPhoneNumberResourceId: null,
      selectedPhoneNumber: null
    }
  },
  created() {
    this.callPhoneNumbers()
  },
  computed: {
    isExchangeDisabled() {
      return this.isLoading || !this.selectedPhoneNumber
    }
  },
  methods: {
    callPhoneNumbers() {
      CallbackService.getAvailableCallbackNumbers().then((response) => {
        this.phoneNumberItems = response.data.data
        this.phoneNumbers = response.data.data.map((item) => item.number)
      })
    },
    handlePhoneNumberChange(phoneNumber) {
      const phoneNumberIndex = this.phoneNumberItems.findIndex(
        (item) => item.number === phoneNumber
      )
      if (phoneNumberIndex !== -1) {
        this.selectedPhoneNumberResourceId = this.phoneNumberItems[
          phoneNumberIndex
        ].providerNumberId
        this.selectedPhoneNumber = phoneNumber
      }
    },
    changeStatus() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm', this.selectedPhoneNumberResourceId)
    }
  }
}
</script>
