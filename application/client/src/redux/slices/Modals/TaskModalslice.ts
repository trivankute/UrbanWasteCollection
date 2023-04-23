import {createSlice} from '@reduxjs/toolkit'

const TaskModalSlice = createSlice({
    name:"TaskModalSlice",
    initialState:{
        loading:false,
        show:false,
        task: false
    },
    reducers:{
        // handleToggle
        handleOpen: (state, action) => {
            state.show = true;
            state.task = action.payload.data
        },
        handleClose: (state, action) => {
            state.show = false;
        }
    },
    extraReducers(builder) {
        // builder
    }
})

export default TaskModalSlice