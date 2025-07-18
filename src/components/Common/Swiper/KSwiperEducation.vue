<template>
  <swiper-slide class="k-swiper-slide k-swiper-slide--education">
    <div class="k-swiper-education" :class="educationClasses">
      <div class="k-swiper-education__content">
        <!-- Header Section -->
        <div class="k-swiper-education__header">
          <h1 v-if="data.title" class="k-swiper-education__title">
            {{ data.title }}
          </h1>

          <p v-if="data.description" class="k-swiper-education__description">
            {{ data.description }}
          </p>
        </div>

        <!-- Dynamic Fields Section -->
        <div v-if="data.fields && data.fields.length" class="k-swiper-education__fields">
          <div v-for="(field, index) in data.fields" :key="index" class="k-swiper-education__field">
            <VTooltip
              v-if="field.tooltip"
              right
              color="#dc3545"
              class="k-swiper-education__field-tooltip"
              attach=".k-swiper-education__fields"
              max-width="320"
              eager
              z-index="9999"
            >
              <template #activator="{ on, attrs }">
                <div class="k-swiper-education__field-content" v-bind="attrs" v-on="on">
                  <span class="k-swiper-education__field-icon">🚩</span>
                  <span class="k-swiper-education__field-key">{{ field.key }}:</span>
                  <span class="k-swiper-education__field-value">{{ field.value }}</span>
                </div>
              </template>
              <span>{{ field.tooltip }}</span>
            </VTooltip>

            <div v-else class="k-swiper-education__field-content">
              <span class="k-swiper-education__field-key">{{ field.key }}:</span>
              <span class="k-swiper-education__field-value">{{ field.value }}</span>
            </div>
          </div>
        </div>

        <!-- HTML Content Section -->
        <div v-if="data.htmlContent" class="k-swiper-education__html-content">
          <div class="k-swiper-education__html-wrapper" v-html="data.htmlContent"></div>
        </div>

        <!-- Actions Section -->
        <div v-if="data.actions && data.actions.length" class="k-swiper-education__actions">
          <button
            v-for="(action, index) in data.actions"
            :key="index"
            class="k-swiper-education__action-button"
            :class="getActionButtonClasses(action)"
            @click="handleActionClick(action)"
          >
            {{ action.text }}
          </button>
        </div>

        <!-- Footer Info -->
        <div v-if="data.footerInfo" class="k-swiper-education__footer">
          <p class="k-swiper-education__footer-text">
            {{ data.footerInfo }}
          </p>
        </div>
      </div>
    </div>
  </swiper-slide>
</template>

<script>
export default {
  name: 'KSwiperEducation',
  props: {
    data: {
      type: Object,
      required: true,
      validator: (data) => {
        return data.title && (data.fields || data.htmlContent)
      }
    },
    swiperRef: {
      type: Object,
      default: null
    }
  },

  computed: {
    educationClasses() {
      return {
        [`k-swiper-education--${this.data.layout || 'default'}`]: true,
        [`k-swiper-education--${this.data.theme || 'phishing'}`]: true,
        'k-swiper-education--has-html': !!this.data.htmlContent
      }
    }
  },

  methods: {
    handleActionClick(action) {
      // Swiper navigation
      if (action.action === 'next_slide' && this.swiperRef) {
        this.swiperRef.slideNext()
      } else if (action.action === 'prev_slide' && this.swiperRef) {
        this.swiperRef.slidePrev()
      }

      // Emit to parent
      this.$emit('action', {
        type: action.action,
        data: action
      })
    },

    getActionButtonClasses(action) {
      return {
        [`k-swiper-education__action-button--${action.variant || 'primary'}`]: true
      }
    }
  }
}
</script>
