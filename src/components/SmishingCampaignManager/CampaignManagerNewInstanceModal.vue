<template>
  <AppModal
    :status="status"
    icon-name="$custom-new-instance"
    title="Create New Instance"
    class-name="add-in-configuration"
    title-id="text--create-new-instance__title"
    confirm-button-id="btn-save--campaign-manager-new-instance-modal"
    cancel-button-id="btn-cancel--campaign-manager-new-instance-modal"
    :confirm-button-text="labels.Launch"
    :confirm-button-style="{ width: '90px' }"
    :save-disable="isActionButtonDisabled"
    @closeOverlay="closeOverlay"
    @submit="handleSubmit"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        :title="labels.CampaignInstance"
        sub-title="Select target groups and schedule options for this smishing campaign instance"
      />
      <FormGroup
        class-name="campaign-manager__target-groups"
        title="Target Audience"
        sub-title="Select target groups to send this text message"
      />
      <CampaignManagerTargetGroups
        ref="refCampaignManagerTargetGroup"
        class="mt-2"
        :selected-target-groups="formValues.targetGroupResourceIds"
        :response-of-target-groups-items="responseOfTargetGroupsItems"
        :is-valid="isTargetGroupsValid"
        @handle-selection-change="handleTableSelectionChange"
      />
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px;"
        :is-valid="isTargetGroupsValid"
        :error-message="getTargetGroupErrorMessage"
      />
      <FormGroup :title="labels.Schedule" :sub-title="labels.ScheduleSub" style="max-width: 600px;">
        <v-radio-group
          v-model="formValues.scheduleTypeId"
          class="mt-0 campaign-manager-target-groups-radio"
          hide-details
        >
          <v-radio
            v-for="item in radioItems"
            :key="item.text"
            style="margin-bottom: 16px;"
            color="#2196f3"
            :id="`input--campaign-manager-radio-${item.text}`"
            :value="item.value"
            :label="item.text"
          ></v-radio>
          <!-- <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
            <v-radio
              :id="`input--campaign-manager-radio-schedule-to`"
              style="margin-bottom: 0;"
              label="Schedule to"
              color="#2196f3"
              value="3"
            />
            <div :class="[!isDateValid && 'date-picker-error mb-n3']">
              <InputDate
                v-model="formValues.scheduledDate"
                class="date-picker-height-40 ml-2"
                type="datetime"
                ref="refPicker"
                placeholder="Select Date Select Time"
                style="width: 100%; max-width: 222px;"
                :format="parsedFormat"
                :valueFormat="parsedFormat"
                :disabled="isScheduledTimeDisabled"
                :picker-options="datePickerOptions"
              />
              <div class="v-text-field__details checkbox-error" v-if="!isDateValid">
                <transition appear name="bounce">
                  <div class="v-messages theme--light error--text" role="alert">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message" style="padding-left: 10px;">
                        Date is required
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <KSelect
              v-model.trim="formValues.scheduledDateTimeZoneId"
              type="autocomplete"
              id="input--campaign-manager-campaign-info-time-type"
              class="ml-2"
              style="max-width: 195px;"
              outlined
              dense
              hide-details
              placeholder="Select a item"
              min-width-type="super"
              nudge-width="200"
              :items="scheduledTimeItems"
              :disabled="isScheduledTimeDisabled"
            />
          </div> -->
        </v-radio-group>
      </FormGroup>
      <FormGroup class="mt-6" :title="labels.MarkAsTest" style="max-width: 640px;">
        <div>
          <v-checkbox
            v-model="formValues.excludeFromReports"
            id="input--campaign-manager-advanced-settings-exclude-from-reports"
            color="#2196f3"
          >
            <template #label> Exclude this campaign’s statistics from all generic reports</template>
          </v-checkbox>
        </div>
      </FormGroup>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
// import KSelect from '@/components/Common/Inputs/KSelect'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
// import InputDate from '@/components/Common/Inputs/InputDate'
import { searchTargetGroups } from '@/api/targetUsers'
// TODO: Change api endpoint
import { launchPhishingCampaign } from '@/api/phishingsimulator'
import { mapGetters } from 'vuex'
import { isDifferent, getTimeZone, getDefaultAxiosPayload } from '@/utils/functions'
import * as validations from '@/utils/validations'
import useDebounce from '@/hooks/useDebounce'

const defaultFormValues = {
  targetGroupResourceIds: [],
  scheduleTypeId: '1',
  scheduledDate: '',
  scheduledDateTimeZoneId: '',
  excludeFromReports: false
}
const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}
export default {
  name: 'CampaignManagerNewInstanceModal',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    // KSelect,
    CampaignManagerTargetGroups,
    CustomError
    // InputDate
  },
  mixins: [useDebounce],
  emits: EMITS,
  props: {
    status: {
      type: Boolean
    },
    resourceId: {
      type: String
    }
  },
  data() {
    return {
      parsedFormat: getTimeZone(false),
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      labels,
      initialFormValues: JSON.parse(JSON.stringify(defaultFormValues)),
      formValues: JSON.parse(JSON.stringify(defaultFormValues)),
      isTargetGroupSearchLoading: false,
      isTargetGroupLoading: false,
      isTargetGroupFocused: false,
      isTargetGroupsValid: true,
      isDateValid: true,
      isActionButtonDisabled: false,
      initial: true,
      responseOfTargetGroupsItems: {},
      defaultTargetGroups: [],
      targetGroupItems: [],
      radioItems: [
        { text: 'Send now', value: '1' },
        { text: 'Save for later', value: '2' }
      ],
      axiosPayloadOfTargetGroups: getDefaultAxiosPayload(),
      rules: {
        select: [
          (v) => !!v.length || labels.Required,
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ],
        days: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', 0)
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    getTargetGroupErrorMessage() {
      return this.formValues.targetGroupResourceIds.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      return this.isShowTargetGroupUsersError ? labels.TargetGroupUserRequiredError : 'Required'
    },
    isScheduledTimeDisabled() {
      return this.formValues.scheduleTypeId !== '3'
    },
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
    }
  },
  watch: {
    timezoneFormat: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.parsedFormat = getTimeZone(false, val)
        }
      }
    },
    selectedTimeZone(val) {
      this.formValues.scheduledDateTimeZoneId = val
    },
    'formValues.scheduledDate'(val) {
      let isDateValid
      if (this.formValues) {
        isDateValid = this.formValues.scheduleTypeId === '3' ? val && val.length > 0 : true
      } else isDateValid = false
      this.isDateValid = isDateValid
    },
    'formValues.scheduleTypeId'(val) {
      if (val !== '3') {
        this.isDateValid = true
      }
    },
    'formValues.targetGroupResourceIds'(val) {
      this.isTargetGroupsValid = !!val.length
    }
  },
  created() {
    this.callForTargetGroups()
    this.callForGetTimeZones()
    this.getSelectedTimeZone()
    this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
  },
  methods: {
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit(EMITS.ON_CLOSE)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit(EMITS.ON_CLOSE)
        }
      })
    },
    callForTargetGroups() {
      this.isTargetGroupSearchLoading = true
      this.setTargetGroupLoading(true)
      searchTargetGroups(this.axiosPayloadOfTargetGroups)
        .then((response) => {
          const { data: { data: { results = [] } = {} } = {} } = response
          if (this.initial) {
            this.responseOfTargetGroupsItems = response
          }

          this.initial = false
          this.targetGroupItems = results.map((item) => ({
            text: item.name,
            value: item.resourceId,
            extraDatas: null
          }))
        })
        .finally(() => {
          this.isTargetGroupSearchLoading = false
          this.setTargetGroupLoading()
          this.addDefaultTargetGroupItems(this.defaultTargetGroups)
          this.targetGroupItems.push(...this.defaultTargetGroups)
        })
    },
    addDefaultTargetGroupItems(targetGroups = []) {
      if (this.formValues.targetGroupResourceIds.length || !targetGroups.length) return
      this.$nextTick(() => {
        this.handleTargetGroupsResourceIdsChange(targetGroups)
      })
    },
    handleTargetGroupsResourceIdsChange(items) {
      const selectedTableItems = items
        .filter((item) => item)
        .map((item) => ({ ...item, resourceId: item.value }))
      if (
        this.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.$refs.elTableRef
      ) {
        this.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
          selectedTableItems
        )
      }
    },
    handleTableSelectionChange(items) {
      this.formValues.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: null
        }))
    },
    setTargetGroupLoading(val = false) {
      this.isTargetGroupLoading = val
    },
    handleSubmit() {
      if (this.formValues.scheduleTypeId === '3' && !this.formValues.scheduledDate) {
        this.isDateValid = false
      }
      if (!this.formValues.targetGroupResourceIds.length) {
        this.isTargetGroupsValid = false
      }
      if (this.isDateValid && this.isTargetGroupsValid) {
        this.setActionButtonDisability(true)
        const payload = {
          ...this.formValues,
          scheduleTypeId: parseInt(this.formValues.scheduleTypeId),
          scheduledDate:
            parseInt(this.formValues.scheduleTypeId) !== 3 ? null : this.formValues.scheduledDate,
          targetGroupResourceIds: this.formValues.targetGroupResourceIds.map(
            (target) => target.value
          )
        }
        launchPhishingCampaign(this.resourceId, payload)
          .then(() => {
            this.$emit(EMITS.ON_SUBMIT)
          })
          .finally(this.setActionButtonDisability)
      }
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    getSelectedTimeZone() {
      if (this.$store?.getters['common/getSelectedTimeZone']) {
        this.formValues.scheduledDateTimeZoneId = this.$store?.getters['common/getSelectedTimeZone']
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      } else {
        this.$store.dispatch('common/callForSettings')
      }
    },
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    }
  }
}
</script>
