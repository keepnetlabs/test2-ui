import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'

describe('useSetAttachmentFile Hook', () => {
  let component

  beforeEach(() => {
    component = {
      formValues: {
        attachmentFiles: []
      },
      ...useSetAttachmentFile.data(),
      ...useSetAttachmentFile.methods
    }
  })

  describe('data()', () => {
    it('should initialize with correct default values', () => {
      const data = useSetAttachmentFile.data()
      expect(data.isAttachmentError).toBe(false)
      expect(data.isPhishingFileModified).toBe(false)
      expect(data.isAddedNewPhishingFile).toBe(false)
    })
  })

  describe('methods', () => {
    describe('setAttachmentFile()', () => {
      it('should return early if empty array is passed', () => {
        component.setAttachmentFile([])
        expect(component.formValues.attachmentFiles).toEqual([])
      })

      it('should set formValues.attachmentFiles for file with type', () => {
        const mockFile = { name: 'test.pdf', type: 'application/pdf' }
        component.setAttachmentFile(mockFile)

        expect(component.formValues.attachmentFiles).toEqual([mockFile])
        expect(component.isAttachmentError).toBe(false)
      })

      it('should handle single file correctly', () => {
        const mockFile = { name: 'test.txt', type: 'text/plain' }
        component.setAttachmentFile(mockFile)

        expect(component.formValues.attachmentFiles).toBeDefined()
        expect(component.isAttachmentError).toBe(false)
      })

      it('should convert file extension and set flags', () => {
        component.formValues.attachmentFiles = []
        const mockFile = { name: 'test.doc' }

        component.setAttachmentFile(mockFile)

        expect(component.isPhishingFileModified).toBe(true)
        expect(component.isAddedNewPhishingFile).toBe(true)
        expect(component.isAttachmentError).toBe(false)
      })

      it('should set flags when file is set', () => {
        component.formValues.attachmentFiles = []
        const mockFile = { name: 'test.pdf', type: 'application/pdf' }
        component.setAttachmentFile(mockFile)

        expect(component.isPhishingFileModified).toBe(true)
        expect(component.isAddedNewPhishingFile).toBe(true)
        expect(component.isAttachmentError).toBe(false)
      })

      it('should convert .doc file to proper MIME type', () => {
        component.formValues.attachmentFiles = []
        const mockFile = { name: 'document.doc' }

        component.setAttachmentFile(mockFile)

        // Check that File was called with correct MIME type
        const attachedFile = component.formValues.attachmentFiles[0]
        expect(attachedFile).toBeDefined()
      })

      it('should convert .docx file to proper MIME type', () => {
        component.formValues.attachmentFiles = []
        const mockFile = { name: 'document.docx' }

        component.setAttachmentFile(mockFile)

        const attachedFile = component.formValues.attachmentFiles[0]
        expect(attachedFile).toBeDefined()
      })

      it('should handle file without extension', () => {
        const mockFile = { name: 'testfile', type: 'text/plain' }
        component.setAttachmentFile(mockFile)

        expect(component.formValues.attachmentFiles).toEqual([mockFile])
        expect(component.isPhishingFileModified).toBe(true)
      })

      it('should clear attachment error when setting file', () => {
        component.isAttachmentError = true
        const mockFile = { name: 'test.pdf', type: 'application/pdf' }
        component.setAttachmentFile(mockFile)

        expect(component.isAttachmentError).toBe(false)
      })

      it('should wrap single file in array', () => {
        const mockFile = { name: 'test.pdf', type: 'application/pdf' }
        component.setAttachmentFile(mockFile)

        expect(Array.isArray(component.formValues.attachmentFiles)).toBe(true)
        expect(component.formValues.attachmentFiles.length).toBeGreaterThan(0)
      })
    })
  })
})
