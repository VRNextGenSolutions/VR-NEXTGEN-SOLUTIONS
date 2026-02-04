import { createServerSupabase } from '@/lib/supabase';

export async function subscribeToNewsletter(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerSupabase();

    // Check if already subscribed
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single();

    if (existing) {
        if (existing.is_active) {
            return { success: false, error: 'Already subscribed' };
        }

        // Reactivate
        const { error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update({ is_active: true, name: name || undefined })
            .eq('id', existing.id);

        if (updateError) return { success: false, error: updateError.message };
        return { success: true };
    }

    // Insert new
    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name });

    if (error) {
        // Handle unique constraint violation just in case race condition
        if (error.code === '23505') { // Postgres unique_violation
            return { success: false, error: 'Already subscribed' };
        }
        return { success: false, error: error.message };
    }

    return { success: true };
}
