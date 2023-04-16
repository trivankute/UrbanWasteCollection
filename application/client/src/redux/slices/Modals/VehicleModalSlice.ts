import {createSlice} from '@reduxjs/toolkit'

const VehicleModalSlice = createSlice({
    name:"VehicleModalSlice",
    initialState:{
        loading:false,
        data:false
    },
    reducers:{
        // handleToggle
        handleOpen: (state, action) => {
            state.data = true;
        },
        handleClose: (state, action) => {
            state.data = false;
        }
        

    },
    extraReducers(builder) {
        // builder
    }
})

export default VehicleModalSlice