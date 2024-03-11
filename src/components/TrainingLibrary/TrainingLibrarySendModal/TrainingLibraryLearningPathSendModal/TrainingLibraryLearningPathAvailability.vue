<template>
  <FormGroup title="Learning Path Availability">
    <div class="campaign-manager-advanced-settings__distribution-item gap-2 mb-4">
      <div style="min-width: 78px;">Start date:</div>
      <div :class="[!isDateValid && 'date-picker-error mb-n3']">
        <InputDate
          v-model="value.startDate"
          class="date-picker-height-40 w-100"
          type="datetime"
          ref="refPicker"
          placeholder="Select Date Select Time"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
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
        v-model.trim="value.startDateTimezoneId"
        type="autocomplete"
        id="input--campaign-manager-campaign-info-time-type"
        style="max-width: 233px;"
        outlined
        dense
        hide-details
        placeholder="Select an item"
        min-width-type="super"
        nudge-width="200"
        :items="scheduledTimeItems"
      />
    </div>
    <div class="campaign-manager-advanced-settings__distribution-item gap-2 mb-4">
      <div style="min-width: 78px;">Due date:</div>
      <div :class="[!isDateValid && 'date-picker-error mb-n3']">
        <InputDate
          v-model="value.dueDate"
          class="date-picker-height-40 w-100"
          type="datetime"
          ref="refPicker"
          placeholder="Select Date Select Time"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
          :disabled="isDueDateDisabled"
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
        v-model.trim="value.dueDateTimezoneId"
        type="autocomplete"
        id="input--campaign-manager-campaign-info-time-type"
        style="max-width: 233px;"
        outlined
        dense
        hide-details
        placeholder="Select an item"
        min-width-type="super"
        nudge-width="200"
        :items="scheduledTimeItems"
        :disabled="isDueDateDisabled"
      />
    </div>
  </FormGroup>
</template>
<script>
import FormGroup from '../../../SmallComponents/FormGroup.vue'
import InputDate from '../../../Common/Inputs/InputDate.vue'
import { getTimeZone } from '../../../../utils/functions'
import KSelect from '../../../Common/Inputs/KSelect.vue'

export default {
  name: 'TrainingLibraryLearningPathAvailability',
  components: { KSelect, InputDate, FormGroup },
  props: {
    value: {
      type: Object,
      default: () => ({
        startDate: '',
        startDateTimezoneId: '',
        dueDate: '',
        dueDateTimezoneId: ''
      })
    }
  },
  data() {
    return {
      isDateValid: true,
      parsedFormat: getTimeZone(false),
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      }
    }
  },
  computed: {
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({ text: item.displayName, value: item.id }))
    },
    isDueDateDisabled() {
      return !(this.value.startDate && this.value.startDateTimezoneId)
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
    }
  },
  created() {
    this.callForGetTimeZones()
    this.getSelectedTimeZone()
  },
  methods: {
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    },
    getSelectedTimeZone() {
      if (this.$store?.getters['common/getSelectedTimeZone']) {
        this.value.startDateTimezoneId = this.$store?.getters['common/getSelectedTimeZone']
        this.value.dueDateTimezoneId = this.$store?.getters['common/getSelectedTimeZone']
      } else {
        this.$store.dispatch('common/callForSettings')
      }
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    }
  }
}
</script>
