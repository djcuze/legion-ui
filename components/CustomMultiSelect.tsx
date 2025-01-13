import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import {useEffect, useState} from "react";
import {getNetworkPromoters} from "../app/network/Network";
import {Autocomplete, autocompleteClasses, Box} from "@mui/material";
import TextField from "@mui/material/TextField";

export default function CustomMultiSelect({networkId, formData, handleOnInput}) {
    const [promoterOptions, setPromoterOptions] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        getNetworkPromoters(networkId)
            .then(data => {
                setPromoterOptions(
                    data
                        .promoters
                        .map((promoter) => ({value: promoter.id, label: promoter.name}))
                );
            })
    }, [networkId]);

    useEffect(() => {
        setSelectedValues(formData.promoter_ids)
    }, [formData])


    function handleOnChange(e, newValue) {
        handleOnInput({target: {name: "promoter_ids", value: newValue}})
    }

    return (
        <div>
            <FormControl fullWidth>
                <Autocomplete
                    disableCloseOnSelect
                    clearOnEscape
                    multiple
                    onChange={handleOnChange}
                    id="promoter_ids"
                    size={"small"}
                    options={promoterOptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedValues}
                    isOptionEqualToValue={(option, value) => {
                        return option.value === value.value;
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Promoters *"
                        />
                    )}
                />

            </FormControl>
        </div>
    );
}
