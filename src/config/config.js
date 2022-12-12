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
    JWT_RT_SECRET: process.env.JWT_RT_SECRET,
    JWT_RT_ALGORITHM: process.env.JWT_RT_ALGORITHM,
    JWT_RT_EXP_Days: process.env.JWT_RT_EXP_DAYS,
    JWT_AT_SECRET: process.env.JWT_AT_SECRET,
    JWT_AT_ALGORITHM: process.env.JWT_AT_ALGORITHM,
    JWT_AT_EXP_Hours: process.env.JWT_AT_EXP_HOURS,
    TEST_ENV: process.env.TEST_ENV
}