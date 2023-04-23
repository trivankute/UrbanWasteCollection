import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';

const McpsSlice = createSlice({
    name:"McpsSlice",
    initialState:{
        loading:false,
        mcps:false,
        mcp:false
    },
    reducers:{
    },
    extraReducers(builder) {
        builder
        .addCase(getAllMcps.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(getAllMcps.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.status === "success") {
                state.mcps = action.payload.data;
            }
        })
    }
})

export const getAllMcps = createAsyncThunk('getAllMcps', async () => {
    //{{host}}/mcp/all
    try {
        const {data} = await axios.get(`${serverUrl}/mcp/all`);
        if(data.status === 'success'){
            return {status:"success",data:data.data};
        }
        else {
            return {status:"fail", message:data.message};
        }
    }
    catch (error : any) {
        if(Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item:any)=>{
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return {status:"fail",message:errorMessage};
        }
        else {
            return {status:"fail",message:error.response.data.message};
        }
    }
}
)

// export const getMcpById = createAsyncThunk('getMcpById', async (id:string) => {
//     //{{host}}/mcp/:id
//     try {
//         const {data} = await axios.get(`${serverUrl}/mcp/${id}`);
//         if(data.status === 'success'){
//             return {status:"success",data:data.data};
//         }
//         else {
//             return {status:"fail", message:data.message};
//         }
//     }
//     catch (error : any) {
//         if(Array.isArray(error.response.data)) {
//             let errorMessage = ""
//             error.response.data[0].errors.issues.map((item:any)=>{
//                 errorMessage += item.message;
//                 errorMessage += ", ";
//                 return item.message;
//             })
//             return {status:"fail",message:errorMessage};
//         }
//         else {
//             return {status:"fail",message:error.response.data.message};
//         }
//     }
// }
// )

export default McpsSlice