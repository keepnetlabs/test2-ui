<template>
  <div :class="rootWrapperClass">
    <!-- Same vertical rhythm as TabsWithMfaSettingsMultipleLanguages when !readOnly: mb-2 + mt-n4 -->
    <div v-if="usePhishingLandingLayout" :class="['mb-2', 'mt-n4']">
      <span class="template-preview__text--body text-primary-color fs-4 fw-600">
        {{ landingPageParams.name }}
        <VTooltip v-if="landingPageParams.isAssistedByAI" bottom>
          <template #activator="{ on }">
            <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
          </template>
          <span>This template was generated with AI</span>
        </VTooltip>
      </span>
    </div>
    <!--
      usePhishingLandingLayout: card = optional open + hr + k-sub-tab; URL bar is BrowserToolbar inside each Page tab (MultipleLanguages parity).
    -->
    <div
      :style="
        usePhishingLandingLayout
          ? 'border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;'
          : 'display: contents;'
      "
    >
      <div
        v-if="!usePhishingLandingLayout"
        class="template-preview__text"
        :class="templateMetaBottomClass"
      >
        <div>
          <span
            class="template-preview__text--title"
            :style="isPhishingScenario ? { 'font-size': '16px', 'font-weight': '600' } : {}"
            >Template Name:
          </span>
          <span
            class="template-preview__text--body text-primary-color"
            :style="isPhishingScenario ? { 'font-size': '16px', 'font-weight': '400' } : {}"
            >{{ landingPageParams.name }}
            <VTooltip v-if="landingPageParams.isAssistedByAI" bottom>
              <template #activator="{ on }">
                <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
              </template>
              <span>This template was generated with AI</span>
            </VTooltip>
          </span>
        </div>
        <div
          v-if="showTemplateLanguageSwitcher"
          style="background: rgb(224, 224, 224); height: 1px; max-width: 554px;"
        ></div>
        <div
          v-if="showTemplateLanguageSwitcher"
          style="max-width: 554px; margin-top: 8px;"
        >
          <InputLanguagePreview
            v-model="languagePreview"
            persistent-hint
            class="max-w-554 tabs-with-mfa-settings__language-preview"
            :hint="templateLanguageHint"
            :items="selectedLanguages"
            :hide-details="false"
            @input="handleLanguageChange"
          />
        </div>
        <div
          class="d-flex align-start justify-space-between gap-2 tabs-with-mfa-settings__url-row"
        >
          <div class="flex-grow-1" style="min-width: 0;">
            <span
              class="template-preview__text--title"
              :style="isPhishingScenario ? { 'font-size': '16px', 'font-weight': '600' } : {}"
              >{{ getUrlTitle }}:
            </span>
            <span
              class="template-preview__text--body"
              :style="isPhishingScenario ? { 'font-size': '16px', 'font-weight': '400' } : {}"
              >{{ landingPageParams.urlTemplate }}
            </span>
          </div>
          <VTooltip v-if="showLandingUrlOpenButton && landingPageUrlForOpen" bottom>
            <template #activator="{ on }">
              <div v-on="on" class="flex-shrink-0">
                <VBtn
                  icon
                  outlined
                  color="#2196F3"
                  small
                  aria-label="Open in new tab"
                  @click="openLandingUrlInNewTab"
                >
                  <VIcon small>mdi-open-in-new</VIcon>
                </VBtn>
              </div>
            </template>
            <span>Open in New Tab</span>
          </VTooltip>
        </div>
      </div>
      <div v-else class="template-preview__text mb-0">
        <div
          v-if="showTemplateLanguageSwitcher"
          style="background: rgb(224, 224, 224); height: 1px; max-width: 554px;"
        ></div>
        <div
          v-if="showTemplateLanguageSwitcher"
          style="max-width: 554px; margin-top: 8px;"
        >
          <InputLanguagePreview
            v-model="languagePreview"
            persistent-hint
            class="max-w-554 tabs-with-mfa-settings__language-preview"
            :hint="templateLanguageHint"
            :items="selectedLanguages"
            :hide-details="false"
            @input="handleLanguageChange"
          />
        </div>
        <div
          v-if="showLandingUrlOpenButton && landingPageUrlForOpen"
          class="email-template-preview__header d-flex align-center justify-end mb-2"
        >
          <div class="email-template-preview__actions d-flex align-center gap-2">
            <VTooltip bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn
                    icon
                    outlined
                    color="#2196F3"
                    small
                    aria-label="Open in new tab"
                    @click="openLandingUrlInNewTab"
                  >
                    <VIcon small>mdi-open-in-new</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Open in New Tab</span>
            </VTooltip>
          </div>
        </div>
        <hr class="mb-3 ml-n4 mr-n4" />
      </div>
      <ElTabs v-model="landingPageTab" :class="innerElTabsClasses">
      <ElTabPane
        v-for="(template, index) in landingPageTemplates"
        :key="index"
        :label="`Page ${index + 1}`"
        :name="`${index + 1}`"
      >
        <div class="template-preview mt-4 pt-0">
          <hr
            v-if="!!getCurrentPageTemplate(template)"
            :class="usePhishingLandingLayout ? 'mt-4 ml-n4 mr-n4' : 'mt-4'"
          />
          <BrowserToolbar
            v-if="usePhishingLandingLayout && !!getCurrentPageTemplate(template)"
            :url="landingPageParams.urlTemplate || ''"
            :page-index="Number.parseInt(landingPageTab, 10) - 1"
            :show-toolbar="!!getCurrentPageTemplate(template)"
          />
          <div
            v-if="blocklistWarning"
            class="blocklist-preview-bar"
            :class="'blocklist-preview-bar--' + blocklistWarning.status"
          >
            <VIcon
              x-small
              :color="blocklistWarning.status === 'malicious' ? '#f44336' : '#ff9800'"
              >mdi-shield-alert</VIcon
            >
            <span class="blocklist-preview-bar__text">{{ blocklistWarningText }}</span>
            <a
              v-if="domainFixIcon"
              class="blocklist-hint__link blocklist-preview-bar__fix"
              :class="{ 'blocklist-hint__link--loading': domainFix.isLoading }"
              @click.prevent="fixDomain"
            >
              <VIcon
                small
                color="#2196f3"
                class="mr-1"
                :class="{ 'domain-suggest-icon--spin': domainFix.isLoading }"
                >{{ domainFixIcon }}</VIcon
              ><span class="blocklist-hint__link-label">Suggest clean domain</span>
            </a>
          </div>
          <div v-if="domainFixNote" class="domain-suggest-note">
            <VIcon v-if="domainFixNoteIcon" x-small color="#4caf50" class="mr-1">{{ domainFixNoteIcon }}</VIcon
            >{{ domainFixNote }}
          </div>
          <KEmailPreview
            v-if="!!getCurrentPageTemplate(template)"
            is-landing-page
            :html="getCurrentPageTemplate(template)"
            :is-red-flagged-template="checkIsRedFlaggedTemplate(getCurrentPageTemplate(template))"
          />
        </div>
      </ElTabPane>
      <ElTabPane
        v-if="isMethodMfa && isPhishingScenario"
        label="MFA Settings"
        :name="`${landingPageTemplates.length + 1}`"
      >
        <div class="template-preview mt-4 pt-0">
          <div class="mt-6">
            <span class="template-preview__text--title">Sender Phone Number: </span>
            <span class="template-preview__text--body">{{
              landingPageParams.mfaSmsSenderNumber
            }}</span>
          </div>
          <div class="mt-2">
            <span class="template-preview__text--title">Verification Message: </span>
            <span class="template-preview__text--body">{{
              landingPageParams.mfaTextTemplate
            }}</span>
          </div>
        </div>
      </ElTabPane>
      <ElTabPane
        v-if="isMethodMfa && !isPhishingScenario"
        label="MFA Settings Info"
        :name="`${landingPageTemplates.length + 1}`"
      >
        <div class="template-preview mt-6 pl-6 pt-0">
          <h3 style="color: #383b41; font-size: 18px; font-weight: 600;">
            Multi-Factor Authentication Info
          </h3>
          <div class="mt-6">
            <span class="template-preview__text--title" style="font-size: 14px; font-weight: 600;"
              >Sender Phone Number:
            </span>
            <span
              class="template-preview__text--body"
              style="font-size: 14px; color: #383b41; font-weight: 400;"
              >{{ landingPageParams.mfaSmsSenderNumber }}</span
            >
          </div>
          <div class="mt-2">
            <span class="template-preview__text--title" style="font-size: 14px; font-weight: 600;"
              >Verification Message:
            </span>
            <span
              class="template-preview__text--body"
              style="font-size: 14px; color: #383b41; font-weight: 400;"
              >{{ landingPageParams.mfaTextTemplate }}</span
            >
          </div>
          <div
            class="mt-6 mr-6 d-flex align-center"
            style="padding: 18px; background: #f1f8fe; border-radius: 8px;"
          >
            <VIcon color="#2196f3">mdi-information</VIcon>
            <span class="ml-2" style="color: #383b41;"
              >Scenarios created with MFA method can be edited from the
              {{ getTextOfScenariosPage }} scenarios page.</span
            >
          </div>
        </div>
      </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import BrowserToolbar from '@/components/Common/Others/BrowserToolbar.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getDomainBlocklistStatus } from '@/api/domainBlocklist'
import domainTemplateFix from '@/mixins/domainTemplateFix'
import { buildContentText } from '@/utils/randomDomain'
export default {
  name: 'TabsWithMfaSettings',
  components: { KEmailPreview, InputLanguagePreview, BrowserToolbar },
  mixins: [domainTemplateFix],
  props: {
    landingPageTemplates: {
      type: Array,
      default: () => []
    },
    landingPageParams: {
      type: Object,
      default: () => ({})
    },
    isMethodMfa: {
      type: Boolean,
      default: false
    },
    isSubTab: {
      type: Boolean,
      default: true
    },
    isPhishingScenario: {
      type: Boolean,
      default: true
    },
    isSmishing: {
      type: Boolean,
      default: false
    },
    /** Smishing/CommonSimulator-style drawer: align with parent ElTabs */
    flushDrawerAlign: {
      type: Boolean,
      default: false
    },
    /**
     * Opt-in only: Smishing scenario/campaign preview matches CommonSimulator (MultipleLanguages + BrowserToolbar).
     * Phishing list preview uses TabsWithMfaSettingsMultipleLanguages elsewhere — do not set this on Phishing/Quishing campaign UIs.
     */
    previewLayout: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'simulator'].includes(v)
    },
    /** Smishing scenario preview drawer: show mdi-open-in-new next to landing URL (parity with CommonSimulator landing tab) */
    showLandingUrlOpenButton: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING
    },
    selectedLanguages: {
      type: Array,
      default: () => []
    },
    languagePreview: {
      type: String,
      default: ''
    },
    /**
     * Opt-in: show the "fix domain" wand inside the blocklist warning. Enable only in
     * editable scenario/campaign-builder contexts — NOT in sent-campaign report previews,
     * since fixing updates the landing page template globally.
     */
    canFixDomain: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      landingPageTab: '1',
      internalLanguagePreview: '',
      blocklistWarning: null
    }
  },
  computed: {
    isBlocklistCheckEnabled() {
      // Smishing scenario previews opt in via `is-smishing` (additive — phishing path unchanged).
      if (this.isSmishing) return true
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING && this.isPhishingScenario
    },
    // Route the domain fix to the right simulator's landing-page API.
    domainFixChannel() {
      if (this.isSmishing) return 'smishing'
      if (this.type === PREVIEW_DIALOG_TYPES.QUISHING) return 'quishing'
      return 'phishing'
    },
    /** Smishing-only: must pass preview-layout="simulator". Never true for PhishingScenarioPreview / campaign wizards (default layout). */
    usePhishingLandingLayout() {
      return this.previewLayout === 'simulator'
    },
    /** Drawer margin alignment: Smishing passes flush + simulator together; unrelated screens stay ml-2. */
    rootWrapperClass() {
      const drawerFlush =
        this.flushDrawerAlign === true || this.previewLayout === 'simulator'
      return drawerFlush ? 'tabs-with-mfa-settings--drawer-flush' : 'ml-2'
    },
    templateMetaBottomClass() {
      return this.usePhishingLandingLayout ? 'mb-0' : 'mb-4'
    },
    /** Hidden for Smishing until multi-language UX is ready (same intent as Quishing in modal preview). */
    showTemplateLanguageSwitcher() {
      return (
        this.selectedLanguages &&
        this.selectedLanguages.length > 1 &&
        !this.isSmishing
      )
    },
    innerElTabsClasses() {
      const classes = []
      if (this.isSubTab) classes.push('k-sub-tab')
      // Match TabsWithMfaSettingsMultipleLanguages (mt-4 on k-sub-tab)
      classes.push('mt-4')
      return classes
    },
    getUrlTitle() {
      if (this.isSmishing) return 'Smishing URL'
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING ? 'Phishing URL' : 'Quishing URL'
    },
    getTextOfScenariosPage() {
      if (this.isSmishing) return 'Smishing'
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING ? 'Phishing' : 'Quishing'
    },
    templateLanguageLabel() {
      const count = this.selectedLanguages.length
      return `Template Language${count > 1 ? 's' : ''} (${count})`
    },
    templateLanguageHint() {
      const count = this.selectedLanguages.length
      return `This template is available in ${count} language${count > 1 ? 's' : ''}.`
    },
    currentLanguagePreview() {
      return this.languagePreview || this.internalLanguagePreview
    },
    landingPageUrlForOpen() {
      const u = this.landingPageParams?.urlTemplate
      return typeof u === 'string' && u.trim() ? u.trim() : ''
    },
    blocklistWarningText() {
      if (!this.blocklistWarning) return ''
      const reason = this.blocklistWarning.reason
      const prefix = reason ? `${reason} ` : ''
      return `${prefix}Please use a clean domain before sending.`
    },
    // --- domainTemplateFix wand (overrides the mixin's stubs) ---
    domainFixResourceId() {
      if (!this.canFixDomain || !this.isBlocklistCheckEnabled) return null
      return this.landingPageParams?.resourceId || null
    },
    domainFixContentText() {
      const pages = (this.landingPageTemplates || []).map((t) => ({
        content: this.getCurrentPageTemplate(t)
      }))
      return buildContentText({
        name: this.landingPageParams?.name,
        description: this.landingPageParams?.description,
        landingPages: pages
      })
    },
    domainFixLanguage() {
      const cur = this.currentLanguagePreview
      const match = (this.selectedLanguages || []).find(
        (l) => String(l.value || l.id || l.languageTypeResourceId) === String(cur)
      )
      return (match && (match.text || match.name || match.languageName)) || ''
    }
  },
  watch: {
    landingPageTemplates() {
      this.landingPageTab = '1'
    },
    languagePreview(newVal) {
      this.internalLanguagePreview = newVal
    },
    selectedLanguages: {
      handler(newVal) {
        if (newVal.length > 0 && !this.currentLanguagePreview) {
          this.internalLanguagePreview =
            newVal[0].value || newVal[0].id || newVal[0].languageTypeResourceId
        }
      },
      immediate: true
    },
    'landingPageParams.urlTemplate'() {
      this.blocklistWarning = null
      this.checkDomainBlocklist()
    }
  },
  mounted() {
    if (this.selectedLanguages.length > 0 && !this.currentLanguagePreview) {
      this.internalLanguagePreview =
        this.selectedLanguages[0].value ||
        this.selectedLanguages[0].id ||
        this.selectedLanguages[0].languageTypeResourceId
    }
    this.checkDomainBlocklist()
  },
  methods: {
    checkIsRedFlaggedTemplate(html) {
      return typeof html === 'string' && html.includes('data-redflag')
    },
    getCurrentPageTemplate(template) {
      // If template has languages object and languagePreview is set, get content for that language
      if (
        this.currentLanguagePreview &&
        template.languages &&
        template.languages[this.currentLanguagePreview]
      ) {
        return template.languages[this.currentLanguagePreview]
      }

      // Fallback to current template's content (main language)
      if (template.content) return template.content

      // If no content found, try to get first available language content
      if (template.languages && Object.keys(template.languages).length > 0) {
        const firstLanguageId = Object.keys(template.languages)[0]
        return template.languages[firstLanguageId]
      }

      return ''
    },
    handleLanguageChange(languageId) {
      this.internalLanguagePreview = languageId
      this.$emit('language-change', languageId)
    },
    openLandingUrlInNewTab() {
      const url = this.landingPageUrlForOpen
      if (!url) return
      try {
        window.open(url, '_blank', 'noopener,noreferrer')
      } catch {
        window.open(url, '_blank')
      }
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
    checkDomainBlocklist() {
      if (!this.isBlocklistCheckEnabled) return
      const domain = this.extractDomain(this.landingPageParams?.urlTemplate)
      if (!domain) return
      return getDomainBlocklistStatus(domain)
        .then((response) => {
          const data = response.data
          if (data.status === 'malicious' || data.status === 'suspicious') {
            this.blocklistWarning = { status: data.status, reason: data.reason }
          }
        })
        .catch(() => {})
    },
    refreshAfterDomainFix(info = {}) {
      // The template's domain was updated globally. Clear the stale warning and hand the
      // rebuilt URL up so the parent (which owns landingPageParams) can refresh the preview.
      this.blocklistWarning = null
      this.$emit('domain-fixed', info)
    }
  }
}
</script>
