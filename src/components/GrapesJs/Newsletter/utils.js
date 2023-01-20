export const getTraits = (options) => [
  {
    type: 'text',
    label: 'Title',
    name: 'title'
  },
  {
    type: 'text',
    label: 'Href',
    name: 'href'
  },
  {
    type: 'select',
    label: 'Target',
    name: 'target',
    options: [
      { value: '', name: 'This Window' },
      { value: '_blank', name: 'New Window' }
    ]
  },
  {
    type: 'select',
    label: 'Merge Tags',
    name: 'href',
    options
  }
]

export const getComponentTypeDefaultParams = (droppable = false, editable = false) => {
  return {
    model: {
      defaults: {
        droppable,
        editable
      }
    }
  }
}

const BLOCK_MAP = {
  'Submit Phishing Button': {
    id: 'Basic',
    label: 'Basic'
  },
  'Outlook Button': {
    id: 'Basic',
    label: 'Basic'
  },
  button: {
    label: 'Basic'
  },
  sect100: {
    label: 'Layout'
  },
  sect50: {
    label: 'Layout'
  },
  sect30: {
    label: 'Layout'
  },
  sect37: {
    label: 'Layout'
  },
  divider: {
    label: 'Layout'
  },
  text: {
    label: 'Typography'
  },
  'text-sect': {
    label: 'Typography'
  },
  image: {
    label: 'Basic'
  },
  quote: {
    label: 'Typography'
  },
  link: {
    label: 'Typography'
  },
  'link-block': {
    label: 'Typography'
  },
  'grid-items': {
    label: 'Layout'
  },
  'list-items': {
    label: 'Layout'
  },
  column1: {
    label: 'Layout'
  },
  column2: {
    label: 'Layout'
  },
  column3: {
    label: 'Layout'
  },
  'column3-7': {
    label: 'Layout'
  },
  video: {
    label: 'Basic'
  },
  form: {
    label: 'Forms'
  },
  input: {
    label: 'Forms'
  },
  textarea: {
    label: 'Forms'
  },
  select: {
    label: 'Forms'
  },
  label: {
    label: 'Forms'
  },
  checkbox: {
    label: 'Forms'
  },
  radio: {
    label: 'Forms'
  },
  'text-basic': {
    label: 'Forms'
  },
  map: {
    label: 'Components'
  },
  'h-navbar': {
    label: 'Components'
  },
  countdown: {
    label: 'Components'
  },
  companyId: {
    label: 'Components'
  }
}

export const setBlocksCategories = (blocks) => {
  return blocks.map((block) => {
    const { id } = block.attributes
    if (BLOCK_MAP.hasOwnProperty(id)) block.attributes.category = BLOCK_MAP[id]
    else
      block.attributes.category = {
        label: 'Components'
      }
    if (id === 'form') block.attributes.customId = 'grapesForm'
  })
}
