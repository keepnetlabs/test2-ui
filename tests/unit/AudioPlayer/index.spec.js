import { createLocalVue, mount } from '@vue/test-utils'
import AudioPlayer from '@/components/AudioPlayer'
import { customVuetify as vuetify } from '../utils'

describe('Vishing template dialog step', () => {
  const localVue = createLocalVue()

  it('should render successfully', () => {
    const wrapper = mount(AudioPlayer, {
      localVue,
      vuetify,
      propsData: {
        src:
          'data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=='
      }
    })

    expect(wrapper.find('.audio-player__wrapper').exists()).toBeTruthy()
  })
})
