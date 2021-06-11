import Vuex from 'vuex';

export default function storeFactory() {
    // Quick start Vuex code just for checking if vuex is built properly
    // To be replaced with actual store definition.
    return new Vuex.Store({
        state: {
            count: 0
        },
        mutations: {
            increment (state) {
            state.count++
            }
        }
    })
}
