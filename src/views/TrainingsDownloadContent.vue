<template>
  <v-container fluid style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
    <v-row style="width:100%;" align="center" justify="center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
        style="display:flex;flex-direction:column;align-items:center;text-align:center;row-gap:12px;max-width:360px;margin-left:auto;margin-right:auto;"
      >
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="primary"
          size="44"
          width="4"
        />
        <v-icon v-else color="primary" size="44">mdi-download</v-icon>
        <div style="font-size:16px;font-weight:500;">{{ statusMessage }}</div>
        <div v-if="shouldShowCloseHint" style="font-size:12px;color:#757575;">
          This tab may not close automatically due to browser settings.
        </div>
        <v-btn
          v-if="shouldShowCloseButton"
          color="primary"
          outlined
          small
          @click="handleCloseTab"
        >
          Close tab
        </v-btn>
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
      statusMessage: 'Preparing download...',
      shouldShowCloseButton: false,
      shouldShowCloseHint: false
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
        this.shouldShowCloseButton = true
        return
      }

      try {
        const response = await axios.get(
          `${APP_CONFIG.VUE_APP_ROOT_API}/trainings/download-content`,
          {
            params: {
              enrollmentContentId: EnrollmentContentId,
              targetUserResourceId: TargetUserResourceId
            },
            responseType: 'blob'
          }
        )

        const fileNameFromHeader = this.getFileNameFromDisposition(
          response?.headers?.['content-disposition']
        )
        const contentType = response?.headers?.['content-type']
        const fallbackExtension = this.getExtensionFromType(contentType)
        const fileName = fileNameFromHeader || `download${fallbackExtension}`

        this.triggerDownload(response.data, fileName)
        this.statusMessage = 'Your download should start shortly.'
        this.shouldShowCloseButton = true
        this.handleAutoClose()
      } catch (error) {
        this.statusMessage = 'Download failed. Please try again later.'
        this.shouldShowCloseButton = true
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
      if (globalThis.navigator?.msSaveOrOpenBlob) {
        globalThis.navigator.msSaveOrOpenBlob(blob, fileName)
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
    },
    handleAutoClose() {
      this.shouldShowCloseHint = true
      setTimeout(() => {
        const didClose = this.handleCloseTab()
        this.shouldShowCloseButton = !didClose
      }, 1200)
    },
    handleCloseTab() {
      try {
        if (window.opener || window.history.length <= 1) {
          window.close()
          return true
        }
      } catch (error) {
        return false
      }

      return false
    }
  }
}
</script>
