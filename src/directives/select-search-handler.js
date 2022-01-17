const selectSearchHandlerState = {
  timeoutId: null,
  searchVal: ''
}
const selectSearchHandler = {
  bind(el, { value }, vNode) {
    const { callback, isLoadingKey } = value
    vNode.componentInstance.$refs['refComponent'].$watch(
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
    vNode.componentInstance.$refs['refComponent'].$watch(
      (vm) => vm.$_menuProps.value,
      (val) => {
        vNode.context[isLoadingKey] = true
        if (selectSearchHandlerState.timeoutId) clearTimeout(selectSearchHandlerState.timeoutId)
        selectSearchHandlerState.timeoutId = setTimeout(() => {
          if (!val && selectSearchHandlerState.searchVal) callback('')
        }, 500)
      }
    )
  },
  unbind() {
    clearTimeout(selectSearchHandlerState.timeoutId)
  }
}

export default selectSearchHandler
