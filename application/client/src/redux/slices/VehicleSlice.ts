import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';

const VehicleSlice = createSlice({
    name:"VehicleSlice",
    initialState:{
        loading:false,
        data:false
    },
    reducers:{
    },
    extraReducers(builder) {
        // builder
    }
})

export const getAllVehicles = createAsyncThunk('getAllVehicles', async () => {
    //{{host}}/vehicle/all
    try {
        const {data} = await axios.get(`${serverUrl}/vehicle/all`);
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

export const getVehicleById = createAsyncThunk('getVehicleById', async (id:string) => {
    //{{host}}/vehicle/:id
    try {
        const {data} = await axios.get(`${serverUrl}/vehicle?id=${id}`);
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

export const assignWorkersToVehicle = createAsyncThunk('assignWorkersToVehicle', async ({vehicleId,workerIds,typeVehicle}:{
    vehicleId:string,
    workerIds:{id:string}[],
    typeVehicle:"janitor"|"collector"
}) => {
    //{{host}}/vehicle/assign
    try {
        const {data} = await axios.put(`${serverUrl}/vehicle/assign`, {
            vehicleId,
            workerIds,
            typeVehicle
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
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


export default VehicleSlice