"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";

import Video from "@/components/Video";

Modal.setAppElement("#home_page");

export default function FFmpegTest() {
  const router = useRouter();

  return (
    <Modal isOpen={true} onRequestClose={() => router.back()}>
      <Video />
    </Modal>
  );
}
