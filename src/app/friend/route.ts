import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

const resend = new Resend(process.env.RESEND as string);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.KEY) {
    console.log("invalid key");
    return NextResponse.json({ friend: false }, { status: 400 });
  }

  // insert into database
  console.log(body.data.fields);

  const email = body.data.fields[0].value;
  const twitterUsername = body.data.fields[1].value.replace("@", "");

  await supabase.from("friends").insert({
    email,
    twitterUsername,
  });

  // email
  await resend.emails.send({
    from: "Friend.Tech Alerts <onboarding@resend.dev>",
    to: email,
    subject: "Friend.Tech Alert",
    html: `<div>Hello</div> <div> Thank you for using Friend.Tech Alerts. Once ${twitterUsername} signs up, you will get another email notification </div>`,
  });

  return NextResponse.json({ friend: true });
}
