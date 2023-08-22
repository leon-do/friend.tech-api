import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wzdsmylqlohsavmvnbmk.supabase.co",
  process.env.SUPABASE as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.KEY) {
    console.log("invalid key");
    return NextResponse.json({ friend: false }, { status: 400 });
  }

  // insert into database
  console.log(body.data.fields);

  await supabase.from("friends").insert({
    email: body.data.fields[0].value,
    twitterUsername: body.data.fields[1].value,
  });

  return NextResponse.json({ friend: true });
}
