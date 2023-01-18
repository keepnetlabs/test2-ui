export default class InputHelper {
  async addData(value, textInput, wrapper) {
    textInput.element.value = value
    wrapper.vm.value = textInput.element.value
    await textInput.trigger('click')
    await wrapper.vm.$nextTick()
  }
}
