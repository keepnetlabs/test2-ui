<template>
  <div>
    <div class="mb-2 mt-n4">
      <span class="template-preview__text--body text-primary-color fs-4 fw-600"
        >{{ landingPageParams.name }}
        <VTooltip v-if="landingPageParams.isAssistedByAI" bottom>
          <template #activator="{ on }">
            <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
          </template>
          <span>This template was generated with AI</span>
        </VTooltip>
      </span>
    </div>
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
      <div v-if="isPhishingScenario">
        <div
          class="email-template-preview__header d-flex align-center mb-4"
          :class="{
            'justify-end': isQuishing,
            'justify-space-between': isPhishing
          }"
        >
          <InputLanguagePreview
            v-if="!isQuishing"
            :value="languagePreview"
            :items="selectedLanguages"
            :label="`Template Language (${selectedLanguages.length})`"
            class="email-template-preview__language-select"
            style="max-width: 320px;"
            hide-details
            @input="handleLanguageChange"
          />
          <div class="email-template-preview__actions d-flex align-center gap-2">
            <VTooltip bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small @click="handleExternalLink">
                    <VIcon small>mdi-open-in-new</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Open in New Tab</span>
            </VTooltip>
            <VTooltip v-if="false" bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small @click="handleEdit">
                    <VIcon small>mdi-pencil</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Edit Template</span>
            </VTooltip>
          </div>
        </div>
        <hr class="mb-3 ml-n4 mr-n4" />
      </div>

      <ElTabs v-model="landingPageTab" :class="[isSubTab ? 'k-sub-tab' : '', 'mt-4']">
        <ElTabPane
          v-for="(template, index) in landingPageTemplates"
          :key="index"
          :label="`Page ${index + 1}`"
          :name="`${index + 1}`"
        >
          <div class="template-preview mt-4 pt-0">
            <hr class="mt-4 ml-n4 mr-n4" v-if="!!template.content" />
            <BrowserToolbar
              v-if="!!getCurrentLandingPageTemplate && isPhishingScenario"
              :url="phishingUrl"
              :page-index="parseInt(landingPageTab) - 1"
              :show-toolbar="!!getCurrentLandingPageTemplate"
            />
            <KEmailPreview
              v-if="!!template.content"
              is-landing-page
              :html="template.content"
              :is-red-flagged-template="checkIsRedFlaggedTemplate(template.content)"
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
import { openHtmlInNewWindow } from '@/utils/functions'
export default {
  name: 'TabsWithMfaSettingsMultipleLanguages',
  components: { KEmailPreview, InputLanguagePreview, BrowserToolbar },
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
    languages: {
      type: Array,
      default: () => []
    },
    phishingUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      landingPageTab: '1',
      languagePreview: ''
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
    isQuishing() {
      return this.type === PREVIEW_DIALOG_TYPES.QUISHING
    },
    isPhishing() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
    },
    selectedLanguages() {
      if (this.landingPageParams?.languages?.length) {
        return this.landingPageParams.languages
      }
      return this.languages
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates[this.landingPageTab - 1]?.content
    }
  },
  watch: {
    landingPageTemplates() {
      this.landingPageTab = '1'
    },
    selectedLanguages(newVal) {
      if (newVal.length > 0 && !this.languagePreview) {
        this.languagePreview = newVal[0].value || newVal[0].id || newVal[0].languageTypeResourceId
      }
    },
    landingPageParams: {
      handler() {
        this.$nextTick(() => {
          this.initializeLanguagePreview()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.initializeLanguagePreview()
  },
  methods: {
    initializeLanguagePreview() {
      if (this.selectedLanguages.length > 0 && !this.languagePreview) {
        this.languagePreview =
          this.selectedLanguages[0].value ||
          this.selectedLanguages[0].id ||
          this.selectedLanguages[0].languageTypeResourceId
      }
    },
    checkIsRedFlaggedTemplate(html) {
      return typeof html === 'string' && html.includes('data-redflag')
    },
    handleExternalLink() {
      const currentTemplate = this.landingPageTemplates[this.landingPageTab - 1]
      if (currentTemplate && currentTemplate.content) {
        openHtmlInNewWindow(currentTemplate.content)
      }
    },
    handleEdit() {
      this.$emit('on-edit')
    },
    handleLanguageChange(languageId) {
      this.languagePreview = languageId
    }
  }
}
</script>
