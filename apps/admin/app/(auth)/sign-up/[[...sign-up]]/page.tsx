import { ThemedSignIn } from "@/components/theme-sign-in";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const SignUpPage = () => {
  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-24">
      <Link
        href="/"
        className="absolute top-4 left-4 text-foreground hover:text-primary transition-colors"
      >
        <span className="flex items-center">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Home
        </span>
      </Link>
      <div className="w-full max-w-4xl flex xl:shadow-2xl shadow-none  rounded-xl overflow-hidden">
        <div className="flex-1 hidden lg:block relative">
          <Image
            src="/new-collection/new-collection-2.jpg"
            alt="Art Lighting Showcase"
            fill
            className="object-cover rounded-l-xl"
            
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col justify-end p-8 text-foreground">
            <h2 className="text-3xl font-bold mb-2">Sign in to Art lighting</h2>
            <p className="text-sm">
            Welcome back! Please sign in to continue
            </p>
          </div>
        </div>
        <div className="flex-1 text-card-foreground flex items-center flex-col justify-center">
          <Suspense fallback={<div>Loading...</div>}>
            <ThemedSignIn />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
