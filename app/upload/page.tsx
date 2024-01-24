"use client"

import { useRouter } from "next/navigation";
import { UploadPage } from "./Upload";

export default function ReuploadPage() {
    const router = useRouter()
    return (<UploadPage hasExisting  onUpload={() => router.push("/")}/>)
}