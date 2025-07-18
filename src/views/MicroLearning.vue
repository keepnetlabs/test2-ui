<template>
  <div class="microlearning-container">
    <k-swiper ref="mainSwiper" pagination="progressbar" :navigation="true">
      <!-- Introduction slide -->
      <k-swiper-introduction
        :data="introData"
        :swiper-ref="$refs.mainSwiper?.swiper"
        @action="handleIntroAction"
      />

      <!-- Content slides -->
      <k-swiper-slide type="content">
        <div>Training content...</div>
      </k-swiper-slide>

      <k-swiper-slide type="quiz">
        <div>Quiz content...</div>
      </k-swiper-slide>
    </k-swiper>
  </div>
</template>
<script>
import KSwiper from '@/components/Common/Swiper/KSwiper.vue'
import KSwiperSlide from '@/components/Common/Swiper/KSwiperSlide.vue'
import KSwiperIntroduction from '@/components/Common/Swiper/KSwiperIntroduction.vue'
export default {
  name: 'MicroLearning',
  components: {
    KSwiper,
    KSwiperSlide,
    KSwiperIntroduction
  },
  data() {
    return {
      introData: {
        title: 'Hello John Doe, you clicked a phishing simulation',
        content: [
          "You're not alone. Many Finance team members clicked on this type of simulation. But you're now one step ahead.",
          "John, this moment is part of your journey to building secure habits. Let's keep going!"
        ],
        button: {
          text: 'Smart Coaching Activated',
          action: 'next_slide',
          variant: 'primary',
          tooltip:
            'This page uses behavioral science techniques like normalization, positive framing, reflective feedback, choice architecture, and microlearning to help you recognize risks and build safer habits.'
        },
        illustration: {
          type: 'image',
          position: 'right',
          url:
            'https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/2d34080d-bdf8-45de-43af-f058b5314200/public'
        },
        layout: 'split',
        theme: 'default'
      },
      educationData: {
        title: 'What You Missed',
        description:
          'Hover over each box to view details. Please review all flags to complete the process—thank you!',
        theme: 'phishing', // phishing, security, awareness
        fields: [
          {
            key: 'From Name',
            value: 'Microsoft Account Team',
            tooltip:
              "The sender name doesn't match Microsoft's official naming convention. Real Microsoft emails use 'Microsoft Security Team' or similar."
          },
          {
            key: 'From Email Address',
            value: 'no-reply@m1crosoft.com',
            tooltip:
              "Notice the '1' instead of 'i' in 'microsoft'. This is a common phishing technique called typosquatting."
          },
          {
            key: 'Subject',
            value: 'Action required: Verify your account to avoid suspension',
            tooltip:
              'Creates false urgency to pressure quick action. Legitimate Microsoft emails rarely threaten account suspension.'
          }
        ],
        htmlContent: `<div>Email HTML content buraya gelecek...</div>`, // Sen vereceğin HTML
        actions: [
          {
            text: 'Continue Learning',
            action: 'next_slide',
            variant: 'primary'
          },
          {
            text: 'Go Back',
            action: 'prev_slide',
            variant: 'secondary'
          }
        ],
        footerInfo: 'Red Flags Reviewed: (0/9)'
      }
    }
  },

  methods: {
    handleIntroAction(action) {
      console.log('Introduction action:', action)
      this.$refs.mainSwiper.swiper.slideNext()
    }
  }
}
</script>
