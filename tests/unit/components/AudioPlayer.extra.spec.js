jest.mock('axios', () => jest.fn(() => Promise.resolve({ data: 'blob-bytes' })))
jest.mock('@/utils/functions', () => ({
  formatSeconds: jest.fn((val) => `t${val}`)
}))

import AudioPlayer from '@/components/AudioPlayer.vue'

describe('AudioPlayer.vue (extra branch coverage)', () => {
  describe('onError branch', () => {
    it('does not emit when src is empty', () => {
      const emit = jest.fn()
      AudioPlayer.methods.onError.call({ src: '', $emit: emit })
      expect(emit).not.toHaveBeenCalled()
    })
    it('does not emit when src is null', () => {
      const emit = jest.fn()
      AudioPlayer.methods.onError.call({ src: null, $emit: emit })
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('onTimeupdate edge cases', () => {
    it('produces NaN sliderTime when maxTime is 0', () => {
      const ctx = {
        audio: { currentTime: 0, maxTime: 0, playing: false },
        sliderTime: 0
      }
      AudioPlayer.methods.onTimeupdate.call(ctx, { target: { currentTime: 0 } })
      expect(Number.isNaN(ctx.sliderTime)).toBe(true)
    })
  })

  describe('isFetchingTTSUrl watcher', () => {
    it('does not change canPlay when val is false', () => {
      const ctx = { canPlay: true }
      AudioPlayer.watch.isFetchingTTSUrl.handler.call(ctx, false)
      expect(ctx.canPlay).toBe(true)
    })
  })

  describe('src watcher server type', () => {
    it('does not update url for server type', () => {
      const ctx = {
        type: 'server',
        url: 'existing',
        $forceUpdate: jest.fn(),
        onChangeCurrentTime: jest.fn(),
        onPause: jest.fn()
      }
      AudioPlayer.watch.src.call(ctx, 'https://new.mp3')
      expect(ctx.$forceUpdate).toHaveBeenCalled()
      expect(ctx.url).toBe('existing')
      expect(ctx.onChangeCurrentTime).not.toHaveBeenCalled()
    })
    it('sets url to null when newSrc is empty', () => {
      const ctx = {
        type: 'client',
        url: 'old',
        $forceUpdate: jest.fn(),
        onChangeCurrentTime: jest.fn(),
        onPause: jest.fn()
      }
      AudioPlayer.watch.src.call(ctx, '')
      expect(ctx.url).toBeNull()
    })
  })

  describe('created client type', () => {
    it('sets url directly for client type', () => {
      const ctx = { type: 'client', src: 'https://cdn.example.com/audio.mp3', url: null }
      AudioPlayer.created.call(ctx)
      expect(ctx.url).toBe('https://cdn.example.com/audio.mp3')
    })
  })
})
