const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const {
    User,
    UserRole,
    RolePrivilege,
    UserAccessToken
} = require('../../../models');
const {
    redisLimiterSlowBruteByIPForForgotPassword
} = require('../../../utils/redisHelper');
const {
    sendMail
} = require('../../../utils/mailHelper');

const AuthRepository = {};

AuthRepository.getUserPrivileges = async (userId) => {
    const user = await User.findOne({
        attributes: ['id', 'email', 'roleId'],
        where: {id: userId},
        include: [
            {
                model : UserRole,
                attributes: ['id', 'title'],
                include: [
                    {
                        model : RolePrivilege,
                        attributes: ['key', 'privilegeScope'],
                        required: true,
                    }
                ],
                required: true,
            }
        ]
    })

    const userPrivileges = {}

    user.UserRole.RolePrivileges.forEach((rolePrivilege) => {
        userPrivileges[rolePrivilege.key] = rolePrivilege.privilegeScope
    })

    return userPrivileges
}

AuthRepository.checkRequestThrotteling = async (email) => {

    const forgotPasswordAttempts = await redisLimiterSlowBruteByIPForForgotPassword.get(email)
    let retrySecs = 0;

    if (forgotPasswordAttempts !== null && forgotPasswordAttempts.remainingPoints < 1) {
        retrySecs = Math.round(forgotPasswordAttempts.msBeforeNext / 1000) || 1;
    }

    return retrySecs
}

AuthRepository.sendResetPasswordUniqueLink = async (userId, email) => {

    const newToken = jwt.sign({
        data: { userId }
      }, process.env.APP_SECRET, { expiresIn: '2h' });

    const userResetPasswordToken = await UserAccessToken.findOne({
        attributes: ['id'],
        where: {
            userId
        }
    })

    if (userResetPasswordToken !== null) {
        await UserAccessToken.update({ value: newToken, expiredAt: sequelize.literal('DATE_ADD(NOW(), INTERVAL 2 HOUR)') },
        {where: {id: userResetPasswordToken.id}})
    } else {
        await UserAccessToken.create({ userId, value: newToken, scope: UserAccessToken.DEFAULTS.SCOPE.FORGOT_PASSWORD });
    }

    await sendMail({to: email, subject: 'Reset Password Link', body: `${process.env.APP_BASE_URL}/admin/recoverPassword/${newToken}`})
    await redisLimiterSlowBruteByIPForForgotPassword.consume(email)
}

module.exports = AuthRepository;