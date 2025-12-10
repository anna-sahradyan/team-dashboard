import Image from "next/image";
import style from "./navbar.module.scss";

export default function Navbar() {
    return (
        <div className={style.navbar}>
            <div className={style.title}>
                <h1>School Management</h1>
            </div>

            <div className={style.right}>

                <div className={style.userInfo}>
                    <span className={style.name}>Anna</span>
                    <span className={style.role}>Admin</span>
                </div>
                <Image src="/avatar.png" alt="" width={36} height={36} className={style.avatar} />
            </div>
        </div>
    );
}
