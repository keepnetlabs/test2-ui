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
      default: 'yyyy/MM/dd HH:mm'
    },
    valueFormat: {
      default: `yyyy/MM/dd HH:mm`
    },
    type: {
      default: 'date'
    },
    defaultTime: {}
  },
  created() {
    this.format = getTimeZone() || 'yyyy/MM/dd HH:mm'
    this.valueFormat = getTimeZone() || `yyyy/MM/dd HH:mm`
    if (this._props.type === 'datetimerange') this.defaultTime = ['00:00:00', '23:59:00']
  }
}
</script>
