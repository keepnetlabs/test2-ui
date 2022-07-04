<template>
  <div>
    <FormGroupHorizontalContent :label="labels.LANGUAGE" class="mb-2">
      <InputSelectLanguage
        v-bind="commonRules"
        :value="value.languageTypeResourceId"
        style="max-width: 205px !important;"
        item-text="text"
        item-value="value"
        required
        :items="languageItems"
        :menu-props="{ offsetY: true }"
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
export default {
  name: 'NewTrainingContentByLanguage',
  components: { KFileUpload, InputSelectLanguage, FormGroupHorizontalContent },
  props: {
    value: {
      type: Object,
      default: () => ({ languageTypeResourceId: '', file: '' })
    }
  },
  data() {
    return {
      labels,
      languageItems: [],
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
      this.$emit('input', { ...this.value, file })
    },
    handleLanguageChange(val) {
      this.$emit('input', { ...this.value, languageTypeResourceId: val })
    }
  }
}
</script>
