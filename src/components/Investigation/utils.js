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

export const createHeaderDataFactory = (params = {}) => {
  return {
    ip: null,
    from: null,
    to: null,
    cc: null,
    bcc: null,
    subject: null,
    senderName: null,
    ...params
  }
}
export const createBodyDataFactory = (params = {}) => {
  return {
    url: null,
    keyword: null,
    regex: null,
    ...params
  }
}

export const createAttachmentDataFactory = (params = {}) => {
  return {
    size: null,
    name: null,
    md5: null,
    sha512: null,
    extension: null,
    ...params
  }
}

export const HEADER_KEYS = ['ip', 'from', 'to', 'cc', 'bcc', 'subject', 'senderName']

export const BODY_KEYS = ['url', 'keyword', 'regex']

export const ATTACHMENT_KEYS = ['size', 'name', 'md5', 'sha512', 'extension']

export const OPERATORS = {
  OR: 0,
  AND: 1
}

export const TEXT_OPERATORS = {
  OR: 'OR',
  AND: 'AND'
}
