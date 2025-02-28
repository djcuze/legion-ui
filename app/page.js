'use client'
import { redirect } from 'next/navigation'
import Image from 'next/image'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import { IconButton } from '@mui/material'
import heroImage from '../public/heroImage.jpg'
import Card from '@mui/material/Card'

export default function Home() {
  return (
    <Card className="flex flex-col items-center" sx={{mt: 8, pb: 5, mb: 8}}>
      <Image src={heroImage} alt=""/>

      <Box sx={{px: 1}} className="flex flex-col items-center w-full">
        <Typography sx={{ my: 4 }} textAlign="center">
          Legion Events AUS is a crew of creatives putting together audio visual experiences
        </Typography>

        <Typography sx={{ my: 2, whiteSpace: "nowrap" }} variant="subtitle2" textAlign="center">
          Follow us on socials:
        </Typography>

        <Box className="flex flex-row items-center">
          <IconButton onClick={() => redirect('https://www.facebook.com/people/Legion-Events/61551102083573/', 'push')}>
            <FacebookIcon/>
          </IconButton>
          <IconButton onClick={() => redirect('https://www.instagram.com/legionevents.aus/', 'push')}>
            <InstagramIcon/>
          </IconButton>
        </Box>
      </Box>
    </Card>
  )
}
