<template>
  <AppModal
    :status="status"
    icon-name="$custom-new-instance"
    title="Create New Instance"
    class-name="add-in-configuration"
    title-id="create-new-instance__title"
    @closeOverlay="closeOverlay"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        :title="labels.CampaignInstance"
        :sub-title="labels.CampaignInstanceSub"
      />
      <FormGroup
        class-name="campaign-manager__target-groups"
        :title="labels.TargetGroups"
        :sub-title="labels.TargetGroupsSub"
      >
        <KSelect
          v-show="false"
          v-model.trim="formValues.targetGroupResourceIds"
          type="combobox"
          id="input--campaign-target-user-groups"
          class="edit-select new-investigation__combo target-users-select-multi select-specific-users"
          outlined
          multiple
          dense
          auto-select-first
          small-chips
          deletable-chips
          persistent-hint
          hint="*Required"
          placeholder="Select groups"
          :loading="isTargetGroupSearchLoading"
          :items="targetGroupItems"
          :rules="rules.select"
          :slots="{ progress: true }"
          @input="handleTargetGroupsResourceIdsChange"
          @update:search-input="handleSearchInputChange"
          @focus="handleFocusOfTargetGroupsInput"
          @focusout="handleFocusOutOfTargetGroupsInput"
        >
          <template #progress>
            <KSelectLoading v-show="isTargetGroupSearchLoading && isTargetGroupFocused" />
          </template>
        </KSelect>
        <v-btn
          v-show="false"
          text
          class="campaign-manager__close-advanced-search"
          color="#2196F3"
          @click="toggleShowAdvancedSearch"
        >
          {{ isShowAdvancedSearch ? labels.CloseAdvancedSearch : labels.OpenAdvancedSearch }}
        </v-btn>
      </FormGroup>
      <CampaignManagerTargetGroups
        v-show="isShowAdvancedSearch"
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
          <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
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
                :disabled="isScheduledTimeDisabled"
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
              min-width-type="small"
              nudge-width="170"
              :items="scheduledTimeItems"
              :disabled="isScheduledTimeDisabled"
            />
          </div>
        </v-radio-group>
      </FormGroup>
      <FormGroup class="mt-6" :title="labels.MarkAsTest" style="max-width: 640px;">
        <div>
          <v-checkbox
            v-model="formValues.excludeFromReports"
            id="input--campaign-manager-advanced-settings-exclude-from-reports"
            color="#2196f3"
          >
            <template #label> Exclude from reports (Test campaign)</template>
          </v-checkbox>
        </div>
      </FormGroup>
    </template>
    <template #overlay-footer>
      <v-btn
        @click="closeOverlay"
        id="create-new-instance__cancel-button"
        class="add-in-configuration__footer-btn-cancel"
        rounded
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          id="create-new-instance__create-button"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          :disabled="isActionButtonDisabled"
          @click="handleSubmit"
        >
          {{ labels.Create }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import KSelectLoading from '@/components/KSelectLoading'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import InputDate from '@/components/Common/Inputs/InputDate'
import { searchTargetGroups } from '@/api/targetUsers'
import { createCampaignInstance } from '@/api/phishingsimulator'
import { mapGetters } from 'vuex'
import { isDifferent } from '@/utils/functions'
import * as validations from '@/utils/validations'

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
    KSelect,
    KSelectLoading,
    CampaignManagerTargetGroups,
    CustomError,
    InputDate
  },
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
      isShowAdvancedSearch: true,
      defaultTargetGroups: [],
      targetGroupItems: [],
      radioItems: [
        { text: 'Send now', value: '1' },
        { text: 'Save for later', value: '2' }
      ],
      axiosPayloadOfTargetGroups: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
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
      selectedTimeZone: 'common/getSelectedTimeZone'
    }),
    getTargetGroupErrorMessage() {
      return this.formValues.targetGroupResourceIds.length
        ? this.isShowTargetGroupUsersError
          ? 'Target groups must have at least 1 user'
          : 'Required'
        : 'Required'
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
    selectedTimeZone(val) {
      this.formValues.scheduledDateTimeZoneId = val
    },
    'formValues.scheduledDate'(val) {
      this.isDateValid = this.formValues
        ? this.formValues.scheduleTypeId === '3'
          ? val && val.length > 0
          : true
        : false
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
  methods: {
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
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    handleSearchInputChange(val) {
      this.debounce(() => {
        if (
          (!this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0] &&
            val === null) ||
          (this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0] &&
            this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0].Value === val)
        )
          return
        this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val }
        ]
        this.callForTargetGroups()
      }, 500)
    },
    handleFocusOfTargetGroupsInput() {
      this.isTargetGroupFocused = true
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          if (document.querySelector('#input--campaign-target-user-groups .k-select__menu')) {
            document
              .querySelector('#input--campaign-target-user-groups .k-select__menu')
              .addEventListener('scroll', this.handleScroll)
          }
        })
      }, 250)
    },
    handleScroll(
      e,
      callback = this.callForTargetGroups,
      axiosPayload = this.axiosPayloadOfTargetGroups
    ) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        axiosPayload.pageSize += 10
        this.debounce(() => {
          callback()
        }, 500)
      }
    },
    handleFocusOutOfTargetGroupsInput() {
      this.isTargetGroupFocused = false
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          if (document.querySelector('#input--campaign-target-user-groups .k-select__menu')) {
            document
              .querySelector('#input--campaign-target-user-groups .k-select__menu')
              .removeEventListener('scroll', this.handleScroll)
          }
        })
      }, 250)
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
    toggleShowAdvancedSearch() {
      this.isShowAdvancedSearch = !this.isShowAdvancedSearch
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
        createCampaignInstance(this.resourceId, this.formValues)
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
  },
  created() {
    this.callForTargetGroups()
    this.callForGetTimeZones()
    this.getSelectedTimeZone()
    this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
  }
}
</script>

<style lang="sass" scoped></style>
