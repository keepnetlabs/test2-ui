import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch.vue'

describe('DataContainerWithSearch.vue (extra)', () => {
  it('getStyle merges custom style with maxWidth', () => {
    const result = DataContainerWithSearch.computed.getStyle.call({
      customStyle: { backgroundColor: 'red' },
      maxWidth: '700px'
    })
    expect(result).toEqual({ backgroundColor: 'red', maxWidth: '700px' })
  })

  it('filter availability computed flags depend on filters prop', () => {
    expect(
      DataContainerWithSearch.computed.isCustomFilterAvailable.call({ filters: ['custom'] })
    ).toBe(true)
    expect(
      DataContainerWithSearch.computed.isInvalidFilterAvailable.call({ filters: ['custom'] })
    ).toBe(false)
    expect(
      DataContainerWithSearch.computed.isInvalidFilterAvailable.call({ filters: ['invalid'] })
    ).toBe(true)
  })

  it('isOneOfFiltersChecked uses invalid filter state when custom filter is unavailable', () => {
    const checked = DataContainerWithSearch.computed.isOneOfFiltersChecked.call({
      isCustomFilterAvailable: false,
      isInvalidFilterAvailable: true,
      isCustomFilterChecked: true,
      isFilterChecked: true
    })
    const unchecked = DataContainerWithSearch.computed.isOneOfFiltersChecked.call({
      isCustomFilterAvailable: false,
      isInvalidFilterAvailable: true,
      isCustomFilterChecked: true,
      isFilterChecked: false
    })
    expect(checked).toBe(true)
    expect(unchecked).toBe(false)
  })

  it('getItems applies search + custom + invalid filter branches together', () => {
    const ctx = {
      search: 'ap',
      options: [
        { val: 'apple', isEditable: true },
        { val: 'apricot', isEditable: true },
        { val: 'grape', isEditable: false }
      ],
      isCustomFilterActive: true,
      isFilterActive: true,
      textFieldRules: [(v) => (v === 'apple' ? true : 'invalid')]
    }

    const result = DataContainerWithSearch.computed.getItems.call(ctx)
    expect(result).toEqual([{ val: 'apricot', isEditable: true }])
  })

  it('getItems returns options directly when no search and no active filter', () => {
    const options = [{ val: 'a', isEditable: true }]
    const ctx = {
      search: '',
      options,
      isCustomFilterActive: false,
      isFilterActive: false,
      textFieldRules: [() => true]
    }
    const result = DataContainerWithSearch.computed.getItems.call(ctx)
    expect(result).toEqual(options)
  })

  it('isOneOfFiltersChecked handles dual-filter and single-filter branches', () => {
    const bothFalse = DataContainerWithSearch.computed.isOneOfFiltersChecked.call({
      isCustomFilterAvailable: true,
      isInvalidFilterAvailable: true,
      isCustomFilterChecked: false,
      isFilterChecked: false
    })
    const oneTrue = DataContainerWithSearch.computed.isOneOfFiltersChecked.call({
      isCustomFilterAvailable: true,
      isInvalidFilterAvailable: true,
      isCustomFilterChecked: true,
      isFilterChecked: false
    })
    const onlyCustomAvailable = DataContainerWithSearch.computed.isOneOfFiltersChecked.call({
      isCustomFilterAvailable: true,
      isInvalidFilterAvailable: false,
      isCustomFilterChecked: true,
      isFilterChecked: false
    })

    expect(bothFalse).toBe(false)
    expect(oneTrue).toBe(true)
    expect(onlyCustomAvailable).toBe(false)
  })

  it('checkAllValid treats non-editable items as valid and validates editable ones', () => {
    const ctx = {
      value: ['editable', 'locked'],
      getEditability: (item) => item !== 'locked',
      textFieldRules: [(v) => v !== 'editable' || 'Error'],
      isAllValid: true
    }

    DataContainerWithSearch.methods.checkAllValid.call(ctx)
    expect(ctx.isAllValid).toBe(false)

    ctx.textFieldRules = [() => true]
    DataContainerWithSearch.methods.checkAllValid.call(ctx)
    expect(ctx.isAllValid).toBe(true)
  })

  it('checkAllValid keeps true for empty value list', () => {
    const ctx = {
      value: [],
      getEditability: () => true,
      textFieldRules: [() => false],
      isAllValid: false
    }

    DataContainerWithSearch.methods.checkAllValid.call(ctx)
    expect(ctx.isAllValid).toBe(true)
  })

  it('setOptions reset branch recreates options using push strategy', () => {
    const ctx = {
      value: ['a', 'b', 'a'],
      options: [{ val: 'old' }],
      addItemToOptions: DataContainerWithSearch.methods.addItemToOptions,
      getEditability: () => true,
      disabledTooltipText: ''
    }

    DataContainerWithSearch.methods.setOptions.call(ctx, 'push', true)

    expect(ctx.options.map((i) => i.val)).toEqual(['a', 'b'])
  })

  it('setOptions default unshift places newer unique values at the top', () => {
    const ctx = {
      value: ['x', 'y'],
      options: [],
      addItemToOptions: DataContainerWithSearch.methods.addItemToOptions,
      getEditability: () => true,
      disabledTooltipText: ''
    }

    DataContainerWithSearch.methods.setOptions.call(ctx)

    expect(ctx.options.map((i) => i.val)).toEqual(['y', 'x'])
  })

  it('setOptions does not re-add rows that already exist in options', () => {
    const ctx = {
      value: ['x', 'y'],
      options: [{ val: 'x' }],
      addItemToOptions: DataContainerWithSearch.methods.addItemToOptions,
      getEditability: () => true,
      disabledTooltipText: ''
    }

    DataContainerWithSearch.methods.setOptions.call(ctx, 'push')

    expect(ctx.options.map((i) => i.val)).toEqual(['x', 'y'])
  })

  it('addItemToOptions appends prepared option object with editability and tooltip', () => {
    const ctx = {
      options: [],
      getEditability: (val) => val !== 'locked',
      disabledTooltipText: 'No edit'
    }

    DataContainerWithSearch.methods.addItemToOptions.call(ctx, 'locked', 'push')

    expect(ctx.options).toHaveLength(1)
    expect(ctx.options[0]).toEqual(
      expect.objectContaining({
        val: 'locked',
        isEdit: false,
        isEditable: false,
        disabledTooltipText: 'No edit',
        textFieldDefaultValue: 'locked'
      })
    )
  })

  it('handleItemDelete returns early when item is not found', () => {
    const emit = jest.fn()
    const checkAllValid = jest.fn()
    const ctx = {
      options: [{ val: 'a' }],
      value: ['a'],
      $emit: emit,
      checkAllValid
    }

    DataContainerWithSearch.methods.handleItemDelete.call(ctx, 'missing')

    expect(ctx.options).toEqual([{ val: 'a' }])
    expect(ctx.value).toEqual(['a'])
    expect(emit).not.toHaveBeenCalled()
    expect(checkAllValid).not.toHaveBeenCalled()
  })

  it('handleItemDelete removes item, emits index and revalidates when found', () => {
    const emit = jest.fn()
    const checkAllValid = jest.fn()
    const ctx = {
      options: [{ val: 'a' }, { val: 'b' }],
      value: ['a', 'b'],
      $emit: emit,
      checkAllValid
    }

    DataContainerWithSearch.methods.handleItemDelete.call(ctx, 'b')

    expect(ctx.options).toEqual([{ val: 'a' }])
    expect(ctx.value).toEqual(['a'])
    expect(emit).toHaveBeenCalledWith('on-delete', 1)
    expect(checkAllValid).toHaveBeenCalled()
  })

  it('handleFilter and clearFilter update active flags and menu state', () => {
    const ctx = {
      isFilterChecked: true,
      isCustomFilterChecked: false,
      isFilterActive: false,
      isCustomFilterActive: true,
      isMenuOpen: true
    }

    DataContainerWithSearch.methods.handleFilter.call(ctx)
    expect(ctx.isFilterActive).toBe(true)
    expect(ctx.isCustomFilterActive).toBe(false)
    expect(ctx.isMenuOpen).toBe(false)

    DataContainerWithSearch.methods.clearFilter.call(ctx)
    expect(ctx.isFilterChecked).toBe(false)
    expect(ctx.isCustomFilterChecked).toBe(false)
    expect(ctx.isFilterActive).toBe(false)
    expect(ctx.isCustomFilterActive).toBe(false)
    expect(ctx.isMenuOpen).toBe(false)
  })

  it('resetOptions clears all option entries', () => {
    const ctx = { options: [{ val: 'a' }, { val: 'b' }] }
    DataContainerWithSearch.methods.resetOptions.call(ctx)
    expect(ctx.options).toEqual([])
  })

  it('handleInputChange emits updated list without dedupe when removeDuplicates=false', () => {
    const emit = jest.fn()
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const item = { val: 'old.com', isEdit: true, key: 'k1' }
    const ctx = {
      getItems: [item],
      value: ['old.com', 'other.com'],
      removeDuplicates: false,
      $set: set,
      $emit: emit,
      checkAllValid: jest.fn()
    }

    DataContainerWithSearch.methods.handleInputChange.call(ctx, 'new.com', 'old.com', 0)

    expect(ctx.value).toEqual(['new.com', 'other.com'])
    expect(item.isEdit).toBe(false)
    expect(item.val).toBe('new.com')
    expect(emit).toHaveBeenCalledWith('input', ctx.value)
    expect(ctx.checkAllValid).toHaveBeenCalled()
  })

  it('handleInputChange emits deduped list when removeDuplicates=true', () => {
    const emit = jest.fn()
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const item = { val: 'a.com', isEdit: true, key: 'k1' }
    const ctx = {
      getItems: [item],
      value: ['a.com', 'b.com'],
      options: [{ val: 'a.com' }, { val: 'b.com' }],
      removeDuplicates: true,
      $set: set,
      $emit: emit,
      checkAllValid: jest.fn(),
      resetOptions: DataContainerWithSearch.methods.resetOptions,
      setOptions: DataContainerWithSearch.methods.setOptions,
      addItemToOptions: DataContainerWithSearch.methods.addItemToOptions,
      getEditability: () => true,
      disabledTooltipText: ''
    }

    DataContainerWithSearch.methods.handleInputChange.call(ctx, 'b.com', 'a.com', 0)

    expect(ctx.value).toEqual(['b.com', 'b.com'])
    expect(emit).toHaveBeenCalledWith('input', ['b.com'])
    expect(ctx.options.length).toBe(1)
    expect(ctx.options[0].val).toBe('b.com')
    expect(ctx.checkAllValid).toHaveBeenCalled()
  })

  it('handleInputChange tolerates old value missing from source array', () => {
    const emit = jest.fn()
    const set = jest.fn((obj, key, val) => {
      obj[key] = val
    })
    const item = { val: 'old.com', isEdit: true, key: 'k1' }
    const ctx = {
      getItems: [item],
      value: ['other.com'],
      removeDuplicates: false,
      $set: set,
      $emit: emit,
      checkAllValid: jest.fn()
    }

    DataContainerWithSearch.methods.handleInputChange.call(ctx, 'new.com', 'old.com', 0)

    expect(ctx.value[0]).toBe('other.com')
    expect(ctx.value.length).toBe(1)
    expect(ctx.value[-1]).toBe('new.com')
    expect(emit).toHaveBeenCalledWith('input', ctx.value)
    expect(ctx.checkAllValid).toHaveBeenCalled()
  })

  it('value watcher resets options, validates and refreshes scroll key', () => {
    const setOptions = jest.fn()
    const checkAllValid = jest.fn()
    const nextTick = jest.fn((cb) => cb())
    const ctx = {
      setOptions,
      checkAllValid,
      $nextTick: nextTick,
      scrollKey: 'old'
    }

    DataContainerWithSearch.watch.value.call(ctx)

    expect(setOptions).toHaveBeenCalledWith('push', true)
    expect(checkAllValid).toHaveBeenCalled()
    expect(nextTick).toHaveBeenCalled()
    expect(ctx.scrollKey.startsWith('scroll-key-')).toBe(true)
  })
})
