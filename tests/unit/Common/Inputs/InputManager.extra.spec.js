import { shallowMount } from '@vue/test-utils'
import InputManager from '@/components/Common/Inputs/InputManager.vue'

describe('InputManager.vue (extra branch coverage)', () => {
  it('value watcher does not update when newVal is null', () => {
    const ctx = {
      managerFirstName: 'A',
      managerLastName: 'B',
      managerEmail: 'a@b.com'
    }
    InputManager.watch.value.handler.call(ctx, null)
    expect(ctx.managerFirstName).toBe('A')
    expect(ctx.managerLastName).toBe('B')
    expect(ctx.managerEmail).toBe('a@b.com')
  })

  it('value watcher does not update when newVal is not object', () => {
    const ctx = {
      managerFirstName: 'A',
      managerLastName: 'B',
      managerEmail: 'a@b.com'
    }
    InputManager.watch.value.handler.call(ctx, 'string')
    expect(ctx.managerFirstName).toBe('A')
    expect(ctx.managerLastName).toBe('B')
    expect(ctx.managerEmail).toBe('a@b.com')
  })

  it('value watcher syncs partial keys with empty string fallback', () => {
    const ctx = {
      managerFirstName: 'Old',
      managerLastName: 'Old',
      managerEmail: 'old@x.com'
    }
    InputManager.watch.value.handler.call(ctx, {
      managerFirstName: 'Jane',
      managerLastName: undefined,
      managerEmail: null
    })
    expect(ctx.managerFirstName).toBe('Jane')
    expect(ctx.managerLastName).toBe('')
    expect(ctx.managerEmail).toBe('')
  })

  it('data init uses empty strings when value is undefined', () => {
    const wrapper = shallowMount(InputManager, {
      propsData: { value: undefined }
    })
    expect(wrapper.vm.managerFirstName).toBe('')
    expect(wrapper.vm.managerLastName).toBe('')
    expect(wrapper.vm.managerEmail).toBe('')
  })

  it('mounted does not call validateFields when no manager fields filled', () => {
    const wrapper = shallowMount(InputManager, {
      propsData: { value: {} }
    })
    const validateSpy = jest.spyOn(wrapper.vm, 'validateFields')
    wrapper.vm.$options.mounted[0].call(wrapper.vm)
    expect(validateSpy).not.toHaveBeenCalled()
    validateSpy.mockRestore()
  })

  it('allFieldsFilled returns true when all three fields filled', () => {
    const wrapper = shallowMount(InputManager, {
      propsData: {
        value: {
          managerFirstName: 'John',
          managerLastName: 'Doe',
          managerEmail: 'j@d.com'
        }
      }
    })
    expect(wrapper.vm.allFieldsFilled).toBe(true)
  })

  it('hasPartialFields returns true when only some fields filled', () => {
    const wrapper = shallowMount(InputManager, {
      propsData: {
        value: {
          managerFirstName: 'John',
          managerLastName: '',
          managerEmail: ''
        }
      }
    })
    expect(wrapper.vm.hasPartialFields).toBe(true)
  })

  it('emitChange emits input with manager object', () => {
    const wrapper = shallowMount(InputManager, {
      propsData: { value: {} }
    })
    wrapper.vm.managerFirstName = 'A'
    wrapper.vm.managerLastName = 'B'
    wrapper.vm.managerEmail = 'a@b.com'
    wrapper.vm.emitChange()
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toEqual({
      managerFirstName: 'A',
      managerLastName: 'B',
      managerEmail: 'a@b.com'
    })
  })
})
