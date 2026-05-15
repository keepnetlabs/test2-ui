import {
  CHART_COLORS,
  SIMULATION_SOURCE_NOTE,
  getSimulationSourceDetails,
  monthNamesLong
} from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import labels from '@/model/constants/labels'

describe('ExecutiveReportsCharts utils', () => {
  it('contains chart styles for core keys', () => {
    expect(CHART_COLORS).toHaveProperty('Clicked (%)')
    expect(CHART_COLORS).toHaveProperty('Open Attachment')
    expect(CHART_COLORS).toHaveProperty(labels.NoResponse)
    expect(CHART_COLORS['Clicked (%)'].backgroundColor).toBe('#2196F3')
  })

  it('exports full month names', () => {
    expect(monthNamesLong).toHaveLength(12)
    expect(monthNamesLong[0]).toBe('January')
    expect(monthNamesLong[11]).toBe('December')
  })

  it('exports the simulation source note copy', () => {
    expect(SIMULATION_SOURCE_NOTE).toBe(
      'Simulation count reflects unique reports from Phishing Campaigns and Incident Responder (where available).'
    )
  })

  it('maps simulation source breakdown into tooltip details', () => {
    const details = getSimulationSourceDetails({
      dataObject: {
        sourceBreakdown: {
          incidentResponderCount: 1,
          campaignCount: 3,
          campaigns: [
            { campaignName: 'Q1 Campaign', count: 2 },
            { name: 'Q2 Campaign', reportCount: 1 }
          ]
        }
      }
    })

    expect(details).toEqual({
      'Incident Responder': 1,
      'Campaign Report > Reporters': 3,
      Campaigns: 'Q1 Campaign (2), Q2 Campaign (1)'
    })
  })

  it('supports root-level source breakdown and source summary fallback', () => {
    expect(
      getSimulationSourceDetails({
        sourceBreakdown: {
          sourceSummary: 'Campaign Report > Reporters (2)'
        }
      })
    ).toEqual({
      'Source Breakdown': 'Campaign Report > Reporters (2)'
    })
  })

  it('returns empty details when source breakdown is missing', () => {
    expect(getSimulationSourceDetails({ dataObject: {} })).toEqual({})
  })
})
