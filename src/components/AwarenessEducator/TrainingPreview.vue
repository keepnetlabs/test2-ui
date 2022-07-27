<template>
  <div class="landing-page-template-preview">
    <div class="landing-page-template-preview__text">
      <div>
        <span class="landing-page-template-preview__text--title">Training Name: </span>
        <span class="landing-page-template-preview__text--body">{{ name }}</span>
      </div>
      <div class="landing-page-template-preview__control-buttons">
        <v-btn class="mr-2" icon :disabled="!hasPrevious" @click="handlePreviousTemplate">
          <v-icon> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn icon :disabled="!hasNext" @click="handleNextTemplate">
          <v-icon> mdi-chevron-right </v-icon>
        </v-btn>
      </div>
    </div>
    <div>
      <span class="landing-page-template-preview__text--title">Language: </span>
      <span class="landing-page-template-preview__text--body">{{
        languages[activePage].name
      }}</span>
    </div>
    <iframe
      v-if="srcs[activePage]"
      frameborder="0"
      :src="srcs[activePage]"
      style="min-width: 1100px; min-height: 900px;"
    ></iframe>
  </div>
</template>

<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingPreview',
  props: {
    name: {
      type: String
    },
    languages: {
      type: Array
    },
    trainingId: {
      type: String
    }
  },
  data() {
    return {
      activePage: 0,
      srcs: [
        'https://dxadb5mrjazug.cloudfront.net/SCORMPlayer/index.html?isPreview=true&scoAddress=https://dxadb5mrjazug.cloudfront.net/1/Training/26323711-8d61-48a5-9a20-c52e28bf48c6/Contents/0022a3d7-9e90-44e6-af4b-240b1f9fc2fa/index_lms.html'
      ]
    }
  },
  computed: {
    hasPrevious() {
      return this.activePage > 0
    },
    hasNext() {
      return this.languages.length - 1 > this.activePage
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handlePreviousTemplate() {
      this.activePage--
      this.callForData()
    },
    handleNextTemplate() {
      this.activePage++
      this.callForData()
    },
    callForData() {
      if (this.srcs[this.activePage]) return
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.trainingId,
        this.languages[this.activePage].id
      ).then((response) => {
        const {
          data: { data }
        } = response
        this.srcs[
          this.activePage
        ] = `${data.scormPlayerUrl}?isPreview=true&scoAddress=${data.trainingUrl}`
      })
    }
  }
}
</script>
