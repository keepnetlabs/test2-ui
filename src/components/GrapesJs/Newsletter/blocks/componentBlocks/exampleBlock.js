const exampleBlock = [
  {
    tagName: 'span',
    content: '<b>Content burya span ici</b>'
  },
  {
    tagName: 'div',
    // use `content` for static strings, `components` string will be parsed
    // and transformed in Components
    components: '<span>Buraya ise component</span>'
  }
]
export default exampleBlock
