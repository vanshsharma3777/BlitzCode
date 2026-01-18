import {  users } from '../../../../../packages/db/src/schema';
import { db   } from '@repo/db';
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/configs/authOptions';
import { use } from 'react';
import { point } from 'drizzle-orm/pg-core';


export  async function POST(request: NextRequest){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            error:"Unauthenticated",
            success:false
        },{status:401})
    }
    const {email , username} = await request.json()
    console.log(username)
    if(!email || !username){
        return NextResponse.json({
            success:false,
            error:"Username not provided",
        },{status:404})
    }

    try{
        const exsistingUser  = await db
        .select({username : users.username})
        .from(users)
        .where(eq(users.username , username))
        .limit(1);
        console.log("exsistingUser", exsistingUser)
    if(exsistingUser.length==0){
       const user = await db.update(users).set({
        username,
       })
       return NextResponse.json({
        msg:"User created successfully",
        success:true,
       })
    }else{
        return NextResponse.json({
        msg:"User already exists",
        success:true
       },{status:501})
    }
    }catch(error){
        console.log("error in creating profile")
        console.log(error)
        return NextResponse.json({
            error:error
        },{status:403})
    }
}