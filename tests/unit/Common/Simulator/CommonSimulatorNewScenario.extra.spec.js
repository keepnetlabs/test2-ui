import CommonSimulatorNewScenario from '@/components/Common/Simulator/CommonSimulatorNewScenario.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

describe('CommonSimulatorNewScenario.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getSelectedRolesText returns "Not selected" when no roles', () => {
      const ctx = {
        isPhishing: true,
        selectedRoleNames: [],
        formValues: { roleResourceIds: [] }
      }
      expect(
        CommonSimulatorNewScenario.computed.getSelectedRolesText.call(ctx)
      ).toBe('Not selected')
    })

    it('getSelectedRolesText returns "1 role" when single role', () => {
      const ctx = {
        isPhishing: true,
        selectedRoleNames: [],
        formValues: { roleResourceIds: ['r1'] }
      }
      expect(
        CommonSimulatorNewScenario.computed.getSelectedRolesText.call(ctx)
      ).toBe('1 role')
    })

    it('getSelectedRolesText returns joined names when selectedRoleNames has values', () => {
      const ctx = {
        isPhishing: true,
        selectedRoleNames: ['Admin', 'Finance'],
        formValues: { roleResourceIds: [] }
      }
      expect(
        CommonSimulatorNewScenario.computed.getSelectedRolesText.call(ctx)
      ).toBe('Admin, Finance')
    })

    it('maxStep returns 3 when attachment based', () => {
      const ctx = { isAttachmentBasedScenario: true }
      expect(CommonSimulatorNewScenario.computed.maxStep.call(ctx)).toBe(3)
    })

    it('maxStep returns 4 when not attachment based', () => {
      const ctx = { isAttachmentBasedScenario: false }
      expect(CommonSimulatorNewScenario.computed.maxStep.call(ctx)).toBe(4)
    })

    it('isAttachmentBasedScenario returns false when methodTypeId is not 3', () => {
      const ctx = {
        isAttachmentBased: undefined,
        isEdit: false,
        isDuplicate: false,
        isFetched: true,
        formValues: { methodTypeId: '1' }
      }
      expect(
        CommonSimulatorNewScenario.computed.isAttachmentBasedScenario.call(ctx)
      ).toBe(false)
    })

    it('isAttachmentBasedScenario returns false when formValues.methodTypeId is undefined', () => {
      const ctx = {
        isAttachmentBased: undefined,
        isEdit: false,
        formValues: {}
      }
      expect(
        CommonSimulatorNewScenario.computed.isAttachmentBasedScenario.call(ctx)
      ).toBe(false)
    })

    it('getScenarioInfoItems includes Quishing Type when isQuishing', () => {
      const ctx = {
        isQuishing: true,
        isPhishing: false,
        formValues: { name: 'X', methodTypeId: '1' },
        getDifficultyType: 'Easy',
        getMethodText: 'Click',
        categoryText: '',
        quishingType: 'Individual'
      }
      const result = CommonSimulatorNewScenario.computed.getScenarioInfoItems.call(ctx)
      expect(result['Quishing Type']).toBe('Individual')
      expect(result['Category']).toBeUndefined()
    })

    it('getModalTitle returns correct strings for phishing new/edit/duplicate', () => {
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.PHISHING,
          isEdit: false
        })
      ).toBe('New Phishing Scenario')
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.PHISHING,
          isEdit: true,
          isDuplicate: true
        })
      ).toBe('Duplicate Phishing Scenario')
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.PHISHING,
          isEdit: true,
          isDuplicate: false
        })
      ).toBe('Edit Phishing Scenario')
    })

    it('getModalTitle returns correct strings for quishing new/edit/duplicate', () => {
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.QUISHING,
          isEdit: false
        })
      ).toBe('New Quishing Scenario')
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.QUISHING,
          isEdit: true,
          isDuplicate: true
        })
      ).toBe('Duplicate Quishing Scenario')
    })
  })

  describe('methods', () => {
    it('setFooterDuplicateIds sets duplicate specific button ids', () => {
      const ctx = { footerButtonsIds: {} }
      CommonSimulatorNewScenario.methods.setFooterDuplicateIds.call(ctx)

      expect(ctx.footerButtonsIds).toEqual({
        cancelButton: 'btn-cancel--duplicate-scenario-modal',
        backButton: 'btn-back--duplicate-scenario-modal',
        nextButton: 'btn-next--duplicate-scenario-modal',
        saveButton: 'btn-save--duplicate-scenario-modal'
      })
    })

    it('id setter methods update initial form and selected template ids', () => {
      const ctx = {
        initialFormValues: {},
        emailTemplateResourceId: null,
        landingPageTemplateResourceId: null
      }

      CommonSimulatorNewScenario.methods.getInitialEmailTemplateId.call(ctx, 'et-1')
      CommonSimulatorNewScenario.methods.getInitialLandingPageTemplateId.call(ctx, 'lp-1')
      CommonSimulatorNewScenario.methods.selectedEmailTemplateResourceId.call(ctx, 'et-r-1')
      CommonSimulatorNewScenario.methods.selectedLandingPageTemplateResourceId.call(ctx, 'lp-r-1')

      expect(ctx.initialFormValues.emailTemplateId).toBe('et-1')
      expect(ctx.initialFormValues.landingPageTemplateId).toBe('lp-1')
      expect(ctx.emailTemplateResourceId).toBe('et-r-1')
      expect(ctx.landingPageTemplateResourceId).toBe('lp-r-1')
    })

    it('selected template change methods update selected values', () => {
      const selectedEmailTemplate = { resourceId: 'et-1', name: 'Template 1' }
      const ctx = {
        formValues: {
          emailTemplateId: null,
          landingPageTemplateId: null
        },
        selectedEmailTemplate: null
      }

      CommonSimulatorNewScenario.methods.selectedEmailTemplateChange.call(
        ctx,
        'email-template-id',
        selectedEmailTemplate
      )
      CommonSimulatorNewScenario.methods.selectedLandingPageChange.call(ctx, 'landing-page-id')

      expect(ctx.formValues.emailTemplateId).toBe('email-template-id')
      expect(ctx.selectedEmailTemplate).toEqual(selectedEmailTemplate)
      expect(ctx.formValues.landingPageTemplateId).toBe('landing-page-id')
    })

    it('validateAvailableFor emits true when list has items and false when empty', () => {
      const emit = jest.fn()
      const ctx = {
        isAvailableForValidated: false,
        isAvailableForValid: false,
        $emit: emit
      }

      CommonSimulatorNewScenario.methods.validateAvailableFor.call(ctx, ['company-1'])
      expect(ctx.isAvailableForValidated).toBe(true)
      expect(ctx.isAvailableForValid).toBe(true)
      expect(emit).toHaveBeenLastCalledWith('validation', true)

      CommonSimulatorNewScenario.methods.validateAvailableFor.call(ctx, [])
      expect(ctx.isAvailableForValid).toBe(false)
      expect(emit).toHaveBeenLastCalledWith('validation', false)
    })

    it('handleClickOutsideNewEmailTemplateModal returns early on leaving dialog and snackbar click', () => {
      const closeMock = jest.fn()
      const ctxLeavingOpen = {
        $store: { state: { common: { isShowLeavingDialog: true } } },
        handleCloseNewEmailTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewEmailTemplateModal.call(
        ctxLeavingOpen,
        {}
      )
      expect(closeMock).not.toHaveBeenCalled()

      const event = {
        target: {
          closest: jest.fn((selector) =>
            selector.includes('.v-snack__wrapper') ? { id: 'snackbar' } : null
          )
        }
      }
      const ctx = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        handleCloseNewEmailTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewEmailTemplateModal.call(ctx, event)
      expect(closeMock).not.toHaveBeenCalled()
    })

    it('handleClickOutsideNewEmailTemplateModal closes grapes modal first and does not close drawer', () => {
      const closeMock = jest.fn()
      const ctx = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        $refs: {
          newEmailTemplate: {
            $refs: {
              refEmailTemplate: { showGrapesModal: true }
            }
          }
        },
        handleCloseNewEmailTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewEmailTemplateModal.call(ctx, null)

      expect(ctx.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal).toBe(false)
      expect(closeMock).not.toHaveBeenCalled()
    })

    it('handleClickOutsideNewEmailTemplateModal ignores leaving dialog buttons and closes when no guards match', () => {
      const closeMock = jest.fn()
      const eventLeavingButton = {
        target: {
          closest: jest.fn((selector) =>
            selector.includes('#btn-continue-editing--leaving-popup') ? { id: 'btn' } : null
          )
        }
      }
      const ctx = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        $refs: {},
        handleCloseNewEmailTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewEmailTemplateModal.call(
        ctx,
        eventLeavingButton
      )
      expect(closeMock).not.toHaveBeenCalled()

      CommonSimulatorNewScenario.methods.handleClickOutsideNewEmailTemplateModal.call(ctx, null)
      expect(closeMock).toHaveBeenCalledTimes(1)
    })

    it('handleClickOutsideNewLandingPageTemplateModal respects menu-open branch and close branch', () => {
      const closeMock = jest.fn()
      const ctxMenuOpen = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        $refs: {
          newLandingPage: {
            isPageAddMenuOpen: [false, true]
          }
        },
        handleCloseNewLandingPageTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewLandingPageTemplateModal.call(
        ctxMenuOpen,
        null
      )
      expect(closeMock).not.toHaveBeenCalled()

      const ctxClose = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        $refs: {
          newLandingPage: {
            isPageAddMenuOpen: [false, false]
          }
        },
        handleCloseNewLandingPageTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewLandingPageTemplateModal.call(
        ctxClose,
        null
      )
      expect(closeMock).toHaveBeenCalledTimes(1)
    })

    it('handleClickOutsideNewLandingPageTemplateModal returns early for leaving dialog/snackbar/button guards', () => {
      const closeMock = jest.fn()
      const ctxLeaving = {
        $store: { state: { common: { isShowLeavingDialog: true } } },
        handleCloseNewLandingPageTemplateModal: closeMock
      }
      CommonSimulatorNewScenario.methods.handleClickOutsideNewLandingPageTemplateModal.call(
        ctxLeaving,
        {}
      )

      const ctx = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        handleCloseNewLandingPageTemplateModal: closeMock
      }
      const snackbarEvent = {
        target: {
          closest: jest.fn((selector) =>
            selector.includes('.v-snack__wrapper') ? { id: 'snackbar' } : null
          )
        }
      }
      CommonSimulatorNewScenario.methods.handleClickOutsideNewLandingPageTemplateModal.call(
        ctx,
        snackbarEvent
      )

      const leavingButtonEvent = {
        target: {
          closest: jest.fn((selector) =>
            selector.includes('#btn-quit--leaving-popup') ? { id: 'btn' } : null
          )
        }
      }
      CommonSimulatorNewScenario.methods.handleClickOutsideNewLandingPageTemplateModal.call(
        ctx,
        leavingButtonEvent
      )

      expect(closeMock).not.toHaveBeenCalled()
    })

    it('handleClickOutsideNewLandingPageTemplateModal closes landing page grapes modal first', () => {
      const closeMock = jest.fn()
      const ctx = {
        $store: { state: { common: { isShowLeavingDialog: false } } },
        $refs: {
          newLandingPage: {
            $refs: {
              refEmailTemplate: [{ showGrapesModal: true }]
            }
          }
        },
        handleCloseNewLandingPageTemplateModal: closeMock
      }

      CommonSimulatorNewScenario.methods.handleClickOutsideNewLandingPageTemplateModal.call(
        ctx,
        null
      )

      expect(ctx.$refs.newLandingPage.$refs.refEmailTemplate[0].showGrapesModal).toBe(false)
      expect(closeMock).not.toHaveBeenCalled()
    })

    it('setAttachmentFile assigns attachment file into formValues', () => {
      const ctx = {
        formValues: {
          attachmentFiles: null
        }
      }
      const file = { name: 'demo.pdf', size: 10 }

      CommonSimulatorNewScenario.methods.setAttachmentFile.call(ctx, file)

      expect(ctx.formValues.attachmentFiles).toEqual(file)
    })

    it('handleEmailTemplatePreviewLanguageChange returns early when language template does not exist', () => {
      const ctx = {
        phishingEmailTemplates: [{ languageType: 'lang-en', subject: 'a' }],
        summaryData: { emailTemplate: { subject: 'old' } }
      }

      CommonSimulatorNewScenario.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'lang-tr')

      expect(ctx.summaryData.emailTemplate.subject).toBe('old')
    })

    it('handleEmailTemplatePreviewLanguageChange updates summary template fields when language exists', () => {
      const ctx = {
        phishingEmailTemplates: [
          {
            languageType: 'lang-tr',
            language: 'Turkish',
            fromName: 'Alice',
            fromEmailAddress: 'alice@example.com',
            subject: 'Merhaba',
            cc: ['cc@example.com'],
            template: '<p>TR</p>'
          }
        ],
        summaryData: { emailTemplate: { subject: 'old', template: '<p>OLD</p>' } }
      }

      CommonSimulatorNewScenario.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'lang-tr')

      expect(ctx.summaryData.emailTemplate).toEqual(
        expect.objectContaining({
          languageTypeResourceId: 'lang-tr',
          languageTypeName: 'Turkish',
          fromName: 'Alice',
          fromEmailAddress: 'alice@example.com',
          subject: 'Merhaba',
          cc: ['cc@example.com'],
          template: '<p>TR</p>'
        })
      )
    })

    it('setPhishingEmailTemplates returns immediately when neither phishing nor quishing', () => {
      const ctx = {
        isPhishing: false,
        isQuishing: false,
        selectedTemplateLanguages: [{ text: 'English', value: 'lang-en' }],
        languageOptions: [],
        summaryData: { emailTemplate: {} }
      }
      const payload = {
        emailTemplate: {
          languageTypeResourceId: 'lang-en',
          languageTypeName: 'English',
          languages: []
        }
      }

      CommonSimulatorNewScenario.methods.setPhishingEmailTemplates.call(ctx, payload)

      expect(ctx.selectedTemplateLanguages).toEqual([{ text: 'English', value: 'lang-en' }])
    })

    it('setPhishingEmailTemplates fills phishing arrays and updates language short codes', () => {
      const changeMock = jest.fn()
      const ctx = {
        isPhishing: true,
        isQuishing: false,
        languageOptions: [
          { text: 'English', value: 'lang-en' },
          { text: 'Turkish', value: 'lang-tr' }
        ],
        phishingEmailTemplates: [],
        selectedTemplateLanguages: [],
        summaryData: { emailTemplate: {} },
        handleEmailTemplatePreviewLanguageChange: changeMock
      }
      const payload = {
        emailTemplate: {
          fromName: 'Primary',
          subject: 'Primary Subject',
          fromAddress: 'primary@example.com',
          ccAddresses: ['p@example.com'],
          template: '<p>primary</p>',
          languageTypeResourceId: 'lang-en',
          languageTypeName: 'English',
          languageShortCode: 'EN',
          languages: [
            {
              fromName: 'Second',
              subject: 'Second Subject',
              fromAddress: 'second@example.com',
              ccAddresses: ['s@example.com'],
              template: '<p>second</p>',
              languageTypeResourceId: 'lang-tr',
              languageTypeName: 'Turkish'
            }
          ]
        }
      }

      CommonSimulatorNewScenario.methods.setPhishingEmailTemplates.call(ctx, payload)

      expect(ctx.phishingEmailTemplates).toHaveLength(2)
      expect(ctx.selectedTemplateLanguages).toEqual([
        { text: 'English', value: 'lang-en' },
        { text: 'Turkish', value: 'lang-tr' }
      ])
      expect(ctx.summaryData.emailTemplate.languageShortCode).toEqual(['EN', 'Turkish'])
      expect(changeMock).toHaveBeenCalledWith('lang-en')
    })
  })
})
