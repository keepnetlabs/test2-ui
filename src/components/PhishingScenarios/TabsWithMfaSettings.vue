<template>
  <div class="ml-2">
    <div class="template-preview__text mb-4">
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
        v-if="selectedLanguages && selectedLanguages.length > 1"
        style="background: rgb(224, 224, 224); height: 1px; max-width: 554px;"
      ></div>
      <div
        v-if="selectedLanguages && selectedLanguages.length > 1"
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
      <div>
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
    </div>
    <ElTabs v-model="landingPageTab" :class="[isSubTab ? 'k-sub-tab' : '', 'mt-4']">
      <ElTabPane
        v-for="(template, index) in landingPageTemplates"
        :key="index"
        :label="`Page ${index + 1}`"
        :name="`${index + 1}`"
      >
        <div class="template-preview mt-4 pt-0">
          <hr class="mt-4" v-if="!!getCurrentPageTemplate(template)" />
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
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
export default {
  name: 'TabsWithMfaSettings',
  components: { KEmailPreview, InputLanguagePreview },
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
    }
  },
  data() {
    return {
      landingPageTab: '1',
      internalLanguagePreview: ''
    }
  },
  computed: {
    getUrlTitle() {
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
    }
  },
  mounted() {
    if (this.selectedLanguages.length > 0 && !this.currentLanguagePreview) {
      this.internalLanguagePreview =
        this.selectedLanguages[0].value ||
        this.selectedLanguages[0].id ||
        this.selectedLanguages[0].languageTypeResourceId
    }
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
    }
  }
}
</script>
