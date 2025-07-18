<template>
  <swiper-slide class="k-swiper-slide k-swiper-slide--introduction">
    <div class="k-swiper-introduction" :class="introClasses">
      <div class="k-swiper-introduction__content">
        <div class="k-swiper-introduction__text">
          <h1 v-if="data.title" class="k-swiper-introduction__title">
            {{ data.title }}
          </h1>

          <div class="k-swiper-introduction__body">
            <p
              v-for="(paragraph, index) in contentArray"
              :key="index"
              class="k-swiper-introduction__paragraph"
            >
              {{ paragraph }}
            </p>
          </div>

          <div v-if="data.button" class="k-swiper-introduction__actions">
            <VTooltip
              v-if="data.button.tooltip"
              bottom
              color="#0671C0"
              class="k-swiper-introduction__tooltip"
              attach=".k-swiper-introduction__actions"
              max-width="320"
              eager
              z-index="9999"
            >
              <template #activator="{ on, attrs }">
                <button
                  class="k-swiper-introduction__button"
                  :class="buttonClasses"
                  v-bind="attrs"
                  v-on="on"
                  @click="handleButtonClick"
                >
                  {{ data.button.text }}
                </button>
              </template>
              <span>{{ data.button.tooltip }}</span>
            </VTooltip>
            <button
              v-else
              class="k-swiper-introduction__button"
              :class="buttonClasses"
              @click="handleButtonClick"
            >
              {{ data.button.text }}
            </button>
          </div>
        </div>

        <div v-if="data.illustration" class="k-swiper-introduction__illustration">
          <img
            v-if="data.illustration.url"
            :src="data.illustration.url"
            :alt="data.illustration.alt || 'Illustration'"
            class="k-swiper-introduction__image"
          />
          <div v-else-if="data.illustration.type" class="k-swiper-introduction__svg-container">
            <img
              :src="data.illustration.url"
              :alt="data.illustration.alt || 'Illustration'"
              class="k-swiper-introduction__image"
            />
          </div>
        </div>
      </div>
    </div>
  </swiper-slide>
</template>

<script>
export default {
  name: 'KSwiperIntroduction',
  props: {
    data: {
      type: Object,
      required: true,
      validator: (data) => {
        return data.title || data.content
      }
    },
    // Swiper entegrasyonu için
    swiperRef: {
      type: Object,
      default: null
    }
  },

  computed: {
    introClasses() {
      return {
        [`k-swiper-introduction--${this.data.layout || 'split'}`]: true,
        [`k-swiper-introduction--${this.data.theme || 'default'}`]: true,
        'k-swiper-introduction--has-illustration': !!this.data.illustration
      }
    },

    buttonClasses() {
      return {
        [`k-swiper-introduction__button--${this.data.button?.variant || 'primary'}`]: true
      }
    },

    contentArray() {
      if (Array.isArray(this.data.content)) {
        return this.data.content
      }
      return this.data.content ? [this.data.content] : []
    }
  },

  methods: {
    handleButtonClick() {
      // Swiper action
      if (this.data.button.action === 'next_slide' && this.swiperRef) {
        this.swiperRef.slideNext()
      }

      // Parent component'e emit
      this.$emit('action', {
        type: this.data.button.action,
        data: this.data
      })
    },

    getIllustrationComponent(type) {
      const componentMap = {
        security_awareness: 'SecurityIllustration',
        phishing_simulation: 'PhishingIllustration',
        training_completion: 'TrainingIllustration'
      }
      return componentMap[type] || 'SecurityIllustration'
    }
  }
}
</script>
