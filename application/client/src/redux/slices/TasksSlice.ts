import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';

const TasksSlice = createSlice({
    name:"TasksSlice",
    initialState:{
        loading:false,
        tasks:false,
        task:false
    },
    reducers:{  
    },
    extraReducers(builder) {
        builder
        .addCase(searchTasks.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(searchTasks.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.status === "success") {
                state.tasks = action.payload.data;
            }
        })
        .addCase(getTaskById.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(getTaskById.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.status === "success") {
                state.task = action.payload.data;
            }
        })
        .addCase(createTask.pending, (state, action) => {
            state.loading = true;
        }
        )
        .addCase(createTask.fulfilled, (state, action) => {
            state.loading = false;
        }
        )
        .addCase(updateTaskToNeedReview.pending, (state, action) => {
            state.loading = true;
        }
        )
        .addCase(updateTaskToNeedReview.fulfilled, (state, action) => {
            state.loading = false;
            if(action.payload.status === "success"){
                state.task = action.payload.data;
            }
        })
        .addCase(taskAnswer.pending, (state, action) => {
            state.loading = true;
        }
        )
        .addCase(taskAnswer.fulfilled, (state, action) => {
            state.loading = false;
        }
        )




    }
})

export const searchTasks = createAsyncThunk('searchTasks', async (input:
    {
        "page":number,
        "pageSize":number,
        "name":string,
        "type":string,
        "state":string,
        "disposalName":string,
        "mcpName":string
    }
) => {
    //{{host}}/task
    try {
        const {data} = await axios.post(`${serverUrl}/task`,input)
        if(data.status === 'success'){
            return {status:"success",data:data.data};
        }
        else {
            return {status:"fail", message:"Cannot get tasks by something else not server"};
        }
    }
    catch (error:any) {
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
})

export const getTaskById = createAsyncThunk('getTaskById', async (id:string) => {
    //{{host}}/task/:id
    try {
        const {data} = await axios.get(`${serverUrl}/task/${id}`)
        if(data.status === 'success'){
            return {status:"success",data:data.data};
        }
        else {
            return {status:"fail", message:"Cannot get task by something else not server"};
        }
    }
    catch (error:any) {
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
})


export const createTask = createAsyncThunk('createTask', async (input:any) =>{ 
    //{{host}}/task/create
    try {
        const {data} = await axios.post(`${serverUrl}/task/create`,input, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(data.status === 'success'){
            return {status:"success",data:data.data};
        }
        else {
            return {status:"fail", message:"Cannot create task by something else not server"};
        }
    }
    catch (error:any) {
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
})

export const taskAnswer = createAsyncThunk('taskAnswer', async (input:{
    id:string,
    answer:"accept"|"refuse"
}) =>{
    //{{host}}/task/:id/answer
    try {
        const {id, answer} = input;
        const {data} = await axios.put(`${serverUrl}/task/${id}/answer`,{answer}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(data.status === 'success'){
            return {status:"success",data:data.message};
        }
        else {
            return {status:"fail", message:"Cannot create task by something else not server"};
        }
    }
    catch (error:any) {
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
})

export const updateTaskToNeedReview = createAsyncThunk('updateTaskToNeedReview', async (id:string) =>{
    // task/644105947caa2485a2fb072a/needreview
    try {
        const {data} = await axios.put(`${serverUrl}/task/${id}/needreview`,{} ,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(data.status === 'success'){
            return {status:"success",data:data.data};
        }
        else {
            return {status:"fail", message:"Cannot update task by something else not server"};
        }
    }
    catch (error:any) {
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
})

export default TasksSlice