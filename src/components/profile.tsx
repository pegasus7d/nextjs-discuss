"use client";

import { Session } from "inspector";
import { useSession } from "next-auth/react";

export default function Profile() {
    const session = useSession();

    if (session.data?.user) {
        return (
            <div>
                From Client User is Signed in :
                {/* {JSON.stringify(session.data)} */}
            </div>
        );
    }
    return <div>From Client User is not signed in</div>;
}
