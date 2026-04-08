import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import { shallowMount } from '@vue/test-utils'

describe('DefaultButtonRowAction.vue (extra)', () => {
  describe('null safety - scope/row undefined', () => {
    it('isDisabled returns true when scope is undefined', () => {
      const ctx = { scope: undefined, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope is null', () => {
      const ctx = { scope: null, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope.row is undefined', () => {
      const ctx = { scope: {}, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope.row is null', () => {
      const ctx = { scope: { row: null }, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled does not throw when scope is missing', () => {
      const ctx = { disabled: false }
      expect(() => DefaultButtonRowAction.computed.isDisabled.call(ctx)).not.toThrow()
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })
  })

  describe('isDisabled with checkIsOwnerProperty false (Agentic row actions)', () => {
    it('ignores isOwner when checkIsOwnerProperty is false', () => {
      const ctx = {
        scope: { row: { isOwner: false } },
        disabled: false,
        checkIsOwnerProperty: false
      }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(false)
    })

    it('uses disabled prop when checkIsOwnerProperty is false', () => {
      const ctx = {
        scope: { row: { isOwner: true } },
        disabled: true,
        checkIsOwnerProperty: false
      }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })
  })

  describe('tooltipMessage null safety', () => {
    it('tooltipMessage returns text when scope is undefined and isDisabled', () => {
      const ctx = {
        scope: undefined,
        isDisabled: true,
        text: 'Fast Launch',
        disabledTooltipText: ''
      }
      expect(DefaultButtonRowAction.computed.tooltipMessage.call(ctx)).toBe('Fast Launch')
    })

    it('tooltipMessage returns disabledTooltipText when scope.row is undefined', () => {
      const ctx = {
        scope: {},
        isDisabled: true,
        text: 'Launch',
        disabledTooltipText: 'Disabled'
      }
      expect(DefaultButtonRowAction.computed.tooltipMessage.call(ctx)).toBe('Disabled')
    })

    it('tooltipMessage returns downloading message when disabled row is downloading', () => {
      const ctx = {
        scope: { row: { isDownloading: true } },
        isDisabled: true,
        text: 'View Report',
        disabledTooltipText: 'Disabled'
      }
      expect(DefaultButtonRowAction.computed.tooltipMessage.call(ctx)).toBe('Downloading PDF. Please wait...')
    })

    it('tooltipMessage returns default text when action is enabled', () => {
      const ctx = {
        scope: { row: { isDownloading: false } },
        isDisabled: false,
        text: 'View Report',
        disabledTooltipText: 'Disabled'
      }
      expect(DefaultButtonRowAction.computed.tooltipMessage.call(ctx)).toBe('View Report')
    })
  })

  describe('handleClick null safety', () => {
    it('handleClick does not emit when scope is null', () => {
      const ctx = { $emit: jest.fn(), isDisabled: false, scope: null }
      DefaultButtonRowAction.methods.handleClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('handleClick does not emit when scope is undefined', () => {
      const ctx = { $emit: jest.fn(), isDisabled: false, scope: undefined }
      DefaultButtonRowAction.methods.handleClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('handleClick does not emit when action is disabled', () => {
      const ctx = { $emit: jest.fn(), isDisabled: true, scope: { row: { isOwner: true } } }
      DefaultButtonRowAction.methods.handleClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })
  })

  describe('rendered disabled tooltip behavior', () => {
    const createWrapper = (propsData = {}) =>
      shallowMount(DefaultButtonRowAction, {
        propsData: {
          icon: 'mdi-text-box',
          text: 'View Report',
          scope: { row: { isOwner: true } },
          ...propsData
        },
        stubs: {
          VTooltip: {
            template: `
              <div class="v-tooltip-stub">
                <slot name="activator" :on="{}" :attrs="{}" />
                <slot />
              </div>
            `
          },
          VBtn: {
            props: ['disabled'],
            template: '<button class="v-btn-stub" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
          },
          VIcon: {
            props: ['disabled'],
            template: '<i class="v-icon-stub" :data-disabled="String(!!disabled)"><slot /></i>'
          }
        }
      })

    it('renders tooltip wrapper and native disabled button for disabled actions', () => {
      const wrapper = createWrapper({
        disabled: true,
        disabledTooltipText: 'Report will be available after this recommendation is approved.'
      })

      expect(wrapper.find('.default-button-row-action-tooltip-wrap').exists()).toBe(true)
      expect(wrapper.find('.v-btn-stub').attributes('disabled')).toBe('disabled')
      expect(wrapper.find('.v-icon-stub').attributes('data-disabled')).toBe('true')
      expect(wrapper.text()).toContain('Report will be available after this recommendation is approved.')
    })

    it('renders disabled button when ownership restriction applies', () => {
      const wrapper = createWrapper({
        scope: { row: { isOwner: false } },
        checkIsOwnerProperty: true
      })

      expect(wrapper.find('.v-btn-stub').attributes('disabled')).toBe('disabled')
      expect(wrapper.find('.v-icon-stub').attributes('data-disabled')).toBe('true')
    })

    it('falls back to action text in tooltip when ownership restriction disables the action', () => {
      const wrapper = createWrapper({
        scope: { row: { isOwner: false } },
        checkIsOwnerProperty: true
      })

      expect(wrapper.text()).toContain('View Report')
    })

    it('does not render disabled attribute when action is enabled', () => {
      const wrapper = createWrapper({
        disabled: false
      })

      expect(wrapper.find('.v-btn-stub').attributes('disabled')).toBeUndefined()
      expect(wrapper.text()).toContain('View Report')
    })

    it('emits on-click when rendered button is enabled and clicked', async () => {
      const wrapper = createWrapper({
        disabled: false
      })

      await wrapper.find('.v-btn-stub').trigger('click')
      expect(wrapper.emitted('on-click')).toEqual([[{ row: { isOwner: true } }]])
    })

    it('does not emit on-click when rendered button is disabled and clicked', async () => {
      const wrapper = createWrapper({
        disabled: true
      })

      await wrapper.find('.v-btn-stub').trigger('click')
      expect(wrapper.emitted('on-click')).toBeUndefined()
    })

    it('does not emit on-click when ownership restriction keeps the rendered button disabled', async () => {
      const wrapper = createWrapper({
        scope: { row: { isOwner: false } },
        checkIsOwnerProperty: true
      })

      await wrapper.find('.v-btn-stub').trigger('click')
      expect(wrapper.emitted('on-click')).toBeUndefined()
    })
  })
})
