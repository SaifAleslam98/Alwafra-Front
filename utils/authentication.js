const axios = require('axios');
async function isAuthorized(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/');
    }
    else {
        const verifyUrl = `${process.env.API_URL}/auth/verify`;
        const header = {
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = (await axios.get(verifyUrl, { headers: header })).data;
            res.locals.userLoggedIn = true
            next();
        } catch (error) {
            res.clearCookie('token');
            res.locals.userLoggedIn = false
            res.locals.userName = null
            return res.redirect('/');
            
        }
    }
}

function isNotAuthorized(req, res, next) {
    if (req.cookies.token) {
        res.redirect('/h/')
        return
    }
    else {
        next()
    }

}
module.exports = { isAuthorized, isNotAuthorized };
