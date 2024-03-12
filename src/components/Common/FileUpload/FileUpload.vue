<template>
  <div
    class="k-file-uploads"
    :class="[
      'k-file-uploads',
      { 'k-file-uploads--readonly': readonly },
      { 'k-file-uploads--disabled': disabled }
    ]"
  >
    <div class="k-file-uploads__wrapper">
      <file-upload
        ref="upload"
        v-model="files"
        :input-id="inputId"
        :id="id"
        :extensions="_extensions"
        :accept="accept"
        :multiple="false"
        @input-file="inputFile"
        @input-filter="inputFilter"
        :drop="true"
        :size="size"
      >
        Select or drop file
        <v-icon>mdi-folder-outline</v-icon>
      </file-upload>
      <template v-if="isPreviewVisible">
        <div
          v-for="file in getFiles"
          :key="file.id"
          :class="showImagePreview ? 'k-file-uploads__item align-center' : 'k-file-uploads__item'"
        >
          <div class="k-file-uploads__item-preview">
            <img
              v-if="!!getCoverImagePreview && showImagePreview"
              :src="getCoverImagePreview"
              alt="logo-preview"
            />
          </div>
          <div class="k-file-uploads__item-details">
            <div class="k-file-uploads__item-details--filename">
              {{ displayFileName(file.name) }}
            </div>
            <div class="k-file-uploads__item-details--filesize">
              <span v-if="!!file.size">{{ getFileSize(file.size) }}</span>
              <span
                v-if="
                  isStandAlone &&
                  file.progress &&
                  uploadProgress <= 100 &&
                  isShowFileProgress &&
                  !isBackendParsed
                "
                class="k-file-uploads__item-details--progress-value"
                >{{ uploadProgress === 100 && !isBackendParsed ? 99 : uploadProgress }}%</span
              >
            </div>
            <div
              v-if="isStandAlone && file.progress && isShowFileProgress"
              class="k-file-uploads__item-details--fileprogress"
            >
              <v-progress-linear :value="uploadProgress" v-if="uploadProgress <= 100" />
              <span
                v-if="isStandAlone && file.progress && isBackendParsed"
                class="k-file-uploads__item-details--progress-value"
                >{{ constant.UPLOADED_SUCCESSFULLY }}</span
              >
            </div>
          </div>
          <div v-if="deletable" class="k-file-uploads__item-actions">
            <v-icon :disabled="isLoading" @click="clear">mdi-delete</v-icon>
          </div>
        </div>
      </template>
    </div>
    <div v-if="hint" class="k-file-uploads__hint">{{ hint }}</div>
    <div v-if="hasError" class="v-messages theme--light error--text" role="alert">
      <div class="v-messages__wrapper">
        <div class="v-messages__message">{{ errorText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import { COMMON_CONSTANTS, LABEL_STORE } from '@/model/constants/commonConstants'
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'KFileUpload',
  components: { FileUpload },
  props: {
    size: {
      type: Number,
      default: 200
    },
    deletable: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isStandAlone: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: String,
      default: 'image'
    },
    extensions: {
      type: Array,
      default: () => {
        return ['gif', 'jpg', 'jpeg', 'png', 'bmp']
      }
    },
    accept: {
      type: String,
      default: undefined
    },
    hint: {
      type: String,
      default: null
    },
    hasError: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean
    },
    onUploadProgress: {
      type: ProgressEvent,
      default: undefined
    },
    isShowFileProgress: {
      type: Boolean,
      default: true
    },
    isPreviewVisible: {
      type: Boolean,
      default: true
    },
    filePreviews: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isBackendParsed: {
      type: Boolean,
      default: false
    },
    showImagePreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [],
      uploadProgress: 0,
      constant: LABEL_STORE,
      id: `id-${createRandomCryptStringNumber()}`,
      inputId: `id-${createRandomCryptStringNumber()}`
    }
  },
  computed: {
    getCoverImagePreview() {
      if (this.files.length) {
        console.log(this.files[0])
        return this.files[0].url
      }
      return false
    },
    getFiles() {
      if (this.files.length) {
        return this.files
      }
      return this.filePreviews
    },
    _extensions() {
      const arr = [...this.extensions]
      return arr.toString()
    },
    readableExtensions() {
      const arr = [...this.extensions]
      return arr.join(', ')
    },
    regexExtensions() {
      const arr = [...this.extensions]
      const extString = arr.join('|')
      return new RegExp('\.(' + extString + ')$', 'i')
    }
  },
  methods: {
    getFileSize(size = 0) {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    },
    displayFileName(fileName = '') {
      return fileName ? this.getFileNameText(fileName) : ''
    },
    getFileNameText(fileName = '') {
      return fileName.length <= 30 ? fileName : fileName.substring(0, 27) + '...'
    },
    inputFile() {
      this.$emit('inputFile', this.files[0]?.file || [])
    },
    inputFilter(newFile, oldFile, prevent) {
      let maxSize = this.size * 1024 * 1024
      this.$emit('inputFilter', { newFile, oldFile, prevent })
      if (newFile && !oldFile) {
        if (!this.regexExtensions.test(newFile.name)) {
          this.$store.dispatch('common/createSnackBar', {
            message: `Invalid file type. Allowed file types are ${this.readableExtensions}`,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
          return prevent()
        }
      }
      if (newFile.size > maxSize) {
        this.$store.dispatch('common/createSnackBar', {
          message: `File size cannot be bigger than ${this.size}MB`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
        return prevent()
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    },
    clear() {
      this.$emit('on-clear')
      this.files = []
      this.uploadProgress = 0
    }
  },
  watch: {
    onUploadProgress() {
      if (this.onUploadProgress) {
        this.uploadProgress = Math.round(
          (100 * this.onUploadProgress.loaded) / this.onUploadProgress.total
        )
      }
    }
  }
}
</script>
