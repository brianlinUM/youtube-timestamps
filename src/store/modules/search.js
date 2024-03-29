/* eslint-disable no-param-reassign */
// Module for holding search bar input.
// Search filtering is implemented in vuex,
// via a getter in the vuex store module, and
// called in the popup.

const state = () => {
  const titleQuery = '';
  const labelQuery = '';
  return { titleQuery, labelQuery };
};

const getters = {
  // normalized query string, for use in search
  // filter in videos module.
  titleQueryString: (_state) => _state.titleQuery.toLowerCase(),
  labelQueryString: (_state) => _state.labelQuery.toLowerCase(),
};

const mutations = {
  setTitleQuery(_state, newQuery) {
    _state.titleQuery = newQuery;
  },
  setLabelQuery(_state, newQuery) {
    _state.labelQuery = newQuery;
  },
};

export default {
  namespaced: false,
  state,
  getters,
  mutations,
};
