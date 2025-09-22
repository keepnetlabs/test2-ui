<template>
  <ElTabs v-model="landingPageTab" :class="[isSubTab ? 'k-sub-tab' : '', 'mt-4']">
    <ElTabPane
      v-for="(template, index) in landingPageTemplates"
      :key="index"
      :label="`Page ${index + 1}`"
      :name="`${index + 1}`"
    >
      <div class="template-preview mt-4 pt-0">
        <div class="template-preview__text">
          <div>
            <span class="template-preview__text--title">Template Name: </span>
            <span class="template-preview__text--body"
              >{{ landingPageParams.name }}
              <VTooltip v-if="landingPageParams.isAssistedByAI" bottom>
                <template #activator="{ on }">
                  <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
                </template>
                <span>This template was generated with AI</span>
              </VTooltip>
            </span>
          </div>
          <div>
            <span class="template-preview__text--title">{{ getUrlTitle }}: </span>
            <span class="template-preview__text--body">{{ landingPageParams.urlTemplate }}</span>
          </div>
        </div>
        <hr class="mt-4" v-if="!!template.content" />
        <KEmailPreview v-if="!!template.content" :html="template.content" is-landing-page />
      </div>
    </ElTabPane>
    <ElTabPane
      v-if="isMethodMfa && isPhishingScenario"
      label="MFA Settings"
      :name="`${landingPageTemplates.length + 1}`"
    >
      <div class="template-preview mt-4 pt-0">
        <div v-if="!!landingPageParams.name" class="template-preview__text">
          <div>
            <span class="template-preview__text--title">Template Name: </span>
            <span class="template-preview__text--body"
              >{{ landingPageParams.name }}
              <VTooltip v-if="landingPageParams.isAssistedByAI" bottom>
                <template #activator="{ on }">
                  <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
                </template>
                <span>This template was generated with AI</span>
              </VTooltip>
            </span>
          </div>
        </div>
        <hr class="mt-2" v-if="!!landingPageParams.name" />
        <div class="mt-6">
          <span class="template-preview__text--title">Sender Phone Number: </span>
          <span class="template-preview__text--body">{{
            landingPageParams.mfaSmsSenderNumber
          }}</span>
        </div>
        <div class="mt-2">
          <span class="template-preview__text--title">Verification Message: </span>
          <span class="template-preview__text--body">{{ landingPageParams.mfaTextTemplate }}</span>
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
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
export default {
  name: 'TabsWithMfaSettings',
  components: { KEmailPreview },
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
    }
  },
  data() {
    return {
      landingPageTab: '1'
    }
  },
  computed: {
    getUrlTitle() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING ? 'Phishing URL' : 'Quishing URL'
    },
    getTextOfScenariosPage() {
      if (this.isSmishing) return 'Smishing'
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING ? 'Phishing' : 'Quishing'
    }
  },
  watch: {
    landingPageTemplates() {
      this.landingPageTab = '1'
    }
  }
}
</script>
