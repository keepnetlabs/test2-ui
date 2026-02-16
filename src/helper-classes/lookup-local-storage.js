import { getLookupListByTypeId, getLookupListByTypeIdList } from '@/api/common'

const ENUMS = {
  LOCAL_STORAGE_KEY: 'lookupLocalStorageStore',
  LAST_VALID_TIME_SINGLE_KEY: 'lookupLastValidTimeSingle',
  LAST_VALID_TIME_MULTIPLE_KEY: 'lookupLastValidTimeMultiple'
}

export default class LookupLocalStorage {
  static getStore() {
    const store = localStorage.getItem(ENUMS.LOCAL_STORAGE_KEY) || {}
    return typeof store === 'string' ? JSON.parse(store) : store
  }

  static getSingle(typeId) {
    const isCacheValid = LookupLocalStorage.checkCache(
      localStorage.getItem(ENUMS.LAST_VALID_TIME_SINGLE_KEY)
    )
    const store = LookupLocalStorage.getStore()
    const value = store[typeId.toString()]
    if (!isCacheValid) {
      LookupLocalStorage.deleteCachedItems(store)
    }
    if (!isCacheValid || !value) return LookupLocalStorage.callApiByTypeId(typeId)
    else return Promise.resolve(value)
  }

  static getMultiple(typeIds = []) {
    const isCacheValid = LookupLocalStorage.checkCache(
      localStorage.getItem(ENUMS.LAST_VALID_TIME_MULTIPLE_KEY)
    )
    const stringTypeIds = typeIds.join(',')
    const store = LookupLocalStorage.getStore()
    const value = store[stringTypeIds]
    if (!isCacheValid) {
      LookupLocalStorage.deleteCachedItems(store, true)
    }
    if (!isCacheValid || !value) {
      return LookupLocalStorage.callApiByTypeListId(typeIds)
    } else return Promise.resolve(value)
  }

  static deleteCachedItems(store, isMultiple = false) {
    Object.keys(store).forEach((key) => {
      if (isMultiple) {
        if (key.length > 1) {
          delete store[key]
        }
      } else if (key.length === 1) {
        delete store[key]
      }
    })
    localStorage.setItem(ENUMS.LOCAL_STORAGE_KEY, JSON.stringify(store))
  }

  static setTypeIdsToData(typeId, data) {
    const store = LookupLocalStorage.getStore()
    store[typeId.toString()] = data
    localStorage.setItem(ENUMS.LOCAL_STORAGE_KEY, JSON.stringify(store))
  }

  static checkCache(lastValidTime) {
    const now = Number.parseInt(Date.now().toString().slice(0, -3))
    if (lastValidTime) {
      lastValidTime = Number.parseInt(lastValidTime)
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
      LookupLocalStorage.setCacheTime(ENUMS.LAST_VALID_TIME_SINGLE_KEY, headers)
      LookupLocalStorage.setTypeIdsToData(typeId, data)
      return LookupLocalStorage.getStore()[typeId]
    })
  }

  static callApiByTypeListId(typeIds = []) {
    return getLookupListByTypeIdList({ typeidlist: typeIds }).then((response) => {
      const { data: { data = [] } = {}, headers = {} } = response
      const stringTypeIds = typeIds.join(',')
      LookupLocalStorage.setCacheTime(ENUMS.LAST_VALID_TIME_MULTIPLE_KEY, headers)
      LookupLocalStorage.setTypeIdsToData(stringTypeIds, data)
      return LookupLocalStorage.getStore()[stringTypeIds]
    })
  }
}
