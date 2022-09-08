import * as core from '@actions/core'
import {prepareGithubOutput} from './preparegithuboutput'
import {prepareSlackOutput} from './prepareslackoutput'
import {filterTestResults, processTestReports} from './processtestreports'

const defaultSlackLMessageLength = 3000

async function run(): Promise<void> {
  try {
    const pathToReport = core.getInput('reportPath')
    const reportFailedOnlyForSlack =
      core.getInput('failedOnlyForSlack') === 'true'
    const reportFailedOnlyForGithub =
      core.getInput('failedOnlyForGithub') === 'true'
    const maxSlackMessageLength = core.getInput('maxLength')
      ? Number(core.getInput('maxLength'))
      : defaultSlackLMessageLength

    const cleanSpecifcPhrases = core.getInput('cleanSpecifcPhrases')

    const reportData = processTestReports(pathToReport, cleanSpecifcPhrases)

    core.setOutput(
      'slackReport',
      prepareSlackOutput(
        filterTestResults(reportData, reportFailedOnlyForSlack),
        maxSlackMessageLength
      )
    )
    core.setOutput(
      'githubReport',
      prepareGithubOutput(
        filterTestResults(reportData, reportFailedOnlyForGithub)
      )
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.stack) {
        core.info(error.stack)
      }
      core.setFailed(error.message)
    }
  }
}

run()
