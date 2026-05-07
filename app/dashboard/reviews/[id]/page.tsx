import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Review detail placeholder</p>
          <h2 className="text-3xl font-semibold text-white">{id}</h2>
        </div>
        <Badge variant="warning">Future Phase 3 UI</Badge>
      </div>

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>What will appear here later</CardTitle>
          <CardDescription>
            This route exists now so navigation, layout, and URL structure already match the product spec.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-400">
          <p>Review metadata, overall risk score, file-level findings, and issue groups will be added in future phases.</p>
          <p>Phase 1 intentionally keeps this as a styled placeholder without GitHub calls, AI summaries, or stored data.</p>
        </CardContent>
      </Card>
    </div>
  );
}
