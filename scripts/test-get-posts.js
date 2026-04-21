const { getBlogPosts } = require('./src/services/blog/posts');
const { createClient } = require('@supabase/supabase-js');

// Mock createServerSupabase
jest = undefined; // just to prevent issues if Next.js tries to run test logic
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://zyudtvmdomiyrbrypbna.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWR0dm1kb21peXJicnlwYm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzQ3NDQsImV4cCI6MjA3ODk1MDc0NH0.sB8xv7sloamk8pykKTfNXSzhYwVQa0PuDxomn3R2IFQ';

async function main() {
    console.log("Fetching all blog posts...");
    // Force require ts-node to run the imported TS file
    require('ts-node').register();

    try {
        const { getBlogPosts } = require('./src/services/blog/posts');
        const result = await getBlogPosts({}, 1, 100);
        console.log("Total posts returned:", result.total);
        result.posts.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title} (${p.slug})`);
        });
    } catch (e) {
        console.error(e);
    }
}
main();
