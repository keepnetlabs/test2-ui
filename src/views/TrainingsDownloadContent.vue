<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-progress-circular v-if="isLoading" indeterminate color="primary" size="48" />
        <div class="mt-4">{{ statusMessage }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TrainingsDownloadContent',
  data() {
    return {
      isLoading: true,
      statusMessage: 'Preparing download...'
    }
  },
  mounted() {
    this.handleDownload()
  },
  methods: {
    async handleDownload() {
      const { EnrollmentContentId, TargetUserResourceId } = this.$route.query

      if (!EnrollmentContentId || !TargetUserResourceId) {
        this.isLoading = false
        this.statusMessage = 'Missing required download parameters.'
        return
      }

      try {
        const response = await axios.get(`${APP_CONFIG.VUE_APP_ROOT_API}/trainings/download-content`, {
          params: {
            enrollmentContentId: EnrollmentContentId,
            targetUserResourceId: TargetUserResourceId
          },
          responseType: 'blob'
        })

        const fileNameFromHeader = this.getFileNameFromDisposition(
          response?.headers?.['content-disposition']
        )
        const contentType = response?.headers?.['content-type']
        const fallbackExtension = this.getExtensionFromType(contentType)
        const fileName = fileNameFromHeader || `download${fallbackExtension}`

        this.triggerDownload(response.data, fileName)
        this.statusMessage = 'Your download should start shortly.'
      } catch (error) {
        this.statusMessage = 'Download failed. Please try again later.'
      } finally {
        this.isLoading = false
      }
    },
    getFileNameFromDisposition(disposition) {
      if (!disposition) {
        return ''
      }

      const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
      if (utf8Match && utf8Match[1]) {
        return decodeURIComponent(utf8Match[1].replace(/['"]/g, '').trim())
      }

      const fileNameMatch = disposition.match(/filename=([^;]+)/i)
      if (fileNameMatch && fileNameMatch[1]) {
        return fileNameMatch[1].replace(/['"]/g, '').trim()
      }

      return ''
    },
    getExtensionFromType(contentType) {
      if (!contentType) {
        return ''
      }

      const normalized = contentType.toLowerCase().split(';')[0].trim()
      const EXTENSION_MAP = {
        'application/pdf': '.pdf',
        'application/zip': '.zip',
        'application/x-zip-compressed': '.zip',
        'application/json': '.json',
        'application/xml': '.xml',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/vnd.ms-powerpoint': '.ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
        'application/vnd.ms-outlook': '.msg',
        'application/octet-stream': '',
        'text/plain': '.txt',
        'text/csv': '.csv',
        'text/html': '.html',
        'text/xml': '.xml',
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov'
      }

      if (EXTENSION_MAP[normalized] !== undefined) {
        return EXTENSION_MAP[normalized]
      }

      if (normalized.startsWith('image/')) return `.${normalized.replace('image/', '')}`
      if (normalized.startsWith('audio/')) return `.${normalized.replace('audio/', '')}`
      if (normalized.startsWith('video/')) return `.${normalized.replace('video/', '')}`

      const slashIndex = normalized.indexOf('/')
      if (slashIndex > -1) {
        const subtype = normalized.slice(slashIndex + 1)
        if (subtype && subtype !== 'octet-stream') {
          return `.${subtype}`
        }
      }

      return ''
    },
    triggerDownload(blob, fileName) {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
        return
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>
