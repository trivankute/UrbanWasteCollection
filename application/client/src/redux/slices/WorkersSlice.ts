import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';



const WorkersSlice = createSlice({
    name:"WorkersSlice",
    initialState:{
        loading:false,
        data:false,
        total:false
    },
    reducers:{  
        handleRemoveWorkerForTemp(state, action) {
            // @ts-ignore
            state.data = state.data.filter((item:any)=>item.id !== action.payload);
        },
        handleAddWorkerForTemp(state, action) {
            // @ts-ignore
            state.data = [...state.data, action.payload.worker];
        },
    },
    extraReducers(builder) {
        builder
        .addCase(searchWorkers.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(searchWorkers.fulfilled, (state, action) => {
            state.loading = false;
            if(action.payload.status === "success") {
                state.data = action.payload.data;
                state.total = action.payload.total;
            }
        })
    }
})

export const searchWorkers = createAsyncThunk('searchWorkers', async (input:{
    name:string,
    role:string,
    disposalName:string,
    state:string,
    page:number,
    pageSize:number,
    forAssignVehicleModal?:boolean,
    workersTempForAssignVehicle?:any
}) => {
    //{{host}}/user
    const {forAssignVehicleModal, workersTempForAssignVehicle, ...rest} = input
    try {
        const {data} = await axios.post(`${serverUrl}/user`, rest, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(input.forAssignVehicleModal)
        {
            // filter out workers that are already in workersTempForAssignVehicle
            data.data = data.data.filter((item:any)=>{
                if(!input.workersTempForAssignVehicle.workers.find((item2:any)=>{
                    if(item2.id === item.id)
                        return true;
                }))
                    return item
            });
        }
        if(data.status === 'success'){
            return {status:"success",data:data.data, total:data.total};
        }
        else {
            return {status:"fail", message:data.message};
        }
    }
    catch (error : any) {
        if(Array.isArray(error.response.data.errors)) {
            let errorMessage = ""
            error.response.data.errors.map((item:any)=>{
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

export default WorkersSlice