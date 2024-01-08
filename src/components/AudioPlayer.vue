<template>
  <div class="audio-player__wrapper">
    <audio
      ref="refAudio"
      style="display: none;"
      preload="auto"
      :src="url"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate($event)"
      @loadedmetadata="onLoadedmetadata($event)"
      @error="onError($event)"
    />
    <div v-if="isPreview && src" class="audio-player audio-player--preview">
      <v-btn small text color="#2196F3" :disabled="!canPlay" @click="onTogglePlay">
        <v-icon left>
          {{ audio.playing ? 'mdi-pause' : 'mdi-play' }}
        </v-icon>
        <span class="audio-player__preview-text"> Preview </span>
      </v-btn>
    </div>
    <div v-else class="audio-player">
      <v-tooltip :disabled="isTextToSpeechCompatible" bottom opacity="1">
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            icon
            color="#ffffff"
            class="audio-player__play-pause-button"
            :style="getButtonStyles"
            :disabled="!canPlay || isFetchingTTSUrl || !isTextToSpeechCompatible"
            @click="onTogglePlay"
          >
            <v-icon v-if="isFetchingTTSUrl" left class="ml-2 loading-spin-clockwise"
              >mdi-rotate-right</v-icon
            >
            <v-icon v-else size="16">{{ audio.playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-span">
          The TTS provider of the selected voice cannot provide a preview of the converted speech
        </span>
      </v-tooltip>
      <div class="audio-player__time">
        <span class="audio-payer__time-text">
          {{ getCurrentTime }}
        </span>
      </div>
      <div class="audio-player__track">
        <el-slider
          v-model="sliderTime"
          class="audio-player__track-slider"
          :show-tooltip="false"
          :disabled="!canPlay"
          @change="onChangeCurrentTime"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { formatSeconds } from '@/utils/functions'
import axios from 'axios'
export default {
  name: 'AudioPlayer',
  props: {
    type: {
      type: String,
      default: 'client' // server or client
    },
    src: {
      type: String
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    isTextToSpeechCompatible: {
      type: Boolean,
      default: true
    },
    isFetchingTTSUrl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canPlay: false,
      isLoading: false,
      isPlaying: false,
      url: null,
      sliderTime: 0,
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        speed: 1
      }
    }
  },
  watch: {
    isFetchingTTSUrl: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val === true) {
          this.canPlay = false
        }
      }
    },
    src(newSrc) {
      this.$forceUpdate()
      if (this.type === 'client') {
        this.url = newSrc || null
        this.onChangeCurrentTime(1)
        this.onPause()
      }
    }
  },
  computed: {
    getCurrentTime() {
      return `${formatSeconds(this.audio.currentTime)} - ${formatSeconds(this.audio.maxTime)}`
    },
    getButtonStyles() {
      return {
        backgroundColor: this.canPlay && !this.isFetchingTTSUrl ? '#757575' : '#F2F2F2',
        width: '32px',
        height: '32px'
      }
    }
  },
  methods: {
    onError() {
      this.$emit('srcError')
    },
    onChangeCurrentTime(index) {
      this.$refs.refAudio.currentTime = parseInt((index / 100) * this.audio.maxTime)
    },
    onTogglePlay() {
      return this.audio.playing ? this.onPauseAudio() : this.onPlayAudio()
    },
    onPlayAudio() {
      this.$refs.refAudio.play()
      this.$emit('play')
    },
    onPauseAudio() {
      this.$refs.refAudio.pause()
      this.$emit('pause')
    },
    onPlay() {
      this.audio.playing = true
    },
    onPause() {
      this.audio.playing = false
    },
    onTimeupdate(event) {
      this.audio.currentTime = event.target.currentTime
      this.sliderTime = parseInt((this.audio.currentTime / this.audio.maxTime) * 100)
    },
    onLoadedmetadata(event) {
      this.audio.maxTime = parseInt(event.target.duration)
      this.canPlay = true
    }
  },
  created() {
    if (this.type === 'server') {
      axios({
        url: this.src,
        method: 'GET',
        responseType: 'blob'
      }).then((res) => {
        if (res?.data) this.url = window.URL.createObjectURL(new Blob([res.data]))
      })
    } else {
      this.url = this.src
    }
  }
}
</script>
