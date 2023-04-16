import {createSlice} from '@reduxjs/toolkit'

const lgSize = 1024;

const ResponsiveSlice = createSlice({
    name:"ResponsiveSlice",
    initialState:{
        loading:false,
        data:window.innerWidth > lgSize ? true : false
    },
    reducers:{
        // handleToggle
        responsiveYesHandle: (state,action) => {
            state.data = action.payload.data
        },
        responsiveNoHandle: (state,action) => {
            state.data = action.payload.data
        }

    },
    extraReducers(builder) {
        // builder
    }
})

export default ResponsiveSlice