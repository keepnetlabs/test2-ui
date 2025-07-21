<template>
  <swiper-slide :class="slideClasses" :data-type="type">
    <!-- Future: Type-specific wrappers will go here -->
    <div v-if="type === 'html'" class="k-slide-html">
      <slot />
    </div>

    <div v-else-if="type === 'youtube'" class="k-slide-youtube">
      <slot />
      <!-- Future: YouTube embed logic -->
    </div>

    <div v-else-if="type === 'video'" class="k-slide-video">
      <slot />
      <!-- Future: Custom video player -->
    </div>

    <div v-else-if="type === 'quiz'" class="k-slide-quiz">
      <slot />
      <!-- Future: Quiz wrapper -->
    </div>

    <!-- Default: Just pass through content -->
    <div v-else class="k-slide-content">
      <slot />
    </div>
  </swiper-slide>
</template>

<script>
export default {
  name: 'KSwiperSlide',
  props: {
    // Content type - future extensibility
    type: {
      type: String,
      default: 'default'
    },

    // Layout options
    centered: {
      type: Boolean,
      default: false
    }

    // Future: Content-specific props
    // videoUrl: String,
    // youtubeId: String,
    // htmlContent: String,
    // quizData: Object
  },

  computed: {
    slideClasses() {
      return {
        'k-swiper-slide': true,
        [`k-swiper-slide--${this.type}`]: this.type !== 'default',
        'k-swiper-slide--centered': this.centered
      }
    }
  }
}
</script>
