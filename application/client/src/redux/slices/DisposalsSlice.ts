import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';

const DisposalsSlice = createSlice({
    name:"DisposalsSlice",
    initialState:{
        loading:false,
        disposals:false,
        disposal:false
    },
    reducers:{  
    },
    extraReducers(builder) {
        builder
        .addCase(getAllDisposals.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(getAllDisposals.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.status === "success") {
                state.disposals = action.payload.data;
            }
        })

    }
})

export const getAllDisposals = createAsyncThunk('getAllDisposals', async () => {
    //{{host}}/disposalfactory/all
    try {
        const {data} = await axios.get(`${serverUrl}/disposalfactory/all`)
        if(data.status === 'success'){
            return {status:"success",data:data.data};   
        }
        else {
            return {status:"fail", message:"Cannot get disposals by something else not server"};
        }
    }
    catch (err) {
        return {status:"fail", message:"Cannot get disposals by server error"};
    }
})


export default DisposalsSlice