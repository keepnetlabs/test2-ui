import EmailDetailsContentDetails from '@/components/IncidentResponder/EmailDetails/EmailDetailsContentDetails.vue'
import { shallowMount } from '@vue/test-utils'

describe('EmailDetailsContentDetails.vue (extra branch coverage)', () => {
  const { computed, methods } = EmailDetailsContentDetails

  it('returns empty resource id when route param is missing', () => {
    expect(computed.getResourceId.call({ $route: { params: {} } })).toBe('')
  })

  it('returns undefined for to/cc/bcc when related fields are missing', () => {
    expect(computed.getMailDetailsTo.call({ mailDetails: {} })).toBeUndefined()
    expect(computed.getMailDetailsCc.call({ mailDetails: {} })).toBeUndefined()
    expect(computed.getMailDetailsBcc.call({ mailDetails: { bcc: ['x@y.com'] } })).toBeUndefined()
  })

  it('isReAnalyzeDisabled returns true for InProgress status', () => {
    const result = computed.isReAnalyzeDisabled.call({
      mailDetails: { status: 'InProgress' },
      getIncidentResponderNotifiedEmailReAnalyze: true
    })

    expect(result).toBe(true)
  })

  it('isReAnalyzeDisabled returns true when permission is missing and mailDetails is empty', () => {
    const result = computed.isReAnalyzeDisabled.call({
      mailDetails: undefined,
      getIncidentResponderNotifiedEmailReAnalyze: false
    })

    expect(result).toBe(true)
  })

  it('handleReAnalyze toggles dialog from true to false', () => {
    const ctx = {
      showReAnalyzeIncidentDialog: true,
      toggleShowReAnalyzeDialog: methods.toggleShowReAnalyzeDialog
    }

    methods.handleReAnalyze.call(ctx)

    expect(ctx.showReAnalyzeIncidentDialog).toBe(false)
  })

  describe('rendered event forwarding', () => {
    const createWrapper = (propsData = {}, dataOverrides = {}) =>
      shallowMount(EmailDetailsContentDetails, {
        propsData: {
          mailDetails: {
            subject: 'Suspicious mail',
            to: ['a@example.com'],
            cc: ['c@example.com'],
            bcc: ['b@example.com'],
            ...propsData.mailDetails
          },
          loading: false,
          ...propsData
        },
        mocks: {
          $route: { params: { id: 'mail-22' } },
          $store: {
            getters: {
              'permissions/getIncidentResponderNotifiedEmailReAnalyze': true
            }
          }
        },
        stubs: {
          VIcon: true,
          ReAnalyzeIncidentDialog: {
            props: ['status', 'name', 'resourceId'],
            template: `
              <div
                class="reanalyze-dialog-stub"
                :data-status="String(!!status)"
                :data-name="name"
                :data-resource-id="resourceId"
              />
            `
          },
          EmailDetailsSenderIpBlacklistCheck: {
            template: '<div class="sender-ip-blacklist-check-stub" @click="$emit(\'on-refresh-click\')" />'
          }
        }
      })

    it('emits handleDownloadEmail when download action is clicked', async () => {
      const wrapper = createWrapper()

      await wrapper.find('#btn--download-incident-responder-email-details').trigger('click')

      expect(wrapper.emitted('handleDownloadEmail')).toEqual([[]])
    })

    it('passes route resource id and subject into re-analyze dialog when open', async () => {
      const wrapper = createWrapper()

      await wrapper.setData({ showReAnalyzeIncidentDialog: true })

      const dialog = wrapper.find('.reanalyze-dialog-stub')
      expect(dialog.attributes('data-status')).toBe('true')
      expect(dialog.attributes('data-name')).toBe('Suspicious mail')
      expect(dialog.attributes('data-resource-id')).toBe('mail-22')
    })

    it('re-emits re-analyze event when sender IP blacklist child requests refresh', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.sender-ip-blacklist-check-stub').trigger('click')

      expect(wrapper.emitted('on-re-analyze-click')).toEqual([[]])
    })

    it('forwards re-analyze confirm from dialog and closes dialog on close event', async () => {
      const wrapper = shallowMount(EmailDetailsContentDetails, {
        propsData: {
          mailDetails: {
            subject: 'Suspicious mail'
          },
          loading: false
        },
        mocks: {
          $route: { params: { id: 'mail-22' } },
          $store: {
            getters: {
              'permissions/getIncidentResponderNotifiedEmailReAnalyze': true
            }
          }
        },
        stubs: {
          VIcon: true,
          ReAnalyzeIncidentDialog: {
            template: `
              <div class="reanalyze-dialog-stub">
                <button class="dialog-confirm" @click="$emit('on-confirm')" />
                <button class="dialog-close" @click="$emit('on-close-dialog')" />
              </div>
            `
          },
          EmailDetailsSenderIpBlacklistCheck: true
        }
      })

      await wrapper.setData({ showReAnalyzeIncidentDialog: true })
      await wrapper.find('.dialog-confirm').trigger('click')
      expect(wrapper.emitted('on-re-analyze-click')).toEqual([[]])

      await wrapper.find('.dialog-close').trigger('click')
      expect(wrapper.vm.showReAnalyzeIncidentDialog).toBe(false)
    })
  })
})
