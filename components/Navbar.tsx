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
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import {redirect} from "next/navigation";

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
    minWidth: "250px",
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

    const searchPromotersAndEvents = async (q) => {
        const headers = await getHeaders()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({q})
        })

        return response.json()
    }

    const debouncedRequest = useDebounce(() => {
        // @ts-ignore
        if (!searchQuery || searchQuery?.length < 1) {
            return null
        }

        searchPromotersAndEvents(searchQuery).then((data) => {
            if (!data || !data.results) return
            setSearchResults(data.results)
        })
    });


    async function handleSearch(e) {
        const value = e.target.value
        setSearchQuery(value)
        debouncedRequest();
    }

    function handleOnSearchClick(option) {
        setSearchQuery(null)
        setSearchResults([])

        switch (option.type) {
            case "promoter":
                return navigate(`/promoters/${option.value}`)
            case "event":
                // @ts-ignore
                return redirect(option.facebook_url, 'push')
        }
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
                            clearOnBlur
                            selectOnFocus
                            noOptionsText={"No results"}
                            id="search-autocomplete"
                            options={searchResults}
                            value={searchQuery}
                            renderOption={(props, option, {selected}) => {
                                const {key, ...optionProps} = props;
                                return (
                                    <ListItem sx={{cursor: "pointer"}}
                                              key={key}
                                              {...optionProps}
                                              onClick={() => handleOnSearchClick(option)}>
                                        <Avatar
                                            sx={{mr: 1, width: 25, height: 25}}
                                            // @ts-ignore
                                            src={option.avatar_url}/>
                                        <Box
                                            sx={(t) => ({
                                                flexGrow: 1,
                                                '& span': {
                                                    color: '#8b949e',
                                                    ...t.applyStyles('light', {
                                                        color: '#586069',
                                                    }),
                                                },
                                            })}
                                        >
                                            <Typography fontSize={14}>
                                                {
                                                    // @ts-ignore
                                                    option.label
                                                }
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                );
                            }}
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
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;

