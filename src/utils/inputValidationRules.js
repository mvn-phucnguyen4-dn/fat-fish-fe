/**
 * creates and returns a validation rule object that
 * is used by useForm hook to validate the form inputs
 *
 * @param {string} ruleName - name of the validation rule
 * @param {string} errorMessage - message to display
 * @param {function} validateFunc - validation function
 */
function createValidationRule(ruleName, errorMessage, validateFunc) {
  return {
    name: ruleName,
    message: errorMessage,
    validate: validateFunc,
  }
}

export function requiredRule(inputName) {
  return createValidationRule(
    'required',
    `${inputName} required`,
    (inputValue) => inputValue.length !== 0,
  )
}

export function minLengthRule(inputName, minCharacters) {
  return createValidationRule(
    'minLength',
    `${inputName} should contain atleast ${minCharacters} characters`,
    (inputValue) => inputValue.length >= minCharacters,
  )
}

export function maxLengthRule(inputName, maxCharacters) {
  return createValidationRule(
    'minLength',
    `${inputName} cannot contain more than ${maxCharacters} characters`,
    (inputValue) => inputValue.length <= maxCharacters,
  )
}

export function passwordMatchRule() {
  return createValidationRule(
    'passwordMatch',
    `Confirm password and password not same`,
    (inputValue, formObj) => {
      return inputValue === formObj.password.value
    },
  )
}
