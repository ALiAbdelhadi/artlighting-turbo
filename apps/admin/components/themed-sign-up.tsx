"use client";

import { ScrollArea } from "@repo/ui/scroll-area";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "../app/clerk.css";

export function ThemedSignUp() {
  const { theme } = useTheme();
  const [mountedComponent, setMountedComponent] = useState(false);

  useEffect(() => {
    setMountedComponent(true);
  }, []);

  if (!mountedComponent) {
    return null;
  }

  return (
    <div className="max-h-[90vh] col-span-full lg:col-span-1 overflow-auto hide-scrollbar">
      <ScrollArea>
        <div>
          <SignUp
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                formButtonPrimary: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  "&:hover": {
                    backgroundColor: "hsl(var(--primary) / 0.9)",
                  },
                },
                card: {
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--card))",
                  boxShadow: "none",
                },
                maxHeight: "80vh",
                overflow: "auto",
                headerTitle: {
                  color: "hsl(var(--foreground))",
                },
                headerSubtitle: {
                  color: "hsl(var(--muted-foreground))",
                },
                socialButtonsBlockButton: {
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  "&:hover": {
                    backgroundColor: "hsl(var(--secondary))",
                  },
                },
                formFieldLabel: {
                  color: "hsl(var(--foreground))",
                },
                formFieldInput: {
                  backgroundColor:
                    theme === "dark"
                      ? "hsl(var(--primary) / 0.3)"
                      : "hsl(var(--primary) / 0.2)",
                  borderColor: "hsl(var(--input))",
                  color: "hsl(var(--foreground))",
                  "&::placeholder": {
                    color: "hsl(var(--muted-foreground))",
                  },
                  "&:focus": {
                    backgroundColor:
                      theme === "dark"
                        ? "hsl(var(--primary) / 0.4)"
                        : "hsl(var(--primary) / 0.3)",
                    borderColor: "hsl(var(--primary))",
                  },
                },
                footerActionLink: {
                  color: "hsl(var(--primary))",
                  "&:hover": {
                    color: "hsl(var(--primary) / 0.9)",
                  },
                },
              },
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
