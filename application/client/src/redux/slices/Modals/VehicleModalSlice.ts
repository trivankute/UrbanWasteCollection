import {createSlice} from '@reduxjs/toolkit'

const VehicleModalSlice = createSlice({
    name:"VehicleModalSlice",
    initialState:{
        loading:false,
        data:false,
        vehicle:false
    },
    reducers:{
        // handleToggle
        handleOpen: (state, action) => {
            state.data = true;
            state.vehicle = action.payload.data;
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