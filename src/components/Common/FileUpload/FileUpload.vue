<template>
  <div class="k-file-uploads" :class="['k-file-uploads', { 'k-file-uploads--readonly': readonly }]">
    <div class="k-file-uploads__wrapper">
      <file-upload
        ref="upload"
        v-model="files"
        :input-id="`id-${Math.random().toString().substring(4)}`"
        :id="`id-${Math.random().toString().substring(4)}`"
        :extensions="_extensions"
        :accept="accept"
        :multiple="false"
        @input-file="inputFile"
        @input-filter="inputFilter"
        :drop="true"
        :size="size"
      >
        Select or drop file
        <v-icon>mdi-folder-open</v-icon>
      </file-upload>
      <div v-for="file in files" :key="file.id" class="k-file-uploads__item">
        <div class="k-file-uploads__item-details">
          <div class="k-file-uploads__item-details--filename">{{ file.name }}</div>
          <div class="k-file-uploads__item-details--filesize">
            <span>{{ file.size | formatSize }}</span>
            <span
              v-if="isStandAlone && file.progress && uploadProgress < 100"
              class="k-file-uploads__item-details--progress-value"
              >{{ uploadProgress }}%</span
            >
          </div>
          <div
            v-if="isStandAlone && file.progress"
            class="k-file-uploads__item-details--fileprogress"
          >
            <v-progress-linear :value="uploadProgress" v-if="uploadProgress < 100" />
            <span
              v-if="isStandAlone && file.progress && uploadProgress === 100"
              class="k-file-uploads__item-details--progress-value"
              >{{ constant.UPLOADED_SUCCESSFULLY }}</span
            >
          </div>
        </div>
        <div v-if="isStandAlone" class="k-file-uploads__item-actions">
          <v-icon :disabled="isLoading" @click="clear">mdi-close-circle</v-icon>
        </div>
      </div>
    </div>
    <div v-if="hint" class="k-file-uploads__hint">{{ hint }}</div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { LABEL_STORE } from '@/model/constants/commonConstants'

export default {
  name: 'KFileUpload',
  components: { FileUpload },
  props: {
    size: {
      type: Number,
      default: 200
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
    readonly: {
      type: Boolean
    },
    onUploadProgress: {
      type: ProgressEvent,
      default: undefined
    }
  },
  data() {
    return {
      files: [],
      uploadProgress: 0,
      constant: LABEL_STORE
    }
  },
  computed: {
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
    inputFile() {
      this.$emit('inputFile', this.files[0].file)
    },
    inputFilter(newFile, oldFile, prevent) {
      let maxSize = this.size * 1024 * 1024
      if (newFile.size > maxSize) {
        this.$store.dispatch('common/createSnackBar', {
          message: `File size cannot be bigger than ${this.size}MB`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
        return prevent()
      }
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
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    },
    clear() {
      //this.$emit('clear')
      //this.$refs.upload.update(file, { active: false })
      this.files = []
      this.uploadProgress = 0
    }
  },
  watch: {
    // files(val) {},
    onUploadProgress() {
      return (this.uploadProgress = Math.round(
        (100 * this.onUploadProgress.loaded) / this.onUploadProgress.total
      ))
    }
  }
}
</script>

<style lang="scss">
.k-file-uploads {
  &--readonly {
    pointer-events: none;
  }

  &__wrapper {
    min-height: 40px;
    border-radius: 8px;
    border: solid 1px #dcdfe6;
    & > .file-uploads {
      padding: 10px;
      font-size: 12px !important ;
      font-weight: 600 !important;
      color: rgba(0, 0, 0, 87);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__item {
    padding: 10px;
    border-top: solid 1px #dcdfe6;
    display: flex;
    &-details {
      flex-grow: 1;
      &--filename {
        font-size: 13px;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.72);
      }
      &--filesize {
        font-size: 9px;
        line-height: 13px;
        color: #474747;
        display: flex;
        justify-content: space-between;
      }
      &--fileprogress {
        margin-top: 6px;
      }
      &--progress-value {
        font-size: 9px;
        line-height: 13px;
        font-weight: 600;
        color: #2196f3;
        display: flex;
        justify-content: space-between;
      }
    }
    &-actions {
      width: 24px;
      text-align: right;
      & > .v-icon.v-icon {
        font-size: 14px;
      }
    }
  }
  &__hint {
    margin-top: 1px;
    font-size: 9px;
    line-height: 13px;
    color: #474747;
  }
}
</style>
