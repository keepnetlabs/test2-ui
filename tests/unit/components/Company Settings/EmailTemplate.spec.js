import { shallowMount } from '@vue/test-utils'
import EmailTemplate from '@/components/Company Settings/EmailTemplate.vue'
import {
  AI_ALLY_EMAIL_SUGGESTIONS,
  AI_ALLY_LURE_SUGGESTIONS,
  AI_ALLY_LANDING_SUGGESTIONS
} from '@/components/Company Settings/utils'

describe('EmailTemplate.vue', () => {
  it('has expected component name', () => {
    expect(EmailTemplate.name).toBe('EmailTemplate')
  })

  it('computed getSelectedStateName and isUSAStateSelected work correctly', () => {
    const stateCtx = {
      localeOptions: [
        { resourceId: 'us-ca', name: 'California' },
        { resourceId: 'de', name: 'Germany' }
      ],
      localizationResourceId: 'us-ca',
      usaStateResourceIds: ['us-ca', 'us-ny']
    }

    expect(EmailTemplate.computed.getSelectedStateName.call(stateCtx)).toBe('California')
    expect(EmailTemplate.computed.isUSAStateSelected.call(stateCtx)).toBe(true)
  })

  it('handleValueComparator supports direct and USA mapped comparison', () => {
    const ctx = {
      usaResourceId: 'usa-root',
      usaStateResourceIds: ['us-ca', 'us-ny']
    }

    expect(EmailTemplate.methods.handleValueComparator.call(ctx, 'same', 'same')).toBe(true)
    expect(EmailTemplate.methods.handleValueComparator.call(ctx, 'usa-root', 'us-ca')).toBe(true)
    expect(EmailTemplate.methods.handleValueComparator.call(ctx, 'usa-root', 'de')).toBe(false)
  })

  it('displayedBadgeContents selects landing, lure (no-link), or default email suggestions', () => {
    // landing wins regardless of useLureSuggestions
    expect(
      EmailTemplate.computed.displayedBadgeContents.call({
        templateType: 'landing',
        useLureSuggestions: true
      })
    ).toBe(AI_ALLY_LANDING_SUGGESTIONS)
    // barrel lure editor → no-link lure suggestions
    expect(
      EmailTemplate.computed.displayedBadgeContents.call({
        templateType: 'email',
        useLureSuggestions: true
      })
    ).toBe(AI_ALLY_LURE_SUGGESTIONS)
    // default (payload / normal) → link-bearing suggestions
    expect(
      EmailTemplate.computed.displayedBadgeContents.call({
        templateType: 'email',
        useLureSuggestions: false
      })
    ).toBe(AI_ALLY_EMAIL_SUGGESTIONS)
  })

  it('lure suggestions never instruct the AI to include a link (payload ones do)', () => {
    // Guards the core barrel rule: the lure email must not contain links.
    AI_ALLY_LURE_SUGGESTIONS.forEach((s) => {
      expect(s.content.toLowerCase()).not.toContain('include a link')
      expect(s.content).toMatch(/do not include any links|no links/i)
    })
    // payload/email suggestions intentionally drive a link/CTA
    expect(AI_ALLY_EMAIL_SUGGESTIONS.some((s) => /link/i.test(s.content))).toBe(true)
    // the two sets cover the same themes
    expect(AI_ALLY_LURE_SUGGESTIONS.map((s) => s.title)).toEqual(
      AI_ALLY_EMAIL_SUGGESTIONS.map((s) => s.title)
    )
  })

  it('handleAiAssistantBadgeClick copies the prompt from displayedBadgeContents', () => {
    const ctx = {
      displayedBadgeContents: [{ content: 'first prompt' }, { content: 'second prompt' }],
      aiTemplateText: ''
    }
    EmailTemplate.methods.handleAiAssistantBadgeClick.call(ctx, 1)
    expect(ctx.aiTemplateText).toBe('second prompt')
  })

  it('changeGrapesModalStatus toggles modal and emits template-edit', () => {
    const ctx = { showGrapesModal: false, $emit: jest.fn() }

    EmailTemplate.methods.changeGrapesModalStatus.call(ctx)
    expect(ctx.showGrapesModal).toBe(true)
    expect(ctx.$emit).toHaveBeenCalledWith('template-edit', true)

    EmailTemplate.methods.changeGrapesModalStatus.call(ctx)
    expect(ctx.showGrapesModal).toBe(false)
    expect(ctx.$emit).toHaveBeenCalledWith('template-edit', false)
  })

  it('shows subject but hides sender fields for teams notification templates', () => {
    const wrapper = shallowMount(EmailTemplate, {
      propsData: {
        template: '<div>Body</div>',
        subject: 'Teams subject',
        hideNotificationTemplateSenderFields: true,
        isNotificationTemplate: true,
        isNotificationEnrollment: true
      },
      mocks: {
        $store: {
          getters: {
            'whitelabel/getEmailTemplateLogoUrl': '',
            'dashboard/isPopupOpened': false,
            'permissions/getEmailTemplatesAIGenerationOptionsPermissions': false
          },
          state: {
            auth: {},
            dashboard: {},
            whitelabel: {}
          },
          dispatch: jest.fn()
        }
      }
    })

    expect(wrapper.find('#input--notification-template-subject').exists()).toBe(true)
    expect(wrapper.find('#input--notification-template-sender-name').exists()).toBe(false)
    expect(wrapper.find('#input--notification-template-from-email').exists()).toBe(false)
    expect(wrapper.find('#input--threat-sharing-incident-share-email').exists()).toBe(false)
  })
})
