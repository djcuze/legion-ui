'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import legionLogo from "../public/legionLogo.png"
import Image from "next/image";
import Link from "next/link";

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const drawerWidth = 240;
const navItems = [{title: "Home", href: "/"}];

export default function Navbar(props: Props) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>

            <Box className="w-full max-w-24">
                <Image src={legionLogo} alt={"Legion logo"}/>
            </Box>

            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton sx={{textAlign: 'center'}}>
                            <Link href={item.href}>
                                <ListItemText primary={item.title}/>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <CssBaseline/>
            <AppBar component="nav">
                <Toolbar>
                    <Box className="w-full max-w-24 mr-3">
                        <Image src={legionLogo} alt={"Legion logo"}/>
                    </Box>

                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        {navItems.map((item) => (
                            <Button key={item.title} sx={{color: '#fff'}}>
                                <Link href={item.href}>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </>
    );
}