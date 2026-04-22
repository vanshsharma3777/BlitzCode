import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/configs/authOptions"
import { NextRequest, NextResponse } from "next/server"
import { db, users } from "@repo/db"
import { eq, sql } from "drizzle-orm"

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({
            success: false,
            error: "Unauthenticated"
        }, { status: 401 })
    }

    const email = session.user.email!
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    try {
        if (existingUser.length == 0) {
            return NextResponse.json({
                error: "User not logged in",
                success: false
            }, { status: 401 })
        }

        const { userEmail } = await request.json()
        if ( userEmail.trim().length === 0) {
            return NextResponse.json({
                success: false,
                error: "Email or score not found"
            }, { status: 501 })
        }
        const isUserExists = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, userEmail))
            .limit(1)

        if (isUserExists.length == 0) {
            return NextResponse.json({
                error: "No user found in DB",
                success: false
            }, { status: 404 })
        }
            
        const updateScore = await db.select().from(users).where(eq(users.email , userEmail)).limit(1)
        return NextResponse.json({
            success: true,
            points: updateScore[0]?.points,
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:"internal server error"
        }, {status: 405})
    }
}