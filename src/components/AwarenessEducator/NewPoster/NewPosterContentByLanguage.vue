<template>
  <div>
    <FormGroupHorizontalContent
      :label="labels.LANGUAGE"
      class="mb-2 training-library-content-by-language"
    >
      <InputSelectLanguage
        v-bind="commonRules"
        v-model="value.languageId"
        class="ml-8"
        style="min-width: 424px !important; max-width: 424px !important;"
        required
        :items="languageItems"
        :menu-props="{ offsetY: true }"
        :disabled="isLanguageDisabled"
      />
      <template v-if="isRemovable">
        <VTooltip v-if="isRenderTooltip" bottom>
          <template #activator="{on}">
            <div v-on="on">
              <VBtn
                outlined
                class="new-training-content-by-language__button"
                :ripple="false"
                :style="getRemovableButtonStyle"
                @click="handleRemove"
              >
                <v-icon left> mdi-delete </v-icon>
                Remove
              </VBtn>
            </div>
          </template>
          <span>{{ value && value.warningMessage }}</span>
        </VTooltip>
        <VBtn
          v-else
          outlined
          class="new-training-content-by-language__button"
          :ripple="false"
          :style="getRemovableButtonStyle"
          @click="handleRemove"
        >
          <v-icon left> mdi-delete </v-icon>
          Remove
        </VBtn>
      </template>
    </FormGroupHorizontalContent>
    <FormGroupHorizontalContent
      class="training-library-content-by-language"
      :label="labels.UploadFile"
    >
      <KFileUpload
        ref="refCoverImageFileUpload"
        id="input--new-poster-content-by-language-file"
        class="ml-8"
        style="width: 424px !important;"
        :size="100"
        :hint="getHint"
        :isShowFileProgress="true"
        :is-stand-alone="true"
        :onUploadProgress="progressEvent"
        :extensions="['jpg', 'pdf', 'tiff', 'png']"
        :file-previews="filePreviews"
        :disabled="!value.languageId"
        :readonly="isReadonly"
        :deletable="false"
        :is-backend-parsed="isBackendParsed"
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
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'NewPosterContentByLanguage',
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
    isUploading: {
      type: Boolean
    },
    filePreviews: {
      type: Array
    },
    typeWithDisplayName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      abortController: null,
      labels,
      isReadonly: false,
      isDisabled: false,
      progressEvent: undefined,
      isBackendParsed: false,
      scormType: 'Scorm',
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
    getRemovableButtonStyle() {
      const style = {}
      if (this.isUploading || this?.value?.isDeleteable) {
        style.opacity = 0.5
        style.pointerEvents = 'none'
      }
      return style
    },
    isRenderTooltip() {
      return this?.value?.isDeleteable
    },
    isLanguageDisabled() {
      return !!this?.filePreviews?.length || this.isDisabled
    },
    getHint() {
      return '.jpg, .png, .pdf, .tiff file. Max. file size 100MB'
    }
  },
  methods: {
    handleFileChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.value.file = null
        return
      }
      this.$emit('input', { ...this.value, isUploading: true })
      this.abortController = new AbortController()
      const payload = new FormData()
      payload.append('File', file)
      payload.append('LanguageId', this.value.languageId)
      payload.append('Type', TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
      this.isDisabled = true
      this.isReadonly = true
      this.isBackendParsed = false
      AwarenessEducatorService.uploadPosterContent(
        payload,
        this.trainingResourceId,
        this.abortController.signal,
        (progressEvent) => {
          this.progressEvent = progressEvent
        }
      )
        .then((response) => {
          this.scormType = response?.data?.data?.typeWithDisplayName
          this.isBackendParsed = true
          this.progressEvent = undefined
          this.abortController = null
          this.$emit('input', { ...this.value, file, isUploading: false })
        })
        .finally(() => {
          this.isReadonly = false
        })
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
