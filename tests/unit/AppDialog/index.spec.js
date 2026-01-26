import { createLocalVue, mount } from '@vue/test-utils'
import AppDialog from '@/components/AppDialog.vue'
import Vuetify from 'vuetify'

describe('AppDialog.vue', () => {
  const localVue = createLocalVue()
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    // ensure data-app exists (it should from global setup, but cleaning body might remove it)
    if (!document.querySelector('[data-app]')) {
       const app = document.createElement('div')
       app.setAttribute('data-app', 'true')
       document.body.appendChild(app)
    }
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
      wrapper = null
    }
    // Clean up portal content
    // v-dialog portals content into .v-dialog__content inside data-app or body.
    // We should clean innerHTML of data-app or body, but keep data-app if possible or recreate.
    document.body.innerHTML = '<div data-app="true"></div>'
  })

  const mountDialog = (propsData = {}, slots = {}) => {
    wrapper = mount(AppDialog, {
      localVue,
      vuetify,
      propsData,
      slots
    })
    return wrapper
  }

  // NOTE: v-dialog content is portal-ed to document body (data-app) usually.
  // We need to check document body for content if v-dialog is truly active.

  it('renders correctly when status is true', async () => {
    mountDialog({ status: true, title: 'My Dialog' })
    expect(wrapper.exists()).toBe(true)
    // Check if title is rendered. Since v-dialog portals, we might find it in wrapper if not fully detached, or we check wrapper.html()
    // but in test-utils mount with Vuetify, often elements are available via wrapper if mapped correctly, or we search globally.
    // However, AppDialog wraps v-dialog.
    // Let's check props passed to v-dialog
    const dialog = wrapper.findComponent({ name: 'v-dialog' })
    expect(dialog.exists()).toBe(true)
    expect(dialog.props('value')).toBe(true)
  })

  it('computes width correctly based on size prop', () => {
    mountDialog({ status: true, size: 'small' })
    expect(wrapper.vm.dialogWidth).toBe('480')

    wrapper.destroy() // manual destroy for multiple mounts in one test? or just let afterEach handle last one?
    // Testing multiple cases in one test with shared wrapper is tricky if we don't update props.
    // Better to update props.
    
    // Test update props approach
    wrapper = mountDialog({ status: true, size: 'big' })
    expect(wrapper.vm.dialogWidth).toBe('580')
    
    // ...
  })

  it('computes width correctly/2', () => {
     mountDialog({ status: true, size: 'maximum' })
     expect(wrapper.vm.dialogWidth).toBe('650')
  })

  it('computes width correctly/3', () => {
     mountDialog({ status: true, size: 'ultraMaximum' })
     expect(wrapper.vm.dialogWidth).toBe('700')
  })

  it('overrides width with customSize', () => {
    mountDialog({ status: true, size: 'small', customSize: '900' })
    expect(wrapper.vm.dialogWidth).toBe('900')
  })

  it('renders title, subtitle and icon', async () => {
    mountDialog({
      status: true,
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      icon: 'mdi-home'
    })
    
    // v-dialog portals content to body
    // We wait for expected content to appear in document body
    // Since we are not using async mount/nextTick explicitly in helper, might need to wait.
    // But usually sync mount is enough for initial render if portal happens immediately.
    // Vuetify v-dialog might wait for transition.
    await localVue.nextTick()
    
    const content = document.body.innerHTML
    expect(content).toContain('Test Title')
    expect(content).toContain('Test Subtitle')
    expect(content).toContain('mdi-home')
  })

  it('applies delete styles when type is delete', async () => {
    mountDialog({
      status: true,
      type: 'Delete',
      title: 'Delete Item',
      icon: 'mdi-delete'
    })

    await localVue.nextTick()

    // Check computed properties
    expect(wrapper.vm.isDelete).toBe(true)
    expect(wrapper.vm.getIconColor).toBe('#B83A3A')
    
    // Check classes in DOM (document.body)
    const titleEl = document.querySelector('.k-dialog__title--delete')
    expect(titleEl).toBeTruthy()
    
    const iconWrapper = document.querySelector('.k-dialog__delete-icon-wrapper')
    expect(iconWrapper).toBeTruthy()
  })

  it('emits changeStatus event on input', async () => {
    mountDialog({ status: true })
    const dialog = wrapper.findComponent({ name: 'v-dialog' })
    
    await dialog.vm.$emit('input', false)
    
    expect(wrapper.emitted('changeStatus')).toBeTruthy()
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false])
  })

  it('renders slots content', async () => {
    mountDialog({ status: true }, {
      'app-dialog-body': '<div class="test-body">Body Content</div>',
      'app-dialog-footer': '<button class="test-footer">Footer Button</button>'
    })

    await localVue.nextTick()
    
    expect(document.body.innerHTML).toContain('Body Content')
    expect(document.body.innerHTML).toContain('Footer Button')
  })

  it('applies max height logic', async () => {
    mountDialog({ status: true, maxHeight: true, maxHeightSize: '500px' })
    
    await localVue.nextTick()

    // Debug content if failing
    // console.log(document.body.innerHTML)

    // Check computed class
    expect(wrapper.vm.getClassName).toContain('k-dialog__max-height-border-radius')
    
    // Check if style is applied to body
    const dialogBody = document.querySelector('.k-dialog__body')
    expect(dialogBody).toBeTruthy()
    // style usually serialized
    expect(dialogBody.outerHTML).toContain('max-height: 500px')
  })
})

