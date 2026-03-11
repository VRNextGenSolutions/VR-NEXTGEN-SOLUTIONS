import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '@/lib/verifyAdmin';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { secret, paths } = req.body;

    const isAuthorized = secret === REVALIDATE_SECRET || await verifyAdmin(req);
    if (!isAuthorized) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!Array.isArray(paths) || paths.length === 0) {
        return res.status(400).json({ success: false, error: 'paths array is required' });
    }

    const results: { path: string; success: boolean; error?: string }[] = [];

    for (const path of paths) {
        if (typeof path !== 'string' || !path.startsWith('/')) {
            results.push({ path, success: false, error: 'Invalid path' });
            continue;
        }

        try {
            await res.revalidate(path);
            results.push({ path, success: true });
            console.log(`[Revalidation] Success: ${path}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error(`[Revalidation] Failed ${path}:`, error);
            results.push({ path, success: false, error: message });
        }
    }

    const allSucceeded = results.every(r => r.success);
    return res.status(allSucceeded ? 200 : 207).json({ success: allSucceeded, results });
}
