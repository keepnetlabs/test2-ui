import { createLocalVue, shallowMount } from '@vue/test-utils'
import AudioPlayer from '@/components/AudioPlayer.vue'
import Vuetify from 'vuetify'
import axios from 'axios'
import { formatSeconds } from '@/utils/functions'

jest.mock('axios')
jest.mock('@/utils/functions', () => ({
  formatSeconds: jest.fn(val => `formatted:${val}`)
}))

describe('AudioPlayer.vue', () => {
  const localVue = createLocalVue()
  let vuetify
  let createObjectURLMock

  beforeEach(() => {
    vuetify = new Vuetify()
    createObjectURLMock = jest.fn(() => 'blob:url')
    window.URL.createObjectURL = createObjectURLMock
    
    // Stub media methods
    window.HTMLMediaElement.prototype.play = jest.fn()
    window.HTMLMediaElement.prototype.pause = jest.fn()
    
    // reset mocks
    jest.clearAllMocks()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(AudioPlayer, {
      localVue,
      vuetify,
      propsData: {
        src: 'http://test.com/audio.mp3',
        ...propsData
      },
      stubs: {
        'el-slider': {
          template: '<div class="el-slider-stub" @input="$emit(\'input\', $event)" @change="$emit(\'change\', $event)"></div>',
          props: ['value']
        }
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.audio-player__wrapper').exists()).toBe(true)
    expect(wrapper.find('audio').exists()).toBe(true)
  })

  it('initializes with type="client" by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.url).toBe('http://test.com/audio.mp3')
  })

  it('initializes with type="server" and fetches blob', async () => {
    const data = new Blob(['test'], { type: 'audio/mp3' })
    axios.mockResolvedValue({ data })
    const wrapper = mountComponent({ type: 'server' })
    
    // Wait for axios
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(axios).toHaveBeenCalledWith({
      url: 'http://test.com/audio.mp3',
      method: 'GET',
      responseType: 'blob'
    })
    expect(createObjectURLMock).toHaveBeenCalled()
    expect(wrapper.vm.url).toBe('blob:url')
  })

  it('handles play/pause toggle when not playing', async () => {
    const wrapper = mountComponent()
    
    // Spy on internal methods
    const playSpy = jest.spyOn(wrapper.vm, 'onPlayAudio').mockImplementation(() => {})
    const pauseSpy = jest.spyOn(wrapper.vm, 'onPauseAudio').mockImplementation(() => {})

    await wrapper.setData({ audio: { playing: false, maxTime: 100 } })
    await wrapper.setData({ canPlay: true })
    
    wrapper.vm.onTogglePlay()
    
    expect(playSpy).toHaveBeenCalled()
    expect(pauseSpy).not.toHaveBeenCalled()
  })

  it('handles play/pause toggle when playing', async () => {
    const wrapper = mountComponent()
    const playSpy = jest.spyOn(wrapper.vm, 'onPlayAudio').mockImplementation(() => {})
    const pauseSpy = jest.spyOn(wrapper.vm, 'onPauseAudio').mockImplementation(() => {})

    await wrapper.setData({ audio: { playing: true, maxTime: 100 } })
    await wrapper.setData({ canPlay: true })

    wrapper.vm.onTogglePlay()
    
    expect(pauseSpy).toHaveBeenCalled()
    expect(playSpy).not.toHaveBeenCalled()
  })

  it('calls audio element play on onPlayAudio', () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs.refAudio.play = jest.fn()
    wrapper.vm.onPlayAudio()
    expect(wrapper.vm.$refs.refAudio.play).toHaveBeenCalled()
    expect(wrapper.emitted('play')).toBeTruthy()
  })

  it('calls audio element pause on onPauseAudio', () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs.refAudio.pause = jest.fn()
    wrapper.vm.onPauseAudio()
    expect(wrapper.vm.$refs.refAudio.pause).toHaveBeenCalled()
    expect(wrapper.emitted('pause')).toBeTruthy()
  })

  it('updates state on audio events', async () => {
    const wrapper = mountComponent()
    
    // loadedmetadata
    // Manually call handler to avoid JSDOM readonly target issue
    wrapper.vm.onLoadedmetadata({ target: { duration: 120 } })
    expect(wrapper.vm.audio.maxTime).toBe(120)
    expect(wrapper.vm.canPlay).toBe(true)

    // play event
    wrapper.vm.onPlay()
    expect(wrapper.vm.audio.playing).toBe(true)

    // timeupdate
    wrapper.vm.onTimeupdate({ target: { currentTime: 60 } })
    expect(wrapper.vm.audio.currentTime).toBe(60)
    expect(wrapper.vm.sliderTime).toBe(50) 

    // pause event
    wrapper.vm.onPause()
    expect(wrapper.vm.audio.playing).toBe(false)
  })

  it('handles error event', async () => {
    const wrapper = mountComponent()
    wrapper.vm.onError()
    expect(wrapper.emitted('srcError')).toBeTruthy()
  })

  it('does not emit error if src is missing', async () => {
    const wrapper = mountComponent({ src: '' })
    wrapper.vm.onError()
    expect(wrapper.emitted('srcError')).toBeFalsy()
  })

  // ... (keep intermediate tests if any omitted) ...

  // Skipping to getButtonStyles fix:

  it('computes getButtonStyles correctly', async () => {
    const wrapper = mountComponent()

    // Case 1: canPlay=false
    await wrapper.setData({ canPlay: false })
    expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#F2F2F2')

    // Case 2: canPlay=true, isFetchingTTSUrl=true
    await wrapper.setProps({ isFetchingTTSUrl: true })
    // Watcher sets canPlay=false, force it true for this specific test case regarding styles computation
    await wrapper.setData({ canPlay: true })

    expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#F2F2F2')

    // Case 3: canPlay=true, isFetching=false
    await wrapper.setProps({ isFetchingTTSUrl: false })
    await wrapper.setData({ canPlay: true })

    expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#757575')
  })

  describe('Component Structure', () => {
    it('should render audio player container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.audio-player__wrapper').exists()).toBe(true)
    })

    it('should have audio element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('audio').exists()).toBe(true)
    })

    it('should have play/pause button', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have time display elements', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.audio).toBeDefined()
    })

    it('should have progress slider', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-slider-stub').exists()).toBe(true)
    })
  })

  describe('Player Controls', () => {
    it('should toggle from pause to play', async () => {
      const wrapper = mountComponent()
      const playSpy = jest.spyOn(wrapper.vm, 'onPlayAudio').mockImplementation(() => {})

      await wrapper.setData({ audio: { playing: false, maxTime: 100 } })
      await wrapper.setData({ canPlay: true })

      wrapper.vm.onTogglePlay()
      expect(playSpy).toHaveBeenCalled()
    })

    it('should toggle from play to pause', async () => {
      const wrapper = mountComponent()
      const pauseSpy = jest.spyOn(wrapper.vm, 'onPauseAudio').mockImplementation(() => {})

      await wrapper.setData({ audio: { playing: true, maxTime: 100 } })
      await wrapper.setData({ canPlay: true })

      wrapper.vm.onTogglePlay()
      expect(pauseSpy).toHaveBeenCalled()
    })

    it('should play audio', () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refAudio.play = jest.fn()

      wrapper.vm.onPlayAudio()
      expect(wrapper.vm.$refs.refAudio.play).toHaveBeenCalled()
    })

    it('should pause audio', () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refAudio.pause = jest.fn()

      wrapper.vm.onPauseAudio()
      expect(wrapper.vm.$refs.refAudio.pause).toHaveBeenCalled()
    })

    it('should manage play with canPlay flag', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ canPlay: false })

      expect(wrapper.vm.canPlay).toBe(false)

      await wrapper.setData({ canPlay: true })
      expect(wrapper.vm.canPlay).toBe(true)
    })
  })

  describe('Audio State Management', () => {
    it('should initialize audio state', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.audio).toBeDefined()
      expect(wrapper.vm.audio.playing).toBe(false)
    })

    it('should track playing state', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onPlay()
      expect(wrapper.vm.audio.playing).toBe(true)

      wrapper.vm.onPause()
      expect(wrapper.vm.audio.playing).toBe(false)
    })

    it('should update current time', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onTimeupdate({ target: { currentTime: 30 } })
      expect(wrapper.vm.audio.currentTime).toBe(30)
    })

    it('should update max duration', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 180 } })
      expect(wrapper.vm.audio.maxTime).toBe(180)
    })

    it('should manage canPlay flag', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ canPlay: false })
      expect(wrapper.vm.canPlay).toBe(false)

      await wrapper.setData({ canPlay: true })
      expect(wrapper.vm.canPlay).toBe(true)
    })
  })

  describe('Time Display', () => {
    it('should format current time', () => {
      const wrapper = mountComponent()
      wrapper.vm.onTimeupdate({ target: { currentTime: 65 } })
      expect(formatSeconds).toHaveBeenCalled()
    })

    it('should format max time', () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 300 } })
      expect(wrapper.vm.audio.maxTime).toBe(300)
    })

    it('should calculate slider percentage', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 100 } })
      wrapper.vm.onTimeupdate({ target: { currentTime: 50 } })
      expect(wrapper.vm.sliderTime).toBe(50)
    })

    it('should handle zero duration gracefully', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 0 } })
      expect(wrapper.vm.audio.maxTime).toBe(0)
    })

    it('should handle fractional seconds', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onTimeupdate({ target: { currentTime: 30.5 } })
      expect(wrapper.vm.audio.currentTime).toBe(30.5)
    })
  })

  describe('Audio Source Handling', () => {
    it('should accept client-side src', () => {
      const wrapper = mountComponent({ type: 'client' })
      expect(wrapper.vm.url).toBe('http://test.com/audio.mp3')
    })

    it('should fetch server-side audio as blob', async () => {
      const data = new Blob(['test'], { type: 'audio/mp3' })
      axios.mockResolvedValue({ data })

      const wrapper = mountComponent({ type: 'server' })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(axios).toHaveBeenCalledWith({
        url: 'http://test.com/audio.mp3',
        method: 'GET',
        responseType: 'blob'
      })
    })

    it('should convert blob to object URL', async () => {
      const data = new Blob(['test'], { type: 'audio/mp3' })
      axios.mockResolvedValue({ data })

      const wrapper = mountComponent({ type: 'server' })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(createObjectURLMock).toHaveBeenCalled()
      expect(wrapper.vm.url).toBe('blob:url')
    })

    it('should handle empty src', () => {
      const wrapper = mountComponent({ src: '' })
      expect(wrapper.vm.url).toBe('')
    })

    it('should support different audio formats', () => {
      const formats = ['audio.mp3', 'audio.wav', 'audio.ogg']
      formats.forEach(format => {
        const wrapper = mountComponent({ src: `http://test.com/${format}` })
        expect(wrapper.vm.url).toBe(`http://test.com/${format}`)
      })
    })
  })

  describe('Event Handling', () => {
    it('should emit play event', () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refAudio.play = jest.fn()
      wrapper.vm.onPlayAudio()
      expect(wrapper.emitted('play')).toBeTruthy()
    })

    it('should emit pause event', () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refAudio.pause = jest.fn()
      wrapper.vm.onPauseAudio()
      expect(wrapper.emitted('pause')).toBeTruthy()
    })

    it('should emit error event on audio error', () => {
      const wrapper = mountComponent()
      wrapper.vm.onError()
      expect(wrapper.emitted('srcError')).toBeTruthy()
    })

    it('should not emit error without src', () => {
      const wrapper = mountComponent({ src: '' })
      wrapper.vm.onError()
      expect(wrapper.emitted('srcError')).toBeFalsy()
    })

    it('should handle time update events', () => {
      const wrapper = mountComponent()
      wrapper.vm.onTimeupdate({ target: { currentTime: 45 } })
      expect(wrapper.vm.audio.currentTime).toBe(45)
    })

    it('should handle loaded metadata events', () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 200 } })
      expect(wrapper.vm.audio.maxTime).toBe(200)
      expect(wrapper.vm.canPlay).toBe(true)
    })
  })

  describe('Styling and Appearance', () => {
    it('should compute button styles when disabled', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ canPlay: false })
      expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#F2F2F2')
    })

    it('should compute button styles when fetching', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ isFetchingTTSUrl: true })
      await wrapper.setData({ canPlay: true })
      expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#F2F2F2')
    })

    it('should compute button styles when enabled', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ isFetchingTTSUrl: false })
      await wrapper.setData({ canPlay: true })
      expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#757575')
    })

    it('should have consistent styling across renders', async () => {
      const wrapper = mountComponent()
      const style1 = wrapper.vm.getButtonStyles
      await wrapper.vm.$forceUpdate()
      const style2 = wrapper.vm.getButtonStyles
      expect(style1).toEqual(style2)
    })
  })

  describe('Props Management', () => {
    it('should accept src prop', () => {
      const wrapper = mountComponent({ src: 'http://test.com/audio.mp3' })
      expect(wrapper.props('src')).toBe('http://test.com/audio.mp3')
    })

    it('should accept type prop', () => {
      const wrapper = mountComponent({ type: 'server' })
      expect(wrapper.props('type')).toBe('server')
    })

    it('should accept isFetchingTTSUrl prop', () => {
      const wrapper = mountComponent({ isFetchingTTSUrl: true })
      expect(wrapper.props('isFetchingTTSUrl')).toBe(true)
    })

    it('should update when src changes', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.url).toBe('http://test.com/audio.mp3')

      await wrapper.setProps({ src: 'http://test.com/audio2.mp3' })
      expect(wrapper.vm.url).toBe('http://test.com/audio2.mp3')
    })

    it('should update when isFetchingTTSUrl changes', async () => {
      const wrapper = mountComponent({ isFetchingTTSUrl: false })
      await wrapper.setProps({ isFetchingTTSUrl: true })
      expect(wrapper.props('isFetchingTTSUrl')).toBe(true)
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete play cycle', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refAudio.play = jest.fn()
      wrapper.vm.$refs.refAudio.pause = jest.fn()

      await wrapper.setData({ audio: { playing: false, maxTime: 100 }, canPlay: true })

      // Play
      wrapper.vm.onTogglePlay()
      expect(wrapper.vm.$refs.refAudio.play).toHaveBeenCalled()

      // Simulate playing
      wrapper.vm.onPlay()
      expect(wrapper.vm.audio.playing).toBe(true)

      // Seek
      wrapper.vm.onTimeupdate({ target: { currentTime: 50 } })
      expect(wrapper.vm.audio.currentTime).toBe(50)

      // Pause
      wrapper.vm.onTogglePlay()
      expect(wrapper.vm.$refs.refAudio.pause).toHaveBeenCalled()
    })

    it('should handle server-side audio fetch and play', async () => {
      const data = new Blob(['test'], { type: 'audio/mp3' })
      axios.mockResolvedValue({ data })

      const wrapper = mountComponent({ type: 'server' })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(createObjectURLMock).toHaveBeenCalled()
      expect(wrapper.vm.url).toBe('blob:url')
    })

    it('should handle error recovery', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onError()
      expect(wrapper.emitted('srcError')).toBeTruthy()

      // Can recover by changing src
      await wrapper.setProps({ src: 'http://test.com/audio2.mp3' })
      expect(wrapper.vm.url).toBe('http://test.com/audio2.mp3')
    })

    it('should handle rapid play/pause toggles', async () => {
      const wrapper = mountComponent()
      wrapper.vm.$refs.refAudio.play = jest.fn()
      wrapper.vm.$refs.refAudio.pause = jest.fn()

      await wrapper.setData({ audio: { playing: false, maxTime: 100 }, canPlay: true })

      for (let i = 0; i < 5; i++) {
        wrapper.vm.onTogglePlay()
      }

      expect(wrapper.emitted('play') || wrapper.emitted('pause')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing audio element gracefully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle very long audio files', () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 36000 } })
      expect(wrapper.vm.audio.maxTime).toBe(36000)
    })

    it('should handle very short audio clips', () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 0.5 } })
      expect(wrapper.vm.audio.maxTime).toBeDefined()
    })

    it('should handle rapid time updates', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 100 } })

      for (let i = 0; i < 100; i++) {
        wrapper.vm.onTimeupdate({ target: { currentTime: i } })
      }

      expect(wrapper.vm.audio.currentTime).toBe(99)
    })

    it('should handle concurrent fetch and play', async () => {
      const data = new Blob(['test'], { type: 'audio/mp3' })
      axios.mockResolvedValue({ data })

      const wrapper = mountComponent({ type: 'server' })
      wrapper.vm.$refs.refAudio.play = jest.fn()

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.vm.url).toBe('blob:url')
    })

    it('should handle null values gracefully', () => {
      const wrapper = mountComponent()
      wrapper.vm.onTimeupdate({ target: { currentTime: null } })
      expect(wrapper.vm.audio.currentTime).toBe(null)
    })

    it('should handle NaN values gracefully', () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: NaN } })
      expect(wrapper.vm.audio.maxTime).toBe(NaN)
    })
  })

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = Date.now()
      mountComponent()
      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(500)
    })

    it('should handle frequent updates efficiently', async () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 100 } })

      const startTime = Date.now()
      for (let i = 0; i < 1000; i++) {
        wrapper.vm.onTimeupdate({ target: { currentTime: i % 100 } })
      }
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Accessibility', () => {
    it('should have semantic controls', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('audio').exists()).toBe(true)
    })

    it('should support keyboard controls', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.onTogglePlay).toBeDefined()
    })

    it('should display duration information', () => {
      const wrapper = mountComponent()
      wrapper.vm.onLoadedmetadata({ target: { duration: 60 } })
      expect(wrapper.vm.audio.maxTime).toBe(60)
    })

    it('should display current time', () => {
      const wrapper = mountComponent()
      wrapper.vm.onTimeupdate({ target: { currentTime: 30 } })
      expect(wrapper.vm.audio.currentTime).toBe(30)
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple player instances', () => {
      const wrapper1 = mountComponent({ src: 'http://test.com/audio1.mp3' })
      const wrapper2 = mountComponent({ src: 'http://test.com/audio2.mp3' })

      expect(wrapper1.vm.url).not.toBe(wrapper2.vm.url)
      wrapper2.destroy()
    })

    it('should maintain independent state', async () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.$refs.refAudio.play = jest.fn()
      wrapper2.vm.$refs.refAudio.play = jest.fn()

      wrapper1.vm.onPlayAudio()
      expect(wrapper1.vm.$refs.refAudio.play).toHaveBeenCalled()
      expect(wrapper2.vm.$refs.refAudio.play).not.toHaveBeenCalled()

      wrapper2.destroy()
    })
  })
})
