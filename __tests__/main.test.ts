import {
  filterTestResults,
  processTestReports,
  ReportData
} from '../src/processtestreports'
import {prepareSlackOutput} from '../src/prepareslackoutput'
import {prepareGithubOutput} from '../src/preparegithuboutput'
import {expect, test} from '@jest/globals'

test('Parse report', async () => {
  const reportData: ReportData = processTestReports(
    '__tests__/test-report/mochawesome.json'
  )
  expect(reportData.testResults.length).toBe(4)
  expect(reportData.testResults[1]).toMatchObject({
    test: 'Test 2',
    passed: 'Fail',
    failedMessage: 'TypeError: expect(...).to.be is not a function'
  })
  expect(reportData.testResults[3]).toMatchObject({
    test: 'Test xxx',
    passed: 'Pass',
    failedMessage: ''
  })
})

test('Parse report with many passed tests', async () => {
  const reportData: ReportData = processTestReports(
    '__tests__/test-report/mochawesome_invalid_array.json'
  )
  expect(reportData.testResults.length).toBe(34)
})

test('Parse report with few passed', async () => {
  const reportData: ReportData = processTestReports(
    '__tests__/test-report/mochawesome_passed.json'
  )
  expect(reportData.testResults.length).toBe(4)
  expect(reportData.testResults[1]).toMatchObject({
    test: 'Test 2',
    passed: 'Pass',
    failedMessage: ''
  })
  expect(reportData.testResults[3]).toMatchObject({
    test: 'Test xxx',
    passed: 'Pass',
    failedMessage: ''
  })
})

test('Produce github text', async () => {
  const results = processTestReports('__tests__/test-report/mochawesome.json')
  const expectedResult = `3 FAILED of 4 tests
| Test name | Status | Error |
| :---         |     :---:      |          ---: |
| Test 1 | Fail | AssertionError: expected { a: 1, b: 2 } to have deep property 'a' of 3, but got 1 |
| Test 2 | Fail | TypeError: expect(...).to.be is not a function |
| Test 999 | Fail | TypeError: expect(...).to.be is not a function |
| Test xxx | Pass |  |
`
  expect(prepareGithubOutput(results)).toBe(expectedResult)
})

test('Check github when all tests failed', async () => {
  const results = processTestReports(
    '__tests__/test-report/mochawesome_all_failed.json'
  )
  const expectedResult = ` All 4 tests failed`
  expect(prepareGithubOutput(results)).toBe(expectedResult)
})

test('Check slack when all tests failed', async () => {
  const results = processTestReports(
    '__tests__/test-report/mochawesome_all_failed.json'
  )
  const expectedResult = ` All 4 tests failed`
  expect(prepareSlackOutput(results, 1000)).toBe(expectedResult)
})

test('Produce slack text', async () => {
  const results = processTestReports('__tests__/test-report/mochawesome.json')
  const expectedResult = `*3 FAILED of 4 tests*
\`\`\`Test       Status                                                                             Error
---------------------------------------------------------------------------------------------------
Test 1       Fail AssertionError: expected { a: 1, b: 2 } to have deep property 'a' of 3, but got 1
Test 2       Fail                                    TypeError: expect(...).to.be is not a function
Test 999     Fail                                    TypeError: expect(...).to.be is not a function
Test xxx     Pass                                                                                  \`\`\``
  expect(prepareSlackOutput(results, 1000)).toBe(expectedResult)
})

test('Report only failed', async () => {
  const results = processTestReports('__tests__/test-report/mochawesome.json')
  const expectedResult = `*3 FAILED of 4 tests*
\`\`\`Test       Status                                                                             Error
---------------------------------------------------------------------------------------------------
Test 1       Fail AssertionError: expected { a: 1, b: 2 } to have deep property 'a' of 3, but got 1
Test 2       Fail                                    TypeError: expect(...).to.be is not a function
Test 999     Fail                                    TypeError: expect(...).to.be is not a function\`\`\``
  expect(prepareSlackOutput(filterTestResults(results, true), 1000)).toBe(
    expectedResult
  )
})

test('Trim Slack report output only failed', async () => {
  const results = processTestReports('__tests__/test-report/mochawesome.json')
  const expectedResult = `*3 FAILED \`\`\``
  expect(prepareSlackOutput(filterTestResults(results, true), 10)).toBe(
    expectedResult
  )
})

test('Cleanup specific phrases from test messages', async () => {
  const results = processTestReports(
    '__tests__/test-report/mochawesome.json',
    'AssertionError: ,TypeError: '
  )
  const expectedResult = `3 FAILED of 4 tests
| Test name | Status | Error |
| :---         |     :---:      |          ---: |
| Test 1 | Fail | expected { a: 1, b: 2 } to have deep property 'a' of 3, but got 1 |
| Test 2 | Fail | expect(...).to.be is not a function |
| Test 999 | Fail | expect(...).to.be is not a function |
| Test xxx | Pass |  |
`
  expect(prepareGithubOutput(results)).toBe(expectedResult)
})

test('Produce slack text for empty test results', async () => {
  const results = processTestReports(
    '__tests__/test-report/mochawesome_invalid_array.json'
  )
  expect(prepareSlackOutput(filterTestResults(results, true), 1000)).toBe('')
})
