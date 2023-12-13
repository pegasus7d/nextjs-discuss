"use server";

export async function CreateTopic(formData: FormData) {
    const name = formData.get("name");
    const description = formData.get("description");

    // console.log(name,description)
}
