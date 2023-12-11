<template>
  <v-card class="callback-template-dialog-step">
    <div v-if="!isCallGreeting" class="callback-template-dialog-step__header">
      <div class="callback-template-dialog-step__header-left">
        <v-btn small icon @click="onToggleExpansion">
          <v-icon>{{ value.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <span class="callback-template-dialog-step__header-text"> {{ getTitle }} </span>
      </div>
      <div class="callback-template-dialog-step__header-right">
        <KButtonCheckbox
          v-if="value.inputType !== 'Pause'"
          :value="value.isVishingStep"
          label="Digit Entering Step"
          customStyle="text-transform: none;"
          @input="onVishingStepChange"
        />
        <v-tooltip :disabled="!isRemoveDisabled" right max-width="200">
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                color="#383B41"
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
      <div
        v-if="isCallGreeting || value.isExpanded"
        class="callback-template-dialog-step__body pt-3"
      >
        <FormGroup
          v-if="isCallGreeting"
          style="max-width: 610px;"
          title="Method"
          subTitle="Choose playback method"
          labelClassName="callback-template-dialog-step__form-label"
        >
          <KSelect
            :value="value.inputType"
            :items="dialingNoticeItems"
            type="select"
            persistent-hint
            dense
            item-text="text"
            item-value="value"
            outlined
            @input="onCallGreetingTypeChange"
          />
        </FormGroup>
        <FormGroup
          v-if="value.inputType === 'Pause'"
          className="mt-1"
          labelClassName="callback-template-dialog-step__form-label"
          title="Pause Duration (seconds)"
        >
          <v-text-field
            v-model.number="value.duration"
            class="callback-template-dialog-step__duration-input"
            placeholder="Enter pause duration"
            type="number"
            style="max-width: 205px;"
            outlined
            :rules="durationRules"
            @input="onPauseDurationChange"
          />
        </FormGroup>
        <div v-if="value.inputType === 'FileUpload'">
          <div class="callback-template-dialog-step__form-title">
            <div class="callback-template-dialog-step__form-title-left">
              <label class="callback-template-dialog-step__form-label">Audio File</label>
              <span class="callback-template-dialog-step__form-subtitle">Upload an audio file</span>
            </div>
          </div>
          <KFileUpload
            hint="*Required (Only MP3 files. Max. file size 1MB)"
            class="callback-template-dialog-step__audio-file-input"
            :extensions="['mp3']"
            :size="1"
            :filePreviews="getFilePreviews"
            @inputFile="onFileChanged"
            @on-clear="onClearFile"
          />
          <div
            v-if="value.inputUrl || value.content"
            class="callback-template-dialog-step__audio-file-preview-container"
          >
            <div class="callback-template-dialog-step__audio-badge-container">
              <div class="callback-template-dialog-step__audio-badge">
                <v-icon class="mr-1" color="#757575" size="large">$playfile-gray</v-icon>Audio File
              </div>
              <v-btn
                rounded
                color="#2196f3"
                :id="'callback-template-dialog-step__play-audio-button'"
                :class="[
                  'add-step-button',
                  'button-new',
                  isPlayAudioDisabled ? 'add-step-button--disabled' : ''
                ]"
                :disabled="isPlayAudioDisabled"
                @click="handlePlayAudio"
              >
                <v-icon color="#ffffff" style="font-size: 20px; margin-top: 1px;">mdi-play</v-icon>
                <span class="add-step-button__text" style="text-transform: none;">Play Audio</span>
              </v-btn>
            </div>
            <div
              v-if="isPlayAudioClicked"
              class="callback-template-dialog-step__audio-player-container"
            >
              <AudioPlayer class="callback-template-dialog-step__audio-player" :src="getFileSrc" />
            </div>
          </div>
          <CustomError
            class="mb-4"
            style="margin-top: 2px;"
            :showValidMessage="false"
            :isValid="!fileUploadErrorText"
            :errorMessage="fileUploadErrorText"
          />
        </div>
        <FormGroup
          v-if="value.inputType === 'TextToSpeech'"
          className="mt-1"
          style="max-width: 603px;"
          labelClassName="callback-template-dialog-step__form-label"
          title="Text"
          :subTitle="getTextToSpeechSubTitlte"
        >
          <InputMergeTag
            :value="value.inputText"
            :max-length="500"
            :mergeTags="isCallGreeting ? [] : mergeTags"
            :language="language"
            :voice="voice"
            :voiceResourceId="voiceResourceId"
            :isVoiceTextToSpeechCompatible="isVoiceTextToSpeechCompatible"
            class="callback-template-dialog-step__text-to-speech-input"
            entity-name="Text to speech"
            initialPlaceholder="Enter your text to speech"
            isTextToSpeech
            isCallback
            required
            @input="onTextToSpeechChange"
          />
        </FormGroup>
        <FormGroup
          v-if="value.inputType !== 'Pause' && !isCallGreeting"
          className="mt-4"
          labelClassName="callback-template-dialog-step__form-label"
          title="Number of digits"
          subTitle="Required number of digits for user to enter"
        >
          <v-text-field
            v-model.number="value.inputDigit"
            placeholder="Enter digit count"
            class="callback-template-dialog-step__input-digit"
            type="number"
            style="max-width: 205px;"
            outlined
            :rules="numberOfDigitsRules"
            @input="onDigitCountChange"
          />
        </FormGroup>
        <AlertBox
          v-if="phishingCodeDigitCount"
          class="bg-aqua-light"
          :text="`Caller is expected to enter ${phishingCodeDigitCount}-digits phishing code at the end of the Call Greeting message.`"
          icon-color="#2196F3"
          icon-name="mdi-information"
          :slots="{ primaryAction: false, secondaryAction: false }"
        />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import KButtonCheckbox from '@/components/Common/Checkbox/KButtonCheckbox'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AudioPlayer from '@/components/AudioPlayer'
import CustomError from '@/components/CustomError'
import InputMergeTag from '@/components/Common/Inputs/InputMergeTag'
import KSelect from '@/components/Common/Inputs/KSelect'
import AlertBox from '@/components/AlertBox'

export default {
  name: 'CallbackTemplateDialogStep',
  components: {
    KButtonCheckbox,
    FormGroup,
    KFileUpload,
    AudioPlayer,
    CustomError,
    InputMergeTag,
    KSelect,
    AlertBox
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
    },
    isCallGreeting: {
      type: Boolean,
      default: false
    },
    dialingNoticeItems: {
      type: Array
    },
    language: {
      type: String
    },
    voice: {
      type: String
    },
    phishingCodeDigitCount: {
      type: Number
    },
    voiceResourceId: {
      type: String
    },
    isVoiceTextToSpeechCompatible: {
      type: Boolean
    }
  },
  computed: {
    getTextToSpeechSubTitlte() {
      if (this.isCallGreeting) {
        return ` Enter your text to be voiced by AI.`
      }
      return ` Enter your text to be voiced by AI. Make your scenario more realistic by using merge tags.`
    },
    isPlayAudioDisabled() {
      return (!this.value?.inputUrl && !this.value?.content) || this.isPlayAudioClicked
    },
    getTitle() {
      const { inputType } = this.value
      if (inputType === 'TextToSpeech' || inputType === 1) {
        return `Step ${this.index + 1} - Text To Speech`
      } else if (inputType === 'FileUpload' || inputType === 2) {
        return `Step ${this.index + 1} - Upload Audio`
      } else if (inputType === 'Pause' || inputType === 3) {
        return `Step ${this.index + 1} - Pause`
      }
      return ''
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
      isPlayAudioClicked: false,
      mergeTags: [
        {
          text: 'Full Name',
          value: '{FULLNAME}'
        },
        {
          text: 'First Name',
          value: '{FIRSTNAME}'
        },
        {
          text: 'Last Name',
          value: '{LASTNAME}'
        },
        {
          text: 'Company Name',
          value: '{COMPANYNAME}'
        }
        // {
        //   text: 'Date Sent',
        //   value: '{DATE_SENT}'
        // },
        // {
        //   text: 'Current Date',
        //   value: '{CURRENT_DATE}'
        // },
        // {
        //   text: 'Current Date Plus 10 Days',
        //   value: '{CURRENT_DATE_PLUS_10_DAYS}'
        // },
        // {
        //   text: 'Current Date Minus 10 Days',
        //   value: '{CURRENT_DATE_MINUS_10_DAYS}'
        // },
        // {
        //   text: 'Random Number 1 Digit',
        //   value: '{RANDOM_NUMBER_1_DIGIT}'
        // },
        // {
        //   text: 'Random Number 2 Digits',
        //   value: '{RANDOM_NUMBER_2_DIGITS}'
        // },
        // {
        //   text: 'Random Number 3 Digits',
        //   value: '{RANDOM_NUMBER_3_DIGITS}'
        // }
      ],
      fileUploadErrorText: '',
      durationRules: [
        (v) => (v === 0 ? true : validations.required(v, labels.Required)),
        (v) => (v >= 0 && v <= 10) || 'Duration must be between 0 and 10 seconds'
      ],
      numberOfDigitsRules: [
        (v) => (v === 0 ? true : validations.required(v, labels.Required)),
        (v) => (v >= 0 && v <= 20) || 'Number of digits must be between 0 and 20'
      ]
    }
  },
  methods: {
    onVishingStepChange(val) {
      this.$emit('input', { ...this.value, isVishingStep: val })
      if (val) {
        this.$emit('vishingStepChange', this.index)
      }
    },
    handlePlayAudio() {
      this.isPlayAudioClicked = true
    },
    onToggleExpansion() {
      this.$emit('input', { ...this.value, isExpanded: !this.value.isExpanded })
    },
    onRemoveStep() {
      this.$emit('removeStep')
    },
    onPauseDurationChange(val) {
      if (!val || /\d{1,2}$/.test(val)) {
        this.$emit('input', {
          ...this.value,
          duration: val.length ? parseInt(val) : null
        })
      }
    },
    onTextToSpeechChange(val) {
      this.$emit('input', { ...this.value, inputText: val })
    },
    onDigitCountChange(val) {
      if (!val || /\d{1,2}$/.test(val)) {
        this.$emit('input', {
          ...this.value,
          inputDigit: val.length ? parseInt(val) : null
        })
      }
    },
    onFileChanged(file) {
      this.isPlayAudioClicked = false
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
    },
    onCallGreetingTypeChange(value) {
      if (value === 'TextToSpeech') {
        this.$emit('input', {
          ...this.value,
          inputType: value,
          inputUrl: null,
          content: null
        })
      } else {
        this.$emit('input', { ...this.value, inputType: value, inputText: null })
      }
    }
  }
}
</script>
