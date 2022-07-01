<template>
  <div class="landing-page-template-preview pt-3">
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
    <hr class="mt-2" v-if="!!getCurrentTemplate" />
    <KEmailPreview v-if="!!getCurrentTemplate" ref="refPreview" :html="getCurrentTemplate" />
  </div>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'TrainingPreview',
  components: { KEmailPreview },
  props: {
    name: {
      type: String
    },
    templates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activePage: 0
    }
  },
  computed: {
    hasPrevious() {
      return this.activePage > 0
    },
    hasNext() {
      return this.templates.length - 1 > this.activePage
    },
    getCurrentTemplate() {
      return this.templates[this.activePage]?.content
    }
  },
  methods: {
    handlePreviousTemplate() {
      this.activePage--
    },
    handleNextTemplate() {
      this.activePage++
    }
  }
}
</script>
