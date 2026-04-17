import { createSelector } from 'reselect'
import initialState from './initialState'

const selectRoot = (state: any) => state || initialState
const createInitialSelectors = () => {
  const selectors: any = {}
  Object.keys(initialState).map((key) => {
    selectors[key] = createSelector(selectRoot, (state : any) => state[key])
  })
  return selectors
}
const selectors = createInitialSelectors()
export default selectors