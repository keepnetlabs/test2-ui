<template>
  <swiper-slide class="k-swiper-slide k-swiper-slide--behavior">
    <div class="k-swiper-behavior" :class="behaviorClasses">
      <div class="k-swiper-behavior__content">
        <!-- Header Section -->
        <div class="k-swiper-behavior__header">
          <h1 v-if="data.title" class="k-swiper-behavior__title">
            {{ data.title }}
          </h1>

          <p v-if="data.description" class="k-swiper-behavior__description">
            {{ data.description }}
          </p>
        </div>

        <!-- Behavior Tips Section -->
        <div v-if="data.tips && data.tips.length" class="k-swiper-behavior__tips">
          <div
            v-for="(tip, index) in data.tips.slice(0, 3)"
            :key="index"
            class="k-swiper-behavior__tip"
            :data-tip-index="index"
          >
            <div class="k-swiper-behavior__tip-content">
              <!-- Icon -->
              <div class="k-swiper-behavior__tip-icon">
                <v-icon v-if="tip.icon && !tip.iconPath" :size="32" color="#0671C0">
                  {{ tip.icon }}
                </v-icon>
                <img
                  v-else-if="tip.iconPath"
                  :src="tip.iconPath"
                  :alt="tip.title"
                  class="k-swiper-behavior__tip-icon-image"
                />
                <v-icon v-else :size="32" color="#0671C0">
                  mdi-information-outline
                </v-icon>
              </div>

              <!-- Text Content -->
              <div class="k-swiper-behavior__tip-text">
                <h3 class="k-swiper-behavior__tip-title">
                  {{ tip.title }}
                </h3>
                <p class="k-swiper-behavior__tip-description">
                  {{ tip.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div v-if="data.actions && data.actions.length" class="k-swiper-behavior__actions">
          <button
            v-for="(action, index) in data.actions"
            :key="index"
            class="k-swiper-behavior__action-button"
            :class="getActionButtonClasses(action)"
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
  name: 'KSwiperBehavior',
  props: {
    data: {
      type: Object,
      required: true,
      validator: (data) => {
        return data.title && data.tips && Array.isArray(data.tips)
      }
    },
    swiperRef: {
      type: Object,
      default: null
    }
  },

  computed: {
    behaviorClasses() {
      return {
        [`k-swiper-behavior--${this.data.layout || 'default'}`]: true,
        [`k-swiper-behavior--${this.data.theme || 'primary'}`]: true,
        'k-swiper-behavior--has-actions': !!(this.data.actions && this.data.actions.length)
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
        [`k-swiper-behavior__action-button--${action.type || 'primary'}`]: true,
        'k-swiper-behavior__action-button--disabled': action.disabled
      }
    }
  }
}
</script>
