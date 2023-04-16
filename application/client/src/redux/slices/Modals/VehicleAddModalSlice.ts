import {createSlice} from '@reduxjs/toolkit'

const VehicleAddModalSlice = createSlice({
    name:"VehicleAddModalSlice",
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

export default VehicleAddModalSlice