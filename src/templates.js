'use strict';

module.exports = {
  error: 'Error.',
  required: 'Required.',
  float: 'Must be number.',
  integer: 'Must be integer.',
  number: 'Must be number.',
  lessThan: 'Must less than {0}.',
  lessThanOrEqualTo: 'Must less than or equal to {0}.',
  greaterThan: 'Must greater than {0}.',
  greaterThanOrEqualTo: 'Must greater than or equal to {0}.',
  between: 'Must between {0} and {1}.',
  size: 'Size must be {0}.',
  length: 'Length must be {0}.',
  minLength: 'Must have {0} characters at least.',
  maxLength: 'Must have {0} characters at most.',
  lengthBetween: 'Length must between {0} and {1}.',
  in: 'Must be {0}.',
  notIn: 'Must not be {0}.',
  match: 'Not matched.',
  regex: 'Invalid format.',
  digit: 'Must be digit.',
  email: 'Invalid email.',
  url: 'Invalid url.',
  optionCombiner: function (options) {
    if (options.length > 2) {
      options = [options.slice(0, options.length - 1).join(', '), options[options.length - 1]];
    }
    return options.join(' or ');
  }
};