# Test report summary github action

This github action parses mochaawesome test report and produces output of Test Summary
- In Github markdown
- In Slack markdown


# Example of use in Pull Requests

```
- uses: vjaceslavsl/test-report-summary@v1
  with:
    reportPath: test-report/mochawesone.json
    failedOnlyForSlack: true
    failedOnlyForGithub: false
    cleanSpecifcPhrases: "AssertionError: ,CypressError: "
- run: |
    echo "Slack result is ${{steps.report-summary.outputs.slackReport}}"
- run: |
    echo "Github result is ${{steps.report-summary.outputs.githubReport}}"
```

### Parameters

### failedOnlyForSlack

Optional parameter
Report only failed tests for Slack (true|false). By default false - reports all tests

#### failedOnlyForGithub

Optional parameter
Report only failed tests for Github (true|false). By default false - reports all tests

### cleanSpecifcPhrases

Optional parameter
Comma separated list of phrases to remove from the error message to shorten reports

Often test frameworks add generic phrases to error output and this produces longer texts

Example:


Was:
```
AssertionError: Order not created
```

cleanSpecifcPhrases: "AssertionError: "

Now
```
Order not created
```

# Create a JavaScript Action using TypeScript

The template to bootstrap the creation of a TypeScript action.:rocket:

https://github.com/actions/typescript-action


This template includes compilation support, tests, a validation workflow, publishing, and versioning guidance.  

If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

## Validate

### unit tests

see ./\_\_tests\_\_

### github action testing

This repository has a pipeline 'build-test'

It validates the action by referencing `./` in a workflow in this repo (see [test.yml](.github/workflows/test.yml))

See the [actions tab](https://github.com/vjaceslavs/slack-test-report/actions) for runs of this action! :rocket:


## Changing code

Github action run the compiled js code from /dist
For that purpose it needs to be valid and actual
Best way to achieve that is to run

```
npm run all
```

before commiting
This command performs the linting, packaging and tests

Once this command run is sucessful, you can commit the changes

## Releasing new version tag

In order to use Github Action in other repository, you need to add version tag

```sh
git tag -fa v1.0 -m "Update v1.0 tag"
git push origin v1.0 --force
```
