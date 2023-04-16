import {createSlice} from '@reduxjs/toolkit'

const TaskModalSlice = createSlice({
    name:"TaskModalSlice",
    initialState:{
        loading:false,
        show:false,
        data:{
            type:"need review"
        }
    },
    reducers:{
        // handleToggle
        handleOpen: (state, action) => {
            state.show = true;
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