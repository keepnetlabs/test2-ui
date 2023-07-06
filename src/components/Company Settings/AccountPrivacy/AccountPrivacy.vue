<template>
  <div>
    <CompanySettingsHeader title="Account Privacy" sub-title="Manage accaunt privacy settings" />
    <AccountPrivacyDialog
      v-if="isShowAccountPrivacyDialog"
      :status="isShowAccountPrivacyDialog"
      :time-allowed="getTimeAllowed"
      @on-close="toggleShowAccountPrivacyDialog"
    />
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else>
      <div class="access-text">{{ accessText }}</div>
      <FormGroup
        class-name="campaign-manager-smtp-settings max-w-554"
        title="Access Period"
        sub-title="Access period is the allowed period for an authorized account before it expires or is terminated"
      >
        <KSelect
          v-model.trim="privacyDurationId"
          id="input--account-privacy-access-period"
          class="new-integration__select"
          dense
          outlined
          placeholder="Select Option"
          :items="accessPeriodItems"
          @change="handlePrivacyDurationChange"
        >
        </KSelect>
        <VBtn
          class="account-privacy-button"
          text
          color="#2196f3"
          :ripple="false"
          :style="isConfirmed ? { cursor: 'default' } : {}"
          @click="handleAccessPeriod"
          ><span :style="getAccessButtonStyle">
            <span>{{ isConfirmed ? 'CONFIRMED' : 'APPROVE' }}</span>
          </span>
        </VBtn>
      </FormGroup>
    </div>
  </div>
</template>
<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DatatableLoading from '../../SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'
import FormGroup from '../../SmallComponents/FormGroup'
import KSelect from '../../Common/Inputs/KSelect'
import { getCompanyPrivacy } from '@/api/company'
import AccountPrivacyDialog from './AccountPrivacyDialog.vue'
export default {
  name: 'AccountPrivacy',
  components: {
    AccountPrivacyDialog,
    KSelect,
    FormGroup,
    DatatableLoading,
    CompanySettingsHeader
  },
  mixins: [useLoading],
  data() {
    return {
      accessText: '',
      privacyDurationId: 1,
      confirmedPrivacyDurationId: 1,
      isConfirmed: true,
      accessPeriodItems: [
        { text: 'Deny allowing access', value: 0 },
        { text: 'Allow access for 1 hour', value: 2 },
        { text: 'Allow access for 1 day', value: 3 },
        { text: 'Allow access for 3 days', value: 4 },
        { text: 'Allow access for 7 days', value: 5 },
        { text: 'Allow access for 30 days', value: 6 },
        { text: 'Allow access continuously', value: 1 }
      ],
      isShowAccountPrivacyDialog: false
    }
  },
  computed: {
    getAccessButtonStyle() {
      return {
        color: this.isConfirmed ? '#43A047' : '#2196F3',
        display: 'flex',
        'align-items': 'center'
      }
    },
    getTimeAllowed() {
      if (this.privacyDurationId === 0) {
        return 'Deny allowing access'
      } else if (this.privacyDurationId === 1) {
        return 'Allow access continuously'
      } else if (this.privacyDurationId === 2) {
        return '1 hour'
      } else if (this.privacyDurationId === 3) {
        return '1 day'
      } else if (this.privacyDurationId === 4) {
        return '3 days'
      } else if (this.privacyDurationId === 5) {
        return '7 days'
      } else if (this.privacyDurationId === 6) {
        return '30 days'
      }
      return ''
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      getCompanyPrivacy()
        .then((response) => {
          const { data: { data = {} } = {} } = response || {}
          this.privacyDurationId = data?.privacyDurationId || 1
          this.confirmedPrivacyDurationId = this.privacyDurationId
          this.setAccessText()
        })
        .finally(this.setLoading)
    },
    setAccessText() {
      if (this.privacyDurationId === 0) {
        this.accessText = 'You deny access to your account'
      } else if (this.privacyDurationId === 1) {
        this.accessText = 'You are granting continuous access to your account'
      } else {
      }
    },
    handlePrivacyDurationChange() {
      this.isConfirmed = this.privacyDurationId === this.confirmedPrivacyDurationId
    },
    toggleShowAccountPrivacyDialog() {
      this.isShowAccountPrivacyDialog = !this.isShowAccountPrivacyDialog
    },
    handleAccessPeriod() {
      if (this.isConfirmed) return
      this.toggleShowAccountPrivacyDialog()
    }
  }
}
</script>
