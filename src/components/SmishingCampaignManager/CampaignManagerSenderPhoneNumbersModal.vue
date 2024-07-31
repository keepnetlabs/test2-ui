<template>
  <AppDialog
    icon="mdi-eye"
    title="Sender Phone Numbers"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div class="mb-6">
        Selected Phone Numbers
      </div>
      <div class="campaign-manager-sender-phone-numbers">
        <template v-for="(pn, index) in phoneNumbers">
          <div :key="pn">
            <div class="campaign-manager-sender-phone-number">
              <span class="campaign-manager-sender-phone-number__number">{{ getPhoneNumberFormatted(pn) }}</span>
              <span class="campaign-manager-sender-phone-number__country">{{ getPhoneNumberCountry(pn) }}</span>
            </div>
            <hr v-if="index !== phoneNumbers.length - 1" class="campaign-manager-sender-phone-number__divider" />
          </div>
        </template>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose
        @on-close="closeModal"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'
import PhoneNumber from 'awesome-phonenumber'

export default {
  name: 'CampaignManagerSenderPhoneNumbersModal',
  components: {
    AppDialog,
    AppDialogFooterWithClose
  },
  props: {
    status: {
      type: Boolean
    },
    phoneNumbers: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    createPhoneNumberObj(phoneNumber = '') {
      return new PhoneNumber(phoneNumber)
    },
    getPhoneNumberFormatted(phoneNumber) {
      const phoneNumberObj = this.createPhoneNumberObj(phoneNumber)
      return phoneNumberObj?.g?.number?.international
    },
    getPhoneNumberCountry(phoneNumber) {
      if (!phoneNumber) return ''
      const phoneNumberObj = this.createPhoneNumberObj(phoneNumber)
      const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
      return regionNamesInEnglish.of(phoneNumberObj?.getRegionCode())
    },
    closeModal() {
      this.$emit('on-close')
    }
  }
}
</script>
