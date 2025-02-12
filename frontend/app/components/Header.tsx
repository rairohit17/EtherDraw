"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const shouldShowNav = pathname !== '/participate';

    return (
        <header className="flex justify-between items-center px-3 py-3 text-[#3898FF] md:mb-[200px] lg:mb-[100px]">
            {/* Logo */}
            <Link href="/" className="text-3xl sm:text-4xl font-rajdhani font-semibold select-none hover:opacity-90 transition-opacity">
                EtherDraw .
            </Link>

            {/* Navigation */}
            {shouldShowNav && (
                <nav className="hidden lg:flex items-center gap-5">
                    <Link 
                        href="/participate" 
                        className="cursor-pointer hover:text-[#2d7ad9] transition-colors"
                    >
                        Participate
                    </Link>
                    <Link 
                        href="#about" 
                        className="cursor-pointer hover:text-[#2d7ad9] transition-colors"
                    >
                        About
                    </Link>
                </nav>
            )}

            {/* Connect Button */}
            <div className="sm:mt-0">
                <ConnectButton />
            </div>
        </header>
    );
}