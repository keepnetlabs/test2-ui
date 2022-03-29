const selectSearchHandlerState = {
  timeoutId: null,
  searchVal: ''
}
const selectSearchHandler = {
  bind(el, { value }, vNode) {
    const { callback, isLoadingKey, isOriginalVuetifyComponent } = value
    const objRef = isOriginalVuetifyComponent
      ? vNode.componentInstance
      : vNode.componentInstance.$refs['refComponent']
    objRef.$watch(
      (vm) => vm.lazySearch,
      (val) => {
        vNode.context[isLoadingKey] = true
        if (selectSearchHandlerState.timeoutId) clearTimeout(selectSearchHandlerState.timeoutId)
        selectSearchHandlerState.timeoutId = setTimeout(() => {
          if (val !== null) callback(val)
          selectSearchHandlerState.searchVal = val
        }, 500)
      }
    )
    objRef.$watch(
      (vm) => vm.$_menuProps.value,
      (val) => {
        if (selectSearchHandlerState.timeoutId) clearTimeout(selectSearchHandlerState.timeoutId)
        selectSearchHandlerState.timeoutId = setTimeout(() => {
          if (!val && selectSearchHandlerState.searchVal) {
            callback('')
          } else {
            vNode.context[isLoadingKey] = false
          }
        }, 500)
      }
    )
  },
  unbind() {
    clearTimeout(selectSearchHandlerState.timeoutId)
  }
}

export default selectSearchHandler
