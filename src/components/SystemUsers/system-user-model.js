class SystemUserModel {
  constructor() {
    this.firstName = ''
    this.lastName = ''
    this.email = ''
    this.phoneNumber = ''
    this.statusName = ''
    this.roleResourceIdList = []
    this.statusId = 1
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
export default SystemUserModel
