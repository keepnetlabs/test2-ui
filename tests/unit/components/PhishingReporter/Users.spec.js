jest.mock('@/api/phishingReporter', () => ({
  searchPhishingReporterUser: jest.fn(() =>
    Promise.resolve({
      data: {
        data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 }
      }
    })
  ),
  exportPhishingReporterUserList: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  deletePhishingReporterUser: jest.fn(() => Promise.resolve()),
  bulkDeletePhishingUsers: jest.fn(() => Promise.resolve())
}))

const createObjectURL = jest.fn(() => 'blob:mock')
beforeAll(() => {
  window.URL.createObjectURL = createObjectURL
})

import Users from '@/components/PhishingReporter/Users.vue'

describe('PhishingReporter Users.vue', () => {
  it('getUserName returns first and last name when selectedRow', () => {
    const ctx = { selectedRow: { firstName: 'John', lastName: 'Doe' }, isMultipleDelete: false }
    expect(Users.computed.getUserName.call(ctx)).toContain('John')
    expect(Users.computed.getUserName.call(ctx)).toContain('Doe')
  })

  it('getUserName returns This user when no selectedRow', () => {
    const ctx = { selectedRow: null, isMultipleDelete: false }
    expect(Users.computed.getUserName.call(ctx)).toBe('This user')
  })

  it('getUserName returns user count when isMultipleDelete', () => {
    const ctx = { selectedRow: null, isMultipleDelete: true, multipleDeletedUserCount: 3 }
    expect(Users.computed.getUserName.call(ctx)).toContain('3 users')
  })

  it('getSubTitle returns plural when isMultiple', () => {
    const ctx = { isMultiple: true, userCount: 5 }
    expect(Users.computed.getSubTitle.call(ctx)).toContain('5 user(s)')
  })

  it('getSubTitle returns singular when not isMultiple', () => {
    const ctx = { isMultiple: false }
    expect(Users.computed.getSubTitle.call(ctx)).toContain('The phishing user')
  })

  it('handleDelete sets selectedRow and isWantToDelete', () => {
    const ctx = { selectedRow: null, isWantToDelete: false }
    const row = { resourceId: 'u1' }
    Users.methods.handleDelete.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.isWantToDelete).toBe(true)
  })

  it('getDiagnosticToolTooltipMessage returns last seen message', () => {
    const ctx = {}
    expect(
      Users.methods.getDiagnosticToolTooltipMessage.call(ctx, { diagnosticToolLastSeen: '2024-01-01' })
    ).toContain('Last seen')
    expect(
      Users.methods.getDiagnosticToolTooltipMessage.call(ctx, { diagnosticToolLastSeen: '2024-01-01' })
    ).toContain('2024-01-01')
  })
})
