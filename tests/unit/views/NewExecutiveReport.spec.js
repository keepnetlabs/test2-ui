import NewExecutiveReport from '@/views/NewExecutiveReport.vue'

describe('NewExecutiveReport.vue', () => {
  it('has correct component name', () => {
    expect(NewExecutiveReport.name).toBe('NewExecutiveReport')
  })

  it('uses NewExecutiveReportCommonContainer', () => {
    expect(NewExecutiveReport.components.NewExecutiveReportCommonContainer).toBeDefined()
  })

  it('beforeDestroy restores main overflow', () => {
    const mainNode = document.createElement('div')
    mainNode.className = 'v-main__wrap'
    mainNode.style.overflow = 'hidden'
    document.body.appendChild(mainNode)
    NewExecutiveReport.beforeDestroy.call({})
    expect(mainNode.style.overflow).toBe('')
    document.body.removeChild(mainNode)
  })
})
