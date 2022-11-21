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

export const setBlocksCategories = (blocks) =>
  blocks.map((block) => {
    if (block.attributes.id === 'Submit Phishing Button') {
      block.attributes.category = {
        id: 'Basic',
        label: 'Basic'
      }
    }
    if (block.attributes.id === 'Outlook Button') {
      block.attributes.category = {
        id: 'Basic',
        label: 'Basic'
      }
    }
    if (block.attributes.id === 'sect100') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'sect50') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'sect30') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'sect37') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'button') {
      block.attributes.category = {
        label: 'Basic'
      }
    } else if (block.attributes.id === 'divider') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'text') {
      block.attributes.category = {
        label: 'Typography'
      }
    } else if (block.attributes.id === 'text-sect') {
      block.attributes.category = {
        label: 'Typography'
      }
    } else if (block.attributes.id === 'image') {
      block.attributes.category = {
        label: 'Basic'
      }
    } else if (block.attributes.id === 'quote') {
      block.attributes.category = {
        label: 'Typography'
      }
    } else if (block.attributes.id === 'link') {
      block.attributes.category = {
        label: 'Typography'
      }
    } else if (block.attributes.id === 'link-block') {
      block.attributes.category = {
        label: 'Typography'
      }
    } else if (block.attributes.id === 'grid-items') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'list-items') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'column1') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'column2') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'column3') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'column3-7') {
      block.attributes.category = {
        label: 'Layout'
      }
    } else if (block.attributes.id === 'video') {
      block.attributes.category = {
        label: 'Basic'
      }
    } else if (block.attributes.id === 'form') {
      block.attributes.category = {
        label: 'Forms'
      }
      block.attributes.customId = 'grapesForm'
    } else if (block.attributes.id === 'input') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'textarea') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'select') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'label') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'checkbox') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'radio') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'text-basic') {
      block.attributes.category = {
        label: 'Forms'
      }
    } else if (block.attributes.id === 'map') {
      block.attributes.category = {
        label: 'Components'
      }
    } else if (block.attributes.id === 'h-navbar') {
      block.attributes.category = {
        label: 'Components'
      }
    } else if (block.attributes.id === 'countdown') {
      block.attributes.category = {
        label: 'Components'
      }
    } else if (block.attributes.id === 'companyId') {
      block.attributes.category = {
        label: 'Components'
      }
    } else {
      block.attributes.category = {
        label: 'Components'
      }
    }
  })
