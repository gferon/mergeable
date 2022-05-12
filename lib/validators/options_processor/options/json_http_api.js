const handlebars = require('handlebars')
const got = require('got')

const DEFAULT_SUCCESS_MESSAGE = "Mohammed is gonna be happy"

const REGEX_NOT_FOUND_ERROR = 'Failed to run the test because \'regex\' is not provided for \'jira\' option. Please check README for more information about configuration'

class JsonHttpApi {
  static async process (validatorContext, labels, rule) {
    let isMergeable

    const filter = rule.json_http_api
    const endpoint = filter.endpoint
    let template = handlebars.compile(filter.endpoint);

    let description = filter.message
    if (!filter.regex) {
      throw new Error(REGEX_NOT_FOUND_ERROR)
    }

    let regexes = filter.regex.map(re => {
      return new RegExp(re)
    })

    // TODO: check that we don't have duplicate keys
    let groups = labels.reduce((groups, label) => {
      let newGroups = regexes.reduce((groups, re) => {
        let match = label.match(re)
        if (match != null && match.groups != null) {
          return Object.assign(groups, match.groups)
        } else {
          return groups
        }
      }, {})
      return Object.assign(groups, newGroups)
    }, {})

    // TODO: catch lack of variables here
    let url = template(groups)

    let response = await got(url);
    switch(response.statusCode) {
      case 404:
        description = `GET ${url} returned 404: Not Found`
        break
      case 200:
        isMergeable = true
    }

    return {
      status: isMergeable ? 'pass' : 'fail',
      description: isMergeable ? DEFAULT_SUCCESS_MESSAGE : description
    }
  }
}

module.exports = JsonHttpApi
