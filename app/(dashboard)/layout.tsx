import Image from 'next/image';
import Link from 'next/link';
import '../globals.css';
import {Menu} from '@/components/menu/Menu';
import style from './dashboard.module.scss';
import React from "react";
import Navbar from "@/components/navbar/Navbar";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className={` ${style.layoutContainer}`}>
            {/* LEFT */}
            <div className={` ${style.layoutLeft}`}>
                <Link
                    href="/"
                    className={` ${style.link}`}
                >
                    <Image src="/logo.png" alt="logo" width={32} height={32}/>
                    <span className={`hidden   text-[#232829] font-[700]  ${style.img}`}>
  Team Dashboard
</span>
                </Link>
                <Menu/>
            </div>
            {/* RIGHT */}
            <div className={` overflow-scroll flex flex-col ${style.layoutRight} `}>
                <Navbar/>
                {children}
            </div>
        </div>
    );
}
