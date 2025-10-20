<template>
  <div class="chat-panel">
    <!-- Chat Toggle Button -->
    <v-btn v-if="!isExpanded" class="chat-toggle-btn" fab small color="primary" @click="toggleChat">
      <v-icon>mdi-robot</v-icon>
    </v-btn>

    <!-- Chat Sidebar Panel -->
    <div
      v-if="isExpanded"
      class="chat-sidebar"
      :class="{ 'chat-sidebar-open': isExpanded, fullwidth: isFullWidth }"
    >
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="d-flex align-center">
          <v-avatar size="32" color="primary" class="mr-2">
            <v-icon small color="white">mdi-robot</v-icon>
          </v-avatar>
        </div>
        <div class="d-flex gap-3">
          <v-btn icon small @click="toggleFullWidth" color="white">
            <v-icon>{{ isFullWidth ? 'mdi-window-restore' : 'mdi-window-maximize' }}</v-icon>
          </v-btn>
          <v-btn icon small @click="toggleChat" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Chat Content - İframe ile Nuxt UI projesi -->
      <div class="chat-iframe-container">
        <!-- Loading Skeleton -->
        <div v-if="!iframeLoaded" class="iframe-loader">
          <!-- Header Skeleton -->
          <div class="skeleton-header">
            <v-skeleton-loader type="avatar" width="32" height="32"></v-skeleton-loader>
            <div class="skeleton-title">
              <v-skeleton-loader type="text" width="100px"></v-skeleton-loader>
            </div>
          </div>

          <!-- Messages Skeleton -->
          <div class="skeleton-messages">
            <v-skeleton-loader v-for="i in 4" :key="i" type="text" class="skeleton-message"></v-skeleton-loader>
          </div>

          <!-- Input Skeleton Card -->
          <div class="skeleton-input-card">
            <div class="skeleton-input-wrapper">
              <v-skeleton-loader type="text" height="40" class="flex-grow-1"></v-skeleton-loader>
              <v-skeleton-loader type="avatar" width="36" height="36"></v-skeleton-loader>
            </div>
          </div>
        </div>

        <iframe
          ref="chatIframe"
          :src="chatUrl"
          class="chat-iframe"
          @load="onIframeLoad"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatPanel',
  data() {
    return {
      isExpanded: false,
      chatUrl: process.env.VUE_APP_CHAT_URL || 'http://localhost:3001',
      iframeLoaded: false,
      isFullWidth: false
    }
  },
  computed: {
    iframeSrc() {
      return `${this.chatUrl}?embedded=true&theme=${this.getCurrentTheme()}`
    }
  },
  methods: {
    toggleChat() {
      this.isExpanded = !this.isExpanded

      // HTML scroll lock/unlock
      if (this.isExpanded) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = ''
        // Panel kapatılırken skeleton'u reset et
        this.iframeLoaded = false
      }

      if (this.isExpanded && this.iframeLoaded) {
        // İframe yüklendiğinde kullanıcı bilgilerini gönder
        this.sendUserInfoToIframe()
      }
    },

    onIframeLoad() {
      this.iframeLoaded = true
      if (this.isExpanded) {
        this.sendUserInfoToIframe()
      }
    },

    sendUserInfoToIframe() {
      if (this.$refs.chatIframe && this.$refs.chatIframe.contentWindow) {
        const userInfo = {
          type: 'USER_INFO',
          data: {
            userId: this.$store.state.auth?.user?.id || 'guest',
            userName: this.$store.state.auth?.user?.firstName || 'Guest',
            companyName: this.$store.state.auth?.selectedCompanyName || 'Demo Company',
            theme: this.getCurrentTheme()
          }
        }

        this.$refs.chatIframe.contentWindow.postMessage(userInfo, this.chatUrl)
      }
    },

    // Ana sayfadan seçili verileri iframe'e gönder
    sendSelectedDataToChat(data) {
      if (this.$refs.chatIframe && this.$refs.chatIframe.contentWindow && this.isExpanded) {
        const dataMessage = {
          type: 'SELECTED_DATA',
          data: data,
          timestamp: new Date().toISOString()
        }

        this.$refs.chatIframe.contentWindow.postMessage(dataMessage, this.chatUrl)
      }
    },

    getCurrentTheme() {
      // Tema bilgisini al (dark/light mode kontrolü için)
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    },

    toggleFullWidth() {
      this.isFullWidth = !this.isFullWidth

      // iframe'e fullwidth durumunu bildir
      if (this.$refs.chatIframe && this.$refs.chatIframe.contentWindow) {
        this.$refs.chatIframe.contentWindow.postMessage(
          {
            type: 'FULLWIDTH_TOGGLE',
            data: { isFullWidth: this.isFullWidth }
          },
          '*'
        )
      }
    },

    // İframe'den gelen mesajları dinle
    handleIframeMessage(event) {
      // Sadece kendi chat URL'imizden gelen mesajları kabul et
      if (event.origin !== new URL(this.chatUrl).origin) return

      if (event.data.type === 'CANVAS_CLICK') {
        this.isFullWidth = true
      }

      if (event.data.type === 'CHAT_MESSAGE') {
        // Chat mesajı geldiğinde gerekli işlemleri yap
        console.log('Chat message received:', event.data)
        // Burada ana uygulama state'ini güncelleyebilir veya toast gösterebilirsin
      }
    }
  },

  mounted() {
    // İframe mesajlarını dinle
    window.addEventListener('message', this.handleIframeMessage)
  },

  beforeDestroy() {
    // Event listener'ı temizle
    window.removeEventListener('message', this.handleIframeMessage)
  }
}
</script>

<style>
.chat-panel {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
  height: 100vh;
  pointer-events: none;
}

.chat-toggle-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  z-index: 1001;
}

.chat-sidebar {
  position: fixed;
  right: -35%; /* Başlangıçta görünmez */
  top: 0;
  width: 35%;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease-in-out;
  pointer-events: auto;
  z-index: 1000;
}

.chat-sidebar-open {
  right: 0; /* Açıkken görünür */
}

.chat-sidebar.fullwidth {
  width: 100%;
  right: -100%;
}

.chat-sidebar.fullwidth.chat-sidebar-open {
  right: 0;
}

/* Loading Skeleton Styles */
.iframe-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
  height: 100%;
  box-sizing: border-box;
}

.skeleton-header {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.skeleton-title {
  flex: 1;
}

.skeleton-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.skeleton-message {
  padding: 8px 0;
}

.skeleton-input-card {
  flex-shrink: 0;
  min-height: 120px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-top: 2px solid #e5e7eb;
}

.skeleton-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-sidebar.fullwidth .chat-header {
  padding: 12px 24px 12px 16px;
}

.chat-iframe-container {
  flex: 1;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* Overlay - chat açıkken arka planı hafif karart */
.chat-panel::before {
  content: '';
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
  z-index: 999;
}

.chat-sidebar-open ~ .chat-panel::before {
  opacity: 1;
  pointer-events: auto;
}

/* Responsive tasarım için */
@media (max-width: 1200px) {
  .chat-sidebar:not(.fullwidth) {
    width: 38%;
    right: -38%;
  }

  .chat-sidebar-open:not(.fullwidth) {
    right: 0;
  }
}

@media (max-width: 768px) {
  .chat-sidebar:not(.fullwidth) {
    width: 50%;
    right: -50%;
  }

  .chat-toggle-btn {
    right: 15px;
  }
}

@media (max-width: 480px) {
  .chat-sidebar:not(.fullwidth) {
    width: 50%;
  }

  .chat-toggle-btn {
    right: 10px;
  }
}
</style>
