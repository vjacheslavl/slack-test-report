import {ReportData} from './processtestreports'

export function prepareGithubOutput(reportData: ReportData): string {
  if (reportData.testCount.failed === reportData.testCount.total) {
    return ` All ${reportData.testCount.total} tests failed`
  }

  return `${reportData.reportTitle}
| Test name | Status | Error |
| :---         |     :---:      |          ---: |
${reportData.testResults
  .map(i => `| ${i.test} | ${i.passed} | ${i.failedMessage} |\n`)
  .join('')}`
}
