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
    type: 'phishing-submit-button',
    attributes: {
      title: 'Submit',
      type: 'submit',
      value: 'Submit'
    },
    style: { cursor: 'pointer' }
  }
}

export default submitButton
