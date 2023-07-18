<template>
  <div>
    <CompanySettingsHeader
      title="Account Privacy"
      sub-title="Configure customer success representative access to your account"
    />
    <AccountPrivacyDialog
      v-if="isShowAccountPrivacyDialog"
      :status="isShowAccountPrivacyDialog"
      :time-allowed="getTimeAllowed"
      :privacy-duration-id="privacyDurationId"
      @on-close="toggleShowAccountPrivacyDialog"
    />
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else>
      <div
        v-if="isReturnMainAccountVisible"
        class="bg-warning px-4 py-4 max-w-554 mb-2 text-primary-color align-start fs-medium d-flex br-2"
      >
        <VIcon color="#B6791D">mdi-alert-circle</VIcon>
        <span class="ml-2"
          >You need to be a company system user to change the account privacy settings</span
        >
      </div>
      <div v-if="!(isAccessOrDeny && isReturnMainAccountVisible)" class="access-text">
        <div v-if="isAccessOrDeny" class="d-flex align-start">
          <VIcon class="mr-2" color="#2196f3">{{ accessIcon }}</VIcon
          ><span>{{ accessText }}</span>
        </div>
        <div class="d-flex align-start" v-else>
          <VIcon>$lock-open-time</VIcon>
          <div class="ml-2">
            <div class="pb-2">
              You granted customer success representatives access to your account for a limited time
            </div>
            <div>
              <strong class="fw-600">Start Time: </strong>
              <span>{{ privacyDurationStartTime }} {{ selectedTimeZone }}</span>
            </div>
            <div>
              <strong class="fw-600">End Time: </strong>
              <span>{{ privacyDurationEndTime }} {{ selectedTimeZone }}</span>
            </div>
          </div>
        </div>
      </div>
      <FormGroup
        class-name="campaign-manager-smtp-settings max-w-554"
        title="Access Period"
        sub-title="Access period is the allowed period for a customer success representative to access your account"
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
          :disabled="isReturnMainAccountVisible"
          @change="handlePrivacyDurationChange"
        >
        </KSelect>
        <VBtn
          v-if="!isReturnMainAccountVisible"
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
import { mapGetters } from 'vuex'
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
      accessIcon: '',
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
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZoneName'
    }),
    isAccessOrDeny() {
      return this.confirmedPrivacyDurationId === 0 || this.confirmedPrivacyDurationId === 1
    },
    isReturnMainAccountVisible() {
      return (
        localStorage.getItem('companyResourceId') !==
        localStorage.getItem('selectedCompanyRequestId')
      )
    },
    getAccessButtonStyle() {
      return {
        color: this.isConfirmed ? '#43A047' : '#2196F3',
        display: 'flex',
        'align-items': 'center'
      }
    },
    getTimeAllowed() {
      if (this.privacyDurationId === PRIVACY_DURATIONS.DENY) {
        return 'Deny access'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY) {
        return 'Allow access continuously'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.TWO_HOURS) {
        return '2 hours'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.EIGHT_HOUR) {
        return '8 hours'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ONE_DAY) {
        return '1 day'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.SEVEN_DAYS) {
        return '7 days'
      }
      return ''
    }
  },
  created() {
    this.callForData()
    if (!this.selectedTimeZone) this.$store.dispatch('common/callForSettings')
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
          this.setAccessTextAndIcon()
        })
        .finally(this.setLoading)
    },
    setAccessTextAndIcon() {
      if (this.privacyDurationId === PRIVACY_DURATIONS.DENY) {
        this.accessText = 'You denied any customer success representative access to your account'
        this.accessIcon = 'mdi-lock'
      } else if (this.privacyDurationId === PRIVACY_DURATIONS.ACCESS_CONTINUOUSLY) {
        this.accessText =
          'You granted customer success representatives continuous access to your account'
        this.accessIcon = 'mdi-lock-open-outline'
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
