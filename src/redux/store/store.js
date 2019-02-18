import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import {composeWithDevTools} from "redux-devtools-extension";
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'

const middleware=[thunk]

const persistConfig = {
    key: 'root',
    storage,
  }

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer, composeWithDevTools( applyMiddleware(...middleware)))
let persistor = persistStore(store)

export default store;
export  {persistor};