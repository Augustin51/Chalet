import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/connexion");
  }

  return (
    <div>
      <h1>Bienvenue admin</h1>
    </div>
  );
}
