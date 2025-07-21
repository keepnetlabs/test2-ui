<template>
  <div class="microlearning-container">
    <!-- Header -->
    <header class="microlearning-header">
      <div class="microlearning-header__content">
        <!-- KeepNet Logo -->
        <div class="microlearning-header__logo">
          <img
            src="https://test-api.devkeepnet.com/whitelabeling/mainlogo/38c87b84-8dcc-4170-8854-82c8c9d1333e.png"
            alt=""
            id="img--main-logo"
          />
        </div>

        <!-- Language Selector -->
        <div class="microlearning-header__language">
          <span class="microlearning-header__language-label">Language:</span>
          <div class="microlearning-header__language-dropdown">
            <button class="microlearning-header__language-button" @click="toggleLanguageDropdown">
              <span class="microlearning-header__language-text">{{ currentLanguage.label }}</span>
              <v-icon size="16" :class="{ rotated: isLanguageDropdownOpen }"
                >mdi-chevron-down</v-icon
              >
            </button>

            <div v-if="isLanguageDropdownOpen" class="microlearning-header__language-menu">
              <button
                v-for="language in availableLanguages"
                :key="language.code"
                class="microlearning-header__language-option"
                :class="{ active: language.code === currentLanguage.code }"
                @click="selectLanguage(language)"
              >
                <img
                  :src="language.flag"
                  :alt="language.label"
                  class="microlearning-header__flag"
                />
                {{ language.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <k-swiper
      ref="mainSwiper"
      pagination="progressbar"
      :navigation="true"
      :navigationDisabled="navigationDisabled"
    >
      <k-swiper-introduction
        :data="introData"
        :swiper-ref="$refs.mainSwiper?.swiper"
        @action="handleIntroAction"
      />

      <k-swiper-education :data="educationData" :swiper-ref="swiperInstance" />

      <k-swiper-behavior
        :data="behaviorData"
        :swiper-ref="swiperInstance"
        @action="handleBehaviorAction"
      />
      <k-swiper-behavior
        :data="whatYouCanDoNextData"
        :swiper-ref="swiperInstance"
        @action="handleWhatYouCanDoNextAction"
      />

      <k-swiper-feedback
        :data="feedbackData"
        :swiper-ref="swiperInstance"
        @submit="handleFeedbackSubmit"
        @action="handleFeedbackAction"
        @disable-navigation="handleDisableNavigation"
      />
    </k-swiper>
  </div>
</template>
<script>
import KSwiper from '@/components/Common/Swiper/KSwiper.vue'
import KSwiperIntroduction from '@/components/Common/Swiper/KSwiperIntroduction.vue'
import KSwiperEducation from '@/components/Common/Swiper/KSwiperEducation.vue'
import KSwiperBehavior from '@/components/Common/Swiper/KSwiperBehavior.vue'
import KSwiperFeedback from '@/components/Common/Swiper/KSwiperFeedback.vue'
import { getMicroLearningData } from '@/components/Common/Swiper/utils.js'

export default {
  name: 'MicroLearning',
  components: {
    KSwiper,
    KSwiperIntroduction,
    KSwiperEducation,
    KSwiperBehavior,
    KSwiperFeedback
  },
  data() {
    return {
      // Header state
      isLanguageDropdownOpen: false,
      currentLanguage: {
        code: 'en-GB',
        label: 'English (United Kingdom)',
        flag: 'https://flagcdn.com/w20/gb.png'
      },
      availableLanguages: [
        {
          code: 'en-GB',
          label: 'English (United Kingdom)',
          flag: 'https://flagcdn.com/w20/gb.png'
        },
        {
          code: 'tr-TR',
          label: 'Türkçe (Türkiye)',
          flag: 'https://flagcdn.com/w20/tr.png'
        }
      ],

      // Navigation state
      navigationDisabled: false,

      // User data
      userName: 'John Doe'
    }
  },

  computed: {
    swiperInstance() {
      return this.$refs.mainSwiper?.swiper || null
    },
    contentData() {
      return getMicroLearningData(this.currentLanguage.code, this.userName)
    },

    introData() {
      return this.contentData.introData
    },

    educationData() {
      return this.contentData.educationData
    },

    behaviorData() {
      return this.contentData.behaviorData
    },

    whatYouCanDoNextData() {
      return this.contentData.whatYouCanDoNextData
    },

    feedbackData() {
      return this.contentData.feedbackData
    }
  },

  methods: {
    handleIntroAction(action) {
      console.log('Introduction action:', action)
      this.$refs.mainSwiper.swiper.slideNext()
    },

    handleBehaviorAction(action) {
      console.log('Behavior action:', action)
    },

    handleWhatYouCanDoNextAction(action) {
      console.log('What you can do next action:', action)
    },

    handleFeedbackSubmit(feedbackData) {
      console.log('Feedback submitted:', feedbackData)
      // Here you would typically send the feedback to your API
      // Example API call:
      // this.$store.dispatch('feedback/submitFeedback', feedbackData)
    },

    handleFeedbackAction(action) {
      console.log('Feedback action:', action)

      if (action.type === 'submit') {
        // Feedback was successfully submitted
        console.log('Feedback submitted with data:', action.feedbackData)
      }
    },

    // Header methods
    toggleLanguageDropdown() {
      this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen
    },

    selectLanguage(language) {
      this.currentLanguage = language
      this.isLanguageDropdownOpen = false

      // Language change will trigger computed properties to update
      console.log('Language changed to:', language.code)

      // Persist the language choice
      localStorage.setItem('selectedLanguage', language.code)

      // Or emit to parent/store for global language management
      // this.$emit('language-changed', language.code)
      // this.$store.dispatch('setLanguage', language.code)
    },

    // Navigation control method
    handleDisableNavigation() {
      this.navigationDisabled = true
      console.log('Navigation disabled after feedback submission')
    }
  },

  mounted() {
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.microlearning-header__language-dropdown')) {
        this.isLanguageDropdownOpen = false
      }
    })

    // Load saved language preference if exists
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      const language = this.availableLanguages.find((lang) => lang.code === savedLanguage)
      if (language) {
        this.currentLanguage = language
      }
    }
  }
}
</script>
