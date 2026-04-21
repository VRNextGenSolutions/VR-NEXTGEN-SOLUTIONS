const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://zyudtvmdomiyrbrypbna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWR0dm1kb21peXJicnlwYm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzQ3NDQsImV4cCI6MjA3ODk1MDc0NH0.sB8xv7sloamk8pykKTfNXSzhYwVQa0PuDxomn3R2IFQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error(error);
        return;
    }

    fs.writeFileSync('scripts/recent_posts.json', JSON.stringify(data, null, 2));
    console.log("Saved to scripts/recent_posts.json");
}
main();
