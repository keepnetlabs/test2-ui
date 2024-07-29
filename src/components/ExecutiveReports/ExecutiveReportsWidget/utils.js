export const createExecutiveReportChartData = (widgetData, comingDateFormat) => {
  const datasets = []
  const valueEnums = new Set()
  widgetData.forEach((dItem) => {
    const dateFormat = comingDateFormat || localStorage.getItem('selectedDateFormat')
    const [datePart] = dItem?.date?.split(' ')
    const [firstPart, secondPart, thirdPart] = datePart?.split('/')
    let calculatedDate
    if (dateFormat === 'YYYY/MM/DD') {
      calculatedDate = new Date(firstPart, secondPart - 1, thirdPart)
    } else if (dateFormat === 'MM/DD/YYYY') {
      calculatedDate = new Date(thirdPart, firstPart - 1, secondPart)
    } else if (dateFormat === 'DD/MM/YYYY') {
      calculatedDate = new Date(thirdPart, secondPart - 1, firstPart)
    }
    const timeStampOfDate = calculatedDate.getTime()
    dItem.values.forEach((vItem) => {
      valueEnums.add(vItem.label)
      const obj = {
        x: timeStampOfDate,
        y: vItem.value,
        result: vItem.label
      }
      if (vItem.name) {
        obj['name'] = vItem.name
      }
      if (vItem.annotations) {
        obj['annotations'] = vItem.annotations
      }
      datasets.push(obj)
    })
  })
  return {
    valueEnums: Array.from(valueEnums),
    datasets
  }
}

export const DATE_PERIOD_ENUMS = {
  LastMonth: 0,
  Last3Months: 1,
  Last6Months: 2,
  LastYear: 3,
  ThisYear: 4,
  Custom: 5
}
