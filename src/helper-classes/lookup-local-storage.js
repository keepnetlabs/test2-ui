import { getLookupListByTypeId, getLookupListByTypeIdList } from '@/api/common'

const ENUMS = {
  LOCAL_STORAGE_KEY: 'lookupLocalStorageStore',
  LAST_VALID_TIME_SINGLE: 'lookupLastValidTimeSingle',
  LAST_VALID_TIME_MULTIPLE: 'lookupLastValidTimeMultiple'
}

export default class LookupLocalStorage {
  static getStore() {
    const store = localStorage.getItem(ENUMS.LOCAL_STORAGE_KEY) || {}
    return typeof store === 'string' ? JSON.parse(store) : store
  }

  static getSingle(typeId) {
    const isCacheValid = LookupLocalStorage.checkCache(
      localStorage.getItem(ENUMS.LAST_VALID_TIME_SINGLE)
    )
    if (!isCacheValid) return LookupLocalStorage.callApiByTypeId(typeId)
    else return Promise.resolve(LookupLocalStorage.getStore()[typeId.toString()])
  }

  static getMultiple(typeIds = []) {
    const isCacheValid = LookupLocalStorage.checkCache(
      localStorage.getItem(ENUMS.LAST_VALID_TIME_MULTIPLE)
    )
    if (!isCacheValid) return LookupLocalStorage.callApiByTypeListId(typeIds)
    else return Promise.resolve(LookupLocalStorage.getStore()[typeIds.join(',')])
  }

  static setTypeIdsToData(typeId, data) {
    const store = LookupLocalStorage.getStore()
    store[typeId.toString()] = data
    localStorage.setItem(ENUMS.LOCAL_STORAGE_KEY, JSON.stringify(store))
  }

  static checkCache(lastValidTime) {
    const now = parseInt(Date.now().toString().slice(0, -3))
    if (lastValidTime) {
      lastValidTime = parseInt(lastValidTime)
      if (lastValidTime > now) {
        return true
      }
    }
    return false
  }

  static setCacheTime(type, headers) {
    const lookupExpireTime = headers['lookup-expire']
    if (!lookupExpireTime) return
    localStorage.setItem(type, lookupExpireTime)
  }

  static callApiByTypeId(typeId = '') {
    return getLookupListByTypeId(typeId).then((response) => {
      const { data: { data = [] } = {}, headers = {} } = response
      LookupLocalStorage.setCacheTime(ENUMS.LAST_VALID_TIME_SINGLE, headers)
      LookupLocalStorage.setTypeIdsToData(typeId, data)
      return LookupLocalStorage.getStore()[typeId]
    })
  }

  static callApiByTypeListId(typeIds = []) {
    return getLookupListByTypeIdList({ typeidlist: typeIds }).then((response) => {
      const { data: { data = [] } = {}, headers = {} } = response
      const stringTypeIds = typeIds.join(',')
      LookupLocalStorage.setCacheTime(ENUMS.LAST_VALID_TIME_MULTIPLE, headers)
      LookupLocalStorage.setTypeIdsToData(stringTypeIds, data)
      return LookupLocalStorage.getStore()[stringTypeIds]
    })
  }
}
