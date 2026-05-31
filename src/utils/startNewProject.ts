import type { AppDispatch } from '../store'
import { clearSavedBranding } from '../store/slices/brandingSlice'
import { clearFeasibility } from '../store/slices/feasibilitySlice'
import { clearProjectDetails } from '../store/slices/projectDetailsSlice'
import { resetProjectWizardState } from '../store/slices/projectWizardSlice'
import { resetProjectSteps } from '../store/slices/projectStepsSlice'

/** Clears stored project id and wizard-related Redux state for a fresh flow. */
export function startNewProject(dispatch: AppDispatch) {
  dispatch(resetProjectSteps())
  dispatch(resetProjectWizardState())
  dispatch(clearSavedBranding())
  dispatch(clearFeasibility())
  dispatch(clearProjectDetails())
}
