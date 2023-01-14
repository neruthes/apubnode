export function onRequest(context) {
    // Hello world
    let username = decodeURIComponent(context.request.url).split('?').reverse()[0].split('&')[0].split('=')[1].split(':')[1].split('@')[0];
    return new Response(
        JSON.stringify({
            "subject": `acct:${username}@mypubnode.pages.dev`,
            "links": [
                {
                    "rel": "http://webfinger.net/rel/profile-page",
                    "type": "text/html",
                    "href": `http://mypubnode.pages.dev/u/${username}/`
                },
                {
                    "rel": "self",
                    "type": "application/ld+json",
                    "href": `http://mypubnode.pages.dev/u/${username}/Person.json`
                },
                {
                    "rel": "self",
                    "type": "application/activity+json",
                    "href": `http://mypubnode.pages.dev/u/${username}/outbox/index.json`
                }
            ]
        }, 't', 4)
    );
};
