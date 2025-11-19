import mergedTextsSurveyUrl from '../blocks/mergedTextsBlocks/surveyUrl'

const surveyUrl = {
  label: 'Survey Url',
  category: 'Merge Tags',
  attributes: {
    title: 'To',
    class: 'merged-text',
    icon: 'fa fa-text',
    isUrl: true,
    'data-title': 'Survey Url'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSurveyUrl
  }
}

export default surveyUrl
