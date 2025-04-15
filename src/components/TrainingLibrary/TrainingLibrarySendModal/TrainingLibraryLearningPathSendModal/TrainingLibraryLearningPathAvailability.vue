<template>
  <FormGroup title="Learning Path Availability">
    <div class="campaign-manager-advanced-settings__distribution-item gap-2 mb-5">
      <div style="min-width: 78px; font-size: 14px;">Start date:</div>
      <div :class="['mb-n3', !isStartDateValid && 'date-picker-error']">
        <InputDate
          v-model="value.startDate"
          class="date-picker-height-40 w-100"
          type="datetime"
          ref="refPicker"
          placeholder="Select Date Select Time"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
          :picker-options="startDatePickerOptions"
        />
        <CustomError class="ml-2" :is-valid="isStartDateValid" />
      </div>
      <span class="v-label theme--light mx-1" style="font-size: 14px;">in</span>
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
    <div class="campaign-manager-advanced-settings__distribution-item gap-2 mb-5">
      <div style="min-width: 78px; font-size: 14px;">Due date:</div>
      <div :class="['mb-n3', !isDueDateValid && 'date-picker-error']">
        <InputDate
          v-model="value.dueDate"
          class="date-picker-height-40 w-100"
          type="datetime"
          ref="refPicker"
          placeholder="Select Date Select Time"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
          :disabled="isDueDateDisabled"
          :picker-options="dueDatePickerOptions"
        />
        <CustomError class="ml-2" :is-valid="isDueDateValid" />
      </div>
      <span class="v-label theme--light mx-1" style="font-size: 14px;">in</span>
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
import CustomError from '@/components/CustomError.vue'

export default {
  name: 'TrainingLibraryLearningPathAvailability',
  components: { CustomError, KSelect, InputDate, FormGroup },
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
      dateFormat: localStorage.getItem('selectedDateFormat'),
      isStartDateValid: true,
      isDueDateValid: true,
      parsedFormat: getTimeZone(false),
      startDatePickerOptions: {
        disabledDate: this.disabledStartPickerEndDates
      },
      dueDatePickerOptions: {
        disabledDate: this.disableDuePickerEndDates
      }
    }
  },
  computed: {
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
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
    },
    '$store.state.common.selectedTimeZone'() {
      this.value.startDateTimezoneId = this.$store?.getters['common/getSelectedTimeZone']
      this.value.dueDateTimezoneId = this.$store?.getters['common/getSelectedTimeZone']
    },
    'value.startDate'(val) {
      this.isStartDateValid = val && val.length > 0
    },
    'value.dueDate'(val) {
      this.isDueDateValid = !!(val && val.length > 0 && this.value.startDate)
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
    disabledStartPickerEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    disableDuePickerEndDates(val) {
      let selectedStartDate = new Date()
      if (this.value.startDate) {
        const [datePart, timePart] = this.value?.startDate?.split(' ') || []
        const [firstPart, secondPart, thirdPart] = datePart?.split('/') || []
        let minutes, hours
        if (this.timeFormat && this.timeFormat === '12h') {
          const [hoursPart, minutesPart] = timePart?.split(' ')?.[0]?.split(':') || []
          minutes = minutesPart
          hours = hoursPart
        } else {
          const [hoursPart, minutesPart] = timePart?.split(':') || []
          minutes = minutesPart
          hours = hoursPart
        }
        if (this.dateFormat === 'YYYY/MM/DD') {
          selectedStartDate = new Date(firstPart, secondPart - 1, thirdPart, hours, minutes)
        } else if (this.dateFormat === 'MM/DD/YYYY') {
          selectedStartDate = new Date(thirdPart, firstPart - 1, secondPart, hours, minutes)
        } else if (this.dateFormat === 'DD/MM/YYYY') {
          selectedStartDate = new Date(thirdPart, secondPart - 1, firstPart, hours, minutes)
        }
      }
      const selectedStartDateInMs = selectedStartDate.getTime()
      return selectedStartDateInMs > val.getTime()
    }
  }
}
</script>
