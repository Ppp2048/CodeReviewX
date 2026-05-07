import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm() {
  return (
    <Card className="bg-white/[0.03]">
      <CardHeader>
        <CardTitle>Workspace preferences</CardTitle>
        <CardDescription>
          These fields are scaffolded for the later Supabase-backed profile flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" placeholder="Jordan Lee" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-username">GitHub username</Label>
            <Input id="github-username" placeholder="jordanlee" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub profile URL</Label>
            <Input id="github-url" placeholder="https://github.com/jordanlee" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-provider">Preferred AI provider</Label>
            <Input id="ai-provider" placeholder="none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo-owner">Default repo owner</Label>
            <Input id="repo-owner" placeholder="acme" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo-name">Default repo name</Label>
            <Input id="repo-name" placeholder="platform-web" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">Session-only AI key placeholder</Label>
          <Textarea
            id="api-key"
            placeholder="Future MVP note: keep optional provider keys session-only on the client or route them through secure server actions."
          />
        </div>

        <div className="flex justify-end">
          <Button variant="outline">Save later-phase profile settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
