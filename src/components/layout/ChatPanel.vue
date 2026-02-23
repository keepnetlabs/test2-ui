<template>
  <div
    v-show="!isInitialHidden && agenticAIEnabled"
    class="chat-panel"
    :style="{ zIndex: isExpanded ? 2147483001 : 5 }"
  >
    <!-- Chat Toggle Button - AI Agent -->
    <div
      class="ai-agent-button"
      :class="{
        'ai-agent-button--hovered': isHoveringButton || isExpanded,
        'ai-agent-button--expanded': isExpanded
      }"
      @click="handleBtnClick"
      @mouseenter="isHoveringButton = true"
      @mouseleave="isHoveringButton = false"
    >
      <div class="ai-agent-button__content">
        <v-icon class="ai-agent-button__icon" color="white"
          >mdi-creation</v-icon
        >
        <span class="ai-agent-button__text">Use Agentic AI </span>
      </div>
    </div>

    <!-- Chat Sidebar Panel -->
    <div
      v-show="isExpanded"
      class="chat-sidebar"
      :class="{ 'chat-sidebar-open': isExpanded, fullwidth: isFullWidth }"
    >
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="d-flex align-center">
          <v-icon color="#2196F3">mdi-creation</v-icon>
        </div>
        <div class="d-flex gap-2">
          <v-btn icon small @click="toggleFullWidth" color="#757575">
            <v-icon>{{
              isFullWidth ? "mdi-window-restore" : "mdi-window-maximize"
            }}</v-icon>
          </v-btn>
          <v-btn icon small @click="toggleChat" color="#757575">
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
            <v-skeleton-loader
              type="avatar"
              width="32"
              height="32"
            ></v-skeleton-loader>
            <div class="skeleton-title">
              <v-skeleton-loader type="text" width="100px"></v-skeleton-loader>
            </div>
          </div>

          <!-- Messages Skeleton -->
          <div class="skeleton-messages">
            <v-skeleton-loader
              v-for="i in 4"
              :key="i"
              type="text"
              class="skeleton-message"
            ></v-skeleton-loader>
          </div>

          <!-- Input Skeleton Card -->
          <div class="skeleton-input-card">
            <div class="skeleton-input-wrapper">
              <v-skeleton-loader
                type="text"
                height="40"
                class="flex-grow-1"
              ></v-skeleton-loader>
              <v-skeleton-loader
                type="avatar"
                width="36"
                height="36"
              ></v-skeleton-loader>
            </div>
          </div>
        </div>

        <iframe
          ref="chatIframe"
          :src="chatUrl"
          title="Agentic AI Chat"
          class="chat-iframe"
          @load="onIframeLoad"
          allowfullscreen
          allow="accelerometer; 
         autoplay; 
         clipboard-write; 
         encrypted-media; 
         fullscreen; 
         geolocation; 
         gyroscope; 
         magnetometer; 
         microphone; 
         picture-in-picture;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { getAgentLoginUrl } from "@/api/auth";

export default {
  name: "ChatPanel",
  data() {
    const hostId = localStorage.getItem("hostId");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const sessionId = `${hostId}-${userData?.email?.replace("@", "_")}-${
      userData?.id
    }`;
    return {
      isExpanded: false,
      chatUrl: "",
      iframeLoaded: false,
      isFullWidth: false,
      isInitialHidden: true,
      chatPopupInterval: null,
      isHoveringButton: false,
      buttonPosition: { right: 20, top: 20 },
      sessionId
    };
  },
  computed: {
    agenticAIEnabled() {
      return this.$store.getters["login/getAgenticAIEnabled"];
    },
    iframeSrc() {
      return `${this.chatUrl}?embedded=true&theme=${this.getCurrentTheme()}`;
    }
  },
  methods: {
    getAbsoluteUrl(url) {
      try {
        return new URL(url, globalThis.location.origin);
      } catch (e) {
        return null;
      }
    },

    normalizeAgentChatUrl(url) {
      try {
        const parsedUrl = this.getAbsoluteUrl(url);
        if (!parsedUrl) return url;
        const isLocalhost = ["localhost", "127.0.0.1"].includes(
          globalThis.location.hostname
        );
        if (isLocalhost) {
          parsedUrl.searchParams.set(
            "baseApiUrl",
            "https://test-api.devkeepnet.com"
          );
        }
        const baseApiUrl = parsedUrl.searchParams.get("baseApiUrl");
        if (!baseApiUrl) return url;

        const normalizedBaseApiUrl = baseApiUrl.replace(/\/api\/?$/i, "");
        if (normalizedBaseApiUrl !== baseApiUrl) {
          parsedUrl.searchParams.set("baseApiUrl", normalizedBaseApiUrl);
        }

        const normalizedUrl = parsedUrl.toString();
        if (isLocalhost) {
          return normalizedUrl.replace(
            "https://agentic-ai-chat.keepnetlabs.com/",
            "http://localhost:3001/"
          );
        }
        return normalizedUrl;
      } catch (e) {
        return url;
      }
    },

    toggleChat() {
      this.isExpanded = !this.isExpanded;
      this.isHoveringButton = false;

      // HTML scroll lock/unlock
      if (this.isExpanded) {
        document.querySelector("html").style.overflowY = "hidden";
        // Panel açılırken iframe yüklüyse kullanıcı bilgilerini gönder
        if (this.iframeLoaded) {
          this.sendUserInfoToIframe();
        }
      } else {
        document.querySelector("html").style.overflowY = "";
      }
    },

    onIframeLoad() {
      this.iframeLoaded = true;
      if (this.isExpanded) {
        this.sendUserInfoToIframe();
      }
    },

    sendUserInfoToIframe() {
      if (this.$refs.chatIframe && this.$refs.chatIframe.contentWindow) {
        const userInfo = {
          type: "USER_INFO",
          data: {
            userId: this.$store.state.auth?.user?.id || "guest",
            userName: this.$store.state.auth?.user?.firstName || "Guest",
            companyName:
              this.$store.state.auth?.selectedCompanyName || "Demo Company",
            theme: this.getCurrentTheme()
          }
        };

        // Chat URL API'ye taşınınca iframe redirect edebiliyor; hedef origin'i bilemeyebiliriz.
        // Bu yüzden mesajı '*' ile gönderip, alıcı tarafta doğrulama yapılmasını bekliyoruz.
        this.$refs.chatIframe.contentWindow.postMessage(userInfo, "*");
      }
    },

    // Ana sayfadan seçili verileri iframe'e gönder
    sendSelectedDataToChat(data) {
      if (
        this.$refs.chatIframe &&
        this.$refs.chatIframe.contentWindow &&
        this.isExpanded
      ) {
        const dataMessage = {
          type: "SELECTED_DATA",
          data: data,
          timestamp: new Date().toISOString()
        };

        this.$refs.chatIframe.contentWindow.postMessage(dataMessage, "*");
      }
    },

    getCurrentTheme() {
      // Tema bilgisini al (dark/light mode kontrolü için)
      return this.$vuetify.theme.dark ? "dark" : "light";
    },

    toggleFullWidth() {
      this.isFullWidth = !this.isFullWidth;

      // iframe'e fullwidth durumunu bildir
      if (this.$refs.chatIframe && this.$refs.chatIframe.contentWindow) {
        this.$refs.chatIframe.contentWindow.postMessage(
          {
            type: "FULLWIDTH_TOGGLE",
            data: { isFullWidth: this.isFullWidth }
          },
          "*"
        );
      }
    },

    // İframe'den gelen mesajları dinle
    handleIframeMessage(event) {
      // Chat URL API endpoint'ine taşınmışsa iframe redirect edebilir ve origin değişir.
      // Origin'e göre filtrelemek yerine, mesajın bizim iframe window'undan geldiğini doğrula.
      if (!this.$refs.chatIframe || !this.$refs.chatIframe.contentWindow)
        return;
      if (event.source !== this.$refs.chatIframe.contentWindow) return;

      if (event.data.type === "CANVAS_CLICK") {
        this.isFullWidth = true;
      }

      if (event.data.type === "CHAT_MESSAGE") {
        // Chat mesajı geldiğinde gerekli işlemleri yap
        console.log("Chat message received:", event.data);
        // Burada ana uygulama state'ini güncelleyebilir veya toast gösterebilirsin
      }
    },

    handleBtnClick() {
      this.toggleChat();
    },
    handleExternalOpen() {
      if (!this.agenticAIEnabled) return;
      if (!this.chatUrl) {
        this.fetchAgentLoginUrl();
      }
      if (!this.isExpanded) {
        this.toggleChat();
      }
    },

    fetchAgentLoginUrl() {
      getAgentLoginUrl({ sessionId: this.sessionId })
        .then((response) => {
          if (response?.data?.url) {
            this.chatUrl = this.normalizeAgentChatUrl(response.data.url);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch agent login URL:", error);
        });
    }
  },

  mounted() {
    // Chat panel'i başlangıçtan sonra göster
    this.isInitialHidden = false;

    // Agent login URL'sini al ve iframe'e ata
    this.fetchAgentLoginUrl();

    // Interval ile diğer chat-popup elemanını kapat
    this.chatPopupInterval = setInterval(() => {
      const otherChatPopup = document.querySelector(".chat-popup");
      if (otherChatPopup) {
        otherChatPopup.style.display = "none";
        // Kapatıldıktan sonra interval'ı kaldır
        clearInterval(this.chatPopupInterval);
        this.chatPopupInterval = null;
      }
    }, 500);

    // İframe'den gelen mesajları dinle
    globalThis.addEventListener("message", this.handleIframeMessage);
    globalThis.addEventListener("open-agentic-ai-chat", this.handleExternalOpen);
  },

  beforeDestroy() {
    // Interval'ı kaldır
    if (this.chatPopupInterval) {
      clearInterval(this.chatPopupInterval);
      this.chatPopupInterval = null;
    }
    // Event listener'ı kaldır
    globalThis.removeEventListener("message", this.handleIframeMessage);
    globalThis.removeEventListener("open-agentic-ai-chat", this.handleExternalOpen);
    // Diğer chat-popup elemanını aç
    const otherChatPopup = document.querySelector(".chat-popup");
    if (otherChatPopup) {
      otherChatPopup.style.display = "";
    }
  }
};
</script>

<style>
.chat-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  pointer-events: none;
}

.ai-agent-button {
  position: fixed;
  right: 0;
  top: 32px;
  height: 48px;
  width: 56px;
  background: linear-gradient(90deg, #1173c1 0%, #2196f3 100%);
  border-radius: 28px 0 0 28px;
  border-top: 2px solid #fff;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: none;
  cursor: pointer;
  z-index: 1001;
  pointer-events: auto;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 16px rgba(17, 115, 193, 0.2);
}

.ai-agent-button--expanded {
  z-index: 999;
}

.ai-agent-button:hover {
  box-shadow: 0 6px 24px rgba(33, 150, 243, 0.3);
}

.ai-agent-button--hovered {
  width: 180px;
  height: 48px;
  padding: 0 16px;
}

.ai-agent-button__content {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.ai-agent-button__icon {
  min-width: 24px;
  width: 24px;
  height: 24px;
  color: white;
  flex-shrink: 0;
}

.ai-agent-button__text {
  color: white;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ai-agent-button--hovered .ai-agent-button__text {
  opacity: 1;
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
  padding: 12px 20px;
  background: #f1f8fe;
  color: white;
  flex-shrink: 0;
  border-bottom: 1px solid #b3d4fc;
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
  content: "";
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

  .ai-agent-button {
    height: 44px;
    width: 52px;
    border-radius: 26px 0 0 26px;
  }

  .ai-agent-button--hovered {
    width: 160px;
    height: 44px;
  }

  .ai-agent-button__text {
    font-size: 12px;
    line-height: 18px;
  }
}

@media (max-width: 480px) {
  .chat-sidebar:not(.fullwidth) {
    width: 50%;
  }

  .ai-agent-button {
    height: 40px;
    width: 48px;
    top: 16px;
    border-radius: 24px 0 0 24px;
  }

  .ai-agent-button--hovered {
    width: 140px;
    height: 40px;
  }

  .ai-agent-button__icon {
    min-width: 20px;
    width: 20px;
    height: 20px;
  }

  .ai-agent-button__text {
    font-size: 11px;
    line-height: 16px;
  }
}
</style>
