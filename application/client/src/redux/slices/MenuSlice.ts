import {createSlice} from '@reduxjs/toolkit'

const MenuSlice = createSlice({
    name:"MenuSlice",
    initialState:{
        loading:false,
        data:false
    },
    reducers:{
        // handleToggle
        toggleHandle: (state,action) => {
            state.data = !state.data
        }
    },
    extraReducers(builder) {
        // builder
    }
})

export default MenuSlice