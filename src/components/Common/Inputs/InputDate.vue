<script>
let isUserCompanyExist = JSON.parse(localStorage.getItem('userData'))
let timeZone =
  isUserCompanyExist && JSON.parse(localStorage.getItem('userData')).userCompany.timeZone
let timeFormat =
  isUserCompanyExist && JSON.parse(localStorage.getItem('userData')).userCompany.timeFormat

if (timeFormat === '12h') {
  timeFormat = 'h'
} else {
  timeFormat = 'HH'
}
switch (timeZone) {
  case 'DD/MM/YYYY':
    timeZone = `dd-MM-yyyy ${timeFormat}:mm:ss`
    //timeZone = `yyyy-MM-dd HH:mm:ss`
    break
  case 'MM/DD/YYYY':
    timeZone = `MM-dd-yyyy ${timeFormat}:mm:ss`
    //timeZone = `yyyy-MM-dd HH:mm:ss`
    break
  case 'YYYY/MM/DD':
    timeZone = `yyyy-MM-dd ${timeFormat}:mm:ss`
    //timeZone = `yyyy-MM-dd HH:mm:ss`
    break
}

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
      default: timeZone || 'yyyy-MM-dd HH:mm:ss'
    },
    valueFormat: {
      default: 'yyyy-MM-dd HH:mm:ss'
    }
  }
}
</script>
