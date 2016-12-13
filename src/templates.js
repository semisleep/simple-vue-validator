'use strict';

module.exports = {
  error: 'Error.',
  required: 'Required.',
  mustBeFloat: 'Must be number.',
  mustBeInteger: 'Must be integer.',
  mustBeNumber: 'Must be number.',
  mustLessThan: 'Must less than {0}.',
  mustLessThanOrEqualTo: 'Must less than or equal to {0}.',
  mustGreaterThan: 'Must greater than {0}.',
  mustGreaterThanOrEqualTo: 'Must greater than or equal to {0}.',
  mustBetween: 'Must between {0} and {1}.',
  sizeMustBe: 'Size must be {0}.',
  lengthMustBe: 'Length must be {0}.',
  lengthAtLeast: 'Must have {0} characters at least.',
  lengthAtMost: 'Must have {0} characters at most.',
  lengthMustBetween: 'Length must between {0} and {1}.',
  valueMustIn: 'Must be {0}.',
  valueMustNotIn: 'Must not be {0}.',
  valueNotMatch: 'Not matched.',
  regexInvalid: 'Invalid format.',
  digitInvalid: 'Must be digit.',
  emailInvalid: 'Invalid email.',
  urlInvalid: 'Invalid url.',
  optionCombiner: function (options) {
    if (options.length > 2) {
      options = [options.slice(0, options.length - 1).join(', '), options[options.length - 1]];
    }
    return options.join(' or ');
  }
};