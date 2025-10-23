<template>
  <div class="chat-app-embedded">
    <div class="chat-container-embedded">
      <!-- Messages Area - İframe için optimize edilmiş -->
      <div class="messages-area-embedded" ref="messagesArea">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-embedded"
          :class="{
            'user-message-embedded': message.type === 'user',
            'ai-message-embedded': message.type === 'ai'
          }"
        >
          <div class="message-avatar-embedded">
            <UAvatar
              :src="message.type === 'user' ? '/avatar-user.png' : '/avatar-ai.png'"
              size="xs"
            />
          </div>
          <div class="message-content-embedded">
            <div class="message-bubble-embedded">
              <p>{{ message.text }}</p>
            </div>
            <div class="message-time-embedded">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area - İframe için optimize edilmiş -->
      <div class="input-area-embedded">
        <UInput
          v-model="newMessage"
          placeholder="Type your message..."
          :disabled="isLoading"
          size="sm"
          @keyup.enter="sendMessage"
        >
          <template #trailing>
            <UButton
              icon="i-heroicons-paper-airplane"
              size="xs"
              color="primary"
              variant="solid"
              :disabled="!newMessage.trim() || isLoading"
              :loading="isLoading"
              @click="sendMessage"
            />
          </template>
        </UInput>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const newMessage = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesArea = ref(null)

// İframe'den gelen mesajları dinle
onMounted(() => {
  window.addEventListener('message', handleParentMessage)
})

// Ana sayfadan gelen mesajları işle
function handleParentMessage(event) {
  if (event.data.type === 'AI_RESPONSE') {
    messages.value.push({
      type: 'ai',
      text: event.data.data.response,
      timestamp: new Date()
    })

    nextTick(() => {
      scrollToBottom()
      isLoading.value = false
    })
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || isLoading.value) return

  const userMessage = newMessage.value.trim()
  newMessage.value = ''

  // Kullanıcı mesajını ekle
  messages.value.push({
    type: 'user',
    text: userMessage,
    timestamp: new Date()
  })

  nextTick(() => {
    scrollToBottom()
  })

  // Parent'e mesaj gönder
  window.parent.postMessage(
    {
      type: 'USER_MESSAGE',
      data: { message: userMessage }
    },
    '*'
  )

  isLoading.value = true
}

function scrollToBottom() {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// İframe yüklendiğinde ana sayfaya haber ver
window.parent.postMessage(
  {
    type: 'CHAT_IFRAME_LOADED',
    data: { status: 'ready' }
  },
  '*'
)
</script>

<style scoped>
/* İframe içinde çalışacak şekilde optimize edilmiş stil */
.chat-app-embedded {
  height: 100vh;
  width: 100%;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, sans-serif;
}

.chat-container-embedded {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.messages-area-embedded {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8fafc;
  scroll-behavior: smooth;
}

.message-embedded {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
  gap: 8px;
}

.message-avatar-embedded {
  flex-shrink: 0;
}

.message-content-embedded {
  flex: 1;
  max-width: calc(100% - 40px);
}

.message-bubble-embedded {
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 14px;
}

.user-message-embedded .message-bubble-embedded {
  background: #3b82f6;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 3px;
}

.ai-message-embedded .message-bubble-embedded {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-time-embedded {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}

.input-area-embedded {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

/* İframe responsive tasarımı */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
