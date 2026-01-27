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
    const audio = wrapper.find('audio')
    
    // loadedmetadata
    await audio.trigger('loadedmetadata', { target: { duration: 120 } })
    expect(wrapper.vm.audio.maxTime).toBe(120)
    expect(wrapper.vm.canPlay).toBe(true)

    // play event
    await audio.trigger('play')
    expect(wrapper.vm.audio.playing).toBe(true)

    // timeupdate
    await audio.trigger('timeupdate', { target: { currentTime: 60 } })
    expect(wrapper.vm.audio.currentTime).toBe(60)
    expect(wrapper.vm.sliderTime).toBe(50) 

    // pause event
    await audio.trigger('pause')
    expect(wrapper.vm.audio.playing).toBe(false)
  })

  it('handles error event', async () => {
    const wrapper = mountComponent()
    await wrapper.find('audio').trigger('error')
    expect(wrapper.emitted('srcError')).toBeTruthy()
  })

  it('does not emit error if src is missing', async () => {
    const wrapper = mountComponent({ src: '' })
    await wrapper.find('audio').trigger('error')
    expect(wrapper.emitted('srcError')).toBeFalsy()
  })

  it('updates current time when slider changes', async () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs.refAudio.currentTime = 0 
    await wrapper.setData({ audio: { maxTime: 200 } })
    
    wrapper.vm.onChangeCurrentTime(50) 
    expect(wrapper.vm.$refs.refAudio.currentTime).toBe(100)
  })

  it('handles watchers for isFetchingTTSUrl', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ canPlay: true })
    
    await wrapper.setProps({ isFetchingTTSUrl: true })
    expect(wrapper.vm.canPlay).toBe(false)
  })

  it('handles watchers for src in client mode', async () => {
    const wrapper = mountComponent()
    
    // Set initial state
    await wrapper.setData({ audio: { playing: true, maxTime: 100 } })
    wrapper.vm.onChangeCurrentTime = jest.fn()
    
    // Trigger watcher logic manually or via props if robust
    await wrapper.setProps({ src: 'http://new.com/music.mp3' })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.url).toBe('http://new.com/music.mp3')
    expect(wrapper.vm.audio.playing).toBe(false) // onPause logic
    expect(wrapper.vm.onChangeCurrentTime).toHaveBeenCalledWith(1)
  })

  it('computes getCurrentTime correctly', () => {
    const wrapper = mountComponent()
    wrapper.setData({ audio: { currentTime: 10, maxTime: 100 } })
    // formatSeconds is mocked to return "formatted:val"
    expect(wrapper.vm.getCurrentTime).toBe('formatted:10 - formatted:100')
  })
  
  it('computes getButtonStyles correctly', () => {
    const wrapper = mountComponent()
    
    // Case 1: canPlay=false
    wrapper.setData({ canPlay: false })
    expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#F2F2F2')
    
    // Case 2: canPlay=true, isFetchingTTSUrl=true
    wrapper.setProps({ isFetchingTTSUrl: true })
    wrapper.setData({ canPlay: true }) // fetch watcher sets it to false, so explicitly set back or test flow
    // Actually watcher sets canPlay=false immediately.
    // Let's force it for testing computed isolation if possible, or respect logic.
    // If props change, watcher runs.
    
    // Let's rely on logic: canPlay && !isFetching
    // If isFetching=true, canPlay becomes false due to watcher.
    // So bg will be #F2F2F2.
    
    expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#F2F2F2')
    
    // Case 3: canPlay=true, isFetching=false
    wrapper.setProps({ isFetchingTTSUrl: false })
    wrapper.setData({ canPlay: true })
    expect(wrapper.vm.getButtonStyles.backgroundColor).toBe('#757575')
  })
})
