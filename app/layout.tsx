import ".//globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getCookie, getCurrentUser} from "./actions";
import '../envConfig.js'

export const metadata = {
    title: 'Legion Events',
    description: 'Event Management Platform',
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {

    async function loggedIn() {
        const cookie = await getCookie('authorization');

        return !!cookie?.value
    }

    const currentUser = await getCurrentUser();

    // const isLoggedIn = use(loggedIn())
    const isLoggedIn = true

    return (
        <html lang="en">
        <body className="mb-6 bg-[#F4F3F2]">
        <Providers currentUser={currentUser}>
            <Box className="flex flex-col">
                <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} />
                <Box className={"max-w-[1200px] mx-auto w-full"}>
                    {children}
                </Box>
            </Box>
        </Providers>
        <footer>
            <Box className="flex justify-center">
                <Typography variant={"caption"} textAlign={"center"}>
                    © 2025 Legion Events AUS
                </Typography>
            </Box>
        </footer>
        </body>
        </html>

    )
}
