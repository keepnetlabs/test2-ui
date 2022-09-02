<template>
  <iframe v-if="src" frameborder="0" :src="src" style="width: 100vw; height: 100vh;"></iframe>
</template>
<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'Scorm',
  data() {
    return {
      src: '',
      scormSessionId: '',
      enrollmentSessionId: ''
    }
  },
  created() {
    this.callForData()
  },

  methods: {
    callForData() {
      const query = this?.$route?.query
      if (query?.isPreview) {
        this.src = `${query.template}?isPreview=true&scoAddress=${query.scoAddress}`
      } else {
        const query = this?.$route?.query
        const enrollmentContentResourceId = query?.EnrollmentContentId
        const targetUserResourceId = query?.TargetUserResourceId
        if (enrollmentContentResourceId && targetUserResourceId) {
          AwarenessEducatorService.getTrainingUrl(targetUserResourceId, enrollmentContentResourceId)
            .then((response) => {
              const {
                data: { data }
              } = response
              this.src = `${data.scormPlayerUrl}?TargetUserResourceId=${targetUserResourceId}&EnrollmentContentId=${enrollmentContentResourceId}&DomainUrl=${APP_CONFIG.VUE_APP_AWARENESS_URL}&scoAddress=${data.trainingUrl}`
            })
            .catch((error) => {
              window.alert(error?.response?.data?.message)
            })
        }
      }
    }
  }
}
</script>
