"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function Navbar() {
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const handleSignIn = async () => {
    signIn();
  };

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <div className="h-20 w-full border-b-2 flex items-center justify-between p-2">
      <Image src="/logo.svg" width="110" height="25" alt="logo" />
      <ul className="flex">
        <li className="p-2 cursor-pointer">
          <Link href="/">Home</Link>
        </li>
        <li className="p-2 cursor-pointer">
          <Link href="/about">About</Link>
        </li>
        <li className="p-2 cursor-pointer">
          <Link href="/profile">Profile</Link>
        </li>
      </ul>

      <ul className="flex">
        {!session.data ? (
          <li onClick={handleSignIn} className="p-2 cursor-pointer">
            Login
          </li>
        ) : (
          <li className="p-2 cursor-pointer flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.data.user.image} />
                  <AvatarFallback>
                    <i style={{ fontSize: "40px" }} className="symbol">
                      account_circle
                    </i>
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 -translate-x-3">
                <DropdownMenuLabel>
                  <div className="flex items-center">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={session.data.user.image} />
                    </Avatar>
                    <div className="ml-2">{session.data.user.name}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
    </div>
  );
}
