const {tokenService} = require('../services');

const rt = async (req,res) => {
    try{
        // get token from request header authorization bearer token
        const token = req.headers.authorization.split(' ')[1];
        const newAccessToken =tokenService.createAccessTokenFromRefreshToken(token);
        res.status(200).json({
            accessToken: newAccessToken
        })
    }
    catch(err){

        res.status(500).json({
            message: "invalid refresh token"
        })
    }
}

module.exports = {
    rt
}