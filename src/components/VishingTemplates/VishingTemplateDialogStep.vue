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
          v-if="value.type !== 'pause'"
          :value="value.isFailStep"
          label="Fail at this step"
          customStyle="text-transform: none;"
          @input="onFailStepChange"
        />
        <v-btn color="#000000" icon outlined @click="onRemoveStep">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
    <v-expand-transition>
      <div v-if="value.isExpanded" class="vishing-template-dialog-step__body">
        <FormGroup
          v-if="value.type === 'pause'"
          className="mt-1"
          labelClassName="vishing-template-dialog-step__form-label"
          title="Pause Duration (seconds)"
        >
          <v-text-field
            v-model.number="value.pauseDuration"
            placeholder="Enter pause duration"
            type="number"
            style="max-width: 205px;"
            outlined
            :rules="durationRules"
            @input="onPauseDurationChange"
          />
        </FormGroup>
        <div v-if="value.type === 'uploadAudio'">
          <div class="vishing-template-dialog-step__form-title">
            <div class="vishing-template-dialog-step__form-title-left">
              <label class="vishing-template-dialog-step__form-label">Audio File</label>
              <span class="vishing-template-dialog-step__form-subtitle">Upload an audio file</span>
            </div>
            <div class="vishing-template-dialog-step__form--title-right">
              <AudioPlayer
                v-if="value.type === 'uploadAudio' && value.fileUrl"
                isPreview
                :src="value.fileUrl"
              />
            </div>
          </div>
          <KFileUpload
            hint="Only MP3 files. Max. file size 1MB"
            :extensions="['mp3']"
            :size="1"
            @inputFile="onFileChanged"
          />
        </div>
        <FormGroup
          v-if="value.type === 'textToSpeech'"
          className="mt-1"
          labelClassName="vishing-template-dialog-step__form-label"
          title="Text"
          subTitle="Enter your text to be voiced by AI"
        >
          <InputDescription
            :value="value.textToSpeech"
            initialPlaceholder="Enter text here"
            @input="onTextToSpeechChange"
          />
        </FormGroup>
        <FormGroup
          v-if="value.type !== 'pause'"
          className="mt-4"
          labelClassName="vishing-template-dialog-step__form-label"
          title="Number of digits"
          subTitle="Required number of digits for user to enter"
        >
          <v-text-field
            v-model.number="value.requiredDigitCount"
            placeholder="Enter pause duration"
            type="number"
            style="max-width: 205px;"
            outlined
            :rules="durationRules"
            @input="onRequiredDigitCountChange"
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
export default {
  name: 'VishingTemplateDialogStep',
  components: {
    KButtonCheckbox,
    FormGroup,
    InputDescription,
    KFileUpload,
    AudioPlayer
  },
  emits: ['removeStep'],
  props: {
    value: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    getTitle() {
      switch (this.value.type) {
        case 'textToSpeech':
          return `Step ${this.index + 1} - Text To Speech`
        case 'uploadAudio':
          return `Step ${this.index + 1} - Upload Audio`
        case 'pause':
          return `Step ${this.index + 1} - Pause`
        default:
          return ''
      }
    }
  },
  data() {
    return {
      durationRules: [
        (v) => validations.required(v, labels.Required),
        (v) => validations.startsWith(v, 'Cannot start with 0', 0)
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
        this.$emit('input', { ...this.value, pauseDuration: parseInt(val) })
      }
    },
    onTextToSpeechChange(val) {
      this.$emit('input', { ...this.value, textToSpeech: val })
    },
    onRequiredDigitCountChange(val) {
      if (!val || /\d+$/.test(val)) {
        this.$emit('input', { ...this.value, requiredDigitCount: parseInt(val) })
      }
    },
    onFailStepChange(val) {
      this.$emit('input', { ...this.value, isFailStep: val })
      if (val) {
        this.$emit('failStepChange', this.index)
      }
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.$emit('input', { ...this.value, fileName: '', file: null, fileUrl: '' })
      } else {
        this.$emit('input', {
          ...this.value,
          fileName: file.name,
          file,
          fileUrl: URL.createObjectURL(file)
        })
      }
    }
  }
  // interface Step {
  //     type: 'Text to Speech' | 'Upload Audio' | 'Pause';
  //     textToSpeech?: string;
  //     fileName?: string;
  //     fileUrl?: string;
  //     requiredDigitCount?: number;
  //     isFailStep: boolean;
  //     pauseDuration?: number;
  // }
}
</script>
