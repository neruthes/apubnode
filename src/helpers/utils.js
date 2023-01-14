const fs = require('fs');


function genDataObjId(username, itemType) {
    return getUserProfileUrl(username) + 'items/' + process.env.TIMESTAMPSTR + '.' + itemType + '.json';
};

function processTolist(tolist, username) {
    if (tolist.length <= 1) {
        return [
            getUserProfileUrl(username) + 'followers/',
            'https://www.w3.org/ns/activitystreams#Public'
        ];
    } else {
        return tolist.split(' ');
    };
};

function parseSiteConfig() {
    const configText = fs.readFileSync('.apubnode/config').toString();
    let configObj = {};
    configText.trim().split('\n').filter(x => x[0] !== '#').forEach(function (line) {
        const innerLineArr = line.match(/^([\w_]+)="(.*?)"/);
        if (!innerLineArr) {
            return 0;
        };
        // console.log('debug  innerLineArr:');
        // console.log(innerLineArr);
        const varname = innerLineArr[1]
        const varvalue = innerLineArr[2];
        configObj[varname] = varvalue;
    });
    return configObj;
};

function getUserProfileUrl(username) {
    const config = parseSiteConfig();
    return config.http_prefix + '/' + config.path_user + '/' + username + '/';
};



module.exports = {
    genDataObjId,
    processTolist,
    parseSiteConfig,
    getUserProfileUrl
};
