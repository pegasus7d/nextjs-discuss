"use server";

import type { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import paths from "@/path";
import { db } from "@/db";

const CreateTopicSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" })
        .regex(/^[a-zA-Z0-9\s]+$/, {
            message: "Name can only contain letters, numbers, and spaces",
        }),

    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(500, { message: "Description must not exceed 500 characters" })
        .regex(/^[a-zA-Z0-9\s.,!?]+$/, {
            message:
                "Description can only contain letters, numbers, spaces, commas, periods, and common punctuation",
        }),
});

interface CreateTopicFormState {
    errors: {
        name?: string[];
        description?: string[];
        _form?: string[];
    };
}
export async function CreateTopic(
    formState: CreateTopicFormState,
    formData: FormData
): Promise<CreateTopicFormState> {
    // const name = formData.get("name");
    // const description = formData.get("description");
    const result = CreateTopicSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
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

    let topic: Topic;
    try {
        topic = await db.topic.create({
            data: {
                slug: result.data.name,
                description: result.data.description,
            },
        });
    } catch (err: unknown) {
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
    revalidatePath('/')
    redirect(paths.topicShow(topic.slug));

    return {
        errors: {},
    };
    
    // console.log(name,description)
}
