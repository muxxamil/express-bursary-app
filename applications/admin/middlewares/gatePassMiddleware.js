const mustLoggedIn = async (req, res, next) => {
        if (!req.session.user) {
            res.redirect('/admin/login');
        } else {
            next();
        }
}

const mustNotLoggedIn = async (req, res, next) => {
    if (req.session.user) {
        res.redirect('/admin/dashboard');
    } else {
        next();
    }
}

const mustHavePrivilege = (privileges, check) => {
    return (req, res, next) => {
        const userPrivileges = req.session?.user?.privileges || {}
        let foundPrivilegesCount = 0

        for (let index = 0; index < privileges.length; index++) {
            const privToCheck = privileges[index];
            if (userPrivileges[privToCheck]) {
                foundPrivilegesCount++
            }
        }

        if ((check === 'all' && foundPrivilegesCount !== privileges.length)
        || (check === 'any' && foundPrivilegesCount === 0)) {
            res.redirect('/admin/pageNotFound'); // TODO: change redirection to page not found link (view to be created)
        } else {
            next();
        }
    }
  }

module.exports = {
    mustLoggedIn,
    mustNotLoggedIn,
    mustHavePrivilege,
};