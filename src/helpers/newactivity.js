const fs = require('fs');
const utils = require('./utils.js');
const datamodels = require('./datamodels.js');

const timeStr = (new Date()).toISOString().slice(0, 19)

const siteConfig = utils.parseSiteConfig();

const itemType = process.argv[2];

const itemObj = datamodels[itemType](itemType, process.env, siteConfig);

console.log(itemObj);



const outputFilePath = siteConfig.fs_prefix + siteConfig.path_user + '/' + process.env.username + '/items/' + process.env.TIMESTAMPSTR + '.' + itemType + '.json'
fs.writeFileSync(
    outputFilePath,
    JSON.stringify(itemObj, '\t', 4)
);
console.log(`Created new item at '${outputFilePath}'`);



//
// Now proceed to the Create action
//

const theCreateAction = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "type": "Create",
    "id": utils.getUserProfileUrl(process.env.username) + 'activities/act-' + process.env.TIMESTAMPSTR + '.create.json',
    "published": process.env.action_datetime,
    "to": itemObj.to,
    "actor": itemObj.attributedTo,
    "object": itemObj
};
console.log(theCreateAction);

const actOutputFilePath = siteConfig.fs_prefix + siteConfig.path_user + '/' + process.env.username + '/activities/act-' + process.env.TIMESTAMPSTR + '.create.json'
fs.writeFileSync(
    actOutputFilePath,
    JSON.stringify(theCreateAction, '\t', 4)
);
console.log(`Created new 'Create' action at '${actOutputFilePath}'`);
