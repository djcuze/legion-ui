'use client'

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import {getHeaders, navigate, setCookie} from "../actions";
import {enqueueSnackbar} from "notistack";


export default function RegisterForm(){
    const [formData, setFormData] = useState({
        email_address: '',
        name: '',
        promoter_name: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            alert("Passwords do not match");
            return;
        }
        await registerAccount().then(() => navigate("/login"))
    };

    async function registerAccount() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            enqueueSnackbar("New account created correctly", {variant: "success", autoHideDuration: 1000})
            return response.json()
        } else {
            alert("Error!")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Email Address"
                name="email_address"
                value={formData.email_address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Promoter Name"
                name="promoter_name"
                value={formData.promoter_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Confirm Password"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" color="primary" sx={{mt: 2, float: "right"}}>
                Register
            </Button>
        </form>
    );
};
