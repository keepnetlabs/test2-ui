<template>
  <v-card class="vishing-template-dialog-step">
    <div class="vishing-template-dialog-step__header">
      <div class="vishing-template-dialog-step__header-left">
        <v-btn small icon @click="onToggleExpansion">
          <v-icon>{{ value.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <span class="vishing-template-dialog-step__header-text"> {{ getTitle }} </span>
      </div>
      <div class="vishing-template-dialog-step__header-right">
        <KButtonCheckbox
          v-if="value.inputType !== 'Pause'"
          :value="value.isVishingStep"
          label="Fail at this step"
          customStyle="text-transform: none;"
          @input="onVishingStepChange"
        />
        <v-tooltip :disabled="!isRemoveDisabled" right max-width="200">
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                color="#000000"
                icon
                outlined
                :disabled="isRemoveDisabled"
                @click="onRemoveStep"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
          <span class="tooltip-span">It cannot be deleted since there is only one step</span>
        </v-tooltip>
      </div>
    </div>
    <v-expand-transition>
      <div v-if="value.isExpanded" class="vishing-template-dialog-step__body">
        <FormGroup
          v-if="value.inputType === 'Pause'"
          className="mt-1"
          labelClassName="vishing-template-dialog-step__form-label"
          title="Pause Duration (seconds)"
        >
          <v-text-field
            v-model.number="value.duration"
            placeholder="Enter pause duration"
            type="number"
            style="max-width: 205px;"
            outlined
            :rules="durationRules"
            @input="onPauseDurationChange"
          />
        </FormGroup>
        <div v-if="value.inputType === 'FileUpload'">
          <div class="vishing-template-dialog-step__form-title">
            <div class="vishing-template-dialog-step__form-title-left">
              <label class="vishing-template-dialog-step__form-label">Audio File</label>
              <span class="vishing-template-dialog-step__form-subtitle">Upload an audio file</span>
            </div>
            <div class="vishing-template-dialog-step__form--title-right">
              <AudioPlayer
                v-if="(value.inputType === 'FileUpload' && getFileSrc)"
                isPreview
                :src="getFileSrc"
              />
            </div>
          </div>
          <KFileUpload
            hint="Only MP3 files. Max. file size 1MB"
            :extensions="['mp3']"
            :size="1"
            :filePreviews="getFilePreviews"
            @inputFile="onFileChanged"
            @on-clear="onClearFile"
          />
          <CustomError
            class="mb-6"
            style="margin-top: 2px;"
            :isValid="!fileUploadErrorText"
            :errorMessage="fileUploadErrorText"
          />
        </div>
        <FormGroup
          v-if="value.inputType === 'TextToSpeech'"
          className="mt-1"
          labelClassName="vishing-template-dialog-step__form-label"
          title="Text"
          subTitle="Enter your text to be voiced by AI"
        >
          <InputDescription
            :value="value.inputText"
            :max-length="500"
            entity-name="Text to speech"
            initialPlaceholder="Enter text here"
            required
            @input="onTextToSpeechChange"
          />
        </FormGroup>
        <FormGroup
          v-if="value.inputType !== 'Pause'"
          className="mt-4"
          labelClassName="vishing-template-dialog-step__form-label"
          title="Number of digits"
          subTitle="Required number of digits for user to enter"
        >
          <v-text-field
            v-model.number="value.inputDigit"
            placeholder="Enter pause duration"
            type="number"
            style="max-width: 205px;"
            outlined
            :rules="numberOfDigitsRules"
            @input="onDigitCountChange"
          />
        </FormGroup>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import KButtonCheckbox from '@/components/Common/Checkbox/KButtonCheckbox'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AudioPlayer from '@/components/AudioPlayer'
import CustomError from '@/components/CustomError'

export default {
  name: 'VishingTemplateDialogStep',
  components: {
    KButtonCheckbox,
    FormGroup,
    InputDescription,
    KFileUpload,
    AudioPlayer,
    CustomError
  },
  emits: ['removeStep'],
  props: {
    value: {
      type: Object
    },
    index: {
      type: Number
    },
    isRemoveDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getTitle() {
      switch (this.value.inputType) {
        case 'TextToSpeech' || 1:
          return `Step ${this.index + 1} - Text To Speech`
        case 'FileUpload' || 2:
          return `Step ${this.index + 1} - Upload Audio`
        case 'Pause' || 3:
          return `Step ${this.index + 1} - Pause`
        default:
          return ''
      }
    },
    getFileSrc() {
      if (this.value?.content) {
        return URL.createObjectURL(this.value.content)
      }

      if (this.value?.inputUrl) {
        return this.value.inputUrl
      }

      return null
    },
    getFilePreviews() {
      if (this.value?.content) {
        return [{ name: this.value.content.name, size: this.value.content.size }]
      }

      if (this.value?.inputUrl) {
        const lastSlashIndex = this.value.inputUrl.lastIndexOf('/') + 1
        const fileName = this.value.inputUrl.substring(lastSlashIndex)
        return [{ name: fileName }]
      }

      return []
    }
  },
  data() {
    return {
      fileUploadErrorText: '',
      durationRules: [
        (v) => (v === 0 ? true : validations.required(v, labels.Required)),
        (v) => (v >= 0 && v <= 10) || 'Duration must be between 0 and 10 seconds'
      ],
      numberOfDigitsRules: [
        (v) => (v === 0 ? true : validations.required(v, labels.Required)),
        (v) => (v >= 0 && v <= 10) || 'Number of digits must be between 0 and 10'
      ]
    }
  },
  methods: {
    onToggleExpansion() {
      this.$emit('input', { ...this.value, isExpanded: !this.value.isExpanded })
    },
    onRemoveStep() {
      this.$emit('removeStep')
    },
    onPauseDurationChange(val) {
      if (!val || /\d+$/.test(val)) {
        this.$emit('input', { ...this.value, duration: val.length ? parseInt(val) : null })
      }
    },
    onTextToSpeechChange(val) {
      this.$emit('input', { ...this.value, inputText: val })
    },
    onDigitCountChange(val) {
      if (!val || /\d+$/.test(val)) {
        this.$emit('input', { ...this.value, inputDigit: val.length ? parseInt(val) : null })
      }
    },
    onVishingStepChange(val) {
      this.$emit('input', { ...this.value, isVishingStep: val })
      if (val) {
        this.$emit('vishingStepChange', this.index)
      }
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.$emit('input', { ...this.value, content: null, inputUrl: null })
        this.fileUploadErrorText = `Audio file can't be empty.`
      } else {
        this.fileUploadErrorText = ''
        this.$emit('input', {
          ...this.value,
          inputUrl: null,
          content: file
        })
      }
    },
    onClearFile() {
      this.fileUploadErrorText = `Audio file can't be empty.`
      this.$emit('input', { ...this.value, content: null, inputUrl: null })
    }
  }
}
</script>
