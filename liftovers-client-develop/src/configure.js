import thunk from 'redux-thunk'
import { createStore,compose,applyMiddleware } from 'redux'
import allReducers from './reducers'

export default function configureStore(initialState, browserHistory) {
    const store = createStore(
        allReducers,
        initialState,
        compose(
                applyMiddleware(thunk),
        )
    )
    return store;
}