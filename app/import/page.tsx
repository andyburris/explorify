"use client"

import { useRouter } from "next/navigation";
import { ImportPage } from "./ImportPage";

export default function ReuploadPage() {
    const router = useRouter()
    return (<ImportPage hasExisting  onUpload={() => router.push("/")}/>)
}