<template>
  <div class="landing-page-template-preview" v-if="hasLandingPageTemplate">
    <div class="landing-page-template-preview__title">
      {{ templateName }}
    </div>
    <div class="landing-page-template-preview__container">
      <!-- Language Selection and Actions Header -->
      <div class="landing-page-template-preview__header">
        <InputLanguagePreview
          v-model="selectedLanguageId"
          :items="languageItems"
          :label="`Template Language (${languageItems.length})`"
          class="landing-page-template-preview__language-select"
          hide-details
          @input="handleLanguageChange"
        />
        <div class="landing-page-template-preview__actions">
          <VTooltip bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" icon outlined color="#2196F3" small @click="handleExternalLink">
                <v-icon small>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <span>Open in New Tab</span>
          </VTooltip>
          <VTooltip v-if="!isNested" bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" icon outlined color="#2196F3" small @click="handleEdit">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit Template</span>
          </VTooltip>
        </div>
      </div>
      <hr class="mt-4 ml-n4 mr-n4" v-if="!!getCurrentLandingPageTemplate" />
      <template v-if="landingPageTemplates.length > 1">
        <v-tabs
          v-model="selectedLandingPageIndex"
          background-color="transparent"
          color="#2196F3"
          class="landing-page-template-preview__tabs k-sub-tab"
        >
          <v-tab v-for="(page, index) in landingPageTemplates" :key="index">
            Page {{ index + 1 }}
          </v-tab>
        </v-tabs>
        <hr class="ml-n4 mr-n4" />
      </template>
      <!-- Safari Browser Toolbar -->
      <div v-if="!!getCurrentLandingPageTemplate" class="browser-toolbar">
        <div class="browser-toolbar__controls">
          <span class="browser-toolbar__dot browser-toolbar__dot--red"></span>
          <span class="browser-toolbar__dot browser-toolbar__dot--yellow"></span>
          <span class="browser-toolbar__dot browser-toolbar__dot--green"></span>
        </div>
        <div class="browser-toolbar__url-bar">
          <span class="browser-toolbar__url-text">{{ phishingUrl }}</span>
        </div>
      </div>

      <KEmailPreview
        v-if="!!getCurrentLandingPageTemplate"
        ref="refPreview"
        :html="previewHtml"
        :is-landing-page="type === PREVIEW_DIALOG_TYPES.PHISHING"
        :is-red-flagged-template="isRedFlaggedTemplate"
      />
    </div>
  </div>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import labels from '../../model/constants/labels'
import { openHtmlInNewWindow } from '@/utils/functions'

export default {
  name: 'LandingPageTemplateModalPreview',
  components: { KEmailPreview, InputLanguagePreview },
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
    languages: {
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
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      PREVIEW_DIALOG_TYPES,
      selectedLandingPageIndex: 0,
      selectedLanguageId: null
    }
  },
  computed: {
    hasLandingPageTemplate() {
      return this?.landingPageTemplates?.length > 0
    },
    languageItems() {
      return this.languages.map((lang) => ({
        text: lang.text || lang.name || lang.languageName,
        value: lang.value || lang.id || lang.languageTypeResourceId
      }))
    },
    getCurrentLandingPageTemplate() {
      return this?.landingPageTemplates[this.selectedLandingPageIndex]?.content
    },
    previewHtml() {
      const html = this.getCurrentLandingPageTemplate || ''
      if (this.isRedFlaggedTemplate && typeof html === 'string') {
        let logo =
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl || ''
        if (!logo) logo = this?.$store?.state?.whitelabel.mainLogoUrl || ''
        return html.replace(/\{COMPANYLOGO\}/g, logo)
      }
      return html
    },
    isRedFlaggedTemplate() {
      const html = this.getCurrentLandingPageTemplate || ''
      return typeof html === 'string' && html.includes('data-redflag')
    }
  },
  watch: {
    languages(newVal) {
      if (newVal.length > 0) {
        this.selectedLanguageId = newVal[0].value
      }
    }
  },
  methods: {
    handleLanguageChange(languageId) {
      this.$emit('language-change', languageId)
    },
    handleExternalLink() {
      openHtmlInNewWindow(this.previewHtml)
    },
    handleEdit() {
      this.$emit('edit')
    }
  }
}
</script>
