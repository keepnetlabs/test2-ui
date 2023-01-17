<template>
  <div class="landing-page-template-preview">
    <div class="landing-page-template-preview__text">
      <div>
        <span class="landing-page-template-preview__text--title">Training Name: </span>
        <span class="landing-page-template-preview__text--body">{{ name }}</span>
      </div>
      <div class="landing-page-template-preview__control-buttons">
        <v-btn class="mr-2" icon :disabled="!hasPrevious" @click="handlePreviousTemplate">
          <v-icon> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn icon :disabled="!hasNext" @click="handleNextTemplate">
          <v-icon> mdi-chevron-right </v-icon>
        </v-btn>
      </div>
    </div>
    <div>
      <span class="landing-page-template-preview__text--title">Language: </span>
      <span class="landing-page-template-preview__text--body">{{
        languages[activePage].name
      }}</span>
    </div>
    <iframe
      v-if="activeTemplate"
      :key="iframeKey"
      title="Training Preview"
      allowfullscreen
      :src="activeTemplate"
      style="min-width: 1200px; min-height: 900px; border-width: 0;"
    ></iframe>
  </div>
</template>

<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingPreview',
  props: {
    name: {
      type: String
    },
    languages: {
      type: Array
    },
    trainingId: {
      type: String
    },
    isLoading: {
      type: Boolean
    }
  },
  data() {
    return {
      activePage: 0,
      activeTemplate: null,
      srcs: [],
      iframeKey: `key-${Math.random().toString()}`
    }
  },
  computed: {
    hasPrevious() {
      return this.activePage > 0
    },
    hasNext() {
      return this.languages.length - 1 > this.activePage
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handlePreviousTemplate() {
      this.activePage--
      this.callForData()
    },
    handleNextTemplate() {
      this.activePage++
      this.callForData()
    },
    callForData() {
      if (this.srcs[this.activePage]) {
        this.activeTemplate = this.srcs[this.activePage]
        return
      }
      this.$emit('update:isLoading', true)
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.trainingId,
        this.languages[this.activePage].id
      )
        .then((response) => {
          const {
            data: { data }
          } = response
          this.srcs[
            this.activePage
          ] = `${data.scormPlayerUrl}?isPreview=true&scoAddress=${data.trainingUrl}`
          this.activeTemplate = this.srcs[this.activePage]
          this.iframeKey = `key-${Math.random().toString()}`
        })
        .finally(() => {
          this.$emit('update:isLoading', false)
        })
    }
  }
}
</script>
