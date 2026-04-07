'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function profile() {
    const session = useSession();
    const router = useRouter()
    if (!session) {
        return router.replace('/api/signin')
    }
    return (
        <div>
            hello world
        </div>
    )
}