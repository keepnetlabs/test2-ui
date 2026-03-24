<template>
  <div class="landing-page-template-preview" v-if="hasLandingPageTemplate">
    <div class="landing-page-template-preview__title">
      {{ templateName }}
      <VTooltip v-if="isAssistedByAI" bottom>
        <template #activator="{ on }">
          <span v-on="on">
            <VIcon color="#2196F3" small>mdi-creation</VIcon>
          </span>
        </template>
        <span>This template was generated with AI</span>
      </VTooltip>
    </div>
    <div class="landing-page-template-preview__container">
      <!-- Language Selection and Actions Header -->
      <div class="landing-page-template-preview__header" :class="{ 'justify-end': isQuishing }">
        <InputLanguagePreview
          v-if="!isQuishing"
          v-model="selectedLanguageId"
          :items="languageItems"
          :label="templateLanguageLabel"
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
          <VTooltip v-if="showEditButton" bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" icon outlined color="#2196F3" small @click="handleEdit">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit Template</span>
          </VTooltip>
          <VTooltip v-if="showDuplicateButton" bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" icon outlined color="#2196F3" small @click="handleDuplicate">
                <v-icon small>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Duplicate Template</span>
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
      <BrowserToolbar
        v-if="!!getCurrentLandingPageTemplate"
        :url="phishingUrl"
        :page-index="selectedLandingPageIndex"
        :show-toolbar="!!getCurrentLandingPageTemplate"
      />

      <div v-if="blacklistWarning" class="blacklist-preview-bar" :class="'blacklist-preview-bar--' + blacklistWarning.status">
        <VIcon x-small :color="blacklistWarning.status === 'malicious' ? '#f44336' : '#ff9800'">mdi-shield-alert</VIcon>
        <span class="blacklist-preview-bar__text">{{ blacklistWarning.reason }}</span>
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
import BrowserToolbar from '@/components/Common/Others/BrowserToolbar.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import labels from '../../model/constants/labels'
import { openHtmlInNewWindow } from '@/utils/functions'
import { getDomainBlacklistStatus } from '@/api/domainBlacklist'

export default {
  name: 'LandingPageTemplateModalPreview',
  components: { KEmailPreview, InputLanguagePreview, BrowserToolbar },
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
    },
    isQuishingProp: {
      type: Boolean,
      default: false
    },
    disableEdit: {
      type: Boolean,
      default: false
    },
    isOwner: {
      type: Boolean,
      default: undefined
    },
    isAssistedByAI: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      PREVIEW_DIALOG_TYPES,
      selectedLandingPageIndex: 0,
      selectedLanguageId: null,
      blacklistWarning: null
    }
  },
  mounted() {
    if (this.languages.length > 0 && !this.selectedLanguageId) {
      this.selectedLanguageId =
        this.languages[0].value || this.languages[0].languageTypeResourceId || this.languages[0].id
    }
    this.checkDomainBlacklist()
  },
  computed: {
    hasLandingPageTemplate() {
      return this?.landingPageTemplates?.length > 0
    },
    isPhishing() {
      return this.type.toLowerCase() === PREVIEW_DIALOG_TYPES.PHISHING.toLowerCase()
    },
    isQuishing() {
      return this.isQuishingProp || this.type === PREVIEW_DIALOG_TYPES.QUISHING
    },
    languageItems() {
      return this.languages.map((lang) => ({
        text: lang.text || lang.name || lang.languageName,
        value: lang.value || lang.id || lang.languageTypeResourceId
      }))
    },
    getCurrentLandingPageTemplate() {
      const currentPage = this?.landingPageTemplates[this.selectedLandingPageIndex]
      if (!currentPage) return null

      // Phishing durumunda ve languages objesi varsa, seçili dile göre content döndür
      if (this.isPhishing && currentPage.languages && this.selectedLanguageId) {
        return currentPage.languages[this.selectedLanguageId] || currentPage.content
      }

      // Diğer durumlar için eski mantık
      return currentPage.content
    },
    previewHtml() {
      const html = this.getCurrentLandingPageTemplate || ''
      if (this.isRedFlaggedTemplate && typeof html === 'string') {
        let logo =
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl || ''
        if (!logo) logo = this?.$store?.state?.whitelabel.mainLogoUrl || ''
        return html.replaceAll('{COMPANYLOGO}', logo)
      }
      return html
    },
    isRedFlaggedTemplate() {
      const html = this.getCurrentLandingPageTemplate || ''
      return typeof html === 'string' && html.includes('data-redflag')
    },
    templateLanguageLabel() {
      const count = this.languageItems.length
      return `Template Language${count > 1 ? 's' : ''} (${count})`
    },
    showEditButton() {
      return !this.isNested && !this.disableEdit && this.isOwner !== false
    },
    showDuplicateButton() {
      return !this.isNested && !this.disableEdit && this.isOwner === false
    }
  },
  watch: {
    languages(newVal) {
      if (newVal.length > 0 && !this.selectedLanguageId) {
        this.selectedLanguageId = newVal[0].value || newVal[0].languageTypeResourceId
      }
    },
    phishingUrl() {
      this.blacklistWarning = null
      this.checkDomainBlacklist()
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
    },
    handleDuplicate() {
      this.$emit('duplicate')
    },
    extractDomain(url) {
      if (!url) return null
      try {
        const fullUrl = url.startsWith('http') ? url : 'https://' + url
        return new URL(fullUrl).hostname.replace(/^www\./, '')
      } catch {
        return null
      }
    },
    checkDomainBlacklist() {
      const domain = this.extractDomain(this.phishingUrl)
      if (!domain) return
      getDomainBlacklistStatus(domain)
        .then((response) => {
          const data = response.data
          if (data.status === 'malicious' || data.status === 'suspicious') {
            this.blacklistWarning = { status: data.status, reason: data.reason }
          }
        })
        .catch(() => {})
    }
  }
}
</script>
