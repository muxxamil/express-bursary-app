const Validator = require('validatorjs');
const _ = require('lodash');

const ValidateHelper = {};

ValidateHelper.validate = async (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => {
    let errors = [];
    _.forEach(validation?.errors?.errors, function (attributeErrors) {
      errors = errors.concat(attributeErrors);
    });
    return callback(errors, false);
  });
};

ValidateHelper.validateForm = (validationFormParams) => {
  return async (req, res, next) => {
    await ValidateHelper.validate(
      req.body,
      validationFormParams.rules,
      {},
      (errors, isPassed) => {
        if (!isPassed) {
          res.render(validationFormParams.failedCase.view, {
            layout: validationFormParams.failedCase.layout,
            errors,
            ...req.body,
          });
        } else {
          next();
        }
      }
    ).catch((err) => console.log(err));
  };
};

module.exports = ValidateHelper;
