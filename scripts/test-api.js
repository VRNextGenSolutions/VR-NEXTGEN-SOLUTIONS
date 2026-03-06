const url = 'https://zyudtvmdomiyrbrypbna.supabase.co/storage/v1/object/list/blog-media';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWR0dm1kb21peXJicnlwYm5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM3NDc0NCwiZXhwIjoyMDc4OTUwNzQ0fQ.Mk9AvKnE-rU_jjx2UxoPcmFgwN0xuZJhxVwRLZDqqj0';

async function test() {
    console.log('Fetching root...');
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefix: "", limit: 100, offset: 0 })
    });
    const root = await res.json();
    console.log('ROOT:', JSON.stringify(root, null, 2));

    for (const item of root) {
        if (!item.metadata || item.id === null) {
            console.log(`\nFetching subfolder: ${item.name}`);
            const subRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prefix: item.name + '/', limit: 100, offset: 0 })
            });
            const sub = await subRes.json();
            console.log(`SUB ${item.name}:`, JSON.stringify(sub, null, 2));

            for (const deepItem of sub) {
                if (!deepItem.metadata || deepItem.id === null) {
                    console.log(`\nFetching deep folder: ${item.name}/${deepItem.name}`);
                    const deepRes = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ prefix: item.name + '/' + deepItem.name + '/', limit: 100, offset: 0 })
                    });
                    const deepInfo = await deepRes.json();
                    console.log(`DEEP ${item.name}/${deepItem.name}:`, JSON.stringify(deepInfo, null, 2));
                }
            }
        }
    }
}

test().catch(console.error);
