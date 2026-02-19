jest.mock('axios', () => jest.fn(() => Promise.resolve({ data: 'blob-bytes' })))
jest.mock('@/utils/functions', () => ({
  formatSeconds: jest.fn((val) => `t${val}`)
}))

import axios from 'axios'
import AudioPlayer from '@/components/AudioPlayer.vue'

describe('AudioPlayer.vue', () => {
  it('computes current time label and button styles', () => {
    expect(
      AudioPlayer.computed.getCurrentTime.call({
        audio: { currentTime: 3, maxTime: 10 }
      })
    ).toBe('t3 - t10')

    const enabledStyle = AudioPlayer.computed.getButtonStyles.call({
      canPlay: true,
      isFetchingTTSUrl: false
    })
    expect(enabledStyle.backgroundColor).toBe('#757575')

    const disabledStyle = AudioPlayer.computed.getButtonStyles.call({
      canPlay: false,
      isFetchingTTSUrl: true
    })
    expect(disabledStyle.backgroundColor).toBe('#F2F2F2')
  })

  it('isFetchingTTSUrl watcher disables play', () => {
    const ctx = { canPlay: true }
    AudioPlayer.watch.isFetchingTTSUrl.handler.call(ctx, true)
    expect(ctx.canPlay).toBe(false)
  })

  it('src watcher updates url and resets playback for client type', () => {
    const onChangeCurrentTime = jest.fn()
    const onPause = jest.fn()
    const ctx = {
      type: 'client',
      url: null,
      $forceUpdate: jest.fn(),
      onChangeCurrentTime,
      onPause
    }
    AudioPlayer.watch.src.call(ctx, 'https://cdn.example.com/audio.mp3')

    expect(ctx.$forceUpdate).toHaveBeenCalled()
    expect(ctx.url).toBe('https://cdn.example.com/audio.mp3')
    expect(onChangeCurrentTime).toHaveBeenCalledWith(1)
    expect(onPause).toHaveBeenCalled()
  })

  it('onTogglePlay routes to play or pause methods', () => {
    const playCtx = {
      audio: { playing: false },
      onPlayAudio: jest.fn(),
      onPauseAudio: jest.fn()
    }
    AudioPlayer.methods.onTogglePlay.call(playCtx)
    expect(playCtx.onPlayAudio).toHaveBeenCalled()

    const pauseCtx = {
      audio: { playing: true },
      onPlayAudio: jest.fn(),
      onPauseAudio: jest.fn()
    }
    AudioPlayer.methods.onTogglePlay.call(pauseCtx)
    expect(pauseCtx.onPauseAudio).toHaveBeenCalled()
  })

  it('updates timing and metadata values', () => {
    const ctx = {
      audio: { currentTime: 0, maxTime: 200, playing: false },
      sliderTime: 0,
      canPlay: false
    }
    AudioPlayer.methods.onTimeupdate.call(ctx, { target: { currentTime: 50 } })
    expect(ctx.audio.currentTime).toBe(50)
    expect(ctx.sliderTime).toBe(25)

    AudioPlayer.methods.onLoadedmetadata.call(ctx, { target: { duration: 187 } })
    expect(ctx.audio.maxTime).toBe(187)
    expect(ctx.canPlay).toBe(true)
  })

  it('changes current time and emits errors when needed', () => {
    const errorEmit = jest.fn()
    const ctx = {
      src: 'has-src',
      $emit: errorEmit
    }
    AudioPlayer.methods.onError.call(ctx)
    expect(errorEmit).toHaveBeenCalledWith('srcError')

    const audioCtx = {
      audio: { maxTime: 200 },
      $refs: { refAudio: { currentTime: 0 } }
    }
    AudioPlayer.methods.onChangeCurrentTime.call(audioCtx, 50)
    expect(audioCtx.$refs.refAudio.currentTime).toBe(100)
  })

  it('created hook fetches server blob and creates object url', async () => {
    const createObjectURL = jest.fn(() => 'blob:audio-url')
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = createObjectURL

    const ctx = {
      type: 'server',
      src: 'https://api.example.com/audio',
      url: null
    }

    AudioPlayer.created.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(axios).toHaveBeenCalledWith({
      url: 'https://api.example.com/audio',
      method: 'GET',
      responseType: 'blob'
    })
    expect(ctx.url).toBe('blob:audio-url')

    window.URL.createObjectURL = originalCreateObjectURL
  })
})
