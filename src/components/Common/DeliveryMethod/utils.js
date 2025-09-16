export const DELIVERY_METHODS = {
  EMAIL: 'email',
  LMS: 'lms',
  MICROSOFT_TEAMS: 'microsoft-teams',
  SMS: 'sms'
}
export const deliveryMethodOptions = (isLMS = false,type='Training') => {
  return [
    {
      label: 'Email',
      value: 'email',
      description: `${type} is sent directly to target users via email`
    },
    ...(isLMS
      ? [
          {
            label: 'LMS',
            value: 'lms',
            description: `${type} is delivered through the organization's LMS (Learning Management System)`
          }
        ]
      : []),
    {
      label: 'Microsoft Teams',
      value: 'microsoft-teams',
      description:
        `${type} is sent via Microsoft Teams to users found there and via email to all`
    },
    {
      label: 'SMS',
      value: 'sms',
      description: `${type} is sent via SMS to users with phone numbers and via email to all`
    }
  ]
}
export const getDeliveryMethodLabel = (deliveryMethod) => {
  if (deliveryMethod === DELIVERY_METHODS.LMS) {
    return 'LMS'
  } else if (deliveryMethod === DELIVERY_METHODS.SMS) {
    return 'SMS & Email'
  } else if (deliveryMethod === DELIVERY_METHODS.MICROSOFT_TEAMS) {
    return 'Microsoft Teams & Email'
  }
  return 'Email'
}
