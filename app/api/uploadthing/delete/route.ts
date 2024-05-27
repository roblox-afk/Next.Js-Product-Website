import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { imageKey } = await req.json();

    try {
        const res = await utapi.deleteFiles(imageKey);
        return NextResponse.json(res);
    } catch (error) {
        console.log("error at uploadthing/delete: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
