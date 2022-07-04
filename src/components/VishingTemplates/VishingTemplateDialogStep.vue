<template>
  <v-card class="vishing-template-dialog-step">
    <div class="vishing-template-dialog-step__header">
      <div class="vishing-template-dialog-step__header-left">
        <v-btn icon @click="onToggleExpansion">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <span class="vishing-template-dialog-step__header-text"> {{ getTitle }} </span>
      </div>
      <div class="vishing-template-dialog-step__header-right">
        <KButtonCheckbox
          v-model="isFailStep"
          label="Fail at this step"
          customStyle="text-transform: none;"
        />
        <v-btn icon outlined @click="onRemoveStep">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
    <v-expand-transition>
      <div v-if="isExpanded" class="vishing-template-dialog-step__body"></div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import KButtonCheckbox from '@/components/Common/Checkbox/KButtonCheckbox'
export default {
  name: 'VishingTemplateDialogStep',
  components: { KButtonCheckbox },
  emits: ['removeStep'],
  props: {
    step: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    getTitle() {
      switch (this.step.type) {
        case 'textToSpeech':
          return `Step ${this.index} - Text To Speech`
        case 'uploadAudio':
          return `Step ${this.index} - Upload Audio`
        case 'pause':
          return `Step ${this.index} - Pause`
        default:
          return ''
      }
    }
  },
  data() {
    return {
      isExpanded: false,
      textToSpeech: '',
      uploadAudio: null,
      numberOfDigits: 0,
      pauseDuration: 0,
      isFailStep: false
    }
  },
  methods: {
    onToggleExpansion() {
      this.isExpanded = !this.isExpanded
    },
    onRemoveStep() {
      this.$emit('removeStep')
    }
  }
}
</script>
