/**
 * Image Compression Utility
 * Server-side image optimization using Sharp
 * 
 * Features:
 * - Resize to max dimensions while maintaining aspect ratio
 * - Convert to WebP for optimal compression
 * - Configurable quality settings
 */

import sharp from 'sharp';

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
}

export interface CompressionResult {
    buffer: Buffer;
    contentType: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    format: 'webp',
};

/**
 * Compress an image buffer
 * @param buffer - Original image buffer
 * @param options - Compression options
 * @returns Compressed image buffer and metadata
 */
export async function compressImage(
    buffer: Buffer,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const { maxWidth, maxHeight, quality, format } = { ...DEFAULT_OPTIONS, ...options };
    const originalSize = buffer.length;

    let sharpInstance = sharp(buffer)
        .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
        });

    // Apply format-specific compression
    switch (format) {
        case 'webp':
            sharpInstance = sharpInstance.webp({ quality });
            break;
        case 'jpeg':
            sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
            break;
        case 'png':
            sharpInstance = sharpInstance.png({ compressionLevel: 9 });
            break;
    }

    const compressedBuffer = await sharpInstance.toBuffer();
    const compressedSize = compressedBuffer.length;

    return {
        buffer: compressedBuffer,
        contentType: `image/${format}`,
        originalSize,
        compressedSize,
        compressionRatio: Math.round((1 - compressedSize / originalSize) * 100),
    };
}

/**
 * Check if a MIME type is a compressible image
 */
export function isCompressibleImage(mimeType: string): boolean {
    const compressibleTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
    ];
    return compressibleTypes.includes(mimeType.toLowerCase());
}

/**
 * Get the file extension for a format
 */
export function getExtensionForFormat(format: CompressionOptions['format']): string {
    switch (format) {
        case 'webp':
            return '.webp';
        case 'jpeg':
            return '.jpg';
        case 'png':
            return '.png';
        default:
            return '.webp';
    }
}
