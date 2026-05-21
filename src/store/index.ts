import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectStepsReducer from './slices/projectStepsSlice'
import projectWizardReducer from './slices/projectWizardSlice'
import serviceRequestReducer from './slices/serviceRequestSlice'
import adminRequestsReducer from './slices/adminRequestsSlice'
import adminUsersReducer from './slices/adminUsersSlice'
import adminProjectsReducer from './slices/adminProjectsSlice'
import userProjectsReducer from './slices/userProjectsSlice'
import feasibilityReducer from './slices/feasibilitySlice'
import brandingReducer from './slices/brandingSlice'
import projectDetailsReducer from './slices/projectDetailsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projectSteps: projectStepsReducer,
    projectWizard: projectWizardReducer,
    serviceRequest: serviceRequestReducer,
    adminRequests: adminRequestsReducer,
    adminUsers: adminUsersReducer,
    adminProjects: adminProjectsReducer,
    userProjects: userProjectsReducer,
    feasibility: feasibilityReducer,
    branding: brandingReducer,
    projectDetails: projectDetailsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
