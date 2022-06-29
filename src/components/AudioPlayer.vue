<template>
  <div class="audio-player__wrapper">
    <audio
      ref="refAudio"
      style="display: none;"
      :src="url"
      preload="auto"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate($event)"
      @loadedmetadata="onLoadedmetadata($event)"
    />
    <div class="audio-player">
      <v-btn
        small
        icon
        color="#ffffff"
        :style="canPlay ? 'background-color: #000000;' : ''"
        :disabled="!canPlay"
        @click="onTogglePlay"
      >
        <v-icon size="16">{{ audio.playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      </v-btn>
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
      type: String,
      default: 'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
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
  computed: {
    getCurrentTime() {
      return `${formatSeconds(this.audio.currentTime)} - ${formatSeconds(this.audio.maxTime)}`
    }
  },
  methods: {
    onChangeCurrentTime(index) {
      this.onPauseAudio()
      this.$refs.refAudio.currentTime = parseInt((index / 100) * this.audio.maxTime)
      this.onPlayAudio()
    },
    onTogglePlay() {
      return this.audio.playing ? this.onPauseAudio() : this.onPlayAudio()
    },
    onPlayAudio() {
      this.$refs.refAudio.play()
    },
    onPauseAudio() {
      this.$refs.refAudio.pause()
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

<style lang="scss">
.audio-player {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0px;
  .el-slider__runway {
    height: 4px !important;
    background-color: #e0e0e0 !important;
  }
  .el-slider__bar {
    height: 4px !important;
    background-color: #757575 !important;
  }
  .el-slider__button-wrapper {
    display: none !important;
  }
}
.audio-player__track {
  flex: 1;
  max-width: 450px;
}
.audio-payer__time-text {
  color: #383b41;
  font-weight: 400;
  font-size: 14px;
}
</style>
