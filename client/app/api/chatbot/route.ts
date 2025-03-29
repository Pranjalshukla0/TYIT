import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const response = await fetch('http://127.0.0.1:5000/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to chatbot' }, { status: 500 });
    }
}
