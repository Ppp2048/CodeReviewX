import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  footerLabel: string;
  footerHref: Route;
  footerLinkText: string;
  fields: Array<{
    id: string;
    label: string;
    type?: string;
    placeholder: string;
  }>;
};

export function AuthForm({
  title,
  description,
  submitLabel,
  footerLabel,
  footerHref,
  footerLinkText,
  fields,
}: AuthFormProps) {
  return (
    <Card className="w-full max-w-md border-white/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/20">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-5">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete="off"
              />
            </div>
          ))}

          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          {footerLabel}{" "}
          <Link href={footerHref} className="font-medium text-cyan-300 hover:text-cyan-200">
            {footerLinkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
