const fs = require('fs');
const utils = require('./utils.js');
const datamodels = require('./datamodels.js');

const siteConfig = utils.parseSiteConfig();

const personObj = JSON.parse(fs.readFileSync(process.env.userbasedir + '/Person.json'));

const newOutboxObj_index = datamodels.user_outbox_index({
    profileUrl: personObj.url,
    userbasedir: process.env.userbasedir
}, siteConfig);

const newOutboxObj_main = datamodels.user_outbox_main({
    profileUrl: personObj.url,
    userbasedir: process.env.userbasedir
}, siteConfig);


// console.log(`debug  newOutboxObj_index:`);
// console.log(newOutboxObj_index);
fs.writeFileSync(process.env.userbasedir + '/outbox/index.json', JSON.stringify(newOutboxObj_index, '\t', 4));

// console.log(`debug  newOutboxObj_main:`);
// console.log(newOutboxObj_main);
fs.writeFileSync(process.env.userbasedir + '/outbox/main.json', JSON.stringify(newOutboxObj_main, '\t', 4));
