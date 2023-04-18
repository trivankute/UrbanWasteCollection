import {configureStore} from '@reduxjs/toolkit'

import MenuSlice from './slices/MenuSlice';
import ResponsiveSlice from './slices/ResponsiveSlice';
import WorkerModalSlice from './slices/Modals/WorkerModalSlice';
import VehicleAddModalSlice from './slices/Modals/VehicleAddModalSlice';
import VehicleModalSlice from './slices/Modals/VehicleModalSlice';
import TaskModalSlice from './slices/Modals/TaskModalslice';
import UserSlice from './slices/UserSlice';
import WorkersSlice from './slices/WorkersSlice';
import VehiclesSlice from './slices/VehiclesSlice';
import SmallNotificationSlice from './slices/Modals/SmallNotificationSlice';



const store = configureStore({
    reducer: {
        menu: MenuSlice.reducer,
        responsive: ResponsiveSlice.reducer,
        workerModal: WorkerModalSlice.reducer,
        vehicleAddModal: VehicleAddModalSlice.reducer,
        vehicleModal: VehicleModalSlice.reducer,
        taskModal: TaskModalSlice.reducer,
        user: UserSlice.reducer,
        workers: WorkersSlice.reducer,
        vehicles: VehiclesSlice.reducer,
        smallNotification: SmallNotificationSlice.reducer
    }
})

export default store
