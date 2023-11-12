const ValidateHelper = require('../../../utils/validateHelper');

const login = async (req, res, next) => {
    const validationRules = {
        'email': 'required|string|email',
        'password': 'required|string',
    };

    return await ValidateHelper.validateForm({
        rules: validationRules, 
        failedCase: { view: 'admin/login', layout: 'loginOrRegister' }
    })(req, res, next)
}

const forgotPassword = async (req, res, next) => {
    const validationRules = {
        'email': 'required|string|email',
    };

    return await ValidateHelper.validateForm({
        rules: validationRules, 
        failedCase: { view: 'admin/forgotPassword', layout: 'loginOrRegister' }
    })(req, res, next)
}

const recoverPassword = async (req, res, next) => {
    const validationRules = {
        'password': 'required|confirmed',
    };

    return await ValidateHelper.validateForm({
        rules: validationRules, 
        failedCase: { view: 'admin/recoverPassword', layout: 'loginOrRegister' }
    })(req, res, next)
}

module.exports = {
    login,
    forgotPassword,
    recoverPassword
};