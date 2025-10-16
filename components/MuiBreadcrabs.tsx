'use client'

import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { usePathname, useRouter } from "next/navigation";
import {breadcrumbsMap} from "@/types/user";


export const MuiBreadcrumbs = () => {
    const pathname = usePathname();
    const router = useRouter();

    const segments = pathname.split('/').filter(Boolean);
    let path = '';
    const crumbs = segments.map((segment, index) => {
        path += '/' + segment;
        return { label: breadcrumbsMap[path] || segment, href: path };
    });

    return (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" onClick={() => router.push('/')} sx={{ cursor: 'pointer' }}>
                Go Home
            </Link>
            {crumbs.map((crumb, i) =>
                i === crumbs.length - 1 ? (
                    <Typography key={i} color="text.primary">{crumb.label}</Typography>
                ) : (
                    <Link key={i} underline="hover" color="inherit" onClick={() => router.push(crumb.href)} sx={{ cursor: 'pointer' }}>
                        {crumb.label}
                    </Link>
                )
            )}
        </Breadcrumbs>
    );
};
