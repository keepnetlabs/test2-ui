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
          <VTooltip bottom>
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
import { getPreventClickScript } from '@/utils/preventClickScript'

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
         if(!logo) logo = this?.$store?.state?.whitelabel.mainLogoUrl || ''
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
      if (this.previewHtml) {
        let htmlContent = this.previewHtml
        // HTML'e title ekle veya varsa güncelle
        if (!htmlContent.includes('<title>')) {
          // <head> tag'i varsa title'ı oraya ekle
          if (htmlContent.includes('<head>')) {
            htmlContent = htmlContent.replace(
              '<head>',
              '<head><title>Landing Page Template Preview</title>'
            )
          } else if (htmlContent.includes('<html>')) {
            // <head> yoksa ama <html> varsa <head> oluştur
            htmlContent = htmlContent.replace(
              '<html>',
              '<html><head><title>Landing Page Template Preview</title></head>'
            )
          } else {
            // Hiçbiri yoksa başa ekle
            htmlContent = `<head><title>Landing Page Template Preview</title></head>${htmlContent}`
          }
        } else {
          // Title varsa güncelle
          htmlContent = htmlContent.replace(
            /<title>.*?<\/title>/i,
            '<title>Landing Page Template Preview</title>'
          )
        }

        // Prevent click script'i ekle
        const preventScript = getPreventClickScript()
        if (htmlContent.includes('</body>')) {
          htmlContent = htmlContent.replace('</body>', `${preventScript}</body>`)
        } else {
          htmlContent += preventScript
        }

        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => window.URL.revokeObjectURL(url), 100)
      }
    },
    handleEdit() {
      this.$emit('edit')
    }
  }
}
</script>
