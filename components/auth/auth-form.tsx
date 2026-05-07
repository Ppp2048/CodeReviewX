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
  action: (formData: FormData) => void | Promise<void>;
  footerLabel: string;
  footerHref: Route;
  footerLinkText: string;
  disabled?: boolean;
  message?: {
    type: "error" | "success";
    text: string;
  };
  fields: Array<{
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    defaultValue?: string;
    autoComplete?: string;
  }>;
};

export function AuthForm({
  title,
  description,
  submitLabel,
  action,
  footerLabel,
  footerHref,
  footerLinkText,
  disabled = false,
  message,
  fields,
}: AuthFormProps) {
  return (
    <Card className="w-full max-w-md border-white/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/20">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={action} className="space-y-5">
          {message ? (
            <div
              className={
                message.type === "error"
                  ? "rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                  : "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              }
            >
              {message.text}
            </div>
          ) : null}

          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                defaultValue={field.defaultValue}
                autoComplete={field.autoComplete ?? "off"}
                disabled={disabled}
              />
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={disabled}>
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
