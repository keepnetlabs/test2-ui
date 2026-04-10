import fs from 'fs'
import path from 'path'

describe('AgenticAIStatusWidget drawer action spacing styles', () => {
  const stylesheetPath = path.resolve(
    process.cwd(),
    'src/components/Common/Widget/WidgetComponents/AgenticAIStatusWidget.scss'
  )

  it('keeps the action cell padding at 0 and applies 18px only on the drawer actions container selector', () => {
    const stylesheet = fs.readFileSync(stylesheetPath, 'utf8')

    expect(stylesheet).toContain(
      '.agentic-ai-activities-drawer__table-wrapper .k-table__wrapper .card .table-wrapper .el-table td.is-right.actions-container--first > .cell'
    )
    expect(stylesheet).toContain('padding-right: 0 !important;')
    expect(stylesheet).toContain(
      '.agentic-ai-activities-drawer__table-wrapper .k-table__wrapper .actions-container--first'
    )
    expect(stylesheet).toContain('padding-right: 18px !important;')
  })

  it('defines matching error styles for the left batch badge and progress bar', () => {
    const stylesheet = fs.readFileSync(stylesheetPath, 'utf8')

    expect(stylesheet).toContain('&--error {')
    expect(stylesheet).toContain('background: #feeeee !important;')
    expect(stylesheet).toContain('border-color: #ef9a9a !important;')
    expect(stylesheet).toContain('color: #c62828 !important;')
    expect(stylesheet).toContain('background: #c62828;')
  })
})
