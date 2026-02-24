import { shallowMount } from '@vue/test-utils'
import Countdown from '@/components/Common/Countdown/Countdown.vue'

describe('Countdown.vue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders as Vue component', () => {
    const wrapper = shallowMount(Countdown)
    expect(wrapper.vm).toBeDefined()
  })

  it('getCountdown formats with leading zero when countDown < 10', () => {
    const wrapper = shallowMount(Countdown)
    wrapper.vm.countDown = 5
    expect(wrapper.vm.getCountdown).toContain('00:05')
  })

  it('getCountdown formats without leading zero when countDown >= 10', () => {
    const wrapper = shallowMount(Countdown)
    wrapper.vm.countDown = 25
    expect(wrapper.vm.getCountdown).toContain('00:25')
  })

  it('getCountdown contains Resend SMS text', () => {
    const wrapper = shallowMount(Countdown)
    expect(wrapper.vm.getCountdown).toContain('Resend SMS in')
  })

  it('countDownTimer decrements countDown', () => {
    const wrapper = shallowMount(Countdown)
    expect(wrapper.vm.countDown).toBe(59)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.countDown).toBe(58)
  })

  it('emits changeButtonStatus when countDown reaches 0', () => {
    const wrapper = shallowMount(Countdown)
    expect(wrapper.vm.countDown).toBe(59)
    jest.advanceTimersByTime(59000)
    expect(wrapper.emitted('changeButtonStatus')).toBeTruthy()
  })
})
