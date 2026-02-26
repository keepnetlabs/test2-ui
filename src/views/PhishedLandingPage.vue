<template>
  <div class="phished-landing-page">
    <div class="phished-landing-page__container">
      <div class="phished-landing-page__image">
        <figure>
          <img id="img--login-main-logo" :src="logo" alt="logo" />
        </figure>
      </div>
      <h1 class="phished-landing-page__title">
        {{ informationMessage }}
      </h1>
      <p class="phished-landing-page__subtitle">
        {{ redirectMessage }}
      </p>
      <div class="phished-landing-page__buttons">
        <VBtn
          v-if="!isMultiple"
          class="phished-landing-page__button"
          color="#2196f3"
          @click="handleStartTraining"
          >{{ startButtonLabel }}
        </VBtn>
        <template v-else>
          <VBtn
            v-for="button in buttons"
            :key="button.language"
            class="phished-landing-page__button"
            color="#2196f3"
            @click="handleStartTrainingByLanguage(button)"
            >{{ button.text }}
          </VBtn>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'PhishedLandingPage',
  data() {
    return {
      logo: require('../assets/img/no-logo.png'),
      buttons: [],
      informationMessage: '',
      redirectMessage: '',
      startButtonLabel: ''
    }
  },
  computed: {
    isMultiple() {
      return this.buttons.length > 1
    }
  },
  created() {
    this.callForData()
  },
  mounted() {
    if (document.querySelector('html')) document.querySelector('html').style.overflowY = 'auto'
  },
  methods: {
    callForData() {
      const query = this?.$route?.query
      const enrollmentId = query?.EnrollmentId
      const targetUserResourceId = query?.TargetUserResourceId
      if (!enrollmentId) return

      AwarenessEducatorService.getPhishedLandingPage(enrollmentId).then((response) => {
        const {
          data: { data = {} }
        } = response
        const {
          enrollmentContents = [],
          mainLogoUrl = [],
          informationMessage = '',
          redirectMessage = '',
          startButtonLabel = ''
        } = data
        this.logo = mainLogoUrl
        this.informationMessage =
          informationMessage ||
          'Because you failed the phishing simulation test, you have been assigned to a training selected by the company admin'
        this.redirectMessage =
          redirectMessage ||
          'Please start the training and complete the training as soon as possible'
        this.startButtonLabel = startButtonLabel || 'Start Training'
        enrollmentContents.forEach((eContent) => {
          this.buttons.push({
            text: eContent.nativeLanguageName,
            enrollmentContentResourceId: eContent.enrollmentContentId,
            targetUserResourceId
          })
        })
      })
    },
    handleStartTraining() {
      this.handleStartTrainingByLanguage(this.buttons[0])
    },
    handleStartTrainingByLanguage(obj) {
      if (obj?.enrollmentContentResourceId && obj?.targetUserResourceId)
        globalThis.open(
          `${globalThis.location.origin}/training/scorm/watch?EnrollmentContentId=${obj.enrollmentContentResourceId}&TargetUserResourceId=${obj.targetUserResourceId}`
        )
    }
  }
}
</script>
