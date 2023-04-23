import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';



const UserSlice = createSlice({
    name:"UserSlice",
    initialState:{
        loading:false,
        data:false
    },
    reducers:{  
    },
    extraReducers(builder) {
        builder
        .addCase(login.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
        })
        .addCase(getMe.pending, (state, action) => {
            state.loading = true;
        }
        )
        .addCase(getMe.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
        })
        .addCase(logout.pending, (state, action) => {
            state.loading = true;
        }
        )
        .addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.data = false;
        }
        )
        .addCase(workerCheckin.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(workerCheckin.fulfilled, (state, action) => {
            state.loading = false;
            if(action.payload.status === "success"){
                state.data = action.payload.data;
            }
        })
        .addCase(workerCheckout.pending, (state, action) => {
            state.loading = true;
        }
        )
        .addCase(workerCheckout.fulfilled, (state, action) => {
            state.loading = false;
            if(action.payload.status === "success"){
                state.data = action.payload.data;
            }
        }
        )

    }
})

export const login = createAsyncThunk('login', async (input:{email:string, password:string}) => {
    //{{host}}/user/login
    try {
        const {data} = await axios.post(`${serverUrl}/user/login`,input,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(data.status === 'success'){
            // put data.accessToken in localStorage
            localStorage.setItem('token', data.accessToken);
            return {status:"success",data:data.user};
        }
        else {
            return {status:"fail", message:"Invalid email or password"};
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

export const registeUser = createAsyncThunk('registeUser', async (input:{name:string, email:string, password:string, confirmPassword:string}) => {
    //{{host}}/user/register
    try {
        const {data} = await axios.post(`${serverUrl}/user/register`,input);
        if(data.status === 'success'){
            return {status:"success",message:data.message};
        }
        else {
            return {status:"fail", message:"Invalid email or password"};
        }
    }
    catch (error : any) {
        // check if error.response.data is array or not?
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

export const getMe = createAsyncThunk('getMe', async () => {
    //{{host}}/user
    try {
        const {data} = await axios.get(`${serverUrl}/user`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(data.status === 'success'){
            return {status:"success",data:data.user};
        }
        else {
            return {status:"fail", message:"You are not logged in"};
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

export const logout = createAsyncThunk('logout', async () => {
    //{{host}}/user/logout
    try {
        const {data} = await axios.get(`${serverUrl}/user/logout`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(data.status === 'success'){
            localStorage.removeItem('token');
            return {status:"success",message:data.message};
        }
        else {
            return {status:"fail", data:data.user, message:"You are not logged in"};
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

export const searchUser = createAsyncThunk('searchUser', async (input:{
    name:string,
    role:string,
    disposalName:string,
    state:string,
    page:number,
    pageSize:number
}) => {
    //{{host}}/user
    try {
        const {data} = await axios.post(`${serverUrl}/user`, input, {
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

export const workerCheckin = createAsyncThunk('workerCheckin', async () => {
    // user/checkin
    try {
        const {data} = await axios.get(`${serverUrl}/user/checkin`, {
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
})

export const workerCheckout = createAsyncThunk('workerCheckout', async () => {
    // user/checkout
    try {
        const {data} = await axios.get(`${serverUrl}/user/checkout`, {
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
})
                

export default UserSlice