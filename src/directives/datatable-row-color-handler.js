let timeout = null
const rowColorHandler = {
  componentUpdated(el, binding, vNode) {
    if (vNode.context.groupable) {
      timeout = setTimeout(() => {
        const container = el.querySelector('.el-table__body-wrapper')
        const rows = [...container.querySelectorAll('tr')]
        const zeroLevelRows = rows.filter((row) => {
          const classList = [...row.classList].join('')
          return !/level-[1-9]+/gi.test(classList)
        })

        zeroLevelRows.forEach((row, ind) => {
          const { style } = row
          const index = ind + 1
          if (index % 2 === 0) {
            style.backgroundColor = '#fafafa'
          } else {
            style.backgroundColor = '#fff'
          }
        })
        clearTimeout(timeout)
      }, 100)
    }
  }
}

export default rowColorHandler
