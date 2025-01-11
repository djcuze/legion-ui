import * as React from 'react'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import ArrowLeft from '@mui/icons-material/ArrowLeft'
import ArrowRight from '@mui/icons-material/ArrowRight'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { TimeClock } from '@mui/x-date-pickers/TimeClock'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

const slots = {
    leftArrowIcon: ArrowLeft,
    rightArrowIcon: ArrowRight,
}

export default function ArrowSwitcherComponent ({ formData, setFormData, setIsDisabled }) {
    const [currentComponent, setCurrentComponent] = React.useState('date')
    const [timePeriodIsMorning, setTimePeriodIsMorning] = React.useState(formData.start_time.format('a') === 'am')

    const handleCurrentComponentChange = (event, nextCurrentComponent) => {
        if (nextCurrentComponent !== null) {
            setCurrentComponent(nextCurrentComponent)
        }
    }

    const changeTimePeriod = () => {
        if (timePeriodIsMorning) {
            setTimePeriodIsMorning(false)
            return setFormData({ ...formData, start_time: formData.start_time.add(12, "hour") })
        }
        setTimePeriodIsMorning(true)
        return setFormData({ ...formData, start_time: formData.start_time.subtract(12, "hour") })
    }

    function handleOnChange(newValue) {
        setFormData({ ...formData, start_time: newValue })
        setIsDisabled(false)
    }

    return (
        <Stack spacing={2} sx={{ height: '360px', maxWidth: '600px', margin: '0 auto', width: '100%' }} color="tertiary"
               alignItems="center">
            <ToggleButtonGroup
                fullWidth
                color="primary"
                value={currentComponent}
                onChange={handleCurrentComponentChange}
                exclusive
            >
                <ToggleButton value={'date'}>date</ToggleButton>
                <ToggleButton value={'time'}>time</ToggleButton>
            </ToggleButtonGroup>
            {currentComponent === 'date' && (
                <DateCalendar
                    value={formData.start_time}
                    onChange={handleOnChange}
                    slots={slots}
                />
            )}

            {currentComponent === 'time' && (
                <Box sx={{ position: 'relative' }}>
                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                        <Typography variant="overline">AM</Typography>
                        <Switch checked={!timePeriodIsMorning} onChange={changeTimePeriod}/>
                        <Typography variant="overline">PM</Typography>
                    </Stack>
                    <TimeClock
                        value={formData.start_time}
                        onChange={handleOnChange}
                        slots={slots}
                        showViewSwitcher
                        sx={{ mt: 3 }}
                    />
                </Box>
            )}
        </Stack>
    )
}