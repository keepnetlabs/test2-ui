import HorizontalBar from '@/components/Common/Charts/HorizontalBar'

describe('HorizontalBar.vue', () => {
  it('adds plugins and renders chart in mounted when chartData exists', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const customPlugin = { id: 'custom' }
    const anotherCustomPlugin = { id: 'another' }
    const chartData = { labels: ['A'], datasets: [{ data: [1] }] }
    const chartOptions = { responsive: true }

    HorizontalBar.mounted.call({
      addPlugin,
      renderChart,
      customPlugin,
      anotherCustomPlugin,
      chartData,
      chartOptions
    })

    expect(addPlugin).toHaveBeenCalledTimes(3)
    expect(renderChart).toHaveBeenCalledWith(chartData, chartOptions)
  })

  it('renders chart on chartData watcher change', () => {
    const renderChart = jest.fn()
    const ctx = {
      renderChart,
      chartData: { labels: ['B'], datasets: [{ data: [2] }] },
      chartOptions: { responsive: false }
    }

    HorizontalBar.watch.chartData.call(ctx)

    expect(renderChart).toHaveBeenCalledWith(ctx.chartData, ctx.chartOptions)
  })
})

