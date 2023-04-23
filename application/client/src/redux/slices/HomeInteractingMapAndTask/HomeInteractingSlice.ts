import {createSlice} from '@reduxjs/toolkit'

const HomeInteractingSlice = createSlice({
    name:"HomeInteractingSlice",
    initialState:{
        loading:false,
        taskId: "",
        vehicleId: ""
    },
    reducers:{
        handleFillTaskId: (state,action) => {
            state.taskId = action.payload
            state.vehicleId = ""
        },
        handleFillVehicleId: (state,action) => {
            state.vehicleId = action.payload
            state.taskId = ""
        },
        handleClearTaskId: (state,action) => {
            state.taskId = ""
        },
        handleClearVehicleId: (state,action) => {
            state.vehicleId = ""
        }


    },
    extraReducers(builder) {
        // builder
    }
})

export default HomeInteractingSlice