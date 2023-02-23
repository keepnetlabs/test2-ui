export const TARGET_USER_TYPES = {
  AllUsers: 'AllUsers',
  Groups: 'Groups',
  Users: 'SpecificUsers'
}
export const ACTION_TYPES = {
  NoAction: 'NoAction',
  Warning: 'Warning',
  MoveToTrash: 'MoveToTrash',
  Delete: 'Delete'
}
export const DURATION_TYPES = {
  OneDay: 1,
  ThreeDays: 3,
  SevenDays: 7
}
export const durations = [
  { durationLabel: '1 Day', durationValue: DURATION_TYPES.OneDay },
  { durationLabel: '3 Days', durationValue: DURATION_TYPES.ThreeDays },
  { durationLabel: '7 Days', durationValue: DURATION_TYPES.SevenDays }
]

export const actions = [
  { actionLabel: 'No action', actionValue: ACTION_TYPES.NoAction },
  { actionLabel: 'Notify user only', actionValue: ACTION_TYPES.Warning },
  { actionLabel: 'Move to trash', actionValue: ACTION_TYPES.MoveToTrash },
  { actionLabel: 'Delete email', actionValue: ACTION_TYPES.Delete }
]
