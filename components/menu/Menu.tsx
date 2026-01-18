import Link from "next/link";
import {getRole} from "@/lib/data";
import style from './menu.module.scss';

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                icon: "/home.png",
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/teacher.png",
                label: "Members",
                href: "/list/members",
                visible: ["admin", "teacher"],
            },

            {
                icon: "/student.png",
                label: "Students",
                href: "/list/students",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/parent.png",
                label: "Parents",
                href: "/",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/subject.png",
                label: "Subjects",
                href: "/",
                visible: ["admin"],
            },
            {
                icon: "/class.png",
                label: "Classes",
                href: "/",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/lesson.png",
                label: "Lessons",
                href: "/",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/exam.png",
                label: "Exams",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/assignment.png",
                label: "Assignments",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/result.png",
                label: "Results",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/attendance.png",
                label: "Attendance",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/calendar.png",
                label: "Events",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/message.png",
                label: "Messages",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/announcement.png",
                label: "Announcements",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },

];

export const Menu = () => {
    const role = getRole();
    return (
        <div className={`${style.menuContainer} `}>
            {menuItems.map((i) => (
                <div className={`${style.titleBlock} `} key={i.title}>
                    {i.items.map((item) => {
                        if (item.href && item.visible.includes(role)) {
                            return (

                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className={`${style.link} rounded-md`}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        width={20}
                                        height={20}
                                        className={style.img}
                                    />
                                    <span className={style.imgText}>{item.label}</span>
                                </Link>
                            );
                        }
                    })}
                </div>
            ))}
        </div>
    );
};

