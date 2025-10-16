'use client'
import style from './members.module.scss';
import {MuiTable} from "@/components/table/MuiTable";


export const Members = () => {
    return (
        <div className={style.container}>
            <div className={style.tableWrapper}>
                <MuiTable/>
            </div>

        </div>
    );
};
