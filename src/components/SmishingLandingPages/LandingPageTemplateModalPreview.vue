<template>
  <div class="landing-page-template-preview" v-if="hasLandingPageTemplate">
    <div class="landing-page-template-preview__text">
      <div>
        <div class="mb-1">
          <span class="template-preview__text--title">Template Name: </span>
          <span class="template-preview__text--body">{{ templateName }}</span>
        </div>
        <div>
          <span class="template-preview__text--title">Phishing URL: </span>
          <span class="template-preview__text--body">{{ phishingUrl }}</span>
        </div>
      </div>
      <div class="landing-page-template-preview__control-buttons">
        <v-btn class="mr-2" icon :disabled="!hasPreviousTemplate" @click="handlePreviousTemplate">
          <v-icon> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn icon :disabled="!hasNextTemplate" @click="handleNextTemplate">
          <v-icon> mdi-chevron-right </v-icon>
        </v-btn>
      </div>
    </div>
    <hr class="mt-2" v-if="!!getCurrentLandingPageTemplate" />
    <KEmailPreview
      v-if="!!getCurrentLandingPageTemplate"
      ref="refPreview"
      :html="getCurrentLandingPageTemplate"
    />
  </div>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'

export default {
  name: 'LandingPageTemplateModalPreview',
  components: { KEmailPreview },
  props: {
    templateName: {
      type: String,
      default: ''
    },
    landingPageTemplates: {
      type: Array,
      default() {
        return []
      }
    },
    phishingUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedLandingPageIndex: 0
    }
  },
  computed: {
    hasLandingPageTemplate() {
      return this?.landingPageTemplates?.length > 0
    },
    getCurrentLandingPageTemplate() {
      return this?.landingPageTemplates[this.selectedLandingPageIndex]?.content
    },
    hasNextTemplate() {
      return this?.landingPageTemplates?.length - 1 > this.selectedLandingPageIndex
    },
    hasPreviousTemplate() {
      return this.selectedLandingPageIndex > 0
    }
  },
  methods: {
    handlePreviousTemplate() {
      this.selectedLandingPageIndex--
    },
    handleNextTemplate() {
      this.selectedLandingPageIndex++
    }
  }
}
</script>
