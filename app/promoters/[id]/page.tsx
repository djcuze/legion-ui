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
    //
    // const promoter = {
    //     name: "Hex Sound System",
    //     bio: "An ever evolving, community focused, hand built Sound System. An ever evolving, community focused, hand built Sound System. An ever evolving, community focused, hand built Sound System. An ever evolving, community focused, hand built Sound System.",
    //     users: [
    //         {
    //             id: 1,
    //             name: "Nate Jacoby",
    //             avatar_url: "https://r9sx7ho9yq0ovqbs.public.blob.vercel-storage.com/FB_IMG_1736558257571-TQMPizNsfZVPfJ6XvqzJHwJgwFbyXm.jpg"
    //         },
    //         {
    //             id: 2,
    //             name: "Nathan Turner",
    //             avatar_url: "https://r9sx7ho9yq0ovqbs.public.blob.vercel-storage.com/FB_IMG_1736558257571-TQMPizNsfZVPfJ6XvqzJHwJgwFbyXm.jpg"
    //         }
    //     ]
    // }

    return (
        <Container sx={{mt: 10, mb: 3, pb: 3}} className="bg-white">
            <PromoterDetail promoter={promoter}/>
        </Container>
    )
}
