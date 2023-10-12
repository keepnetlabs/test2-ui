<template>
  <div class="phished-landing-page">
    <div class="phished-landing-page__container">
      <div class="phished-landing-page__image">
        <figure>
          <img id="img--login-main-logo" :src="logo" alt="logo" />
        </figure>
      </div>
      <h1 class="phished-landing-page__title">
        Because you’ve been phished, you were directed to the training selected by the company admin
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
          @click="handleStartTrainingByLanguage()"
          >{{ button.text }}
        </VBtn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PhishedLandingPage',
  data() {
    return {
      logo:
        'https://dev-api.devkeepnet.com/whitelabeling/mainlogo/6b4ca5c7-e8fd-424a-87a5-3c07b240a606.png',
      isMultiple: false,
      subtitleText: 'Please start the training and complete the training as soon as possible',
      buttons: [
        {
          text: 'English',
          language: 'en'
        },
        {
          text: 'Turkish',
          language: 'tr'
        },
        {
          text: 'French',
          language: 'fr'
        },
        {
          text: 'Arabic',
          language: 'ar'
        }
      ]
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      /*
      const query = this?.$route?.query
      const enrollmentContentResourceId = query?.EnrollmentContentId
      const targetUserResourceId = query?.TargetUserResourceId
      //logo buttonların linki
       */
    },
    handleStartTraining() {},
    handleStartTrainingByLanguage() {}
  }
}
</script>
