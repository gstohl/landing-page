import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the Neon database
    const sql = neon(process.env.DATABASE_URL!);

    // Insert the message into the database
    await sql`
      INSERT INTO get_in_touch (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
} 