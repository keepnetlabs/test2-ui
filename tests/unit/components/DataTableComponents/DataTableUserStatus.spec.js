import DataTableUserStatus from '@/components/DataTableComponents/DataTableUserStatus.vue'

describe('DataTableUserStatus.vue', () => {
  it('getBtnUserStatusColor returns color for online/offline', () => {
    expect(DataTableUserStatus.methods.getBtnUserStatusColor('online')).toBe('#00bcd4')
    expect(DataTableUserStatus.methods.getBtnUserStatusColor('offline')).toBe('#f56c6c')
  })
})
