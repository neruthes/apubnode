export function onRequest(context) {
    // Hello world
    let username = decodeURIComponent(context.request.url).split('?').reverse()[0].split('&')[0].split('=')[1].split(':')[1].split('@')[0];
    return new Response(
        // Content:
        JSON.stringify({
            "subject": `acct:${username}@mypubnode.pages.dev`,
            "links": [
                {
                    "rel": "http://webfinger.net/rel/profile-page",
                    "type": "text/html",
                    "href": `https://mypubnode.pages.dev/u/${username}/`
                },
                {
                    "rel": "self",
                    "type": "application/activity+json",
                    "href": `https://mypubnode.pages.dev/u/${username}/Person.json`
                }
            ]
        }, 't', 4),
        // Init:
        {
            headers: {
                'content-type': 'application/jrd+json; charset=utf-8'
            }
        }
    );
};
