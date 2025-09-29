<template>
  <div class="landing-page-template-preview" v-if="hasLandingPageTemplate">
    <div class="landing-page-template-preview__text">
      <div>
        <div>
          <span class="template-preview__text--title"
            >{{ type === PREVIEW_DIALOG_TYPES.PHISHING ? labels.Phishing : labels.Quishing }}
            URL:
          </span>
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
    <hr class="mt-6" v-if="!!getCurrentLandingPageTemplate" />
    <KEmailPreview
      v-if="!!getCurrentLandingPageTemplate"
      ref="refPreview"
      :html="previewHtml"
      :is-landing-page="type === PREVIEW_DIALOG_TYPES.PHISHING"
      :is-red-flagged-template="isRedFlaggedTemplate"
    />
  </div>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import labels from '../../model/constants/labels'

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
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING
    }
  },
  data() {
    return {
      labels,
      PREVIEW_DIALOG_TYPES,
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
    previewHtml() {
      const html = this.getCurrentLandingPageTemplate || ''
      if (this.isRedFlaggedTemplate && typeof html === 'string') {
        const logo = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''
        return html.replace(/\{COMPANYLOGO\}/g, logo)
      }
      return html
    },
    isRedFlaggedTemplate() {
      const html = this.getCurrentLandingPageTemplate || ''
      return typeof html === 'string' && html.includes('data-redflag')
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
