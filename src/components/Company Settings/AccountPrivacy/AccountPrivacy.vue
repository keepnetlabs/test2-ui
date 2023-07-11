<template>
  <div>
    <CompanySettingsHeader title="Account Privacy" sub-title="Manage account privacy settings" />
    <AccountPrivacyDialog
      v-if="isShowAccountPrivacyDialog"
      :status="isShowAccountPrivacyDialog"
      :time-allowed="getTimeAllowed"
      :privacy-duration-id="privacyDurationId"
      @on-close="toggleShowAccountPrivacyDialog"
    />
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else>
      <div class="access-text">
        <span v-if="confirmedPrivacyDurationId === 0 || confirmedPrivacyDurationId === 1">{{
          accessText
        }}</span>
        <div v-else>
          <div class="pb-2">
            You are granting access permission to your account for a limited time
          </div>
          <div>
            <strong class="fw-600">Start Time: </strong> <span>{{ privacyDurationStartTime }}</span>
          </div>
          <div>
            <strong class="fw-600">End Time: </strong> <span>{{ privacyDurationEndTime }}</span>
          </div>
        </div>
      </div>
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
          hide-details
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
import { PRIVACY_DURATIONS, accessPeriodItems } from './utils'
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
      privacyDurationId: PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY,
      confirmedPrivacyDurationId: PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY,
      privacyDurationStartTime: '',
      privacyDurationEndTime: '',
      isConfirmed: true,
      accessPeriodItems,
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
      if (this.privacyDurationId === PRIVACY_DURATIONS.DENY) {
        return 'Deny allowing access'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY) {
        return 'Allow access continuously'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ONE_HOUR) {
        return '1 hour'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ONE_DAY) {
        return '1 day'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.THREE_DAYS) {
        return '3 days'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.SEVEN_DAYS) {
        return '7 days'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.THIRTY_DAYS) {
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
          this.privacyDurationId = data?.privacyDurationId ?? PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY
          this.privacyDurationStartTime = data?.privacyDurationStartTime || ''
          this.privacyDurationEndTime = data?.privacyDurationEndTime || ''
          this.confirmedPrivacyDurationId = this.privacyDurationId
          this.isConfirmed = true
          this.setAccessText()
        })
        .finally(this.setLoading)
    },
    setAccessText() {
      if (this.privacyDurationId === PRIVACY_DURATIONS.DENY) {
        this.accessText = 'You deny access to your account'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY) {
        this.accessText = 'You are granting continuous access to your account'
      }
    },
    handlePrivacyDurationChange() {
      this.isConfirmed = this.privacyDurationId === this.confirmedPrivacyDurationId
    },
    toggleShowAccountPrivacyDialog(forceUpdate = false) {
      if (forceUpdate) this.callForData()
      this.isShowAccountPrivacyDialog = !this.isShowAccountPrivacyDialog
    },
    handleAccessPeriod() {
      if (this.isConfirmed) return
      this.toggleShowAccountPrivacyDialog()
    }
  }
}
</script>
