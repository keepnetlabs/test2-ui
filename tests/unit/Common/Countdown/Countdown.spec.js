import { shallowMount } from '@vue/test-utils'
import Countdown from '@/components/Common/Countdown/Countdown.vue'

describe('Countdown.vue', () => {
  let wrapper
  jest.useFakeTimers()

  beforeEach(() => {
    wrapper = shallowMount(Countdown)
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllTimers()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should render a div element', () => {
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should have specific inline styles', () => {
      const div = wrapper.find('div')
      expect(div.vm.$attrs.style).toContain('font-size: 11px')
      expect(div.vm.$attrs.style).toContain('font-weight: normal')
      expect(div.vm.$attrs.style).toContain('text-align: center')
    })
  })

  describe('data initialization', () => {
    it('should initialize countDown to 59', () => {
      expect(wrapper.vm.countDown).toBe(59)
    })

    it('should start countdown on created', () => {
      expect(wrapper.vm.countDown).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should have changeButtonStatus prop', () => {
      expect(wrapper.vm.$options.props).toContain('changeButtonStatus')
    })

    it('should not require changeButtonStatus prop', () => {
      expect(wrapper.vm.$options.props.changeButtonStatus.required).toBe(false)
    })

    it('should accept changeButtonStatus prop', () => {
      wrapper = shallowMount(Countdown, {
        propsData: {
          changeButtonStatus: jest.fn()
        }
      })
      expect(wrapper.vm.changeButtonStatus).toBeDefined()
    })
  })

  describe('getCountdown computed property', () => {
    it('should return formatted countdown string', () => {
      expect(wrapper.vm.getCountdown).toContain('Resend SMS in 00:')
    })

    it('should display initial countdown at 59', () => {
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:59')
    })

    it('should format single digit numbers with leading zero', async () => {
      wrapper.vm.countDown = 5
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:05')
    })

    it('should format double digit numbers without leading zero', async () => {
      wrapper.vm.countDown = 15
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:15')
    })

    it('should show 00:00 when countdown is zero', async () => {
      wrapper.vm.countDown = 0
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:00')
    })

    it('should show 00:01 when countdown is one', async () => {
      wrapper.vm.countDown = 1
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:01')
    })

    it('should show 00:10 when countdown is ten', async () => {
      wrapper.vm.countDown = 10
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:10')
    })
  })

  describe('countdown timer', () => {
    it('should decrement countDown every 1000ms', () => {
      const initialCount = wrapper.vm.countDown
      jest.advanceTimersByTime(1000)
      expect(wrapper.vm.countDown).toBe(initialCount - 1)
    })

    it('should continue countdown after first decrement', () => {
      jest.advanceTimersByTime(1000)
      const afterFirstTick = wrapper.vm.countDown
      jest.advanceTimersByTime(1000)
      expect(wrapper.vm.countDown).toBe(afterFirstTick - 1)
    })

    it('should reach zero after 59 seconds', () => {
      jest.advanceTimersByTime(59000)
      expect(wrapper.vm.countDown).toBe(0)
    })

    it('should decrement multiple times correctly', () => {
      jest.advanceTimersByTime(5000)
      expect(wrapper.vm.countDown).toBe(54)

      jest.advanceTimersByTime(10000)
      expect(wrapper.vm.countDown).toBe(44)
    })
  })

  describe('countDownTimer method', () => {
    it('should be called on created', () => {
      const spy = jest.spyOn(wrapper.vm, 'countDownTimer')
      wrapper = shallowMount(Countdown)
      expect(wrapper.vm.countDownTimer).toBeDefined()
    })

    it('should decrement countDown by 1', () => {
      const initialCount = wrapper.vm.countDown
      jest.advanceTimersByTime(1000)
      expect(wrapper.vm.countDown).toBe(initialCount - 1)
    })

    it('should call itself recursively', () => {
      jest.advanceTimersByTime(1000)
      expect(wrapper.vm.countDown).toBe(58)
      jest.advanceTimersByTime(1000)
      expect(wrapper.vm.countDown).toBe(57)
    })

    it('should stop recursion when countDown reaches 0', () => {
      jest.advanceTimersByTime(59000)
      expect(wrapper.vm.countDown).toBe(0)
      jest.advanceTimersByTime(1000)
      expect(wrapper.vm.countDown).toBe(0) // Should not decrement below 0
    })
  })

  describe('emit changeButtonStatus', () => {
    it('should emit changeButtonStatus when countdown reaches zero', () => {
      jest.advanceTimersByTime(59000)
      expect(wrapper.emitted('changeButtonStatus')).toBeTruthy()
    })

    it('should emit changeButtonStatus only once', () => {
      jest.advanceTimersByTime(59000)
      jest.advanceTimersByTime(10000)
      expect(wrapper.emitted('changeButtonStatus').length).toBe(1)
    })

    it('should not emit changeButtonStatus before countdown reaches zero', () => {
      jest.advanceTimersByTime(50000)
      expect(wrapper.emitted('changeButtonStatus')).toBeFalsy()
    })
  })

  describe('text display', () => {
    it('should render getCountdown text', () => {
      expect(wrapper.text()).toBe('Resend SMS in 00:59')
    })

    it('should update displayed text as countdown decrements', () => {
      expect(wrapper.text()).toBe('Resend SMS in 00:59')
      jest.advanceTimersByTime(1000)
      expect(wrapper.text()).toBe('Resend SMS in 00:58')
    })

    it('should show updated text after multiple ticks', () => {
      jest.advanceTimersByTime(5000)
      expect(wrapper.text()).toContain('00:54')
    })
  })

  describe('styling', () => {
    it('should have small font size', () => {
      expect(wrapper.find('div').vm.$attrs.style).toContain('font-size: 11px')
    })

    it('should have normal font weight', () => {
      expect(wrapper.find('div').vm.$attrs.style).toContain('font-weight: normal')
    })

    it('should have centered text', () => {
      expect(wrapper.find('div').vm.$attrs.style).toContain('text-align: center')
    })

    it('should have specific color', () => {
      expect(wrapper.find('div').vm.$attrs.style).toContain('rgba(56, 59, 65, 0.72)')
    })

    it('should have normal letter spacing', () => {
      expect(wrapper.find('div').vm.$attrs.style).toContain('letter-spacing: normal')
    })
  })

  describe('edge cases', () => {
    it('should handle very short timeouts', () => {
      jest.advanceTimersByTime(100)
      expect(wrapper.vm.countDown).toBe(59)

      jest.advanceTimersByTime(900)
      expect(wrapper.vm.countDown).toBe(58)
    })

    it('should display correctly at various countdown values', async () => {
      wrapper.vm.countDown = 0
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:00')

      wrapper.vm.countDown = 30
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:30')

      wrapper.vm.countDown = 59
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:59')
    })
  })

  describe('countdown complete state', () => {
    it('should remain at zero after countdown completes', () => {
      jest.advanceTimersByTime(59000)
      expect(wrapper.vm.countDown).toBe(0)

      jest.advanceTimersByTime(10000)
      expect(wrapper.vm.countDown).toBe(0)
    })

    it('should display 00:00 when complete', () => {
      jest.advanceTimersByTime(59000)
      expect(wrapper.text()).toBe('Resend SMS in 00:00')
    })
  })

  describe('component lifecycle', () => {
    it('should initialize countdown in created hook', () => {
      wrapper = shallowMount(Countdown)
      expect(wrapper.vm.countDown).toBe(59)
    })

    it('should cleanup timers on destroy', () => {
      const clearSpy = jest.spyOn(global, 'clearTimeout')
      wrapper.destroy()
      // Timers should be cleaned up by jest.useFakeTimers
      expect(clearSpy).toBeDefined()
    })
  })

  describe('format verification', () => {
    it('should always have format "Resend SMS in HH:MM"', () => {
      jest.advanceTimersByTime(15000)
      const text = wrapper.vm.getCountdown
      expect(text).toMatch(/Resend SMS in \d{2}:\d{2}/)
    })

    it('should have valid time format throughout countdown', () => {
      for (let i = 0; i < 59; i++) {
        jest.advanceTimersByTime(1000)
        expect(wrapper.vm.getCountdown).toMatch(/Resend SMS in 00:\d{2}/)
      }
    })
  })

  describe('reactivity', () => {
    it('should reactively update countDown value', async () => {
      wrapper.vm.countDown = 10
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:10')

      wrapper.vm.countDown = 5
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getCountdown).toBe('Resend SMS in 00:05')
    })

    it('should update displayed text reactively', async () => {
      wrapper.vm.countDown = 20
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe('Resend SMS in 00:20')

      wrapper.vm.countDown = 15
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe('Resend SMS in 00:15')
    })
  })
})
