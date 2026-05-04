import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectStepsReducer from './slices/projectStepsSlice'
import projectWizardReducer from './slices/projectWizardSlice'
import serviceRequestReducer from './slices/serviceRequestSlice'
import userProjectsReducer from './slices/userProjectsSlice'
import feasibilityReducer from './slices/feasibilitySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projectSteps: projectStepsReducer,
    projectWizard: projectWizardReducer,
    serviceRequest: serviceRequestReducer,
    userProjects: userProjectsReducer,
    feasibility: feasibilityReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
