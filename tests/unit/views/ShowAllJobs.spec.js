import ShowAllJobs from '@/views/ShowAllJobs.vue'

describe('ShowAllJobs.vue', () => {
  it('has expected component name and registers required child components', () => {
    expect(ShowAllJobs.name).toBe('ShowAllJobs')
    expect(ShowAllJobs.components).toHaveProperty('KContainer')
    expect(ShowAllJobs.components).toHaveProperty('ShowAllJobsInline')
  })
})
