<template>
  <div>
    <FormGroupHorizontalContent :label="labels.LANGUAGE" class="mb-2">
      <InputSelectLanguage
        v-bind="commonRules"
        :value="value.languageId"
        style="max-width: 205px !important;"
        required
        :items="languageItems"
        :menu-props="{ offsetY: true }"
        :disabled="isLanguageDisabled"
        @change="handleLanguageChange"
      />
    </FormGroupHorizontalContent>
    <FormGroupHorizontalContent :label="labels.UploadFile">
      <KFileUpload
        ref="refCoverImageFileUpload"
        id="input--new-training-content-by-language-file"
        hint="Scorm 1.2 .zip file. Max. file size 40mb"
        style="width: 205px !important;"
        :extensions="['.zip']"
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
      default: () => ({ languageId: '', file: '' })
    },
    languageItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      isLanguageDisabled: false,
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
  methods: {
    handleFileChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        return (this.value.file = null)
      }
      const payload = new FormData()
      payload.append('zipFile', file)
      payload.append('languageId', this.value.languageId)
      AwarenessEducatorService.uploadTrainingContent(payload).then((res) => {
        this.$emit('input', { ...this.value, file })
        this.isLanguageDisabled = true
      })
    },
    handleLanguageChange(val) {
      this.$emit('input', { ...this.value, languageTypeResourceId: val })
    }
  }
}
</script>
