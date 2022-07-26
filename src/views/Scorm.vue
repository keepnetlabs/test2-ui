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
        this.src = query?.template
      } else {
        const query = this?.$route?.query
        const enrollmentContentResourceId = query?.EnrollmentContentId
        const targetUserResourceId = query?.TargetUserResourceId
        if (enrollmentContentResourceId && targetUserResourceId) {
          AwarenessEducatorService.getTrainingUrl(
            targetUserResourceId,
            enrollmentContentResourceId
          ).then((response) => {
            debugger
          })
        }
      }
    }
  }
}
</script>
