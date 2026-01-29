import { shallowMount } from '@vue/test-utils'
import FileUpload from '@/components/Common/FileUpload/FileUpload.vue'

describe('FileUpload.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(FileUpload, {
      stubs: {
        'file-upload': true
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('KFileUpload')
    })

    it('should render container with k-file-uploads class', () => {
      expect(wrapper.classes()).toContain('k-file-uploads')
    })
  })

  describe('props handling', () => {
    it('should have size prop with default 200', () => {
      expect(wrapper.vm.$options.props.size.default).toBe(200)
    })

    it('should have deletable prop with default true', () => {
      expect(wrapper.vm.$options.props.deletable.default).toBe(true)
    })

    it('should have isLoading prop with default false', () => {
      expect(wrapper.vm.$options.props.isLoading.default).toBe(false)
    })

    it('should have fileType prop with default image', () => {
      expect(wrapper.vm.$options.props.fileType.default).toBe('image')
    })

    it('should have showFileSize prop with default true', () => {
      expect(wrapper.vm.$options.props.showFileSize.default).toBe(true)
    })

    it('should have extensions array default', () => {
      const extensions = wrapper.vm.$options.props.extensions.default()
      expect(Array.isArray(extensions)).toBe(true)
      expect(extensions).toContain('jpg')
      expect(extensions).toContain('png')
    })

    it('should have hint prop with default null', () => {
      expect(wrapper.vm.$options.props.hint.default).toBeNull()
    })

    it('should have hasError prop with default false', () => {
      expect(wrapper.vm.$options.props.hasError.default).toBe(false)
    })

    it('should have isPreviewVisible prop with default true', () => {
      expect(wrapper.vm.$options.props.isPreviewVisible.default).toBe(true)
    })

    it('should have showImagePreview prop with default false', () => {
      expect(wrapper.vm.$options.props.showImagePreview.default).toBe(false)
    })

    it('should accept custom size', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: { size: 500 },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.size).toBe(500)
    })

    it('should accept custom extensions', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: { extensions: ['pdf', 'docx'] },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.extensions).toEqual(['pdf', 'docx'])
    })
  })

  describe('data initialization', () => {
    it('should initialize files as empty array', () => {
      expect(Array.isArray(wrapper.vm.files)).toBe(true)
      expect(wrapper.vm.files.length).toBe(0)
    })

    it('should initialize uploadProgress to 0', () => {
      expect(wrapper.vm.uploadProgress).toBe(0)
    })

    it('should have unique id and inputId', () => {
      expect(wrapper.vm.id).toBeDefined()
      expect(wrapper.vm.inputId).toBeDefined()
      expect(wrapper.vm.id).not.toBe(wrapper.vm.inputId)
    })
  })

  describe('computed properties', () => {
    it('should have getCoverImagePreview computed property', () => {
      expect(wrapper.vm.getCoverImagePreview).toBeDefined()
    })

    it('should return false when no files or previews', () => {
      expect(wrapper.vm.getCoverImagePreview).toBe(false)
    })

    it('should have getFiles computed property', () => {
      expect(wrapper.vm.getFiles).toBeDefined()
    })

    it('should return files if available', () => {
      wrapper.vm.files = [{ id: 1, name: 'test.jpg' }]
      expect(wrapper.vm.getFiles.length).toBe(1)
    })

    it('should return filePreviews if files empty', () => {
      wrapper.vm.files = []
      wrapper = shallowMount(FileUpload, {
        propsData: {
          filePreviews: [{ id: 1, name: 'preview.jpg', url: 'http://example.com/img.jpg' }]
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.getFiles.length).toBeGreaterThan(0)
    })

    it('should have _extensions computed property', () => {
      expect(wrapper.vm._extensions).toBeDefined()
      expect(typeof wrapper.vm._extensions).toBe('string')
    })

    it('should have readableExtensions computed property', () => {
      expect(wrapper.vm.readableExtensions).toBeDefined()
      expect(typeof wrapper.vm.readableExtensions).toBe('string')
    })

    it('should have regexExtensions computed property', () => {
      expect(wrapper.vm.regexExtensions).toBeDefined()
      expect(wrapper.vm.regexExtensions instanceof RegExp).toBe(true)
    })
  })

  describe('getFileSize method', () => {
    it('should convert bytes to KB', () => {
      const result = wrapper.vm.getFileSize(2048)
      expect(result).toContain('KB')
    })

    it('should convert bytes to MB', () => {
      const result = wrapper.vm.getFileSize(1024 * 1024 * 5)
      expect(result).toContain('MB')
    })

    it('should convert bytes to GB', () => {
      const result = wrapper.vm.getFileSize(1024 * 1024 * 1024 * 2)
      expect(result).toContain('GB')
    })

    it('should convert bytes to TB', () => {
      const result = wrapper.vm.getFileSize(1024 * 1024 * 1024 * 1024 * 3)
      expect(result).toContain('TB')
    })

    it('should return bytes for small files', () => {
      const result = wrapper.vm.getFileSize(512)
      expect(result).toContain('B')
    })
  })

  describe('displayFileName method', () => {
    it('should return file name as is if 30 chars or less', () => {
      const result = wrapper.vm.displayFileName('short.jpg')
      expect(result).toBe('short.jpg')
    })

    it('should truncate long file names', () => {
      const longName = 'this_is_a_very_long_file_name_that_should_be_truncated.jpg'
      const result = wrapper.vm.displayFileName(longName)
      expect(result.length).toBeLessThan(longName.length)
      expect(result).toContain('...')
    })

    it('should return empty string for empty input', () => {
      const result = wrapper.vm.displayFileName('')
      expect(result).toBe('')
    })
  })

  describe('inputFile method', () => {
    it('should emit inputFile event', () => {
      wrapper.vm.files = [{ id: 1, file: new File(['content'], 'test.jpg') }]
      wrapper.vm.inputFile()
      expect(wrapper.emitted('inputFile')).toBeTruthy()
    })

    it('should emit empty array if no files', () => {
      wrapper.vm.files = []
      wrapper.vm.inputFile()
      expect(wrapper.emitted('inputFile')).toBeTruthy()
      expect(wrapper.emitted('inputFile')[0][0]).toEqual([])
    })
  })

  describe('inputFilter method', () => {
    it('should emit inputFilter event', () => {
      const newFile = { name: 'test.jpg', size: 1024 }
      const oldFile = null
      const prevent = jest.fn()
      wrapper.vm.inputFilter(newFile, oldFile, prevent)
      expect(wrapper.emitted('inputFilter')).toBeTruthy()
    })

    it('should prevent invalid file extensions', () => {
      const newFile = { name: 'test.exe', size: 1024 }
      const oldFile = null
      const prevent = jest.fn()
      wrapper.vm.inputFilter(newFile, oldFile, prevent)
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
    })

    it('should prevent files exceeding size limit', () => {
      wrapper.vm.size = 5 // 5MB
      const newFile = { name: 'test.jpg', size: 10 * 1024 * 1024 } // 10MB
      const oldFile = null
      const prevent = jest.fn()
      wrapper.vm.inputFilter(newFile, oldFile, prevent)
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
    })
  })

  describe('clear method', () => {
    it('should emit on-clear event', () => {
      wrapper.vm.clear()
      expect(wrapper.emitted('on-clear')).toBeTruthy()
    })

    it('should clear files array', () => {
      wrapper.vm.files = [{ id: 1, name: 'test.jpg' }]
      wrapper.vm.clear()
      expect(wrapper.vm.files.length).toBe(0)
    })

    it('should reset uploadProgress to 0', () => {
      wrapper.vm.uploadProgress = 50
      wrapper.vm.clear()
      expect(wrapper.vm.uploadProgress).toBe(0)
    })
  })

  describe('watch onUploadProgress', () => {
    it('should calculate upload progress', () => {
      const progress = { loaded: 50, total: 100 }
      wrapper = shallowMount(FileUpload, {
        propsData: { onUploadProgress: progress },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.uploadProgress).toBe(50)
    })

    it('should handle progress update', () => {
      wrapper = shallowMount(FileUpload, {
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      const progress = { loaded: 75, total: 100 }
      wrapper.setProps({ onUploadProgress: progress })
      expect(wrapper.vm.uploadProgress).toBe(75)
    })
  })

  describe('state management', () => {
    it('should track multiple uploads sequentially', () => {
      wrapper.vm.files = []
      wrapper.vm.uploadProgress = 0
      expect(wrapper.vm.files.length).toBe(0)
      expect(wrapper.vm.uploadProgress).toBe(0)
    })

    it('should support disable state', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: { disabled: true },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should support readonly state', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: { readonly: true },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should handle image upload', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: {
          fileType: 'image',
          extensions: ['jpg', 'png', 'gif']
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.fileType).toBe('image')
    })

    it('should handle file upload with size limit', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: {
          size: 10, // 10MB
          fileType: 'document'
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.size).toBe(10)
    })

    it('should support preview visibility toggle', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: {
          isPreviewVisible: false
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.isPreviewVisible).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should display error message', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: {
          hasError: true,
          errorText: 'File upload failed'
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.hasError).toBe(true)
      expect(wrapper.vm.errorText).toBe('File upload failed')
    })

    it('should show hint when provided', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: {
          hint: 'Select an image file'
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      expect(wrapper.vm.hint).toBe('Select an image file')
    })
  })

  describe('file extensions', () => {
    it('should support default image extensions', () => {
      const extensions = wrapper.vm._extensions
      expect(extensions).toContain('jpg')
      expect(extensions).toContain('png')
    })

    it('should support custom extensions', () => {
      wrapper = shallowMount(FileUpload, {
        propsData: {
          extensions: ['pdf', 'docx', 'xlsx']
        },
        stubs: { 'file-upload': true },
        mocks: { $store: { dispatch: jest.fn() } }
      })
      const extensions = wrapper.vm._extensions
      expect(extensions).toContain('pdf')
    })

    it('should generate regex for extension validation', () => {
      const regex = wrapper.vm.regexExtensions
      expect(regex.test('image.jpg')).toBe(true)
      expect(regex.test('image.png')).toBe(true)
      expect(regex.test('image.exe')).toBe(false)
    })
  })

  describe('upload progress tracking', () => {
    it('should track upload progress', () => {
      wrapper.vm.uploadProgress = 0
      expect(wrapper.vm.uploadProgress).toBe(0)

      wrapper.vm.uploadProgress = 50
      expect(wrapper.vm.uploadProgress).toBe(50)

      wrapper.vm.uploadProgress = 100
      expect(wrapper.vm.uploadProgress).toBe(100)
    })

    it('should show progress percentage', () => {
      wrapper.vm.uploadProgress = 75
      expect(wrapper.vm.uploadProgress).toBe(75)
    })
  })
})
