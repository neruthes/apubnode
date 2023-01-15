const fs = require('fs');
const utils = require('./utils.js');
const sh = require('child_process').execSync;

module.exports = {
    user_outbox_index: function (opt, config) {
        // Copied from https://mastodon.world/users/neruthes/outbox
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "id": opt.profileUrl + 'outbox/index.json',
            "type": "OrderedCollection",
            "totalItems": 1,
            "first": opt.profileUrl + 'outbox/main.json',
            "last": opt.profileUrl + 'outbox/main.json'
        };
        return obj;
    },
    user_outbox_main: function (opt, config) {
        // Copied from https://mastodon.world/users/neruthes/outbox?page=true
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "id": opt.profileUrl + 'outbox/main.json',
            "type": "OrderedCollectionPage",
            "prev": null,
            "partOf": opt.profileUrl + 'outbox/index.json',
            "orderedItems": fs.readdirSync(opt.userbasedir + '/activities').sort().reverse().filter(function (fn) {
                return fn.match(/^act-\d+-\d+.create.json$/);
            }).map(function (fn) {
                return JSON.parse(fs.readFileSync(opt.userbasedir + '/activities/' + fn).toString())
            })
        }
        return obj;
    },
    note: function (itemType, opt, config) {
        // Expected opt props: username, content, tolist
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "type": "Note",
            "id": utils.genDataObjId(opt.username, itemType),
            "url": utils.genDataObjId(opt.username, itemType),
            "published": process.env.action_datetime,
            "to": utils.processTolist(opt.tolist, opt.username),
            "attributedTo": utils.getUserProfileUrl(opt.username) + 'Person.json',
            "content": fs.readFileSync(opt.content_path).toString().trim()
        };
        return obj;
    },
    person: function (opt, config) {
        // Expected opt props: fullname, username, summary
        profileUrl = utils.getUserProfileUrl(opt.username);
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "type": "Person",
            "url": profileUrl,
            "id": profileUrl + 'Person.json',
            "name": opt.fullname,
            "preferredUsername": opt.username,
            "summary": opt.summary,
            "inbox": "",
            "outbox": "",
            "followers": "",
            "following": "",
            "liked": "",
            "publicKey": {
                "id": profileUrl + 'public.pem',
                "owner": profileUrl + 'Person.json',
                "publicKeyPem": fs.readFileSync(opt.userbasedir + '/public.pem').toString()
            }
        };
        ['inbox', 'outbox', 'followers', 'following', 'liked'].forEach(function (propname) {
            obj[propname] = obj.url + propname + '/index.json';
        });
        return obj;
    }
};
