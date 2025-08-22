import { createPinia } from 'pinia'

// Single shared Pinia instance to be imported anywhere stores are used outside components
export const pinia = createPinia()