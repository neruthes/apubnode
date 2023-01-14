const app = {
    ram: {
        person_id2obj_map: {}
    }
};

app.registerPerson = function (personObj) {
    app.ram.person_id2obj_map[personObj.id] = personObj;
};
app.probePersonInRam = function (personId) {
    if (app.ram.person_id2obj_map[personId]) {
        return app.ram.person_id2obj_map[personId]
    } else {
        return null
    };
    // http://127.0.0.1:35588/u/neruthes/
};

app.renderAction_Create = function (actionItem) {
    let actorObj = app.probePersonInRam(actionItem.actor);
    if (!actorObj) {
        actorObj = app.ram.personObj;
        console.log(`Very strange, cannot find person in app.ram by actor '${actionItem.actor}' of actionItem:`);
        console.log(actionItem);
    };
    return `<div class="tlAction-ANY tlAction-Create" data-tl-action="Create">
        <div class="padbox-h">
            <div class="tla-Create-header tla-ANY-header">
                <img class="tla-ANY-avatarImg" src="../../userimg/avatar/${actorObj.preferredUsername}.png">
                <a class="tla-ANY-header--actorAnchor" href="${actorObj.id}">
                    <span class="tla-ANY-header--actorFullname">${actorObj.name}</span>
                    <span class="tla-ANY-header--actorUsername">(@${actorObj.preferredUsername})</span></a>&nbsp;
                <span class="tla-ANY-header--actionName">created new ${actionItem.object.type.toLowerCase()}</span>
            </div>

            <div class="tla-Create-content tla-ANY-content">
                ${app[`renderObject_${actionItem.object.type}`](actionItem.object)}
            </div>

            <div class="tla-Create-footer tla-ANY-footer">
                <time class="tla-ANY-footer--time" datetime="${actionItem.published}">${actionItem.published.replace('T', ' ').slice(0, 19)}</time>
                <a class="tla-ANY-footer--permalink" href="${actorObj.id}status/?id=${actionItem.id.split('/').reverse()[0]}">Permalink</a>
                <a class="tla-ANY-footer--permalink" href="${actorObj.id}activities/${actionItem.id.split('/').reverse()[0]}">JSON-LD</a>
            </div>
        </div>
    </div>`;
};

app.renderObject_Note = function (objectItem) {
    // const localObjectXhr = 
    return `<div class="tlo-Note" data-tl-object="Note">
        <div class="tlo-Note--inner" data-tlo-inner-id="${objectItem.id}">
            ${objectItem.content}
        </div>
    </div>`;
};

app.outboxMainDidLoad = function () {
    app.ram.outboxObj = JSON.parse(outboxMainXhr.responseText.trim());
    console.log(app.ram.outboxObj);
    //
    // Render js-profile-timeline region
    //
    document.querySelector('#js-profile-timeline').innerHTML = app.ram.outboxObj.orderedItems.map(function (actionItem) {
        // const actionInfoObj = {};
        return app[`renderAction_${actionItem.type}`](actionItem);
    }).join('\n\n');
};

app.profilePageStart = function () {
    try {
        app.ram.personObj = JSON.parse(personJsonXhr.responseText.trim());
        const person = app.ram.personObj;
        app.registerPerson(person);
        //
        // Render js-profile-major region
        //
        document.querySelector('#js-profile-major').innerHTML = `<div class="profile-page-major-inner">
            <div class="padbox-h">
                <img class="profileMajor-avatarimg" src="../../userimg/avatar/${person.preferredUsername}.png">
                <h2 class="profileMajor-name">${person.name}</h2>
                <aside class="profileMajor-username">@${person.preferredUsername}</aside>
                <p class="profileMajor-summary">${person.summary}</p>
                <div class="profileMajor-summary">
                    <a class="profileMajor-smallAnchor" href="${person.id}outbox/index.json">Outbox</a>
                    <a class="profileMajor-smallAnchor" href="${person.id}Person.json">Person</a>
                </div>
            </div>
        </div>`;
        //
        // Get timeline (outbox)
        //
        window.outboxMainXhr = new XMLHttpRequest();
        outboxMainXhr.open('GET', './outbox/main.json');
        outboxMainXhr.addEventListener('load', app.outboxMainDidLoad);
        outboxMainXhr.send();
    } catch (error) {
        // What shall we do when Person cannot be loaded/parsed?
    };
};

window.addEventListener('load', function () {
    //
    // Do our stuff now
    //

    // Load Person.json
    window.personJsonXhr = new XMLHttpRequest();         // I love good old XHR days; bad for async hell.
    personJsonXhr.open('GET', './Person.json');
    personJsonXhr.addEventListener('load', app.profilePageStart);
    personJsonXhr.send();
});
