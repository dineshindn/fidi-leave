if(process.env.NODE_ENV) {
    require('dotenv').config({
        path: `.${process.env.NODE_ENV}.env`
    });
}
else{
    require('dotenv').config();
}
module.exports = {
    PORT: process.env.PORT,
    JWT_RT_SECRET: 'secretrt',
    JWT_RT_ALGORITHM: 'HS256',
    JWT_RT_EXP_Days: 30,
    JWT_AT_SECRET: 'secretat',
    JWT_AT_ALGORITHM: 'HS256',
    JWT_AT_EXP_Hours: 1,
    TEST_ENV: process.env.TEST_ENV
}