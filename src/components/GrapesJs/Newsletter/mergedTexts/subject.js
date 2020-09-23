import mergedTextsSubject from '../blocks/mergedTextsBlocks/subject'

const subject = {
  label: 'Subject',
  category: 'Merged Texts',
  attributes: {
    title: 'To',
    class: 'gjs-fonts gjs-f-text gjs-block gjs-one-bg gjs-four-color-h',
    icon: 'fa fa-text'
  },
  content: {
    tagName: 'span',
    draggable: true,
    components: mergedTextsSubject
  }
}

export default subject
