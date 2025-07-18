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

        <!-- Combined Content Section -->
        <div
          v-if="(data.fields && data.fields.length) || data.htmlContent"
          class="k-swiper-education__main-content"
        >
          <!-- Dynamic Fields Section -->
          <div v-if="data.fields && data.fields.length" class="k-swiper-education__fields">
            <div
              v-for="(field, index) in data.fields"
              :key="index"
              class="k-swiper-education__field"
            >
              <VTooltip
                v-if="field.tooltip"
                color="#B83A3A"
                class="k-swiper-education__field-tooltip"
                max-width="320"
                attach=".k-swiper-education__field-content"
                bottom
                eager
                z-index="9999"
              >
                <template #activator="{ on, attrs }">
                  <div
                    class="k-swiper-education__field-content"
                    data-flagged-area
                    :data-field="field.key"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span class="k-swiper-education__field-icon"
                      ><img
                        src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/506bf119-942d-4224-7ab1-98292e2e3900/public"
                        alt="Red Flag"
                        class="k-swiper-education__field-icon-image"
                    /></span>
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

          <!-- Separator -->
          <div
            v-if="data.fields && data.fields.length && data.htmlContent"
            class="k-swiper-education__separator"
          ></div>

          <!-- HTML Content Section -->
          <div v-if="data.htmlContent" class="k-swiper-education__html-content">
            <div class="k-swiper-education__html-wrapper" v-html="data.htmlContent"></div>
          </div>
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
        <div class="k-swiper-education__footer">
          <div v-if="data.isShowRedFlags" class="k-swiper-education__red-flags">
            <span class="k-swiper-education__red-flags-text">
              Red Flags Reviewed: ({{ data.redFlagsReviewed }}/{{ data.totalRedFlags }})
            </span>
          </div>
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

  data() {
    return {
      reviewedFlags: new Set()
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
  mounted() {
    const flaggedAreas = document.querySelectorAll('.flagged-area')
    const fieldFlags = document.querySelectorAll('[data-flagged-area]')
    const allFlags = [...flaggedAreas, ...fieldFlags]
    allFlags.forEach((area) => {
      area.addEventListener('mouseover', (e) => {
        const flagId = e.target.getAttribute('data-field')
        if (flagId && !this.reviewedFlags.has(flagId)) {
          this.reviewedFlags.add(flagId)
          this.data.redFlagsReviewed++
        }
      })
    })
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
