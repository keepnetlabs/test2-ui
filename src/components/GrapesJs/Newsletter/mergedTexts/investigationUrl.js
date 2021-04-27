import mergedTextsInvestigationUrl from '../blocks/mergedTextsBlocks/investigationUrl'

const investigationUrl = {
  label: 'Investigation Url',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Investigation URL'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsInvestigationUrl
  }
}

export default investigationUrl
