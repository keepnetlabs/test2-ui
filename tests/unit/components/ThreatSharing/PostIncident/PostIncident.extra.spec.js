jest.mock('vue', () => {
  const Vue = jest.requireActual('vue')
  Vue.customElement = Vue.customElement || jest.fn()
  return Vue
})

import PostIncident from '@/components/ThreatSharing/PostIncident/PostIncident.vue'

describe('PostIncident.vue (branch coverage)', () => {
  it('onContinue returns current step when step1 is invalid', () => {
    const ctx = { isStep1Valid: false, step: 2 }

    const result = PostIncident.methods.onContinue.call(ctx)

    expect(result).toBe(2)
    expect(ctx.step).toBe(2)
  })

  it('onContinue increments step when step1 is valid', () => {
    const ctx = { isStep1Valid: true, step: 2 }

    const result = PostIncident.methods.onContinue.call(ctx)

    expect(result).toBe(2)
    expect(ctx.step).toBe(3)
  })

  it('onSecondStep increments only when refStep2Form validate returns true', () => {
    const validCtx = {
      step: 2,
      $refs: { refStep2Form: { validate: jest.fn(() => true) } }
    }
    const invalidCtx = {
      step: 2,
      $refs: { refStep2Form: { validate: jest.fn(() => false) } }
    }

    PostIncident.methods.onSecondStep.call(validCtx)
    PostIncident.methods.onSecondStep.call(invalidCtx)

    expect(validCtx.step).toBe(3)
    expect(invalidCtx.step).toBe(2)
  })

  it('onThirdStep stops when step3 form is invalid', () => {
    const ctx = {
      step: 3,
      $refs: { refStep3Form: { validate: jest.fn(() => false) } },
      setShadowRootMalicousLink: jest.fn()
    }

    PostIncident.methods.onThirdStep.call(ctx)

    expect(ctx.step).toBe(3)
    expect(ctx.setShadowRootMalicousLink).not.toHaveBeenCalled()
  })

  it('onThirdStep increments and prepares preview when form is valid', () => {
    const ctx = {
      step: 3,
      $refs: { refStep3Form: { validate: jest.fn(() => true) } },
      setShadowRootMalicousLink: jest.fn()
    }

    PostIncident.methods.onThirdStep.call(ctx)

    expect(ctx.step).toBe(4)
    expect(ctx.setShadowRootMalicousLink).toHaveBeenCalledWith('last-preview-body-shadow-root')
  })

  it('onPreviousButtonClick refreshes shadow root according to current step', () => {
    const ctxToFour = { step: 5, setShadowRootMalicousLink: jest.fn() }
    const ctxToOne = { step: 2, setShadowRootMalicousLink: jest.fn() }

    PostIncident.methods.onPreviousButtonClick.call(ctxToFour)
    PostIncident.methods.onPreviousButtonClick.call(ctxToOne)

    expect(ctxToFour.step).toBe(4)
    expect(ctxToFour.setShadowRootMalicousLink).toHaveBeenCalledWith('last-preview-body-shadow-root')
    expect(ctxToOne.step).toBe(1)
    expect(ctxToOne.setShadowRootMalicousLink).toHaveBeenCalledWith('incident-preview-1')
  })

  it('allUrlsValChange updates url flags and checks all-links switch', () => {
    const urlA = { isHidden: false, isFlagged: true, url: 'https://a.test' }
    const urlB = { isHidden: false, isFlagged: true, url: 'https://b.test' }
    const ctx = {
      uploadRespond: { urls: [urlA, urlB] },
      urlSwitchChange: jest.fn(function () {
        this.checkUrlChangeForAllLinksSwitch()
      }),
      checkUrlChangeForAllLinksSwitch: PostIncident.methods.checkUrlChangeForAllLinksSwitch,
      allLinks: false
    }

    PostIncident.methods.allUrlsValChange.call(ctx, true)

    expect(ctx.uploadRespond.urls.every((item) => item.isHidden)).toBe(true)
    expect(ctx.uploadRespond.urls.every((item) => !item.isFlagged)).toBe(true)
    expect(ctx.urlSwitchChange).toHaveBeenCalledTimes(2)
    expect(ctx.allLinks).toBe(true)
  })

  it('allAttachmentsValChange and checkAttachmentsChangeForAllLinksSwitch update attachment state', () => {
    const attachmentA = { isHidden: false, isFlagged: true }
    const attachmentB = { isHidden: false, isFlagged: true }
    const ctx = {
      uploadRespond: { attachments: [attachmentA, attachmentB] },
      allAttachments: false
    }

    PostIncident.methods.allAttachmentsValChange.call(ctx, true)
    PostIncident.methods.checkAttachmentsChangeForAllLinksSwitch.call(ctx, attachmentA)

    expect(ctx.uploadRespond.attachments.every((item) => item.isHidden)).toBe(true)
    expect(ctx.uploadRespond.attachments.every((item) => !item.isFlagged)).toBe(true)
    expect(ctx.allAttachments).toBe(true)
    expect(attachmentA.isFlagged).toBe(false)
  })

  it('headerValChange and field-specific handlers update flags and checkbox status', () => {
    const ctx = {
      uploadRespond: {
        subject: 'subject',
        from: 'sender@example.com',
        to: ['a@example.com'],
        cc: ['c@example.com'],
        bcc: ['b@example.com'],
        isSubjectHidden: false,
        isFromHidden: false,
        isToHidden: false,
        isCcHidden: false,
        isBccHidden: false,
        isSubjectFlagged: true,
        isFromFlagged: true,
        isToFlagged: true,
        isCcFlagged: true,
        isBccFlagged: true
      },
      allHeader: false,
      checkAllHeaderCheck: PostIncident.methods.checkAllHeaderCheck
    }

    PostIncident.methods.headerValChange.call(ctx, true)
    PostIncident.methods.subjectValChange.call(ctx, true)

    expect(ctx.uploadRespond.isSubjectHidden).toBe(true)
    expect(ctx.uploadRespond.isFromHidden).toBe(true)
    expect(ctx.uploadRespond.isToHidden).toBe(true)
    expect(ctx.uploadRespond.isCcHidden).toBe(true)
    expect(ctx.uploadRespond.isBccHidden).toBe(true)
    expect(ctx.uploadRespond.isSubjectFlagged).toBe(false)
    expect(ctx.uploadRespond.isFromFlagged).toBe(false)
    expect(ctx.uploadRespond.isToFlagged).toBe(false)
    expect(ctx.uploadRespond.isCcFlagged).toBe(false)
    expect(ctx.uploadRespond.isBccFlagged).toBe(false)
    expect(ctx.allHeader).toBe(true)
  })

  it('closePreview clears selected email, upload response, and uploaded file', () => {
    const ctx = {
      selectedEmail: 'mail@example.com',
      uploadRespond: { id: 'resp-1' },
      msgEmlFile: { name: 'sample.eml' }
    }

    PostIncident.methods.closePreview.call(ctx)

    expect(ctx.selectedEmail).toBeNull()
    expect(ctx.uploadRespond).toEqual({})
    expect(ctx.msgEmlFile).toBeNull()
  })
})
