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

app.actionObjDidLoad = function () {
    app.ram.actionObj = JSON.parse(actionObjXhr.responseText.trim());
    console.log(app.ram.actionObj);
    //
    // Render js-status-major region
    //
    document.querySelector('#js-status-major').innerHTML = app[`renderAction_${app.ram.actionObj.type}`](app.ram.actionObj);
    // app.ram.actionObj.orderedItems.map(function (actionItem) {
    //     // const actionInfoObj = {};
    //     return 
    // }).join('\n\n');
};

app.statusPageStart = function () {
    try {
        app.ram.personObj = JSON.parse(personJsonXhr.responseText.trim());
        const person = app.ram.personObj;
        app.registerPerson(person);
        //
        // Render js-status-starting region
        //
        document.querySelector('#js-status-starting').innerHTML = `<div class="status-page-starting-inner">
            <div class="padbox-h">
                <a class="statusStarting-profileAnchor" href="../">
                    <span class="statusStarting-name">${person.name}</span>
                </a>&nbsp;&nbsp;/&nbsp;
                <span class="statusStarting-hereLabel">This Activity</span>
            </div>
        </div>`;
        // document.querySelector('#js-status-starting').innerHTML = `<div class="status-starting-inner">
        //     <div class="padbox-h">
        //         <h2 class="statusStarting-name">${person.name}</h2>
        //         <aside class="statusStarting-username">@${person.preferredUsername}</aside>
        //     </div>
        // </div>`;
        //
        // Parse URL param
        //
        const actionItemId = location.search.match(/[&?]id=act-(\d+-\d+.).\w+?.json/)[0].slice(4);
        console.log(actionItemId);
        //
        // Get status (action)
        //
        window.actionObjXhr = new XMLHttpRequest();
        actionObjXhr.open('GET', '../activities/' + actionItemId);
        actionObjXhr.addEventListener('load', app.actionObjDidLoad);
        actionObjXhr.send();
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
    personJsonXhr.open('GET', '../Person.json');
    personJsonXhr.addEventListener('load', app.statusPageStart);
    personJsonXhr.send();
});
