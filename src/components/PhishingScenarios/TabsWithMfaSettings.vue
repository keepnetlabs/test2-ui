<template>
  <ElTabs v-model="landingPageTab" class="k-sub-tab mt-4">
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
            <span class="template-preview__text--body">{{ landingPageParams.name }}</span>
          </div>
          <div class="mt-2">
            <span class="template-preview__text--title">Phishing URL: </span>
            <span class="template-preview__text--body">{{ landingPageParams.urlTemplate }}</span>
          </div>
        </div>
        <hr class="mt-2" v-if="!!template.content" />
        <KEmailPreview v-if="!!template.content" :html="template.content" />
      </div>
    </ElTabPane>
    <ElTabPane v-if="isMethodMfa" label="MFA Settings" :name="`${landingPageTemplates.length + 1}`">
      <div class="template-preview mt-4 pt-0">
        <div v-if="!!landingPageParams.name" class="template-preview__text">
          <div>
            <span class="template-preview__text--title">Template Name: </span>
            <span class="template-preview__text--body">{{ landingPageParams.name }}</span>
          </div>
        </div>
        <hr class="mt-2" v-if="!!landingPageParams.name" />
        <div class="mt-6">
          <span class="template-preview__text--title">Sender Phone Number: </span>
          <span class="template-preview__text--body">{{
            landingPageParams.senderPhoneNumber
          }}</span>
        </div>
        <div class="mt-2">
          <span class="template-preview__text--title">Verification Message: </span>
          <span class="template-preview__text--body">{{
            landingPageParams.verificationMessage
          }}</span>
        </div>
      </div>
    </ElTabPane>
  </ElTabs>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import { SCENARIO_METHOD_TYPES } from './utils'

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
    }
  },
  data() {
    return {
      landingPageTab: '1'
    }
  },
  computed: {
    isMethodMfa() {
      return this.landingPageParams.method === SCENARIO_METHOD_TYPES.MFA
    }
  },
  watch: {
    landingPageTemplates() {
      this.landingPageTab = '1'
    }
  }
}
</script>
