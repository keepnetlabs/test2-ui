<template>
  <div class="microlearning-container">
    <k-swiper ref="mainSwiper" pagination="progressbar" :navigation="true">
      <!-- Introduction slide -->
      <k-swiper-introduction
        :data="introData"
        :swiper-ref="$refs.mainSwiper?.swiper"
        @action="handleIntroAction"
      />

      <k-swiper-education class="slide-taller" :data="educationData" />

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
import KSwiperEducation from '@/components/Common/Swiper/KSwiperEducation.vue'

export default {
  name: 'MicroLearning',
  components: {
    KSwiper,
    KSwiperSlide,
    KSwiperIntroduction,
    KSwiperEducation
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
        theme: 'security',
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
        htmlContent: `<html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Verify Your Microsoft Account</title>

</head>
<body style="Margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;color:#333;">
    <style>
    .flagged-area {
      position: relative;
      display: inline-block;
      border: 1px solid #e00;
      border-radius: 4px;
      padding: 0.2em 0.6em 0.2em 2em;
      margin: 0 0.1em;
    }
    .flagged-area::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0.5em;
      width: 1em;
      height: 1em;
      transform: translateY(-50%);
      background: url('https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/506bf119-942d-4224-7ab1-98292e2e3900/public') no-repeat center/contain;
    }
    .flagged-area:hover::after {
      content: attr(data-flag-tooltip);
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      margin-top: 0.3em;
      padding: 0.4em 0.6em;
      background: #B83A3A;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: #fff;
      white-space: normal;
      word-break: break-word;
      min-width: 240px;
      border-radius: 4px;
      z-index: 1000;
    }
  </style>
  <center style="width:100%;background-color:#f5f5f5;">
    <table align="center" role="presentation" width="100%" style="max-width:600px;margin:0 auto;">

      <!-- Header Logo -->
      <tbody><tr>
        <td style="padding:20px 0;text-align:left;">
          <span class="flagged-area" data-field="logo" data-flag-tooltip="The logo is loaded from a third-party site rather than a Microsoft CDN, which could be used to track you or inject malicious content.">
            <img src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/4405f77d-e69f-4aa5-858d-875a93de2a00/public" alt="Microsoft" style="width:120px;height:auto;display:block;border:0;outline:none;text-decoration:none;">
          </span>
        </td>
      </tr>

      <!-- Card Container -->
      <tr>
        <td style="background-color:#ffffff;padding:40px;border-radius:4px;">

          <!-- Subject -->
          <h1 style="Margin:0 0 24px 0;font-size:24px;line-height:32px;font-weight:bold;color:#111;">
            <span class="flagged-area" data-field="subject" data-flag-tooltip="The subject line uses urgency (‘Action Required’) and threats (‘prevent suspension’)—classic phishing tactics.">
              Action Required: Verify Your Account to Prevent Suspension
            </span>
          </h1>

          <!-- Greeting -->
          <p style="Margin:0 0 16px 0;font-size:16px;line-height:24px;">
            <span class="flagged-area" data-field="greeting" data-flag-tooltip="Real providers usually address you by name; ‘Dear user’ is impersonal and suggests a mass mailing.">
              Dear user,
            </span>
          </p>

          <!-- Main Text with Deadline -->
          <p style="Margin:0 0 24px 0;font-size:16px;line-height:24px;">
            We were unable to verify your Microsoft&nbsp;365 subscription due to a recent billing failure. To avoid suspension and potential data loss, please confirm your account information within the next
            <span class="flagged-area" data-field="deadline" data-flag-tooltip="Deadlines like ‘within 24 hours’ are designed to rush you into action without thinking.">
              24&nbsp;hours
            </span>.
          </p>

          <!-- CTA Button -->
          <table role="presentation" align="center" style="margin:0 auto 24px auto;">
            <tbody><tr>
              <td style="border-radius:4px;background-color:#0078D4;">
                <span class="flagged-area" data-field="ctaButton" data-flag-tooltip="Hovering over the button reveals a URL pointing to a non-Microsoft domain—a strong phishing indicator.">
                  <a href="#" style="display:inline-block;padding:12px 24px;font-size:16px;color:#fff;text-decoration:none;font-weight:bold;border-radius:4px;">
                    Verify Now
                  </a>
                </span>
              </td>
            </tr>
          </tbody></table>

          <!-- Warning Text -->
          <p style="Margin:0 0 16px 0;font-size:14px;line-height:20px;color:#555;">
            <span class="flagged-area" data-field="warningText" data-flag-tooltip="Phishing emails commonly warn of account suspension or data loss to create fear and urgency.">
              If you do not verify your account, your email service will be interrupted and your mailbox will be permanently deleted.
            </span>
          </p>

          <!-- Thanks and Signature -->
          <p style="Margin:0 0 16px 0;font-size:14px;line-height:20px;color:#555;">
            Thank you for your prompt attention.
          </p>
          <p style="Margin:0;font-size:14px;line-height:20px;color:#555;">
            Sincerely,<br>
            Microsoft Account Team
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 0 0 0;text-align:center;font-size:12px;line-height:18px;color:#888;">
          <p style="Margin:0;">
            This message was sent from an unmonitored address. Please do not reply directly to this email.
          </p>
          <p style="Margin:4px 0 0 0;">
            © 2025 Microsoft Corporation, One Microsoft Way, Redmond, WA 98052
          </p>
        </td>
      </tr>

    </tbody></table>
  </center>

</body></html>`,
        isShowRedFlags: true,
        redFlagsReviewed: 0,
        totalRedFlags: 9
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
