import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueId = uuidv4();
        const extension = path.extname(file.name);
        const filename = `${uniqueId}${extension}`;

        // Save to public directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return the URL
        return NextResponse.json({
            location: `/uploads/${filename}`
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
} 