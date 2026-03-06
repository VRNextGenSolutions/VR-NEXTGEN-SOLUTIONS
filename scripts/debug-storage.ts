import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
    console.log('Fetching root...');
    const { data: root, error } = await supabase.storage.from('blog-media').list('', { limit: 100 });
    console.log('ROOTERROR:', error);
    console.log('ROOT:', JSON.stringify(root, null, 2));

    if (root) {
        for (const item of root) {
            if (!item.metadata) {
                console.log(`Fetching subfolder ${item.name}...`);
                const { data: sub, error: subError } = await supabase.storage.from('blog-media').list(item.name, { limit: 100 });
                console.log(`SUBERROR ${item.name}:`, subError);
                console.log(`SUB ${item.name}:`, JSON.stringify(sub, null, 2));
            }
        }
    }
}

inspect().catch(console.error);
