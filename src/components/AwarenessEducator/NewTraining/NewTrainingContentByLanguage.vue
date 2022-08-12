<template>
  <div>
    <FormGroupHorizontalContent
      :label="labels.LANGUAGE"
      class="mb-2"
      :style="!isRemovable && { justifyContent: 'flex-start', maxWidth: '456px' }"
    >
      <InputSelectLanguage
        v-bind="commonRules"
        v-model="value.languageId"
        style="min-width: 205px !important; max-width: 205px !important;"
        required
        :items="languageItems"
        :menu-props="{ offsetY: true }"
        :disabled="isLanguageDisabled"
      />
      <v-btn
        v-if="isRemovable"
        outlined
        class="new-training-content-by-language__button"
        :ripple="false"
        @click="handleRemove"
      >
        <v-icon left> mdi-delete </v-icon>
        Remove
      </v-btn>
    </FormGroupHorizontalContent>
    <FormGroupHorizontalContent
      style="justify-content: flex-start; max-width: 456px;"
      :label="labels.UploadFile"
    >
      <KFileUpload
        ref="refCoverImageFileUpload"
        id="input--new-training-content-by-language-file"
        hint="Scorm 1.2 .zip file. Max. file size 40MB"
        style="width: 205px !important;"
        :size="40"
        :isShowFileProgress="true"
        :is-stand-alone="true"
        :onUploadProgress="progressEvent"
        :extensions="['.zip']"
        :file-previews="filePreviews"
        :disabled="!value.languageId"
        :deletable="false"
        @inputFile="handleFileChange"
      />
    </FormGroupHorizontalContent>
  </div>
</template>

<script>
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'
import labels from '@/model/constants/labels'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import * as Validations from '@/utils/validations'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'NewTrainingContentByLanguage',
  components: { KFileUpload, InputSelectLanguage, FormGroupHorizontalContent },
  props: {
    value: {
      type: Object,
      default: () => ({
        languageId: 'f9288272-d0a1-4edc-93d3-534e56983e4f',
        file: ''
      })
    },
    languageItems: {
      type: Array,
      default: () => []
    },
    trainingResourceId: {
      type: String
    },
    isRemovable: {
      type: Boolean
    },
    filePreviews: {
      type: Array
    }
  },
  data() {
    return {
      abortController: null,
      labels,
      isDisabled: false,
      progressEvent: undefined,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      }
    }
  },
  computed: {
    isLanguageDisabled() {
      return !!this?.filePreviews?.length || this.isDisabled
    }
  },
  methods: {
    handleFileChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        return (this.value.file = null)
      }
      this.abortController = new AbortController()
      const payload = new FormData()
      payload.append('zipFile', file)
      payload.append('languageId', this.value.languageId)
      this.isDisabled = true
      AwarenessEducatorService.uploadTrainingContent(
        payload,
        this.trainingResourceId,
        this.abortController.signal,
        (progressEvent) => {
          this.progressEvent = progressEvent
        }
      )
        .then(() => {
          this.progressEvent = undefined
          this.abortController = null
          this.$emit('input', { ...this.value, file })
        })
        .finally(() => {})
    },
    handleRemove() {
      if (this.abortController) {
        this.abortController.abort()
        this.abortController = null
      }
      this.$emit('on-remove')
    }
  }
}
</script>
