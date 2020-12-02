<script>
import { DatePicker } from 'element-ui'

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
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    valueFormat: {
      default: 'yyyy-MM-dd HH:mm:ss'
    }
  }
}
</script>
