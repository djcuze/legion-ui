'use server'

import {redirect} from 'next/navigation'
import {cookies} from "next/headers";

export async function navigate(url) {
    redirect(url)
}

export async function setCookie(name, value) {
    const cookieStore = await cookies()
    cookieStore.set(name, value, {secure: true})
}

export async function getCookie(name) {
    const cookieStore = await cookies()
    return cookieStore.get(name)
}

export async function getHeaders() {
    const token = await getCookie("authorization")

    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token ? token.value : ""
    }
}

export const getCurrentUser = async () => {
    const headers = await getHeaders()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/user`, {
        method: "GET",
        headers: headers
    })
    return response.json()
}
