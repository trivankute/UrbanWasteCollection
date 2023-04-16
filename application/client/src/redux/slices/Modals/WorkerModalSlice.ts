import {createSlice} from '@reduxjs/toolkit'

const WorkerModalSlice = createSlice({
    name:"WorkerModalSlice",
    initialState:{
        loading:false,
        data:false,
        allData:false
    },
    reducers:{
        // handleToggle
        handleOpen: (state, action) => {
            state.data = true;
            state.allData = action.payload.workerData;
        },
        handleClose: (state, action) => {
            state.data = false;
            state.allData = false;
        }


    },
    extraReducers(builder) {
        // builder
    }
})

export default WorkerModalSlice