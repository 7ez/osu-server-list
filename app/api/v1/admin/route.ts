import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const adminKey = req.headers.get("x-admin-key");

    if (adminKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: null });
}