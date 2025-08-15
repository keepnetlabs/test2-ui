<template>
  <div :class="['input-merge-tag', isTextToSpeech && 'text-to-speech']">
    <div v-if="mergeTags.length" class="input-merge-tag__tags">
      <v-btn
        v-for="mergeTag in getRowMergeTags"
        :key="mergeTag.value"
        class="input-merge-tag__tag ma-1"
        elevation="0"
        small
        @click="handleMergeTagClick(mergeTag.value)"
      >
        {{ mergeTag.text }}
      </v-btn>
      <v-menu v-if="hasOverflowItems" :offset-x="true" bottom right>
        <template v-slot:activator="{ on: menu }">
          <v-btn v-on="menu" rounded icon class="ml-4" style="background-color: #2196f3;">
            <v-icon color="#ffffff" medium>mdi-tag-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="mergeTag in getOverflowItems"
            :key="mergeTag.value"
            :id="mergeTag.value"
            @click="handleMergeTagClick(mergeTag.value)"
          >
            <v-list-item-title>{{ mergeTag.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="input-merge-tag__container">
      <v-textarea
        v-bind="requiredProps"
        ref="refInput"
        class="rounded-t-0"
        :value="value"
        :row="3"
        outlined
        dense
        no-resize
        autocomplete="disabled"
        :height="height"
        :rows="rows"
        :disabled="disabled"
        :placeholder="placeholder"
        :rules="rules"
        :readonly="readonly"
        :hint="hint"
        @input="$emit('input', $event)"
      >
        <template v-if="isTextToSpeech" #prepend-inner>
          <div class="input-merge-tag__inner">
            <div v-if="isTextToSpeech" class="input-merge-tag__badges-and-button">
              <div class="input-merge-tag__badges">
                <div class="input-merge-tag__badge">
                  <v-icon class="mr-1" color="#757575" size="large">mdi-web</v-icon
                  >{{ language || 'Language' }}
                </div>
                <div class="input-merge-tag__badge">
                  <v-icon class="mr-1" color="#757575" size="large">mdi-microphone-outline</v-icon
                  >{{ voice || 'Voice' }}
                </div>
              </div>
              <v-tooltip :disabled="!isShowTooltip" right opacity="1">
                <template #activator="{ on }">
                  <v-btn
                    v-on="on"
                    rounded
                    color="#2196f3"
                    :id="'input-merge-tag__play-text-to-speech-button'"
                    :class="[
                      'add-step-button',
                      'button-new',
                      isPlayTextDisabled ? 'add-step-button--disabled' : ''
                    ]"
                    :disabled="isPlayTextDisabled"
                    @click="handlePlayTextToSpeech"
                  >
                    <v-icon
                      v-if="isFetchingTTSUrl"
                      class="ml-1 loading-spin-clockwise"
                      color="#ffffff"
                      medium
                      >mdi-rotate-right
                    </v-icon>
                    <v-icon v-else color="#ffffff" style="font-size: 20px; margin-top: 1px;"
                      >mdi-play</v-icon
                    >
                    <span class="add-step-button__text" style="text-transform: none;"
                      >Play the Text</span
                    >
                  </v-btn>
                </template>
                <span class="tooltip-span">
                  The TTS provider of the selected voice cannot provide a preview of the converted
                  speech
                </span>
              </v-tooltip>
            </div>
            <div
              v-if="audioSrc && isPlayTextClicked && !isFetchingTTSUrl"
              class="input-merge-tag__audio-container"
            >
              <AudioPlayer class="input-merge-tag__audio-player" :src="audioSrc" />
            </div>
          </div>
        </template>
      </v-textarea>
      <div v-if="$slots['append-inner']" class="input-merge-tag__button-overlay">
        <slot name="append-inner"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { playTextToSpeech } from '@/api/vishing'
import CallbackService from '@/api/callback'
import AudioPlayer from '@/components/AudioPlayer'
export default {
  name: 'InputMergeTag',
  components: {
    AudioPlayer
  },
  props: {
    value: {
      type: String
    },
    id: {
      type: String
    },
    initialPlaceholder: {
      type: String,
      default: ''
    },
    initialRules: {
      type: Array
    },
    entityName: {
      type: String,
      default: labels.Description
    },
    required: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 2000
    },
    disabled: {
      default: false
    },
    readonly: {
      default: false
    },
    applyRules: {
      default: true
    },
    height: {
      type: String
    },
    rows: {
      type: String
    },
    hint: {
      type: String
    },
    mergeTags: {
      type: Array,
      required: true
    },
    isTextToSpeech: {
      type: Boolean,
      default: false
    },
    language: {
      type: String
    },
    voice: {
      type: String
    },
    voiceResourceId: {
      type: String
    },
    isVoiceTextToSpeechCompatible: {
      type: Boolean
    },
    isCallback: {
      type: Boolean,
      default: false
    },
    overflowCount: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      isFetchingTTSUrl: false,
      isPlayTextClicked: false,
      audioSrc: '',
      rules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(
            v,
            this.maxLength,
            labels.getMaxLengthMessage(this.entityName, this.maxLength)
          )
      ],
      mergeTagRules: [
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          if (!matches?.length) return true
          const tags = this.mergeTags.map((tag) => tag.value)
          for (let i = 0; i < matches.length; i++) {
            if (!tags.includes(matches[i].toUpperCase())) {
              return `${matches[i]} is an incorrect merge tag. Please enter an existing merge tag.`
            }
          }
          return true
        },
        (v) => {
          if (!v) return true
          const regexp = new RegExp(
            `(${this.mergeTags.map((mergeTag) => mergeTag.value).join('|')})`,
            'gi'
          )
          const matches = v.match(regexp)
          if (!matches?.length) return true
          const mergeTags = this.mergeTags.map((tag) => tag.value)
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          )
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            'Only use uppercase letters for the merge tag'
          )
        }
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  computed: {
    isShowTooltip() {
      return !this.isVoiceTextToSpeechCompatible && !!this.voice
    },
    isPlayTextDisabled() {
      return (
        !this.value ||
        !this.language ||
        !this.voice ||
        (this.$refs?.refInput && !this.$refs?.refInput?.valid) ||
        !this.isVoiceTextToSpeechCompatible ||
        this.isPlayTextClicked
      )
    },
    hasOverflowItems() {
      return this.mergeTags?.length > this.overflowCount
    },
    getOverflowItems() {
      return this.mergeTags?.slice(this.overflowCount)
    },
    getRowMergeTags() {
      return this.mergeTags?.slice(0, this.overflowCount)
    }
  },
  watch: {
    voice(val) {
      this.isPlayTextClicked = false
    },
    value(val) {
      this.isPlayTextClicked = false
    },
    required(val) {
      if (val) {
        this.requiredProps = {
          hint: this.hint || labels.RequiredStar,
          persistentHint: true
        }
        this.rules.unshift((v) => Validations.required(v))
      }
      this.rules = this.applyRules ? this.initialRules || this.rules : []
      if (this.mergeTags.length > 0) this.rules.push(...this.mergeTagRules)
      this.placeholder = this.initialPlaceholder || labels.EnterDescription
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = {
        hint: this.hint || labels.RequiredStar,
        persistentHint: true
      }
      this.rules.unshift((v) => Validations.required(v))
    }
    this.rules = this.applyRules ? this.initialRules || this.rules : []
    if (this.mergeTags.length > 0) this.rules.push(...this.mergeTagRules)
    this.placeholder = this.initialPlaceholder || labels.EnterDescription
  },
  methods: {
    handleMergeTagClick(mergeTag) {
      let textarea = this.$refs?.refInput?.$el?.getElementsByTagName('textarea')?.[0]
      if (!textarea) return
      let start_position = textarea.selectionStart
      let end_position = textarea.selectionEnd
      const newValue = `${textarea.value.substring(
        0,
        start_position
      )}${mergeTag}${textarea.value.substring(end_position, textarea.value.length)}`
      this.$emit('input', newValue)
    },
    handlePlayTextToSpeech(retryCount = 5) {
      if (!this.value) return
      this.isPlayTextClicked = true
      this.isFetchingTTSUrl = true
      const payload = {
        inputText: this.value,
        voiceResourceId: this.voiceResourceId
      }
      let fn = null
      if (this.isCallback) {
        fn = CallbackService.getVoiceUrl
      } else {
        fn = playTextToSpeech
      }
      fn(payload)
        .then((res) => {
          if (res?.data?.data) {
            this.audioSrc = res?.data?.data
            this.isPlayTextClicked = true
          }
        })
        .catch(() => {
          if (retryCount) this.handlePlayTextToSpeech(retryCount - 1)
        })
        .finally(() => {
          this.isFetchingTTSUrl = false
        })
    }
  }
}
</script>

<style>
.input-merge-tag__container {
  position: relative;
}

.input-merge-tag__button-overlay {
  position: absolute;
  bottom: 32px;
  right: 16px;
  z-index: 10;
}
.enhance-alert-box .alert-box__default-content {
  align-items: center;
}
</style>
