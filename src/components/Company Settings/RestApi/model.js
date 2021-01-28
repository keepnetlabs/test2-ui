class RestApiModel {
  constructor() {
    this.name = ''
    this.clientId = ''
    this.clientSecret = ''
    this.status = true
    this.statusId = 1
    this.hasIpAddressRestriction = false
    this.allowedIpAddresses = [{ value: '', name: '' }]
  }
}

export default RestApiModel
