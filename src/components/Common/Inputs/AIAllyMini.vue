<template>
  <div class="ai-ally-mini">
    <div class="ai-ally-mini__container">
      <div class="ai-ally-mini__controls">
        <div class="ai-ally-mini__textarea-wrapper">
          <VTextarea
            v-model="aiTemplateText"
            class="ai-ally-mini__textarea"
            id="ai-ally-mini__textarea"
            outlined
            dense
            no-resize
            auto-grow
            hide-details
            persistent-hint
            :rows="1"
            :min-height="98"
            :readonly="isEmailGenerating"
            :rules="aiTemplateTextRules"
            :placeholder="getAITemplateTextAreaPlaceholder"
          >
            <template #append>
              <div class="ai-ally-mini__textarea-footer">
                <div
                  class="ai-ally-mini__char-count"
                  :style="aiTemplateText.length > 500 ? { color: '#B83A3A', opacity: '1' } : ''"
                >
                  <VTooltip v-if="aiTemplateText.length > 500" bottom max-width="300">
                    <template #activator="{ on }">
                      <VIcon style="font-size: 20px;" v-on="on" color="#B83A3A" small
                        >mdi-information</VIcon
                      >
                    </template>
                    <span
                      >Description cannot exceed the 500 character limit. Please shorten
                      description.</span
                    >
                  </VTooltip>
                  {{ aiTemplateText.length }} / 500 characters
                </div>
              </div>
            </template>
          </VTextarea>
          <div
            class="ai-ally-mini__suggestions-wrapper"
            :class="{
              'ai-ally-mini__suggestions-wrapper--generating': isEmailGenerating
            }"
          >
            <VMenu v-model="suggestionsMenuOpen" bottom offset-y :close-on-content-click="true">
              <template #activator="{ on, attrs }">
                <VBtn
                  v-bind="attrs"
                  v-on="on"
                  class="ai-ally-mini__suggestions-btn"
                  height="24px"
                  min-width="120px"
                  depressed
                >
                  <span class="ai-ally-mini__suggestions-btn-text">Suggestions</span>
                  <VIcon class="ml-1" size="16" color="#fff">mdi-menu-down</VIcon>
                </VBtn>
              </template>
              <VList dense>
                <VListItem
                  v-for="(badge, index) in landingPageBadgeContents"
                  :key="index"
                  @click="handleSuggestionClick(index)"
                >
                  <VListItemTitle>{{ badge.title }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
            <KSelect
              v-model="formatType"
              class="ai-ally-mini__format-select"
              :class="{
                'ai-ally-mini__format-select--generating': isEmailGenerating
              }"
              outlined
              dense
              hide-details
              :items="formatOptions"
              item-text="text"
              item-value="value"
              placeholder="Format"
              :menu-props="{ offsetY: true }"
              :slots="{ selection: true }"
              @input="handleFormatChange"
            >
              <template #selection="{ item }">
                <span class="ai-ally-mini__format-selection">
                  Format:
                  <span class="ai-ally-mini__format-value">{{
                    (item && item.text) || getSelectedFormatText
                  }}</span>
                </span>
              </template>
            </KSelect>
          </div>
          <div class="ai-ally-mini__generate-wrapper">
            <VTooltip v-if="isShowRedFlags" bottom max-width="142">
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn
                    class="ai-ally-mini__generate-btn"
                    :class="{
                      'ai-ally-mini__generate-btn--generating': isEmailGenerating
                    }"
                    color="#2196F3"
                    :style="getGenerateEmailButtonStyle"
                    @click="handleGenerateEmail"
                  >
                    <VIcon class="mr-1" color="#fff">mdi-creation</VIcon>
                    {{ isEmailGenerating ? 'Generating...' : 'Generate' }}
                  </VBtn>
                </div>
              </template>
              <span>To use this action, first hide the Red Flag.</span>
            </VTooltip>
            <VBtn
              v-else
              class="ai-ally-mini__generate-btn"
              :class="{
                'ai-ally-mini__generate-btn--generating': isEmailGenerating
              }"
              color="#2196F3"
              :style="getGenerateEmailButtonStyle"
              @click="handleGenerateEmail"
            >
              <VIcon class="mr-1" color="#fff" small>mdi-creation</VIcon>
              {{ isEmailGenerating ? 'Generating...' : 'Generate' }}
            </VBtn>
          </div>
        </div>
      </div>
      <div class="ai-ally-mini__footer-info">
        <span class="ai-ally-mini__method-text">
          Selected template method is
          <span class="fw-600">{{ selectedMethod }}</span>
        </span>
        <span class="ai-ally-mini__feedback-link cursor-pointer" @click="handleFeedbackClick">
          Give us feedback!
        </span>
      </div>
      <div
        v-if="generatedTemplates.length > 1"
        :class="['d-flex mt-2 items-center justify-space-between']"
      >
        <div class="d-flex align-center">
          <VIcon
            class="cursor-pointer"
            color="#757575"
            :disabled="activeGeneratedTemplateIndex < 1"
            @click="setActiveGeneratedTemplate(activeGeneratedTemplateIndex - 1)"
            >mdi-chevron-left</VIcon
          >
          <VIcon
            class="ml-1 cursor-pointer"
            color="#757575"
            :disabled="activeGeneratedTemplateIndex === generatedTemplates.length - 1"
            @click="setActiveGeneratedTemplate(activeGeneratedTemplateIndex + 1)"
            >mdi-chevron-right</VIcon
          >
          <span class="ai-ally-mini__template-count ml-2"
            >Generated landing page {{ activeGeneratedTemplateIndex + 1 }} of
            {{ generatedTemplates.length }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import {
  generateAILandingPageTemplate,
  getGeneratedAILandingPageTemplate
} from '@/api/phishingsimulator'
import { mapActions } from 'vuex'

export default {
  name: 'AIAllyMini',
  components: {
    KSelect
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    languageTypeResourceId: {
      type: [Number, String],
      default: null
    },
    languageOptions: {
      type: Array,
      default: () => []
    },
    selectedMethod: {
      type: String,
      default: ''
    },
    isShowRedFlags: {
      type: Boolean,
      default: false
    },
    methodTypeId: {
      type: [Number, String],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    aiAssistantRemainingRight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      Validations,
      labels,
      isEmailGenerating: false,
      landingPageBadgeContents: [
        {
          title: 'Company Event Registration',
          content:
            'Create a landing page for a company event registration. Include fields for full name, email, phone number, and a dropdown to select the department. Add a "Register" button at the bottom. The page should also include a banner at the top with the company logo and event name. The color scheme should match typical corporate branding with a professional look.'
        },
        {
          title: 'Password Reset Page',
          content:
            'Create a landing page for a system password reset. Include a field for entering the email address, a "Submit" button, and a link for "Contact Support" in case the user has trouble resetting their password. The design should be simple with a white background, and include a small company logo at the top. The instructions should be clear and concise.'
        },
        {
          title: 'Bank Account Login Page',
          content:
            'Create a landing page that mimics a bank account login page. Include fields for "Username" and "Password", a "Forgot Username or Password?" link, and a "Sign In" button. Add a small bank logo at the top, and include links for "Enroll Now" and "Help". The design should be secure and professional, with a dark blue and white color scheme.'
        },
        {
          title: 'Subscription Confirmation Page',
          content:
            'Create a landing page for subscription confirmation. Include a message saying "Thank you for subscribing!", a field for entering an email address to confirm the subscription, and a "Confirm Subscription" button. Add a small note about privacy at the bottom. The design should be clean and modern, with a focus on ease of use.'
        },
        {
          title: 'Phishing Awareness Oops Page',
          content:
            "Create a landing page that tells the user they've clicked on a simulated phishing email. The message should say \"Oops! The email you just clicked was a phishing simulation. Don't worry, this is to help you learn.\" Include three key rules: 1. Avoid unknown links/attachments. 2. Verify the sender's email. 3. Be cautious of too-good-to-be-true offers. The design should be clear and educational."
        }
      ],
      aiTemplateTextRules: [(v) => v.length <= 500],
      timeoutId: null,
      aiTemplateText: '',
      generatedTemplates: [],
      activeGeneratedTemplateIndex: -1,
      suggestionsMenuOpen: false,
      formatType: 'html',
      formatOptions: [
        { text: 'HTML', value: 'html' },
        { text: 'Plain Text', value: 'plain' }
      ]
    }
  },
  computed: {
    suggestionItems() {
      return this.landingPageBadgeContents.map((badge, index) => ({
        ...badge,
        index
      }))
    },
    getGenerateButtonLabel() {
      return this.isEmailGenerating ? 'Generating Landing Page...' : 'Generate Landing Page'
    },
    getGenerateEmailButtonStyle() {
      if (this.isShowRedFlags) return this.isRedFlagButtonDisabledStyle
      return this.aiTemplateText.length > 0 &&
        this.aiTemplateText.length <= 500 &&
        !this.isEmailGenerating &&
        this.languageTypeResourceId
        ? { opacity: 1, pointerEvents: '' }
        : { opacity: 0.5, pointerEvents: 'none' }
    },
    isRedFlagButtonDisabledStyle() {
      return this.isShowRedFlags ? { opacity: 0.5, pointerEvents: 'none' } : {}
    },
    getAITemplateTextAreaPlaceholder() {
      return 'AI Ally will generate a landing page template based on the provided details'
    },
    getSelectedFormatText() {
      const selectedOption = this.formatOptions.find((opt) => opt.value === this.formatType)
      return selectedOption ? selectedOption.text : 'HTML'
    }
  },
  methods: {
    ...mapActions({ changeFeedbackPopup: 'dashboard/changeFeedbackPopup' }),
    handleSuggestionClick(index) {
      if (this.landingPageBadgeContents[index]) {
        this.aiTemplateText = this.landingPageBadgeContents[index].content
        this.suggestionsMenuOpen = false
      }
    },
    handleFormatChange(value) {
      this.formatType = value
    },
    handleGenerateEmail() {
      this.isEmailGenerating = true
      const isPlainText = this.formatType === 'plain'
      const payload = {
        name: this.name,
        languageTypeResourceId: this.languageTypeResourceId,
        prompt: this.aiTemplateText,
        phishingTypeId: 1,
        methodTypeId: parseInt(this.methodTypeId),
        isPlainText: !isPlainText
      }
      this.$emit('update:isAssistedByAITemplate', true)
      generateAILandingPageTemplate(payload)
        .then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAILandingPageTemplate()
            this.$emit('update:aiAssistantRemainingRight', this.aiAssistantRemainingRight - 1)
          }
        })
        .catch(() => {
          this.isEmailGenerating = false
        })
    },
    callForGetGeneratedAILandingPageTemplate() {
      getGeneratedAILandingPageTemplate()
        .then((response) => {
          const template = response?.data?.data || {}
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: template,
            languageTypeResourceId: this.languageTypeResourceId
          })
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1
          this.$emit('update:template', template)
          this.isEmailGenerating = false
        })
        .catch((error) => {
          if (error?.response?.status === 500) {
            if (this.timeoutId) clearTimeout(this.timeoutId)
            this.isEmailGenerating = false
            return
          }
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAILandingPageTemplate(), 5000)
        })
    },
    setActiveGeneratedTemplate(index) {
      this.activeGeneratedTemplateIndex = index
      this.aiTemplateText = this.generatedTemplates[index].text
      this.isShowRedFlags = false
      this.$emit(
        'update:languageTypeResourceId',
        this.generatedTemplates[index].languageTypeResourceId
      )
      this.$emit('update:template', this.generatedTemplates[index].content)
    },
    handleFeedbackClick() {
      this.changeFeedbackPopup(true)
    }
  }
}
</script>
