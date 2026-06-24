// Full-branch tests for the two-pass Double Barrel translation in NewEmailTemplates.
// The backend exposes a SINGLE polling job, so a barrel template is localized by first
// translating the lure body, then chaining the payload body through the same poll loop
// and writing results into each language's `barrelPayload`. Non-barrel templates must
// keep the legacy single-pass (lure-only) behaviour untouched.

import NewEmailTemplates from '@/components/PhishingScenarios/NewEmailTemplates.vue'
import {
  generateEmailTemplateTranslation,
  getEmailTemplateTranslation,
  getEmailTemplatePreviewContent
} from '@/api/phishingsimulator'

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (v) => JSON.parse(JSON.stringify(v))
}

jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  FLAGGED_AREA_CSS: '<style>.flagged-area{}</style>',
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getDefaultAxiosPayload: jest.fn((payload = {}) => ({ ...payload }))
}))

jest.mock('@/api/file', () => ({ parseEmailOrMessageFile: jest.fn() }))
jest.mock('@/api/phishingsimulator')
jest.mock('@/components/Company Settings/utils', () => ({ scrollToEmailTemplateContent: jest.fn() }))

const flush = async () => {
  for (let i = 0; i < 6; i++) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve()
  }
}

const askForEmailTemplateTranslation = NewEmailTemplates.methods.askForEmailTemplateTranslation
const handleGenerateWithAI = NewEmailTemplates.methods.handleGenerateWithAI

const baseCtx = (overrides = {}) => ({
  isEverythingLocalized: false,
  selectedLanguages: [{ value: 'tr', text: 'Turkish' }],
  timeoutId: 0,
  isDefault: false,
  isBarrelTemplate: false,
  barrelTranslationPhase: null,
  barrelPayloadTranslationSource: null,
  selectedLanguagePayloadItemBeforeSave: { template: '', subject: '' },
  languagesPayload: [],
  emptyBarrelPayload: NewEmailTemplates.methods.emptyBarrelPayload,
  $nextTick: (cb) => cb && cb(),
  $set: (obj, key, val) => {
    obj[key] = val
  },
  showLocalizationErrorMessage: jest.fn(),
  showLocalizationSuccessMessage: jest.fn(),
  resetGenerateWithAIDisabled: jest.fn(),
  handleActiveLanguageChange: jest.fn(),
  askForEmailTemplateTranslation,
  ...overrides
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('seedBarrelPayloadFromLureIfNeeded — copies lure into empty payloads on switch-to-barrel', () => {
  const ctx = (overrides = {}) => ({
    isBarrelTemplate: true,
    emptyBarrelPayload: NewEmailTemplates.methods.emptyBarrelPayload,
    $set: (obj, key, val) => {
      obj[key] = val
    },
    languagesPayload: [
      // payload already filled (user diverged) → must NOT be overwritten
      {
        languageTypeResourceId: 'tr',
        template: '<p>lure tr</p>',
        subject: 'lure tr subj',
        barrelPayload: { subject: 'kept', template: '<p>kept payload</p>' }
      },
      // lure present (already localized), payload empty → seed from lure
      {
        languageTypeResourceId: 'en',
        template: '<p>lure en</p>',
        subject: 'lure en subj',
        barrelPayload: { subject: '', template: '' }
      },
      // lure present, no barrelPayload object at all → create + seed
      { languageTypeResourceId: 'de', template: '<p>lure de</p>', subject: 'lure de subj' }
    ],
    ...overrides
  })

  it('no-op for non-barrel templates', () => {
    const c = ctx({ isBarrelTemplate: false })
    NewEmailTemplates.methods.seedBarrelPayloadFromLureIfNeeded.call(c)
    expect(c.languagesPayload[1].barrelPayload.template).toBe('')
  })

  it('seeds empty payloads from the (already-localized) lure, creating barrelPayload when missing', () => {
    const c = ctx()
    NewEmailTemplates.methods.seedBarrelPayloadFromLureIfNeeded.call(c)
    // empty payload filled from lure
    expect(c.languagesPayload[1].barrelPayload.template).toBe('<p>lure en</p>')
    expect(c.languagesPayload[1].barrelPayload.subject).toBe('lure en subj')
    // missing barrelPayload created + seeded
    expect(c.languagesPayload[2].barrelPayload.template).toBe('<p>lure de</p>')
    expect(c.languagesPayload[2].barrelPayload.subject).toBe('lure de subj')
  })

  it('never overwrites a payload the user has already diverged', () => {
    const c = ctx()
    NewEmailTemplates.methods.seedBarrelPayloadFromLureIfNeeded.call(c)
    expect(c.languagesPayload[0].barrelPayload.template).toBe('<p>kept payload</p>')
    expect(c.languagesPayload[0].barrelPayload.subject).toBe('kept')
  })

  it('skips a language whose lure is also empty (nothing to copy)', () => {
    const c = ctx({
      languagesPayload: [
        { languageTypeResourceId: 'tr', template: '   ', subject: '', barrelPayload: { subject: '', template: '' } }
      ]
    })
    NewEmailTemplates.methods.seedBarrelPayloadFromLureIfNeeded.call(c)
    expect(c.languagesPayload[0].barrelPayload.template).toBe('')
  })

  it('keeps an existing payload subject when only the body was empty', () => {
    const c = ctx({
      languagesPayload: [
        {
          languageTypeResourceId: 'tr',
          template: '<p>lure</p>',
          subject: 'lure subj',
          barrelPayload: { subject: 'existing payload subj', template: '' }
        }
      ]
    })
    NewEmailTemplates.methods.seedBarrelPayloadFromLureIfNeeded.call(c)
    expect(c.languagesPayload[0].barrelPayload.template).toBe('<p>lure</p>')
    expect(c.languagesPayload[0].barrelPayload.subject).toBe('existing payload subj')
  })
})

describe('created() edit-load — seeds barrel payload from lure for Click-Only-origin templates', () => {
  it('copies the (already-localized) lure into empty payload bodies when a barrel template loads', async () => {
    getEmailTemplatePreviewContent.mockResolvedValue({
      data: {
        data: {
          name: 'T',
          description: '',
          categoryResourceId: 'BrLr4x7Km2Nw',
          languageTypeResourceId: 'tr',
          subject: 'Konu',
          fromName: 'A',
          fromAddress: 'a@b.com',
          ccAddresses: [],
          template: '<p>lure tr</p>',
          prompt: '',
          toneResourceId: '',
          localizationResourceId: '',
          // empty payload — template was authored as Click Only before the method switch
          barrelPayload: { subject: '', template: '' },
          languages: [],
          availableForList: [],
          canRemoveLanguages: true
        }
      }
    })

    const ctx = {
      isEdit: true,
      isDuplicate: false,
      emailTemplateId: 'tmpl-1',
      isBarrelTemplate: true,
      formValues: {},
      languagesPayload: [],
      selectedLanguages: [],
      languageOptions: [],
      getSelectedLanguagePayload: {},
      $set: (obj, key, val) => {
        obj[key] = val
      },
      setFooterButtonIds: jest.fn(),
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      seedBarrelPayloadFromLureIfNeeded: NewEmailTemplates.methods.seedBarrelPayloadFromLureIfNeeded,
      emptyBarrelPayload: NewEmailTemplates.methods.emptyBarrelPayload,
      barrelPayloadFromApi: NewEmailTemplates.methods.barrelPayloadFromApi
    }

    NewEmailTemplates.created.call(ctx)
    await flush()

    const tr = ctx.languagesPayload.find((p) => p.languageTypeResourceId === 'tr')
    expect(tr.template).toBe('<p>lure tr</p>') // lure preserved
    expect(tr.barrelPayload.template).toBe('<p>lure tr</p>') // payload seeded from lure
    expect(tr.barrelPayload.subject).toBe('Konu')
  })
})

describe('handleGenerateWithAI — barrel setup + lure POST', () => {
  const genCtx = (overrides = {}) => ({
    isGenerateWithAi: false,
    isGenerateWithAIDisabled: false,
    isSubmitDisabled: false,
    isEverythingLocalized: true,
    $refs: { refEmailTemplate: { isEmailGenerating: false } },
    getSelectedLanguagePayload: { template: '<p>lure</p>', subject: 'subj' },
    selectedLanguagePayloadItemBeforeSave: { template: '<p>lure</p>', subject: 'subj' },
    selectedLanguages: [
      { value: 'tr', text: 'Turkish' },
      { value: 'en', text: 'English' }
    ],
    languagesPayload: [
      { languageTypeResourceId: 'tr', isTranslated: true },
      { languageTypeResourceId: 'en', isTranslated: false }
    ],
    isBarrelTemplate: true,
    getSelectedBarrelPayload: { template: '<p>payload</p>', subject: 'ps' },
    askForEmailTemplateTranslation: jest.fn(),
    resetGenerateWithAIDisabled: jest.fn(),
    handleGenerateWithAI,
    ...overrides
  })

  it('POSTs only the LURE language list (untranslated langs), sets phase, captures payload source', async () => {
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: true } } })
    const ctx = genCtx()
    handleGenerateWithAI.call(ctx)
    await flush()

    expect(ctx.barrelTranslationPhase).toBe('lure')
    // payload source captured from the active language's payload (immune to later changes)
    expect(ctx.barrelPayloadTranslationSource).toEqual({ template: '<p>payload</p>', subject: 'ps' })
    // lure POST uses the lure language list (only the untranslated 'en'), NOT a payload list
    expect(generateEmailTemplateTranslation).toHaveBeenCalledWith({
      languages: [{ languageResourceId: 'en', languageName: 'English' }],
      template: '<p>lure</p>',
      subject: 'subj'
    })
    expect(ctx.askForEmailTemplateTranslation).toHaveBeenCalled()
  })

  it('non-barrel template sets phase null (legacy lure-only behaviour)', async () => {
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: true } } })
    const ctx = genCtx({ isBarrelTemplate: false })
    handleGenerateWithAI.call(ctx)
    await flush()
    expect(ctx.barrelTranslationPhase).toBeNull()
    expect(ctx.askForEmailTemplateTranslation).toHaveBeenCalled()
  })

  it('lure POST rejection is caught and resets the UI', async () => {
    generateEmailTemplateTranslation.mockRejectedValue(new Error('network'))
    const ctx = genCtx()
    handleGenerateWithAI.call(ctx)
    await flush()
    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
    expect(ctx.askForEmailTemplateTranslation).not.toHaveBeenCalled()
  })
})

describe('categoryResourceId watcher — resets edit mode and seeds payload on switch-to-barrel', () => {
  const watcher = NewEmailTemplates.watch['formValues.categoryResourceId']

  it('resets to lure mode and seeds the payload when the category becomes barrel', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelEditMode: 'payload',
      $nextTick: (cb) => cb && cb(),
      seedBarrelPayloadFromLureIfNeeded: jest.fn()
    }
    watcher.call(ctx)
    expect(ctx.barrelEditMode).toBe('lure')
    expect(ctx.seedBarrelPayloadFromLureIfNeeded).toHaveBeenCalled()
  })

  it('resets to lure mode but does NOT seed for non-barrel categories', () => {
    const ctx = {
      isBarrelTemplate: false,
      barrelEditMode: 'payload',
      $nextTick: (cb) => cb && cb(),
      seedBarrelPayloadFromLureIfNeeded: jest.fn()
    }
    watcher.call(ctx)
    expect(ctx.barrelEditMode).toBe('lure')
    expect(ctx.seedBarrelPayloadFromLureIfNeeded).not.toHaveBeenCalled()
  })
})

describe('Barrel payload coherence — prompt pre-fill from the lure', () => {
  const buildBarrelPayloadPrompt = NewEmailTemplates.methods.buildBarrelPayloadPrompt
  const handleGenerateEmailTemplateSuccess =
    NewEmailTemplates.methods.handleGenerateEmailTemplateSuccess

  it('buildBarrelPayloadPrompt references the lure subject and demands the link', () => {
    const withSubject = buildBarrelPayloadPrompt.call({}, 'HR Benefits Update')
    expect(withSubject).toContain('HR Benefits Update')
    expect(withSubject).toContain('{PHISHINGURL}')
    expect(withSubject).toMatch(/MUST include/i)
  })

  it('buildBarrelPayloadPrompt falls back to a generic reference when no subject', () => {
    const generic = buildBarrelPayloadPrompt.call({}, '')
    expect(generic).toContain('the previous lure email')
    expect(generic).toContain('{PHISHINGURL}')
  })

  it('pre-fills the payload prompt after a lure generation (barrel, empty payload prompt)', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelPayloadAi: { prompt: '' },
      getSelectedLanguagePayload: { isTranslated: false },
      selectedLanguagePayloadItemBeforeSave: {},
      buildBarrelPayloadPrompt
    }
    handleGenerateEmailTemplateSuccess.call(ctx, { template: '<p>lure</p>', subject: 'Payroll Update' })
    expect(ctx.barrelPayloadAi.prompt).toContain('Payroll Update')
    expect(ctx.barrelPayloadAi.prompt).toContain('{PHISHINGURL}')
  })

  it('never overwrites a payload prompt the user already wrote', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelPayloadAi: { prompt: 'my own payload prompt' },
      getSelectedLanguagePayload: { isTranslated: false },
      selectedLanguagePayloadItemBeforeSave: {},
      buildBarrelPayloadPrompt
    }
    handleGenerateEmailTemplateSuccess.call(ctx, { template: '<p>lure</p>', subject: 'X' })
    expect(ctx.barrelPayloadAi.prompt).toBe('my own payload prompt')
  })

  it('does not pre-fill for non-barrel templates', () => {
    const ctx = {
      isBarrelTemplate: false,
      barrelPayloadAi: { prompt: '' },
      getSelectedLanguagePayload: { isTranslated: false },
      selectedLanguagePayloadItemBeforeSave: {},
      buildBarrelPayloadPrompt
    }
    handleGenerateEmailTemplateSuccess.call(ctx, { template: '<p>x</p>', subject: 'X' })
    expect(ctx.barrelPayloadAi.prompt).toBe('')
  })
})

describe('Barrel translation — timeout placeholder branch (phase-aware)', () => {
  it('lure/non-barrel pass fills untranslated lure bodies with placeholder', () => {
    const ctx = baseCtx({
      barrelTranslationPhase: 'lure',
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: true, template: '<p>done</p>' },
        { languageTypeResourceId: 'en', isTranslated: false, template: '' }
      ]
    })
    askForEmailTemplateTranslation.call(ctx, 5, 1, 0)
    expect(ctx.languagesPayload[0].template).toBe('<p>done</p>') // translated → untouched
    expect(ctx.languagesPayload[1].template).toBe('<div style="height:300px"></div>')
    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
  })

  it('payload pass fills empty barrelPayload bodies only, never the lure body', () => {
    const ctx = baseCtx({
      barrelTranslationPhase: 'payload',
      languagesPayload: [
        {
          languageTypeResourceId: 'tr',
          isTranslated: true,
          template: '<p>lure</p>',
          barrelPayload: { subject: 's', template: '<p>filled</p>' }
        },
        {
          languageTypeResourceId: 'en',
          isTranslated: false,
          template: '<p>lure-en</p>',
          barrelPayload: { subject: '', template: '' }
        }
      ]
    })
    askForEmailTemplateTranslation.call(ctx, 5, 1, 0)
    // already-filled payload untouched
    expect(ctx.languagesPayload[0].barrelPayload.template).toBe('<p>filled</p>')
    // empty payload gets placeholder
    expect(ctx.languagesPayload[1].barrelPayload.template).toBe('<div style="height:300px"></div>')
    // lure bodies must never be overwritten in the payload pass
    expect(ctx.languagesPayload[0].template).toBe('<p>lure</p>')
    expect(ctx.languagesPayload[1].template).toBe('<p>lure-en</p>')
    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
  })
})

describe('Barrel translation — payload pass writes into barrelPayload', () => {
  it('routes poll results to barrelPayload (creating it when missing) and finalizes', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: {
        data: [
          { languageResourceId: 'tr', template: '<p>TR payload</p>', subject: 'TR konu' },
          { languageResourceId: 'en', template: '<p>EN payload</p>', subject: 'EN subject' }
        ]
      }
    })
    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'payload',
      languagesPayload: [
        { languageTypeResourceId: 'tr', template: '<p>lure-tr</p>', barrelPayload: { subject: '', template: '' } },
        { languageTypeResourceId: 'en', template: '<p>lure-en</p>' } // no barrelPayload yet
      ]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(ctx.languagesPayload[0].barrelPayload.template).toBe('<p>TR payload</p>')
    expect(ctx.languagesPayload[0].barrelPayload.subject).toBe('TR konu')
    // created via $set when missing
    expect(ctx.languagesPayload[1].barrelPayload.template).toBe('<p>EN payload</p>')
    expect(ctx.languagesPayload[1].barrelPayload.subject).toBe('EN subject')
    // lure bodies untouched
    expect(ctx.languagesPayload[0].template).toBe('<p>lure-tr</p>')
    expect(ctx.languagesPayload[1].template).toBe('<p>lure-en</p>')
    // payload pass is terminal → finalize, no further chaining
    expect(ctx.showLocalizationSuccessMessage).toHaveBeenCalled()
    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
    expect(generateEmailTemplateTranslation).not.toHaveBeenCalled()
  })
})

describe('Barrel translation — lure pass chains the payload pass', () => {
  it('after lure completes, starts a payload translate job with the captured source', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>lure TR</p>', subject: 'lure konu' }] }
    })
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: true } } })

    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      barrelPayloadTranslationSource: { template: '<p>payload src</p>', subject: 'payload sub' },
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } }
      ],
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    // lure result written + flagged translated
    expect(ctx.languagesPayload[0].template).toBe('<p>lure TR</p>')
    expect(ctx.languagesPayload[0].isTranslated).toBe(true)
    // phase advanced and payload job started with captured source (not active-language read)
    expect(ctx.barrelTranslationPhase).toBe('payload')
    expect(generateEmailTemplateTranslation).toHaveBeenCalledWith({
      languages: [{ languageResourceId: 'tr', languageName: 'Turkish' }],
      template: '<p>payload src</p>',
      subject: 'payload sub'
    })
    // lure pass is NOT terminal → no success/finalize yet
    expect(ctx.showLocalizationSuccessMessage).not.toHaveBeenCalled()
    expect(ctx.handleActiveLanguageChange).not.toHaveBeenCalled()
  })

  it('first-open default localization (isDefault): writes the result to BOTH lure and payload in one pass, no chaining', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>localized</p>', subject: 'subj' }] }
    })

    const ctx = baseCtx({
      isDefault: true,
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      barrelPayloadTranslationSource: { template: '<p>default</p>', subject: 'def' },
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } }
      ]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    // single localized result applied to both bodies
    expect(ctx.languagesPayload[0].template).toBe('<p>localized</p>')
    expect(ctx.languagesPayload[0].barrelPayload.template).toBe('<p>localized</p>')
    expect(ctx.languagesPayload[0].barrelPayload.subject).toBe('subj')
    expect(ctx.languagesPayload[0].isTranslated).toBe(true)
    // no second (payload) translate call on first open
    expect(generateEmailTemplateTranslation).not.toHaveBeenCalled()
    expect(ctx.barrelTranslationPhase).toBeNull()
    expect(ctx.showLocalizationSuccessMessage).toHaveBeenCalled()
  })

  it('fresh template: chains the payload pass even when the payload holds the (non-empty) default body', async () => {
    // Regression: the empty-payload heuristic skipped the payload pass on fresh barrel
    // templates because the payload carries the default body. Chaining is driven by the
    // languages the lure localized, so it must fire regardless of payload emptiness.
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>lure TR</p>', subject: 'konu' }] }
    })
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: true } } })

    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      barrelPayloadTranslationSource: { template: '<p>default payload</p>', subject: 'def' },
      languagesPayload: [
        {
          languageTypeResourceId: 'tr',
          isTranslated: false,
          template: '',
          // NON-EMPTY default payload — the old heuristic would have excluded this language
          barrelPayload: { subject: 'def', template: '<p>default payload</p>' }
        }
      ]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(ctx.barrelTranslationPhase).toBe('payload')
    expect(generateEmailTemplateTranslation).toHaveBeenCalledWith({
      languages: [{ languageResourceId: 'tr', languageName: 'Turkish' }],
      template: '<p>default payload</p>',
      subject: 'def'
    })
  })

  it('newly added language (manual localize, isDefault false): localizes BOTH lure and payload sequentially', async () => {
    // 'tr' is the source (already translated, payload filled); 'en' was just added.
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'en', template: '<p>lure EN</p>', subject: 'EN konu' }] }
    })
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: true } } })

    const ctx = baseCtx({
      isDefault: false, // manual localize, NOT first-open default
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      selectedLanguages: [
        { value: 'tr', text: 'Turkish' },
        { value: 'en', text: 'English' }
      ],
      barrelPayloadTranslationSource: { template: '<p>payload TR</p>', subject: 'payload sub' },
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: true, template: '<p>lure TR</p>', barrelPayload: { subject: 's', template: '<p>payload TR</p>' } },
        { languageTypeResourceId: 'en', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } }
      ]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    // 1) lure localized for the new language
    expect(ctx.languagesPayload[1].template).toBe('<p>lure EN</p>')
    expect(ctx.languagesPayload[1].isTranslated).toBe(true)
    // 2) then the payload pass is chained (sequential) for that same new language
    expect(ctx.barrelTranslationPhase).toBe('payload')
    expect(generateEmailTemplateTranslation).toHaveBeenCalledWith({
      languages: [{ languageResourceId: 'en', languageName: 'English' }],
      template: '<p>payload TR</p>',
      subject: 'payload sub'
    })
  })

  it('excludes a language whose lure errored from the chained payload pass (no half-translation)', async () => {
    // 'tr' lure succeeds, 'en' lure errors → only 'tr' should get a payload pass.
    getEmailTemplateTranslation.mockResolvedValue({
      data: {
        data: [
          { languageResourceId: 'tr', template: '<p>lure TR</p>', subject: 'konu' },
          { languageResourceId: 'en', error: 'failed' }
        ]
      }
    })
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: true } } })

    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      selectedLanguages: [
        { value: 'tr', text: 'Turkish' },
        { value: 'en', text: 'English' }
      ],
      barrelPayloadTranslationSource: { template: '<p>payload src</p>', subject: 'sub' },
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } },
        { languageTypeResourceId: 'en', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } }
      ],
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(ctx.languagesPayload[0].isTranslated).toBe(true) // tr lure ok
    expect(ctx.languagesPayload[1].isTranslated).toBe(false) // en lure errored
    // payload pass requested only for the language whose lure succeeded
    expect(generateEmailTemplateTranslation).toHaveBeenCalledWith({
      languages: [{ languageResourceId: 'tr', languageName: 'Turkish' }],
      template: '<p>payload src</p>',
      subject: 'sub'
    })
  })

  it('chained payload POST returning isSuccess:false resets the UI (no further poll)', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>lure</p>', subject: 'k' }] }
    })
    generateEmailTemplateTranslation.mockResolvedValue({ data: { data: { isSuccess: false } } })

    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      barrelPayloadTranslationSource: { template: '<p>p</p>', subject: 's' },
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } }
      ]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(generateEmailTemplateTranslation).toHaveBeenCalledTimes(1)
    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
  })

  it('chained payload POST rejection is caught and resets the UI', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>lure</p>', subject: 'k' }] }
    })
    generateEmailTemplateTranslation.mockRejectedValue(new Error('network'))

    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      barrelPayloadTranslationSource: { template: '<p>p</p>', subject: 's' },
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: false, template: '', barrelPayload: { subject: '', template: '' } }
      ]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
  })

  it('skips the payload pass when the payload source is empty (finalizes after lure)', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>lure TR</p>', subject: 'konu' }] }
    })

    const ctx = baseCtx({
      isBarrelTemplate: true,
      barrelTranslationPhase: 'lure',
      barrelPayloadTranslationSource: { template: '   ', subject: '' }, // empty
      languagesPayload: [{ languageTypeResourceId: 'tr', isTranslated: false, template: '' }],
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(generateEmailTemplateTranslation).not.toHaveBeenCalled()
    expect(ctx.barrelTranslationPhase).toBeNull()
    expect(ctx.showLocalizationSuccessMessage).toHaveBeenCalled()
    expect(ctx.resetGenerateWithAIDisabled).toHaveBeenCalled()
  })

  it('non-barrel template never chains a payload pass (legacy behaviour preserved)', async () => {
    getEmailTemplateTranslation.mockResolvedValue({
      data: { data: [{ languageResourceId: 'tr', template: '<p>tr</p>', subject: 'konu' }] }
    })

    const ctx = baseCtx({
      isBarrelTemplate: false,
      barrelTranslationPhase: null,
      languagesPayload: [{ languageTypeResourceId: 'tr', isTranslated: false, template: '' }]
    })

    askForEmailTemplateTranslation.call(ctx, 0, 1, 0)
    jest.advanceTimersByTime(5000)
    await flush()

    expect(ctx.languagesPayload[0].template).toBe('<p>tr</p>')
    expect(ctx.languagesPayload[0].isTranslated).toBe(true)
    expect(generateEmailTemplateTranslation).not.toHaveBeenCalled()
    expect(ctx.showLocalizationSuccessMessage).toHaveBeenCalled()
  })
})
