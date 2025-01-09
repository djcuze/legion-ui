import Registration from './Registration'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

export default function RegistrationPage() {
  return (
    <Container sx={{mt: 12, mb: 8}} maxWidth="sm">
      <Typography variant={"overline"}>
        Register
      </Typography>

      <Card sx={{p: 3}}>
        <Registration/>
      </Card>
    </Container>
  )
}