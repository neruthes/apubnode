const fs = require('fs');
const utils = require('./utils.js');
const sh = require('child_process').execSync;

module.exports = {
    user_outbox_index: function (opt, config) {
        // Copied from https://mastodon.world/users/neruthes/outbox
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "id": opt.id,
            "type": "OrderedCollection",
            "totalItems": 1,
            "first": opt.id + 'outbox/main.json',
            "last": opt.id + 'outbox/main.json'
        };
        return obj;
    },
    user_outbox_main: function (opt, config) {
        // Copied from https://mastodon.world/users/neruthes/outbox?page=true
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "id": opt.id + 'outbox/main.json',
            "type": "OrderedCollectionPage",
            "prev": null,
            "partOf": opt.outbox,
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
            "published": process.env.action_datetime,
            "to": utils.processTolist(opt.tolist, opt.username),
            "attributedTo": utils.getUserProfileUrl(opt.username),
            "content": fs.readFileSync(opt.content_path).toString().trim()
        };
        return obj;
    },
    person: function (opt, config) {
        // Expected opt props: fullname, username, summary
        profileId = utils.getUserProfileUrl(opt.username);
        let obj = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "type": "Person",
            "id": profileId,
            "name": opt.fullname,
            "preferredUsername": opt.username,
            "summary": opt.summary,
            "inbox": "",
            "outbox": "",
            "followers": "",
            "following": "",
            "liked": "",
            "publicKey": {
                "id": profileId + 'public.pem',
                "owner": profileId,
                "publicKeyPem": fs.readFileSync(opt.userbasedir + '/public.pem').toString()
            }
        };
        ['inbox', 'outbox', 'followers', 'following', 'liked'].forEach(function (propname) {
            obj[propname] = obj.id + propname + '/index.json';
        });
        return obj;
    }
};
