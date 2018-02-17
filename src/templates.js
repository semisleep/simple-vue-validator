'use strict';

module.exports = {
  error: 'Error.',
  required: 'Required.',
  float: 'Must be a number.',
  integer: 'Must be an integer.',
  number: 'Must be a number.',
  lessThan: 'Must be less than {0}.',
  lessThanOrEqualTo: 'Must be less than or equal to {0}.',
  greaterThan: 'Must be greater than {0}.',
  greaterThanOrEqualTo: 'Must greater than or equal to {0}.',
  between: 'Must be between {0} and {1}.',
  size: 'Size must be {0}.',
  length: 'Length must be {0}.',
  minLength: 'Must have at least {0} characters.',
  maxLength: 'Must have up to {0} characters.',
  lengthBetween: 'Length must between {0} and {1}.',
  in: 'Must be {0}.',
  notIn: 'Must not be {0}.',
  match: 'Not matched.',
  regex: 'Invalid format.',
  digit: 'Must be a digit.',
  email: 'Invalid email.',
  url: 'Invalid url.',
  optionCombiner: function (options) {
    if (options.length > 2) {
      options = [options.slice(0, options.length - 1).join(', '), options[options.length - 1]];
    }
    return options.join(' or ');
  }
};
