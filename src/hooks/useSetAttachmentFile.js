export default {
  data() {
    return {
      isAttachmentError: false,
      isPhishingFileModified: false,
      isAddedNewPhishingFile: false
    }
  },
  methods: {
    setAttachmentFile(file) {
      if (Array.isArray(file) && file.length === 0) return
      if (file && !Array.isArray(file) && !file.type) {
        let newFile = null
        let fileExtension = ''
        if (file?.name.includes('.')) {
          fileExtension = file?.name?.split('.')?.pop()
        }
        if (fileExtension === '.doc') {
          newFile = new File([file], file.name, { type: 'application/msword' })
        } else if (fileExtension === 'docx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
        } else if (fileExtension === 'ppt') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.ms-powerpoint'
          })
        } else if (fileExtension === 'pptx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          })
        }
        this.formValues.attachmentFiles = Array.isArray(newFile) ? newFile : [newFile]
        this.isAttachmentError = false
      } else {
        this.formValues.attachmentFiles = Array.isArray(file) ? file : [file]
        this.isAttachmentError = false
      }
      this.isPhishingFileModified = true
      this.isAddedNewPhishingFile = true
    }
  }
}
