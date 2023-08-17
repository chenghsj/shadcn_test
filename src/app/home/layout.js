"use client";

import React from "react";

export default function Layout({ children, editor }) {
  return (
    <div>
      {children}
      {editor}
    </div>
  );
}
