const submitButton = {
  label: 'Phishing Email Submit Button',
  category: 'Basic',
  id: 'phishing-email-submit-button',
  attributes: {
    title: 'Submit',
    type: 'submit',
    class: 'gjs-fonts gjs-f-button gjs-block gjs-one-bg gjs-four-color-h',
    style: 'order:-1',
    category: 'Basic'
  },
  content: {
    tagName: 'input',
    draggable: true,
    attributes: {
      title: 'Submit',
      type: 'submit'
    }
  }
}

export default submitButton
