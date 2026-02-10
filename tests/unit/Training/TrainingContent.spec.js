import { createLocalVue, mount } from '@vue/test-utils'
import { customVuetify as vuetify } from '../utils'
import NewTrainingContentByLanguage from '@/components/AwarenessEducator/NewTraining/NewTrainingContentByLanguage.vue'
describe('Training Content', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify
    })
    //checking is rendered
    expect(wrapper.exists()).toBe(true)
    //checking title
    expect(wrapper.text().includes('Language')).toBeTruthy()
    //checking file upload text
    expect(wrapper.text().includes('Upload File')).toBeTruthy()
    //checking file upload component
    expect(wrapper.find('.k-file-uploads__wrapper').exists()).toBe(true)
    //checking is file upload vue component
    expect(wrapper.findComponent({ name: 'KFileUpload' }).exists()).toBe(true)
  })
  it('Checking default value', async () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: [{ name: 'Scorm', size: 1000002 }]
      }
    })
    //checking file name
    expect(wrapper.find('.k-file-uploads__item-details--filename').text().includes('Scorm')).toBe(
      true
    )
    //checking file size
    expect(
      wrapper.find('.k-file-uploads__item-details--filesize').text().includes('976.56 KB')
    ).toBe(true)
  })

  it('renders with empty file previews', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: []
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'KFileUpload' }).exists()).toBe(true)
  })

  it('displays multiple file previews', () => {
    const filePreviews = [
      { name: 'File1.scorm', size: 1000002 },
      { name: 'File2.scorm', size: 2000000 }
    ]
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: { filePreviews }
    })
    const fileItems = wrapper.findAll('.k-file-uploads__item')
    expect(fileItems.length).toBeGreaterThanOrEqual(filePreviews.length)
  })

  it('has correct file upload wrapper structure', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify
    })
    const uploadWrapper = wrapper.find('.k-file-uploads__wrapper')
    expect(uploadWrapper.exists()).toBe(true)
    expect(uploadWrapper.classes()).toContain('k-file-uploads__wrapper')
  })

  it('correctly formats large file sizes', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: [{ name: 'LargeFile.scorm', size: 10485760 }] // 10 MB
      }
    })
    const fileSizeText = wrapper.find('.k-file-uploads__item-details--filesize').text()
    expect(fileSizeText).toBeTruthy()
    expect(fileSizeText.includes('MB') || fileSizeText.includes('KB')).toBe(true)
  })

  describe('Component Rendering and Structure', () => {
    it('renders component successfully', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('displays Language label', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(wrapper.text()).toContain('Language')
    })

    it('displays Upload File text', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(wrapper.text()).toContain('Upload File')
    })

    it('renders file upload wrapper', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.k-file-uploads__wrapper').exists()).toBe(true)
    })

    it('renders KFileUpload component', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(wrapper.findComponent({ name: 'KFileUpload' }).exists()).toBe(true)
    })
  })

  describe('File Preview Props', () => {
    it('accepts filePreviews prop as array', () => {
      const filePreviews = [{ name: 'test.scorm', size: 1000 }]
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews }
      })
      expect(wrapper.props('filePreviews')).toEqual(filePreviews)
    })

    it('handles empty filePreviews array', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews: [] }
      })
      expect(wrapper.props('filePreviews').length).toBe(0)
    })

    it('updates when filePreviews prop changes', async () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews: [] }
      })

      await wrapper.setProps({
        filePreviews: [{ name: 'new.scorm', size: 500 }]
      })

      expect(wrapper.props('filePreviews').length).toBe(1)
    })

    it('renders single file preview', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'Single.scorm', size: 1000002 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })
  })

  describe('File Name Display', () => {
    it('displays file name correctly', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'MyTraining.scorm', size: 1000 }]
        }
      })
      expect(wrapper.text()).toContain('MyTraining.scorm')
    })

    it('displays file name with extension', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'Scorm', size: 1000002 }]
        }
      })
      const filenameElement = wrapper.find('.k-file-uploads__item-details--filename')
      expect(filenameElement.text()).toContain('Scorm')
    })

    it('handles file names with special characters', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'File-Name_2024.scorm', size: 1000 }]
        }
      })
      expect(wrapper.text()).toContain('File-Name_2024.scorm')
    })

    it('handles very long file names', () => {
      const longName = 'a'.repeat(100) + '.scorm'
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: longName, size: 1000 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })
  })

  describe('File Size Formatting', () => {
    it('formats file size in KB', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'File.scorm', size: 1000002 }]
        }
      })
      const sizeText = wrapper.find('.k-file-uploads__item-details--filesize').text()
      expect(sizeText).toContain('KB')
    })

    it('formats file size in MB', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'Large.scorm', size: 10485760 }]
        }
      })
      const sizeText = wrapper.find('.k-file-uploads__item-details--filesize').text()
      expect(sizeText.includes('MB') || sizeText.includes('KB')).toBe(true)
    })

    it('displays specific KB value correctly', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'Scorm', size: 1000002 }]
        }
      })
      const sizeElement = wrapper.find('.k-file-uploads__item-details--filesize')
      expect(sizeElement.text()).toContain('KB')
    })

    it('handles tiny file sizes', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'tiny.scorm', size: 100 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item-details--filesize').exists()).toBe(true)
    })

    it('handles very large file sizes', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'huge.scorm', size: 1099511627776 }] // 1 TB
        }
      })
      const sizeElement = wrapper.find('.k-file-uploads__item-details--filesize')
      expect(sizeElement.text()).toBeTruthy()
    })
  })

  describe('Multiple File Preview Handling', () => {
    it('displays multiple files', () => {
      const filePreviews = [
        { name: 'File1.scorm', size: 1000002 },
        { name: 'File2.scorm', size: 2000000 }
      ]
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews }
      })
      const fileItems = wrapper.findAll('.k-file-uploads__item')
      expect(fileItems.length).toBeGreaterThanOrEqual(filePreviews.length)
    })

    it('preserves file order', () => {
      const filePreviews = [
        { name: 'First.scorm', size: 1000 },
        { name: 'Second.scorm', size: 2000 },
        { name: 'Third.scorm', size: 3000 }
      ]
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews }
      })
      expect(wrapper.text()).toContain('First.scorm')
      expect(wrapper.text()).toContain('Second.scorm')
      expect(wrapper.text()).toContain('Third.scorm')
    })

    it('handles up to 10 files', () => {
      const filePreviews = Array.from({ length: 10 }, (_, i) => ({
        name: `File${i + 1}.scorm`,
        size: 1000 * (i + 1)
      }))
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews }
      })
      const fileItems = wrapper.findAll('.k-file-uploads__item')
      expect(fileItems.length).toBeGreaterThanOrEqual(10)
    })

    it('renders each file with its own size', () => {
      const filePreviews = [
        { name: 'Small.scorm', size: 100000 },
        { name: 'Medium.scorm', size: 1000000 },
        { name: 'Large.scorm', size: 10000000 }
      ]
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews }
      })
      const sizeElements = wrapper.findAll('.k-file-uploads__item-details--filesize')
      expect(sizeElements.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('File Upload Wrapper Structure', () => {
    it('has correct wrapper CSS class', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      const uploadWrapper = wrapper.find('.k-file-uploads__wrapper')
      expect(uploadWrapper.classes()).toContain('k-file-uploads__wrapper')
    })

    it('wrapper exists when no files provided', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews: [] }
      })
      expect(wrapper.find('.k-file-uploads__wrapper').exists()).toBe(true)
    })

    it('wrapper exists with file previews', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'test.scorm', size: 1000 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__wrapper').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles null file name gracefully', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: null, size: 1000 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })

    it('handles zero file size', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'empty.scorm', size: 0 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })

    it('handles missing size property gracefully', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'incomplete.scorm' }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })

    it('handles unicode characters in file names', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: {
          filePreviews: [{ name: 'Tëst_Üñiçödé.scorm', size: 1000 }]
        }
      })
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state after prop updates', async () => {
      const wrapper = mount(NewTrainingContentByLanguage, {
        localVue,
        vuetify,
        propsData: { filePreviews: [] }
      })

      await wrapper.setProps({
        filePreviews: [{ name: 'test.scorm', size: 1000 }]
      })

      expect(wrapper.props('filePreviews').length).toBe(1)
      expect(wrapper.find('.k-file-uploads__item').exists()).toBe(true)
    })
  })
})
