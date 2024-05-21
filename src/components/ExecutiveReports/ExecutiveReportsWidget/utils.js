export const createExecutiveReportChartData = (widgetData) => {
  const datasets = []
  const valueEnums = new Set()
  widgetData.forEach((dItem) => {
    const splittedDate = dItem?.date?.split(' ')
    const lefSideDate = splittedDate[0]
    const leftSideSplittedDate = lefSideDate?.split('/')
    const timeStampOfDate = new Date(
      leftSideSplittedDate[2],
      leftSideSplittedDate[1] - 1,
      leftSideSplittedDate[0]
    ).getTime()
    dItem.values.forEach((vItem) => {
      valueEnums.add(vItem.label)
      datasets.push({
        x: timeStampOfDate,
        y: vItem.value,
        result: vItem.label
      })
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
  Custom: 4
}
