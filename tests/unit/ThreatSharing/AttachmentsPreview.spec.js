import { shallowMount } from '@vue/test-utils'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'

describe('AttachmentsPreview.vue', () => {
  it('computes file name from fileName first', () => {
    const wrapper = shallowMount(AttachmentsPreview, {
      propsData: {
        att: { fileName: 'file-a.pdf', name: 'fallback.pdf' }
      }
    })

    expect(wrapper.vm.getFileName).toBe('file-a.pdf')
  })

  it('falls back to name when fileName does not exist', () => {
    const wrapper = shallowMount(AttachmentsPreview, {
      propsData: {
        att: { name: 'fallback.pdf' }
      }
    })

    expect(wrapper.vm.getFileName).toBe('fallback.pdf')
  })

  it('emits delete with index', () => {
    const wrapper = shallowMount(AttachmentsPreview, {
      propsData: {
        att: { name: 'x' },
        index: 4
      }
    })

    wrapper.vm.handleDelete()

    expect(wrapper.emitted('on-delete')).toBeTruthy()
    expect(wrapper.emitted('on-delete')[0]).toEqual([4])
  })
})

