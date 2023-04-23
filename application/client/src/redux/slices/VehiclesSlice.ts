import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import serverUrl from '../urls/urls';

const VehiclesSlice = createSlice({
    name: "VehiclesSlice",
    initialState: {
        loading: false,
        vehicles: false,
        vehicle: false
    },
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(getAllVehicles.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllVehicles.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === "success") {
                    state.vehicles = action.payload.data;
                }
            })
            .addCase(getVehicleById.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getVehicleById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === "success") {
                    state.vehicle = action.payload.data;
                }
            })
            .addCase(handleSearchVehicle.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(handleSearchVehicle.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === "success") {
                    state.vehicles = action.payload.data;
                }
            })
            .addCase(assignWorkersToVehicle.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(assignWorkersToVehicle.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === "success") {
                    state.vehicle = action.payload.data;
                }
            })
            .addCase(resetVehicleHandle.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(resetVehicleHandle.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === "success") {
                    state.vehicle = action.payload.data;
                }
            })

    }
})

export const getAllVehicles = createAsyncThunk('getAllVehicles', async () => {
    //{{host}}/vehicle/all
    try {
        const { data } = await axios.get(`${serverUrl}/vehicle/all`);
        if (data.status === 'success') {
            return { status: "success", data: data.data };
        }
        else {
            return { status: "fail", message: data.message };
        }
    }
    catch (error: any) {
        if (Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item: any) => {
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return { status: "fail", message: errorMessage };
        }
        else {
            return { status: "fail", message: error.response.data.message };
        }
    }
}
)

export const getVehicleById = createAsyncThunk('getVehicleById', async (id: string) => {
    //{{host}}/vehicle/:id
    try {
        const { data } = await axios.get(`${serverUrl}/vehicle?id=${id}`);
        if (data.status === 'success') {
            return { status: "success", data: data.data };
        }
        else {
            return { status: "fail", message: data.message };
        }
    }
    catch (error: any) {
        if (Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item: any) => {
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return { status: "fail", message: errorMessage };
        }
        else {
            return { status: "fail", message: error.response.data.message };
        }
    }
}
)

export const handleSearchVehicle = createAsyncThunk('handleSearchVehicle', async (input: any) => {
    //{{host}}/vehicle
    try {
        const { data } = await axios.post(`${serverUrl}/vehicle`, input, {});
        if (data.status === 'success') {
            return { status: "success", data: data.data };
        }
        else {
            return { status: "fail", message: data.message };
        }
    }
    catch (error: any) {
        if (Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item: any) => {
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return { status: "fail", message: errorMessage };
        }
        else {
            return { status: "fail", message: error.response.data.message };
        }
    }
})
export const assignWorkersToVehicle = createAsyncThunk('assignWorkersToVehicle', async ({ vehicleId, workerIds, typeVehicle }: {
    vehicleId: string,
    workerIds: { id: string }[],
    typeVehicle: "janitor" | "collector"
}) => {
    //{{host}}/vehicle/assign
    try {
        const { data } = await axios.put(`${serverUrl}/vehicle/assign`, {
            vehicleId,
            workerIds,
            typeVehicle
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (data.status === 'success') {
            return { status: "success", data: data.data };
        }
        else {
            return { status: "fail", message: data.message };
        }
    }
    catch (error: any) {
        if (Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item: any) => {
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return { status: "fail", message: errorMessage };
        }
        else {
            return { status: "fail", message: error.response.data.message };
        }
    }
}
)

export const addVehicle = createAsyncThunk('addVehicle', async (input: any) => {
    //{{host}}/vehicle/create
    try {
        const { data } = await axios.post(`${serverUrl}/vehicle/create`, input, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (data.status === 'success') {
            return { status: "success", data: data.data };
        }
        else {
            return { status: "fail", message: data.message };
        }
    }
    catch (error: any) {
        if (Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item: any) => {
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return { status: "fail", message: errorMessage };
        }
        else {
            return { status: "fail", message: error.response.data.message };
        }
    }
}
)

export const resetVehicleHandle = createAsyncThunk('resetVehicleHandle', async (id:any) => {
    //{{host}}/vehicle/6433815df9807950d0ce5809/refuel
    try {
        const { data } = await axios.get(`${serverUrl}/vehicle/${id}/refuel`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (data.status === 'success') {
            return { status: "success", data: data.data };
        }
        else {
            return { status: "fail", message: data.message };
        }
    }
    catch (error: any) {
        if (Array.isArray(error.response.data)) {
            let errorMessage = ""
            error.response.data[0].errors.issues.map((item: any) => {
                errorMessage += item.message;
                errorMessage += ", ";
                return item.message;
            })
            return { status: "fail", message: errorMessage };
        }
        else {
            return { status: "fail", message: error.response.data.message };
        }
    }
})

export default VehiclesSlice