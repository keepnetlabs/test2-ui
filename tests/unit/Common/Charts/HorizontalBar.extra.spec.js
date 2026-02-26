import HorizontalBar from '@/components/Common/Charts/HorizontalBar'

describe('HorizontalBar.vue (extra branch coverage)', () => {
  it('adds only datalabel plugin when custom plugins are missing', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()

    HorizontalBar.mounted.call({
      addPlugin,
      renderChart,
      customPlugin: null,
      anotherCustomPlugin: undefined,
      chartData: null,
      chartOptions: { responsive: true }
    })

    expect(addPlugin).toHaveBeenCalledTimes(1)
    expect(renderChart).not.toHaveBeenCalled()
  })

  it('adds one custom plugin when only customPlugin exists', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const customPlugin = { id: 'only-custom' }

    HorizontalBar.mounted.call({
      addPlugin,
      renderChart,
      customPlugin,
      anotherCustomPlugin: null,
      chartData: { labels: ['A'], datasets: [{ data: [1] }] },
      chartOptions: { responsive: true }
    })

    expect(addPlugin).toHaveBeenCalledTimes(2)
    expect(addPlugin).toHaveBeenCalledWith(customPlugin)
    expect(renderChart).toHaveBeenCalledWith(
      { labels: ['A'], datasets: [{ data: [1] }] },
      { responsive: true }
    )
  })

  it('adds one custom plugin when only anotherCustomPlugin exists', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const anotherCustomPlugin = { id: 'only-another' }

    HorizontalBar.mounted.call({
      addPlugin,
      renderChart,
      customPlugin: '',
      anotherCustomPlugin,
      chartData: { labels: ['B'], datasets: [{ data: [2] }] },
      chartOptions: { maintainAspectRatio: false }
    })

    expect(addPlugin).toHaveBeenCalledTimes(2)
    expect(addPlugin).toHaveBeenCalledWith(anotherCustomPlugin)
    expect(renderChart).toHaveBeenCalledWith(
      { labels: ['B'], datasets: [{ data: [2] }] },
      { maintainAspectRatio: false }
    )
  })
})
