export function getStatusBadgeProps(status) {
  if (status === 'Completed') {
    return {
      color: '#217124',
      text: 'Completed'
    }
  }

  if (status === 'Running') {
    return {
      color: '#1173C1',
      text: 'Running'
    }
  }

  if (status === 'Idle') {
    return {
      color: '#0198AC',
      text: 'Idle'
    }
  }

  if (status === 'Scheduled') {
    return {
      color: '#757575',
      text: 'Scheduled'
    }
  }

  if (status === 'Cancelled') {
    return {
      color: '#B83A3A',
      text: 'Cancelled'
    }
  }

  if (status === 'Error') {
    return {
      color: '#F56C6C',
      text: 'Error',
      outline: false
    }
  }
}

export const sendCallsOnDaysOptions = [
  {
    text: 'Monday',
    value: 1
  },
  {
    text: 'Tuesday',
    value: 2
  },
  {
    text: 'Wednesday',
    value: 4
  },
  {
    text: 'Thursday',
    value: 8
  },
  {
    text: 'Friday',
    value: 16
  },
  {
    text: 'Saturday',
    value: 32
  },
  {
    text: 'Sunday',
    value: 64
  }
]
export const sendCallsOnDaysOptionsShort = [
  {
    text: 'Mon',
    value: 1
  },
  {
    text: 'Tue',
    value: 2
  },
  {
    text: 'Wed',
    value: 4
  },
  {
    text: 'Thu',
    value: 8
  },
  {
    text: 'Fri',
    value: 16
  },
  {
    text: 'Sat',
    value: 32
  },
  {
    text: 'Sun',
    value: 64
  }
]

export const recipientTypes = [
  {
    text: 'percent',
    value: 1
  },
  {
    text: 'users',
    value: 2
  }
]
export const sendCallsOverTypes = [
  {
    text: 'days',
    value: 'days'
  },
  {
    text: 'weeks',
    value: 'weeks'
  }
]
export const getSendCallOnDays = (val) => {
  return Number(val)
    ?.toString(2)
    ?.split('')
    ?.reverse()
    .reduce((acc, item, index) => {
      const number = Number.parseInt(item)
      if (number === 0) return acc
      acc.push(Math.pow(2, index))
      return acc
    }, [])
}

export const getScheduleType = (val) => {
  if (typeof val === 'number') return Number(val).toString()
  if (typeof val === 'string') {
    switch (val) {
      case 'SendNow':
        return '1'
      case 'SaveForLater':
        return '2'
      default:
        return '3'
    }
  }
  return '1'
}
