import {
  getStoreValue,
  PROPERTY_STORE,
  COMMON_CONSTANTS,
  COMMON_SNACKBAR
} from '@/model/constants/commonConstants'

describe('model/constants/commonConstants', () => {
  it('getStoreValue resolves label from PROPERTY_STORE', () => {
    expect(getStoreValue(PROPERTY_STORE.EMAIL)).toBe('Email')
  })

  it('getStoreValue trims and uppercases key input before lookup', () => {
    expect(getStoreValue('  email  ')).toBe('Email')
  })

  it('getStoreValue returns uppercase when type is UPPERCASE', () => {
    expect(getStoreValue(PROPERTY_STORE.EMAIL, COMMON_CONSTANTS.UPPERCASE)).toBe('EMAIL')
  })

  it('getStoreValue returns lowercase when type is LOWERCASE', () => {
    expect(getStoreValue(PROPERTY_STORE.EMAIL, COMMON_CONSTANTS.LOWERCASE)).toBe('email')
  })

  it('COMMON_SNACKBAR has success defaults', () => {
    expect(COMMON_SNACKBAR).toEqual({
      show: true,
      color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
      icon: 'mdi-check-circle'
    })
  })
})
