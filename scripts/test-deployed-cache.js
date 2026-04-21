const https = require('https');

https.get('https://vrnextgensolutions.com/nextgen-blog', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        // Find the __NEXT_DATA__ script
        const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
        if (match && match[1]) {
            try {
                const state = JSON.parse(match[1]);
                const posts = state.props.pageProps.posts;
                console.log(`Found ${posts.length} posts in Next.js Server cache:`);
                posts.forEach((p, i) => {
                    console.log(`${i + 1}. ${p.title} (${p.slug})`);
                });
            } catch (e) {
                console.error("Error parsing JSON");
            }
        } else {
            console.log("Could not find __NEXT_DATA__");
        }
    });
});
