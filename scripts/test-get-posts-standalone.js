const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zyudtvmdomiyrbrypbna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWR0dm1kb21peXJicnlwYm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzQ3NDQsImV4cCI6MjA3ODk1MDc0NH0.sB8xv7sloamk8pykKTfNXSzhYwVQa0PuDxomn3R2IFQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    console.log("Querying Supabase just like getBlogPosts does...");
    const { data, count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .eq('is_deleted', false)
        .order('published_at', { ascending: false })
        .range(0, 8);

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Returned ${data.length} posts (Total count match: ${count})`);
    data.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} (deleted: ${p.is_deleted})`);
    });
}
main();
