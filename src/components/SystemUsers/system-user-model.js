class SystemUserModel {
  constructor() {
    this.firstName = ''
    this.lastName = ''
    this.email = ''
    this.phoneNumber = ''
    this.statusName = ''
    this.roleResourceIdList = []
    this.statusId = 1
    this.bypassSsoRedirect = false
    this.bypassMfa = false
    this.bypassIpRestriction = false
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
export default SystemUserModel
