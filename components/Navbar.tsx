'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
import Image from "next/image";
import legionLogo from "../public/legionLogo.png"
import {getHeaders, navigate, setCookie} from "../app/actions";
import useCurrentUser from "../hooks/useCurrentUser";

function ResponsiveAppBar({isLoggedIn}) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { data: currentUser } = useCurrentUser();
    const settings = isLoggedIn ? [
        {label: "Profile", onClick: () => navigate("/profile")},
        {label: "Logout", onClick: logOut}
    ] : [
        {label: "Login", onClick: () => navigate("/login")},
        {label: "Sign up for an account", onClick: () => navigate("/register")},
    ];

    const pages = isLoggedIn ? [
        {title: "Home", href: "/"},
        {title: "Events", href: "/events"},
        {title: "Network", href: "/network"}
    ] : [
        {title: "Home", href: "/"}
    ]

    async function logOut() {
        const headers = await getHeaders()
        const response = await fetch('https://legion-events-au-platform-03eeffdb069d.herokuapp.com/session', {
            method: "DELETE",
            headers: headers
        })

        if (response.ok) {
            await setCookie("authorization", null)
            await navigate("/login")
        }
    }

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{mr: 2, display: {xs: 'none', md: 'flex'},}}>
                        <Image src={legionLogo} alt={""} width={100}/>
                    </Box>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            {pages.map((page) => (
                                <Link key={page.title} href={page.href}>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography sx={{textAlign: 'center'}}>{page.title}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{mr: 2, display: {xs: 'flex', md: 'none'}, flexGrow: 1}}>
                        <Image src={legionLogo} alt={""} width={100}/>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Link href={page.href} key={page.title}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {page.title}
                                </Button>
                            </Link>

                        ))}
                    </Box>
                    {/*<Box sx={{flexGrow: 0}}>*/}
                    {/*    <Tooltip title="Open settings">*/}
                    {/*        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>*/}
                    {/*            {currentUser && <Avatar alt={currentUser.name} src={currentUser.avatar_url}/>}*/}
                    {/*        </IconButton>*/}
                    {/*    </Tooltip>*/}
                    {/*    <Menu*/}
                    {/*        sx={{mt: '45px'}}*/}
                    {/*        id="menu-appbar"*/}
                    {/*        anchorEl={anchorElUser}*/}
                    {/*        anchorOrigin={{*/}
                    {/*            vertical: 'top',*/}
                    {/*            horizontal: 'right',*/}
                    {/*        }}*/}
                    {/*        keepMounted*/}
                    {/*        transformOrigin={{*/}
                    {/*            vertical: 'top',*/}
                    {/*            horizontal: 'right',*/}
                    {/*        }}*/}
                    {/*        open={Boolean(anchorElUser)}*/}
                    {/*        onClose={handleCloseUserMenu}*/}
                    {/*    >*/}
                    {/*        {settings.map((setting) => (*/}
                    {/*            <MenuItem key={setting.label} onClick={handleCloseUserMenu}>*/}
                    {/*                <Typography sx={{textAlign: 'center'}}*/}
                    {/*                            onClick={setting.onClick}>{setting.label}</Typography>*/}
                    {/*            </MenuItem>*/}
                    {/*        ))}*/}
                    {/*    </Menu>*/}
                    {/*</Box>*/}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;

