const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../../../models');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AuthRepository = require('../repositories/authRepository');
const { User, UserAccessToken } = require('../../../models');
const {
  mustNotLoggedIn,
  mustLoggedIn,
} = require('../middlewares/gatePassMiddleware');
const i18n = require('i18n');

const router = express.Router();

router.get('/', mustNotLoggedIn, (req, res) => {
  res.redirect('admin/login');
});

router.get('/login', mustNotLoggedIn, (req, res) => {
  res.render('admin/login', {
    layout: 'loginOrRegister',
    errors: req.flash('errors'),
    successes: req.flash('successes'),
  });
});

router.post(
  '/login',
  mustNotLoggedIn,
  AuthMiddleware.login,
  async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password,
        active: true,
      },
    });
    if (!user) {
      res.render('admin/login', {
        layout: 'loginOrRegister',
        errors: ['Either email or password is wrong!'],
        ...req.body,
      });
      return;
    }
    const userPrivileges = await AuthRepository.getUserPrivileges(user.id);
    req.session.user = {
      userId: user.id,
      email: user.email,
      privileges: userPrivileges,
    };
    res.redirect('/admin/dashboard');
  }
);

router.get('/register', (req, res) => {
  res.render('admin/register', { layout: 'loginOrRegister' });
});

router.get('/forgotPassword', (req, res) => {
  res.render('admin/forgotPassword', {
    layout: 'loginOrRegister',
    errors: req.flash('errors'),
    successes: req.flash('successes'),
  });
});

router.post(
  '/forgotPassword',
  mustNotLoggedIn,
  AuthMiddleware.forgotPassword,
  async (req, res) => {
    const retryInSec = await AuthRepository.checkRequestThrotteling(
      req.body.email
    );

    if (retryInSec > 0) {
      req.flash('errors', [
        i18n.__('CONTROLLER.AUTH.ALREADY_SHARED_RESET_LINK'),
      ]);
      res.redirect('/admin/forgotPassword');
      return;
    }

    const user = await User.findOne({
      where: { email: req.body.email, active: true },
    });
    if (!user) {
      req.flash('errors', ['User not found against this email!']);
      res.redirect('/admin/forgotPassword');
      return;
    }

    await AuthRepository.sendResetPasswordUniqueLink(user.id, req.body.email);
    req.flash('successes', [
      i18n.__('CONTROLLER.AUTH.FORGOT_PASSWORD_SUCCESS'),
    ]);
    res.redirect('/admin/forgotPassword');
  }
);

router.get('/recoverPassword/:token', async (req, res) => {
  try {
    jwt.verify(req.params.token, process.env.APP_SECRET);

    const accessToken = await UserAccessToken.findOne({
      attributes: ['id'],
      where: {
        value: req.params.token,
        scope: UserAccessToken.DEFAULTS.SCOPE.FORGOT_PASSWORD,
        expiredAt: { [Op.gt]: sequelize.fn('NOW') },
      },
    });

    if (!accessToken) {
      res.redirect('/admin/login');
      return;
    }

    res.render('admin/recoverPassword', {
      layout: 'loginOrRegister',
      token: req.params.token,
    });
  } catch (e) {
    res.redirect('/admin/login');
  }
});

router.post(
  '/recoverPassword',
  AuthMiddleware.recoverPassword,
  async (req, res) => {
    try {
      const decodedToken = jwt.verify(req.body.token, process.env.APP_SECRET);
      const userId = decodedToken.data.userId;

      const accessToken = await UserAccessToken.findOne({
        attributes: ['id'],
        where: {
          value: req.body.token,
          scope: UserAccessToken.DEFAULTS.SCOPE.FORGOT_PASSWORD,
          expiredAt: { [Op.gt]: sequelize.fn('NOW') },
        },
      });

      if (!accessToken) {
        res.redirect('/admin/login');
        return;
      }

      await User.update(
        { password: req.body.password },
        { where: { id: userId } }
      );
      await UserAccessToken.update(
        { expiredAt: sequelize.fn('NOW') },
        {
          where: {
            id: userId,
            scope: UserAccessToken.DEFAULTS.SCOPE.FORGOT_PASSWORD,
          },
        }
      );

      req.flash('successes', [
        i18n.__('CONTROLLER.AUTH.RESET_PASSWORD_SUCCESS'),
      ]);
      res.redirect('/admin/login');
    } catch (e) {
      res.redirect('/admin/login');
    }
  }
);

router.post('/logout', mustLoggedIn, async (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;
