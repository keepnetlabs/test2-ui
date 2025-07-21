<template>
  <div class="k-swiper">
    <!-- External Custom Navigation Buttons -->
    <button
      v-if="navigation"
      class="k-swiper-nav k-swiper-nav--prev"
      :disabled="isFirst || navigationDisabled"
      @click="slidePrev"
      type="button"
    >
      <svg
        width="11"
        height="20"
        viewBox="0 0 11 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
          fill="currentColor"
          transform-origin="center"
          transform="rotate(180)"
        ></path>
      </svg>
    </button>

    <button
      v-if="navigation"
      class="k-swiper-nav k-swiper-nav--next"
      :disabled="isLast || navigationDisabled"
      @click="slideNext"
      type="button"
    >
      <svg
        width="11"
        height="20"
        viewBox="0 0 11 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
          fill="currentColor"
        ></path>
      </svg>
    </button>

    <!-- Swiper Container -->
    <swiper-container
      ref="swiperEl"
      init="false"
      :navigation="internalNavigation ? 'true' : 'false'"
      :pagination="paginationAttribute"
      :pagination-type="paginationType"
      :auto-height="isDesktop ? 'true' : 'false'"
      class="k-swiper-container"
    >
      <slot />
    </swiper-container>
  </div>
</template>

<script>
export default {
  name: 'KSwiper',
  props: {
    slidesPerView: { type: [Number, String], default: 1 },
    spaceBetween: { type: Number, default: 0 },
    loop: { type: Boolean, default: false },
    autoplay: { type: [Boolean, Number], default: false },

    // 🆕 İki farklı navigation seçeneği
    navigation: {
      type: Boolean,
      default: false,
      description: 'External custom navigation buttons (outside container)'
    },
    internalNavigation: {
      type: Boolean,
      default: false,
      description: 'Swiper internal navigation buttons (inside container)'
    },

    pagination: {
      type: [Boolean, String],
      default: false,
      validator: (val) => [false, true, 'bullets', 'fraction', 'progressbar'].includes(val)
    },

    navigationDisabled: {
      type: Boolean,
      default: false,
      description: 'Disable navigation buttons (useful after feedback submission)'
    }
  },

  data() {
    return {
      swiper: null,
      isFirst: true,
      isLast: false,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024
    }
  },

  computed: {
    paginationAttribute() {
      return this.pagination ? 'true' : 'false'
    },

    paginationType() {
      if (!this.pagination) return 'bullets'
      return typeof this.pagination === 'string' ? this.pagination : 'bullets'
    },

    isDesktop() {
      return this.windowWidth > 768
    }
  },

  mounted() {
    this.initSwiper()
    this.handleResize = () => {
      this.windowWidth = window.innerWidth
    }
    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true)
    }
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  },

  methods: {
    initSwiper() {
      const config = {
        slidesPerView: this.slidesPerView,
        spaceBetween: this.spaceBetween,
        loop: this.loop,

        // Autoplay
        autoplay: this.autoplay
          ? {
              delay: typeof this.autoplay === 'number' ? this.autoplay : 3000
            }
          : false,

        // Responsive
        breakpoints: {
          640: {
            slidesPerView: Math.min(this.slidesPerView, 2),
            spaceBetween: Math.max(this.spaceBetween, 10)
          },
          1024: {
            slidesPerView: this.slidesPerView,
            spaceBetween: this.spaceBetween
          }
        },

        // Events
        on: {
          init: (swiper) => {
            this.swiper = swiper
            this.updateNavigation(swiper)
            this.$emit('init', swiper)
          },
          slideChange: (swiper) => {
            this.updateNavigation(swiper)
            this.$emit('slide-change', swiper)
          }
        }
      }

      Object.assign(this.$refs.swiperEl, config)
      this.$refs.swiperEl.initialize()
    },

    updateNavigation(swiper) {
      if (!this.loop) {
        this.isFirst = swiper.isBeginning
        this.isLast = swiper.isEnd
      } else {
        this.isFirst = false
        this.isLast = false
      }
    },

    slideNext() {
      if (this.swiper) {
        this.swiper.slideNext()
      }
    },

    slidePrev() {
      if (this.swiper) {
        this.swiper.slidePrev()
      }
    },

    slideTo(index) {
      if (this.swiper) {
        this.swiper.slideTo(index)
      }
    }
  }
}
</script>
