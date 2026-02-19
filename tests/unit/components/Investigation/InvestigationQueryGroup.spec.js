import { shallowMount } from '@vue/test-utils'
import InvestigationQueryGroup from '@/components/Investigation/InvestigationQueryGroup.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InvestigationQueryGroup.vue', () => {
  const createWrapper = (propsData = {}, options = {}) =>
    shallowMount(InvestigationQueryGroup, {
      propsData: {
        index: 0,
        depth: 1,
        labels: { matchTypes: [{ label: 'OR' }, { label: 'AND' }], addRule: 'Add Rule' },
        selectedRule: { id: 'rule-1' },
        query: { logicalOperator: 'OR', children: [] },
        rules: [
          {
            operands: [
              {
                children: [{}, { isDisabled: false }, {}, {}, {}, {}, { isDisabled: false }]
              }
            ],
            errorMessages: []
          }
        ],
        ...propsData
      },
      stubs: {
        'query-builder-children': true,
        QueryBuilderRule: true,
        VBtn: true,
        VIcon: true
      },
      methods: {
        ruleById: jest.fn(() => ({ type: 'text' }))
      },
      ...options
    })

  it('provides expected helper methods', () => {
    const wrapper = createWrapper()
    const provided = wrapper.vm.$options.provide.call(wrapper.vm)

    expect(typeof provided.checkOperandsDisabilityStatus).toBe('function')
    expect(typeof provided.handleInputSingularityChange).toBe('function')
    expect(typeof provided.removeErrorMessage).toBe('function')
  })

  it('mounted adds default rule when children are empty and disables custom badge', async () => {
    const wrapper = createWrapper({ query: { logicalOperator: 'OR', children: [] } })
    await flushPromises()

    expect(wrapper.emitted('update:query')).toBeTruthy()
    expect(wrapper.vm.getCustomBadgeRender).toBe(false)
  })

  it('handleLogicalOperatorChange updates operator and emits event', () => {
    const wrapper = createWrapper({
      query: {
        logicalOperator: 'OR',
        children: [{ query: { operand: 'from' } }]
      }
    })
    wrapper.vm.checkOperandsDisabilityStatus = jest.fn()

    wrapper.vm.handleLogicalOperatorChange('AND')

    expect(wrapper.vm.blockAnimation).toBe(false)
    expect(wrapper.vm.query.logicalOperator).toBe('AND')
    expect(wrapper.vm.checkOperandsDisabilityStatus).toHaveBeenCalled()
    expect(wrapper.emitted('logical-operator-change')[0]).toEqual(['AND'])
  })

  it('handleLogicalOperatorChange keeps animation when operator is unchanged', () => {
    const wrapper = createWrapper({ query: { logicalOperator: 'OR', children: [] } })
    wrapper.vm.checkOperandsDisabilityStatus = jest.fn()
    wrapper.vm.blockAnimation = true

    wrapper.vm.handleLogicalOperatorChange('OR')

    expect(wrapper.vm.blockAnimation).toBe(true)
    expect(wrapper.vm.checkOperandsDisabilityStatus).toHaveBeenCalled()
    expect(wrapper.emitted('logical-operator-change')[0]).toEqual(['OR'])
  })

  it('checkOperandsDisabilityStatus toggles operand disabled flags by logical operator', () => {
    const wrapper = createWrapper({
      query: {
        logicalOperator: 'AND',
        children: [{ query: { operand: 'from' } }, { query: { operand: 'ip' } }]
      }
    })

    wrapper.vm.checkOperandsDisabilityStatus()
    expect(wrapper.vm.rules[0].operands[0].children[1].isDisabled).toBe(true)
    expect(wrapper.vm.rules[0].operands[0].children[6].isDisabled).toBe(true)

    wrapper.vm.query.logicalOperator = 'OR'
    wrapper.vm.checkOperandsDisabilityStatus()
    expect(wrapper.vm.rules[0].operands[0].children[1].isDisabled).toBe(false)
    expect(wrapper.vm.rules[0].operands[0].children[6].isDisabled).toBe(false)
  })

  it('checkSingularity sets duplicate error message and ignores empty items', async () => {
    const wrapper = createWrapper({
      query: {
        logicalOperator: 'OR',
        children: [{ query: { operand: 'from', value: 'a@x.com' } }, { query: { operand: 'from', value: 'a@x.com' } }]
      }
    })

    wrapper.vm.checkSingularity({ operand: 'from', value: 'a@x.com' }, 1)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.rules[0].errorMessages[1]).toBe('There is already from with same value')

    wrapper.vm.checkSingularity(null, 0)
    expect(wrapper.vm.rules[0].errorMessages[0]).toBeUndefined()
  })

  it('handleInputSingularityChange uses safe fallback and triggers all checks', () => {
    const wrapper = createWrapper()
    const checkSingularitySpy = jest.spyOn(wrapper.vm, 'checkSingularity').mockImplementation(() => {})
    const checkAllSpy = jest.spyOn(wrapper.vm, 'checkAllSingularity').mockImplementation(() => {})

    wrapper.vm.handleInputSingularityChange(null, 0)

    expect(checkSingularitySpy).toHaveBeenCalledWith({ operand: '', value: '' }, 0)
    expect(checkAllSpy).toHaveBeenCalled()
  })

  it('removeErrorMessage removes item and rechecks singularity', () => {
    const wrapper = createWrapper()
    wrapper.vm.rules[0].errorMessages = ['a', 'b', 'c']
    const checkAllSpy = jest.spyOn(wrapper.vm, 'checkAllSingularity').mockImplementation(() => {})

    wrapper.vm.removeErrorMessage(1)

    expect(wrapper.vm.rules[0].errorMessages).toEqual(['a', 'c'])
    expect(checkAllSpy).toHaveBeenCalled()
  })

  it('addRule emits updated query for normal and multi-select rule types', () => {
    const textWrapper = createWrapper()
    textWrapper.vm.ruleById = jest.fn(() => ({ type: 'text' }))
    textWrapper.vm.addRule()
    const textPayload = textWrapper.emitted('update:query').pop()[0]
    expect(textPayload.children[0].query.value).toBe('')

    const multiWrapper = createWrapper()
    multiWrapper.vm.ruleById = jest.fn(() => ({ type: 'multi-select' }))
    multiWrapper.vm.addRule()
    const multiPayload = multiWrapper.emitted('update:query').pop()[0]
    expect(multiPayload.children[0].query.value).toEqual([])
  })

  it('query watcher updates child badge visibility for depth 1', async () => {
    const wrapper = createWrapper({ depth: 1, query: { logicalOperator: 'OR', children: [{}, {}] } })
    wrapper.vm.$children = [
      {
        $children: [{ getCustomBadgeRender: false }, { getCustomBadgeRender: false }, { getCustomBadgeRender: false }]
      }
    ]

    wrapper.vm.$options.watch.query.call(wrapper.vm)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$children[0].$children[0].getCustomBadgeRender).toBe(true)
    expect(wrapper.vm.$children[0].$children[1].getCustomBadgeRender).toBe(true)
    expect(wrapper.vm.$children[0].$children[2].getCustomBadgeRender).toBe(false)
  })
})

