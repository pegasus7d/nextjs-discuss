"use server";
import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import paths from "@/path";
import { db } from "@/db";
import { redirect } from "next/navigation";

const CreatePostSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" })
        .regex(/^[a-zA-Z0-9\s]+$/, {
            message: "Name can only contain letters, numbers, and spaces",
        }),

    content: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(500, { message: "Description must not exceed 500 characters" })
        .regex(/^[a-zA-Z0-9\s.,!?]+$/, {
            message:
                "Description can only contain letters, numbers, spaces, commas, periods, and common punctuation",
        }),
});

interface CreatePostFormState {
    errors: {
        title?: string[];
        content?: string[];
        _form?: string[];
    };
}
export async function CreatePost(
    slug:string,
    formState: CreatePostFormState,
    formData: FormData
): Promise<CreatePostFormState> {
    const result = CreatePostSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
    });

    if (!result.success) {
        // console.log(result.error.flatten().fieldErrors);
        return { errors: result.error.flatten().fieldErrors };
    }

    const session = await auth();
    if (!session || !session.user) {
        return {
            errors: {
                _form: ["You must be signed in "],
            },
        };
    }


    const topic=await db.topic.findFirst({
        where:{slug}
    })
    if(!topic){
        return{
            errors:{
                _form:['Cannot find topic']
            }
        }

    }

    let post:Post;
    try{
        post=await db.post.create({
            data:{
                title:result.data.title,
                content:result.data.content,
                userId:session.user.id,
                topicId:topic.id
            }
        })

    }catch(err:unknown){
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message],
                },
            };
        } else {
            return {
                errors: {
                    _form: ["Something went wrong"],
                },
            };
        }

    }

    
    revalidatePath(paths.topicShow(slug))
    redirect(paths.postShow(slug,post.id))
    return {
        errors: {},
    };
}
