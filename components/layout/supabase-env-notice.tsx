import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupabaseEnvNotice() {
  return (
    <Card className="border-amber-500/20 bg-amber-500/10">
      <CardHeader>
        <CardTitle>Supabase setup required</CardTitle>
        <CardDescription>
          Add your Supabase project URL and publishable key in `.env.local` before using auth or profile features.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-amber-100/80">
        Phase 2 wiring is complete, but this environment does not include live Supabase credentials.
      </CardContent>
    </Card>
  );
}
