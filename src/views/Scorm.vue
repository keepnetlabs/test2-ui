<template>
  <iframe
    v-if="src"
    allowfullscreen
    title="Scorm Preview"
    allow="microphone; downloads"
    :src="src"
    style="width: 100vw; height: 100vh; border-width: 0;"
  ></iframe>
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
              globalThis.alert(error?.response?.data?.message)
            })
            .finally(() => {
              setTimeout(() => {
                if (globalThis.__beforeUnloadHandler) {
                  globalThis.removeEventListener('beforeunload', globalThis.__beforeUnloadHandler)
                }
              }, 12000)
              this.registerFrameChannelForQuestionExtractorProxy()
            })
        }
      }
    },
    registerFrameChannelForQuestionExtractorProxy() {
      const iframe = document.querySelector('iframe')
      if (iframe) {
        const channel = new MessageChannel()
        iframe.addEventListener('load', () => {
          try {
            iframe.contentWindow.postMessage({ type: 'QEX_PARAMS_CHANNEL' }, '*', [channel.port2])
            const query = new URLSearchParams(globalThis.location.search)
            const data = {
              EnrollmentContentId: query.get('EnrollmentContentId') || '',
              TargetUserResourceId: query.get('TargetUserResourceId') || ''
            }
            channel.port1.postMessage(data)
          } catch (err) {
            console.error('QEX params gönderilemedi:', err)
          }
        })
      } else {
        console.warn('Sayfada hiç iframe bulunamadı!')
      }
    }
  }
}
</script>
