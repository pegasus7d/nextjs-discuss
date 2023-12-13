import Link from "next/link";
import { Suspense } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    
} from "@nextui-org/react";
import SearchInput from "@/components/search-input";
import HeaderAuth from "@/components/header-auth";

export default function Header() {
    
    return (
        <Navbar className="shadow mb-6">
            <NavbarBrand>
                <Link href="/" className="font-bold">
                    Discuss
                </Link>
            </NavbarBrand>
            <NavbarContent justify="center">
                <NavbarItem>
                    <Suspense>
                    <SearchInput />
                    </Suspense>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {/* {session?.user ? (
                        <div>Signed in</div>
                    ) : (
                        <div>Signed out</div>
                    )} */}

                <HeaderAuth />
            </NavbarContent>
        </Navbar>
    );
}
