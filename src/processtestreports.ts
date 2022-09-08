import fs from 'fs'
import * as core from '@actions/core'

export type TestResults = {
  test: string
  passed: string
  failedMessage: string
}

export type ReportData = {
  reportTitle: string
  testResults: TestResults[]
  testCount: TestsCount
}

export type TestsCount = {
  total: number
  failed: number
}

const PASSED = 'Pass'
const FAILED = 'Fail'

const MAX_MESSAGE_LENGTH = 200

export function processTestReports(
  pathToReport: string,
  cleanSpecifcPhrases = ''
): ReportData {
  const parsedResult = parseJson(pathToReport)

  const phrasesToRemove = cleanSpecifcPhrases
    ? cleanSpecifcPhrases.split(',')
    : []

  core.info(`Reading test results`)
  const testResults: TestResults[] = []
  for (const result of parsedResult.results) {
    for (const suite of result.suites) {
      for (const test of suite.tests) {
        testResults.push({
          test: test.title,
          passed: test.pass ? PASSED : FAILED,
          failedMessage:
            test.err.message == null
              ? ''
              : cleanupMessage(test.err.message as string, phrasesToRemove)
        })
      }
    }
  }

  const testCount = countTests(testResults)
  const reportTitle = createReportTitle(testCount)

  return {reportTitle, testResults, testCount}
}

function countTests(parsedData: TestResults[]): TestsCount {
  return {
    total: parsedData.length,
    failed: parsedData.filter(i => i.passed === 'Fail').length
  }
}

function createReportTitle(testCount: TestsCount): string {
  if (testCount.failed === 0) {
    return `${testCount.total} tests PASSED`
  } else {
    return `${testCount.failed} FAILED of ${testCount.total} tests`
  }
}

function cleanupMessage(message: string, phrasesToRemove: string[]): string {
  core.info(`Performing message cleanup`)
  let resultMessage = message

  for (const phrase of phrasesToRemove) {
    resultMessage = resultMessage.split(phrase).join('')
  }

  if (resultMessage.length > MAX_MESSAGE_LENGTH) {
    resultMessage = `${resultMessage.substring(0, MAX_MESSAGE_LENGTH)} ...`
  }

  return resultMessage
}

export function filterTestResults(
  reportData: ReportData,
  reportFailedOnly = false
): ReportData {
  core.info(`Filtering test results`)
  if (reportFailedOnly) {
    return {
      reportTitle: reportData.reportTitle,
      testResults: reportData.testResults.filter(i => i.passed === FAILED),
      testCount: reportData.testCount
    }
  } else {
    return reportData
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(filePath: string): any {
  core.info(`Parsing json at ${filePath}`)
  try {
    return JSON.parse(
      fs.readFileSync(filePath, {
        encoding: 'utf8',
        flag: 'r'
      })
    )
  } catch (err) {
    throw err
  }
}
