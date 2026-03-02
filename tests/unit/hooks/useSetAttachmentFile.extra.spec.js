import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'

describe('useSetAttachmentFile Hook (extra branch coverage)', () => {
  let component

  beforeEach(() => {
    component = {
      formValues: { attachmentFiles: [] },
      ...useSetAttachmentFile.data(),
      ...useSetAttachmentFile.methods
    }
  })

  describe('setAttachmentFile branch coverage', () => {
    it('returns early when file is empty array', () => {
      component.formValues.attachmentFiles = [{ name: 'old.pdf' }]
      component.setAttachmentFile([])
      expect(component.formValues.attachmentFiles).toEqual([{ name: 'old.pdf' }])
      expect(component.isPhishingFileModified).toBe(false)
    })

    it('handles file without type and extension ppt', () => {
      const mockFile = { name: 'presentation.ppt' }
      component.setAttachmentFile(mockFile)
      expect(component.formValues.attachmentFiles).toHaveLength(1)
      expect(component.formValues.attachmentFiles[0]).toBeInstanceOf(File)
      expect(component.formValues.attachmentFiles[0].name).toBe('presentation.ppt')
      expect(component.isAttachmentError).toBe(false)
    })

    it('handles file without type and extension pptx', () => {
      const mockFile = { name: 'slides.pptx' }
      component.setAttachmentFile(mockFile)
      expect(component.formValues.attachmentFiles).toHaveLength(1)
      expect(component.formValues.attachmentFiles[0]).toBeInstanceOf(File)
      expect(component.formValues.attachmentFiles[0].name).toBe('slides.pptx')
    })

    it('handles file without type and no extension in name', () => {
      const mockFile = { name: 'noextension' }
      component.setAttachmentFile(mockFile)
      expect(component.formValues.attachmentFiles).toEqual([null])
      expect(component.isPhishingFileModified).toBe(true)
    })

    it('handles file without type and unknown extension', () => {
      const mockFile = { name: 'file.xyz' }
      component.setAttachmentFile(mockFile)
      expect(component.formValues.attachmentFiles).toEqual([null])
      expect(component.isPhishingFileModified).toBe(true)
    })

    it('handles file with type - uses file directly', () => {
      const mockFile = { name: 'doc.pdf', type: 'application/pdf' }
      component.setAttachmentFile(mockFile)
      expect(component.formValues.attachmentFiles).toEqual([mockFile])
      expect(component.isAttachmentError).toBe(false)
    })

    it('handles array of files when file has type', () => {
      const files = [
        { name: 'a.pdf', type: 'application/pdf' },
        { name: 'b.pdf', type: 'application/pdf' }
      ]
      component.setAttachmentFile(files)
      expect(component.formValues.attachmentFiles).toEqual(files)
      expect(component.formValues.attachmentFiles).toHaveLength(2)
    })

    it('handles undefined file - sets single undefined in array', () => {
      component.setAttachmentFile(undefined)
      expect(component.formValues.attachmentFiles).toEqual([undefined])
      expect(component.isPhishingFileModified).toBe(true)
    })

    it('handles null file - sets single null in array', () => {
      component.setAttachmentFile(null)
      expect(component.formValues.attachmentFiles).toEqual([null])
      expect(component.isPhishingFileModified).toBe(true)
    })
  })
})
