import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { component, key, value } = await req.json();

  const { error } = await supabase
    .from("Content")
    .update({ value })
    .eq("component", component)
    .eq("key", key);

  return Response.json({ success: !error, error });
}
