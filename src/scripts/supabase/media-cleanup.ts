// @ts-nocheck
/**
 * Media Cleanup Edge Function
 * Automatically deletes media files older than 2 months
 * 
 * Schedule: Run daily or weekly via Supabase Cron
 * Limits: Deletes 100 files per run to prevent timeouts
 */

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const BUCKET_NAME = 'blog-media';
const AGE_LIMIT_DAYS = 60; // 2 months

serve(async (req) => {
    // 1. Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
        return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // 2. Identify old files
        // Cutoff date
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - AGE_LIMIT_DAYS);

        // List all files (limited to 100 to avoid timeouts)
        // Note: For large buckets, this needs recursive listing or pagination
        // Assuming simple folder structure or first-level check for this script
        let filesToDelete: string[] = [];

        // Get root folders
        const { data: rootFolders } = await supabase.storage
            .from(BUCKET_NAME)
            .list('', { limit: 100 });

        for (const folder of rootFolders || []) {
            if (!folder.id) continue;

            const { data: subFolders } = await supabase.storage
                .from(BUCKET_NAME)
                .list(folder.name, { limit: 100 });

            for (const subFolder of subFolders || []) {
                if (!subFolder.id) continue;

                const { data: files } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(`${folder.name}/${subFolder.name}`, { limit: 50 });

                for (const file of files || []) {
                    if (file.id && file.created_at) {
                        const fileDate = new Date(file.created_at);
                        if (fileDate < cutoffDate) {
                            filesToDelete.push(`${folder.name}/${subFolder.name}/${file.name}`);
                        }
                    }
                }
            }
        }

        // 3. Delete identified files
        if (filesToDelete.length > 0) {
            console.log(`Deleting ${filesToDelete.length} files older than ${AGE_LIMIT_DAYS} days...`);

            const { error: deleteError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove(filesToDelete);

            if (deleteError) throw deleteError;
        }

        return new Response(JSON.stringify({
            success: true,
            deletedCount: filesToDelete.length,
            deletedFiles: filesToDelete
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
