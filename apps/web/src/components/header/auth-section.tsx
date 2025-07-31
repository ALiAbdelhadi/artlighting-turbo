"use server"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import Link from "next/link"
import { CartSidebar } from "../cart-sidebar"

export default async function AuthSection() {
  try {
    const user = await currentUser()
    const isAdmin = user?.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL

    return (
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-3">
          <SignedOut>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" aria-label="User menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <SignInButton>
                    <span className="w-full">
                      Sign In
                    </span>
                  </SignInButton>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SignUpButton>
                    <span className="w-full">
                      Sign Up
                    </span>
                  </SignUpButton>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/help"
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                  >
                    Help & Support
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-lg",
                },
                variables: {
                  fontSize: "14px",
                },
              }}
            />
          </SignedIn>
          <CartSidebar />
        </div>
        <div className="flex lg:hidden flex-col gap-3 w-full">
          <SignedOut>
            <div className="flex gap-2 w-full">
              <SignInButton>
                Sign In
              </SignInButton>
              <SignUpButton>
                Sign Up
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "shadow-lg",
                    },
                    variables: {
                      fontSize: "13px",
                    },
                  }}
                />
              </div>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </SignedIn>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error while rendering AuthSection:", error)
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="bg-transparent">
          Loading...
        </Button>
      </div>
    )
  }
}