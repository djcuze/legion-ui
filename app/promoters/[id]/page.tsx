import * as React from 'react'
import {Container} from '@mui/material'
import PromoterDetail from "./PromoterDetail";
import {getHeaders} from "../../actions";

const getPromoter = async (promoter_id) => {
    const headers = await getHeaders()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promoters/${promoter_id}`, {
        method: "GET",
        headers: headers
    })
    return response.json()
}

export default async function PromoterPage(
    {params}: {
        params: Promise<{ id: string }>
    }) {
    const id = (await params).id

    const promoter = await getPromoter(id)

    return (
        <Container sx={{mt: 10, mb: 3, pb: 3}}>
            <PromoterDetail promoter={promoter}/>
        </Container>
    )
}
