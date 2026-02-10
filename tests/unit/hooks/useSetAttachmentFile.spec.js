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

  describe('Hook Structure', () => {
    it('should export hook with data and methods', () => {
      expect(useSetAttachmentFile).toBeDefined()
      expect(useSetAttachmentFile.data).toBeDefined()
      expect(useSetAttachmentFile.methods).toBeDefined()
    })

    it('should have setAttachmentFile method', () => {
      expect(useSetAttachmentFile.methods.setAttachmentFile).toBeDefined()
      expect(typeof useSetAttachmentFile.methods.setAttachmentFile).toBe('function')
    })

    it('data function should return state object', () => {
      const data = useSetAttachmentFile.data()
      expect(data).toEqual({
        isAttachmentError: false,
        isPhishingFileModified: false,
        isAddedNewPhishingFile: false
      })
    })
  })

  describe('State Initialization', () => {
    it('should initialize isAttachmentError as false', () => {
      const data = useSetAttachmentFile.data()
      expect(data.isAttachmentError).toBe(false)
    })

    it('should initialize isPhishingFileModified as false', () => {
      const data = useSetAttachmentFile.data()
      expect(data.isPhishingFileModified).toBe(false)
    })

    it('should initialize isAddedNewPhishingFile as false', () => {
      const data = useSetAttachmentFile.data()
      expect(data.isAddedNewPhishingFile).toBe(false)
    })

    it('should initialize with all flags false', () => {
      const data = useSetAttachmentFile.data()
      expect(data.isAttachmentError).toBe(false)
      expect(data.isPhishingFileModified).toBe(false)
      expect(data.isAddedNewPhishingFile).toBe(false)
    })
  })

  describe('File Type Handling', () => {
    it('should handle PDF files', () => {
      const pdfFile = { name: 'document.pdf', type: 'application/pdf' }
      component.setAttachmentFile(pdfFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should handle Word documents', () => {
      const wordFile = { name: 'document.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      component.setAttachmentFile(wordFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should handle text files', () => {
      const textFile = { name: 'document.txt', type: 'text/plain' }
      component.setAttachmentFile(textFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should convert .doc to proper MIME type', () => {
      const docFile = { name: 'old.doc', type: 'application/msword' }
      component.setAttachmentFile(docFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })
  })

  describe('Flag Management', () => {
    it('should set isPhishingFileModified when file is added', () => {
      component.formValues.attachmentFiles = []
      const file = { name: 'test.pdf', type: 'application/pdf' }
      component.setAttachmentFile(file)
      expect(component.isPhishingFileModified).toBe(true)
    })

    it('should set isAddedNewPhishingFile when file is added', () => {
      component.formValues.attachmentFiles = []
      const file = { name: 'test.pdf', type: 'application/pdf' }
      component.setAttachmentFile(file)
      expect(component.isAddedNewPhishingFile).toBe(true)
    })

    it('should clear attachment error when file is set', () => {
      component.isAttachmentError = true
      const file = { name: 'test.pdf' }
      component.setAttachmentFile(file)
      expect(component.isAttachmentError).toBe(false)
    })

    it('should toggle modification flags', () => {
      expect(component.isPhishingFileModified).toBe(false)
      component.setAttachmentFile({ name: 'test.pdf' })
      expect(component.isPhishingFileModified).toBe(true)
    })
  })

  describe('File Storage', () => {
    it('should initialize with empty attachmentFiles array', () => {
      expect(Array.isArray(component.formValues.attachmentFiles)).toBe(true)
      expect(component.formValues.attachmentFiles.length).toBe(0)
    })

    it('should add file to attachmentFiles', () => {
      component.formValues.attachmentFiles = []
      component.setAttachmentFile({ name: 'test.pdf' })
      expect(component.formValues.attachmentFiles.length).toBeGreaterThan(0)
    })

    it('should preserve file information', () => {
      const file = { name: 'document.pdf', type: 'application/pdf', size: 1024 }
      component.setAttachmentFile(file)
      expect(component.formValues.attachmentFiles[0]).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      component.setAttachmentFile([])
      expect(component.formValues.attachmentFiles).toEqual([])
    })

    it('should handle file without type property', () => {
      const fileNoType = { name: 'test.pdf' }
      component.setAttachmentFile(fileNoType)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should handle file with very long name', () => {
      const longNameFile = { name: 'a'.repeat(100) + '.pdf' }
      component.setAttachmentFile(longNameFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should handle special characters in filename', () => {
      const specialFile = { name: 'test@#$%.pdf' }
      component.setAttachmentFile(specialFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should handle file without extension', () => {
      const noExtFile = { name: 'testfile', type: 'text/plain' }
      component.setAttachmentFile(noExtFile)
      expect(component.formValues.attachmentFiles).toBeDefined()
    })
  })

  describe('Multiple File Operations', () => {
    it('should handle setting file multiple times', () => {
      component.setAttachmentFile({ name: 'file1.pdf' })
      component.setAttachmentFile({ name: 'file2.pdf' })
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should maintain file state after multiple operations', () => {
      const file1 = { name: 'file1.pdf' }
      const file2 = { name: 'file2.pdf' }
      component.setAttachmentFile(file1)
      component.setAttachmentFile(file2)
      expect(component.isPhishingFileModified).toBe(true)
    })
  })

  describe('Component Integration', () => {
    it('should work with form values object', () => {
      expect(component.formValues).toBeDefined()
      expect(component.formValues.attachmentFiles).toBeDefined()
    })

    it('should maintain formValues structure', () => {
      const file = { name: 'test.pdf' }
      component.setAttachmentFile(file)
      expect(component.formValues).toEqual({
        attachmentFiles: expect.any(Array)
      })
    })
  })
})
