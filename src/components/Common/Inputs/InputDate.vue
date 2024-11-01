<script>
import { DatePicker } from 'element-ui'
import { getTimeZone } from '@/utils/functions'

export default {
  name: 'InputDate',
  extends: DatePicker,
  props: {
    placeholder: {
      default: 'Select a date'
    },
    startPlaceholder: {
      default: 'Start Date'
    },
    endPlaceholder: {
      default: 'End Date'
    },
    rangeSeparator: {
      default: 'To'
    },
    popperClass: {
      default: 'filter__date-picker'
    },
    format: {
      default: getTimeZone() || 'yyyy/MM/dd HH:mm'
    },
    valueFormat: {
      default: getTimeZone() || `yyyy/MM/dd HH:mm`
    },
    type: {
      default: 'date'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    defaultTime: {}
  },
  created() {
    if (this._props.type === 'datetimerange') this.defaultTime = ['00:00:00', '23:59:00']
  }
}
</script>
