'use client'
import * as React from 'react';
import {AppProvider} from '@toolpad/core/AppProvider';
import {
    SignInPage,
    type AuthProvider,
    type AuthResponse,
} from '@toolpad/core/SignInPage';
import {useTheme} from '@mui/material/styles';
import {getCookie, getHeaders, navigate, setCookie} from "../actions";
import {useSnackbar} from "notistack";
import {useEffect} from "react";

const providers = [{id: 'credentials', name: 'Email and password'}];

export default function NotificationsSignInPageError() {
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();

    const signIn: (
        provider: AuthProvider,
        formData: FormData,
    ) => Promise<AuthResponse> | void = async (provider, formData) => {
        const promise = new Promise<AuthResponse>(async (resolve) => {
            const email_address = formData.get('email');
            const password = formData.get('password');
            const headers = await getHeaders()

            const response = await fetch('http://localhost:3000/session', {
                method: "POST",
                headers: headers,
                body: JSON.stringify({email_address, password})
            })

            if (response.ok) {
                response.json().then(async (r) => {
                    await setCookie('authorization', r.data.token)
                    enqueueSnackbar("Successfully logged in", {variant: "success", autoHideDuration: 1000})
                    await navigate("/events")
                })
            } else {
                resolve({type: 'CredentialsSignin', error: "Username and/or password not found"})
            }
        });
        return promise;
    };

    return (
        // preview-start
        <AppProvider theme={theme}>
            <SignInPage
                signIn={signIn}
                providers={providers}
                slotProps={{emailField: {autoFocus: false}}}
            />
        </AppProvider>
        // preview-end
    );
}