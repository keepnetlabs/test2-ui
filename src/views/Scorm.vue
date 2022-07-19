<template>
  <iframe frameborder="0" :src="src" style="width: 100vw; height: 100vh;"></iframe>
</template>

<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'Scorm',
  data() {
    return {
      src: 'https://d8rg7jrq84z6k.cloudfront.net/deneme(2)/index_lms.html'
    }
  },
  created() {
    debugger
    //this.callForData()
  },
  methods: {
    callForData() {
      const query = this?.$route?.query
      const enrollmentContentResourceId = query?.EnrollmentContentId
      const targetUserResourceId = query?.TargetUserResourceId
      if (enrollmentContentResourceId && targetUserResourceId) {
        AwarenessEducatorService.lmsInitialize({
          enrollmentContentResourceId,
          targetUserResourceId
        }).catch(() => {
          this.routeToLogin()
        })
      } else this.routeToLogin()
    },
    routeToLogin() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
