<template>
  <div class="phished-landing-page">
    <div class="phished-landing-page__container">
      <div class="phished-landing-page__image">
        <figure>
          <img id="img--login-main-logo" :src="logo" alt="logo" />
        </figure>
      </div>
      <h1 class="phished-landing-page__title">
        Because you failed the phishing simulation test, you have been assigned to a training
        selected by the company admin
      </h1>
      <p class="phished-landing-page__subtitle">
        {{ subtitleText }}
      </p>
      <div class="phished-landing-page__buttons">
        <VBtn
          v-if="!isMultiple"
          class="phished-landing-page__button"
          color="#2196f3"
          @click="handleStartTraining"
          >Start Training
        </VBtn>
        <VBtn
          v-else
          v-for="button in buttons"
          :key="button.language"
          class="phished-landing-page__button"
          color="#2196f3"
          @click="handleStartTrainingByLanguage(button)"
          >{{ button.text }}
        </VBtn>
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
      buttons: []
    }
  },
  computed: {
    isMultiple() {
      return this.buttons.length > 1
    },
    subtitleText() {
      return this.isMultiple
        ? 'Please start the training by selecting the language and complete the training as soon as possible'
        : 'Please start the training and complete the training as soon as possible'
    }
  },
  created() {
    this.callForData()
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
        const { enrollmentContents = [], mainLogoUrl = [] } = data
        this.logo = mainLogoUrl
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
        window.open(
          `${window.location.origin}/training/scorm/watch?EnrollmentContentId=${obj.enrollmentContentResourceId}&TargetUserResourceId=${obj.targetUserResourceId}`
        )
    }
  }
}
</script>
