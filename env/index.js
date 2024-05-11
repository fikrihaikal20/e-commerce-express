const path = require("path");
const dotenv = require('dotenv');
const debug = require('../app/services/debug')
debug.logHeader("Setting up Environment")
const envFile = { path: path.resolve(__dirname, `../env/.env`) };

const envConfig = dotenv.config(envFile);
debug.logData('env path', envFile.path)
debug.logData('env config', envConfig)
