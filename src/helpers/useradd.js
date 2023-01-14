const fs = require('fs');
const utils = require('./utils.js');
const datamodels = require('./datamodels.js');

const siteConfig = utils.parseSiteConfig();

const personObj = datamodels.person(process.env, siteConfig);

console.log(personObj);
fs.writeFileSync(
    siteConfig.fs_prefix + siteConfig.path_user + '/' + process.env.username + '/Person.json',
    JSON.stringify(personObj, '\t', 4)
);
