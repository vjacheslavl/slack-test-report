import {ReportData} from './processtestreports'
import slackTable from 'slack-table'

export function prepareSlackOutput(
  reportData: ReportData,
  maxOutputLength: number
): string {
  if (reportData.testCount.failed === reportData.testCount.total) {
    return ` All ${reportData.testCount.total} tests failed`
  }

  if (reportData.testResults.length > 0) {
    const maxNameLength = Math.max(
      ...reportData.testResults.map(i => i.test.length)
    )
    const maxMessageLength = Math.max(
      ...reportData.testResults.map(i => i.failedMessage.length)
    )

    const table = slackTable({
      title: reportData.reportTitle,
      columns: [
        {width: maxNameLength, title: 'Test', dataIndex: 'test'},
        {width: 8, title: 'Status', dataIndex: 'passed', align: 'right'},
        {
          width: maxMessageLength,
          title: 'Error',
          dataIndex: 'failedMessage',
          align: 'right'
        }
      ],
      dataSource: ['-', ...reportData.testResults]
    })

    if (table.length > maxOutputLength) {
      // add trailing closing ``` for the Slack table
      return `${table.substring(0, maxOutputLength)}\`\`\``
    } else {
      return table
    }
  } else {
    return ''
  }
}
