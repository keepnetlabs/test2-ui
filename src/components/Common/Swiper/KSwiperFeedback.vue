<template>
  <swiper-slide class="k-swiper-slide k-swiper-slide--feedback">
    <div class="k-swiper-feedback" :class="feedbackClasses">
      <div class="k-swiper-feedback__content">
        <!-- Header Section -->
        <div class="k-swiper-feedback__header">
          <h1 v-if="data.title" class="k-swiper-feedback__title">
            {{ data.title }}
          </h1>
        </div>

        <!-- Star Rating Section -->
        <div class="k-swiper-feedback__rating">
          <div class="k-swiper-feedback__stars">
            <button
              v-for="star in 5"
              :key="star"
              class="k-swiper-feedback__star"
              :class="{ 'k-swiper-feedback__star--active': star <= rating }"
              :aria-label="`Rate ${star} ${star === 1 ? 'star' : 'stars'}`"
              @click="setRating(star)"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
            >
              <v-icon :color="star <= rating ? '#FFD700' : '#E0E0E0'" size="32">
                {{ getStarIcon(star) }}
              </v-icon>
            </button>
          </div>
        </div>

        <!-- Feedback Text Section -->
        <div class="k-swiper-feedback__input">
          <div class="k-swiper-feedback__textarea-wrapper">
            <textarea
              v-model="feedbackText"
              :placeholder="computedPlaceholder"
              :rows="data.rows || 4"
              :maxlength="data.maxLength || 500"
              class="k-swiper-feedback__textarea"
              :class="{ 'k-swiper-feedback__textarea--error': hasTextError }"
              @focus="isFocused = true"
              @blur="isFocused = false"
            />

            <!-- Character Counter -->
            <div v-if="data.maxLength" class="k-swiper-feedback__counter">
              {{ feedbackText.length }}/{{ data.maxLength }}
            </div>

            <!-- Error Message -->
            <div v-if="hasTextError" class="k-swiper-feedback__error">
              {{ textErrorMessage }}
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div v-if="data.actions && data.actions.length" class="k-swiper-feedback__actions">
          <button
            v-for="(action, index) in data.actions"
            :key="index"
            class="k-swiper-feedback__action-button"
            :class="getActionButtonClasses(action)"
            :disabled="!isValid || isSubmitting"
            @click="handleActionClick(action)"
          >
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>
  </swiper-slide>
</template>

<script>
export default {
  name: 'KSwiperFeedback',

  props: {
    data: {
      type: Object,
      required: true,
      validator: (data) => {
        return data.title
      }
    },
    swiperRef: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      rating: this.data.initialRating || 0,
      hoverRating: 0,
      feedbackText: this.data.initialText || '',
      isSubmitting: false,
      isFocused: false
    }
  },

  computed: {
    feedbackClasses() {
      return {
        [`k-swiper-feedback--${this.data.layout || 'default'}`]: true,
        [`k-swiper-feedback--${this.data.theme || 'primary'}`]: true,
        'k-swiper-feedback--has-actions': !!(this.data.actions && this.data.actions.length)
      }
    },

    computedPlaceholder() {
      const placeholder =
        this.data.placeholder || 'Tell us what was helpful or what can be improved...'
      if (this.data.userName) {
        return `${this.data.userName}, ${placeholder.toLowerCase()}`
      }
      return placeholder
    },

    hasTextError() {
      if (this.data.requireText && !this.feedbackText.trim()) {
        return true
      }

      if (
        this.data.minTextLength > 0 &&
        this.feedbackText.trim().length < this.data.minTextLength
      ) {
        return true
      }

      return false
    },

    textErrorMessage() {
      if (this.data.requireText && !this.feedbackText.trim()) {
        return 'Feedback text is required'
      }

      if (
        this.data.minTextLength > 0 &&
        this.feedbackText.trim().length < this.data.minTextLength
      ) {
        return `Minimum ${this.data.minTextLength} characters required`
      }

      return ''
    },

    isValid() {
      const ratingValid = this.data.requireRating !== false ? this.rating > 0 : true
      const textValid = !this.hasTextError

      return ratingValid && textValid
    },

    feedbackData() {
      return {
        rating: this.rating,
        text: this.feedbackText ? this.feedbackText.trim() : '',
        timestamp: new Date().toISOString()
      }
    }
  },

  watch: {
    'data.initialRating'(newVal) {
      this.rating = newVal || 0
    },

    'data.initialText'(newVal) {
      this.feedbackText = newVal || ''
    }
  },

  methods: {
    setRating(star) {
      this.rating = star
      this.$emit('rating-change', star)
    },

    async handleActionClick(action) {
      // Handle different action types
      if (action.action === 'submit') {
        await this.handleSubmit(action)
      } else if (action.action === 'next_slide' && this.swiperRef) {
        this.swiperRef.slideNext()
      } else if (action.action === 'prev_slide' && this.swiperRef) {
        this.swiperRef.slidePrev()
      } else if (action.action === 'cancel') {
        this.handleCancel()
      }

      // Emit to parent
      this.$emit('action', {
        type: action.action,
        data: action,
        feedbackData: this.feedbackData
      })
    },

    async handleSubmit(action) {
      if (!this.isValid) return

      this.isSubmitting = true

      try {
        // Emit feedback data
        this.$emit('submit', this.feedbackData)

        // Auto-advance to next slide if configured
        if (action.autoNext && this.swiperRef) {
          setTimeout(() => {
            this.swiperRef.slideNext()
          }, 1000)
        }
      } catch (error) {
        this.$emit('error', error)
      } finally {
        this.isSubmitting = false
      }
    },

    handleCancel() {
      this.reset()
      this.$emit('cancel')
    },

    reset() {
      this.rating = 0
      this.feedbackText = ''
      this.hoverRating = 0
      this.$emit('reset')
    },

    getActionButtonClasses(action) {
      return {
        [`k-swiper-feedback__action-button--${action.type || 'primary'}`]: true,
        'k-swiper-feedback__action-button--disabled':
          action.disabled || (!this.isValid && action.action === 'submit')
      }
    },

    getStarIcon(star) {
      return star <= this.rating ? 'mdi-star' : 'mdi-star-outline'
    }
  }
}
</script>
