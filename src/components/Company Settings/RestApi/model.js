class RestApiModel {
  constructor() {
    this.name = ''
    this.clientId = ''
    this.clientSecret = ''
    this.status = true
    this.statusId = 1
    this.hasIpAddressRestriction = false
    this.allowedIpAddresses = [{ value: '', name: '' }]
    this.roleResourceIdList = []
  }
  get name() {
    return this.name
  }
  set name(value) {
    this.name = value
  }
}

export default RestApiModel
