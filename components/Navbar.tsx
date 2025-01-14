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
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
import Image from "next/image";
import legionLogo from "../public/legionLogo.png"
import {getHeaders, navigate, setCookie} from "../app/actions";
import useCurrentUser from "../hooks/useCurrentUser";
import {styled, alpha} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {Autocomplete, InputAdornment} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useQuery} from "@tanstack/react-query";
import {getNetworkPromoters} from "../app/network/Network";
import {useEffect} from "react";
import {useDebounce} from "../hooks/useDebounce";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledTextField = styled(TextField)(({theme}) => ({
    color: "#fff",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "4px",
    width: "100%",
    minWidth: "200px",
    "& input": {
        color: "#fff !important"
    },
    "& fieldset": {
        borderWidth: "0px",
        "& fieldset:hover, & fieldset:focus, & fieldset:active": {
            "& fieldset:hover, & fieldset:focus, & fieldset:active": {
                borderWidth: "0px"
            },
            "& .MuiInputBase-input": {
                padding: theme.spacing(1, 1, 1, 2),
                transition: theme.transitions.create("width"),
                color: "#fff",
                width: "100%",
                [theme.breakpoints.up("sm")]: {
                    width: "12ch",
                    "&:focus": {
                        width: "20ch"
                    }
                },
            }
        }
    }
}))

function ResponsiveAppBar({isLoggedIn, currentUser}) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState(null);

    const {data, isFetching} = useQuery({
        queryKey: ['networkPromoters'],
        queryFn: () => getNetworkPromoters(currentUser.network_id),
    })

    useEffect(() => {

    }, []);

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
        // {title: "Promoters", href: "/promoters"},
        {title: "Network", href: "/network"}
    ] : [
        {title: "Home", href: "/"}
    ]

    async function logOut() {
        const headers = await getHeaders()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session`, {
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

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const searchPromoters = async (q) => {
        const headers = await getHeaders()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/promoters`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({q})
        })

        return response.json()
    }

    const debouncedRequest = useDebounce(() => {
        searchPromoters(searchQuery).then((data) => {
            if (!data) return
            setSearchResults(data.results)
        })
    });


    async function handleSearch(e) {
        const value = e.target.value
        setSearchQuery(value)
        debouncedRequest();
    }

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
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>


                        <Autocomplete
                            freeSolo
                            id="search-autocomplete"
                            disableClearable

                            options={searchResults}
                            renderInput={(params) => (
                                <StyledTextField
                                    {...params}
                                    placeholder="Search…"
                                    onChange={handleSearch}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    style={{color: "white", marginLeft: "8px"}}
                                                />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Search>
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

