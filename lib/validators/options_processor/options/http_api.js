DEFAULT_SUCCESS_MESSAGE = "Mohammed is gonna be happy"

class HttpApi {
  static async process (validatorContext, input, rule) {
    let isMergeable = true;

    return {
      status: isMergeable ? 'pass' : 'fail',
      description: isMergeable ? DEFAULT_SUCCESS_MESSAGE : description
    }
  }
}

module.exports = HttpApi
