import { LoginForm } from "./login-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                 <Image 
                    data-ai-hint="institute logo"
                    src="https://media.licdn.com/dms/image/v2/C510BAQEI9giuDuO9Qw/company-logo_200_200/company-logo_200_200/0/1630583307654?e=1757548800&v=beta&t=dlksJZY8vCNYYo_ubqpf20rTUg3Ar00msOpVS2UNZ0M"
                    alt="Institute Logo" 
                    width={96} 
                    height={96} 
                    className="rounded-md object-contain"
                />
            </div>
          <CardTitle className="text-2xl font-bold font-headline">ScholarSync</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
