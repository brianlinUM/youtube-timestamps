// Popup vue root and entry.

import Vue from 'vue';
import store from './store/initializeStore';
import Popup from './components/Popup.vue';

new Vue({ // eslint-disable-line no-new
  el: '#popup',
  store,
  components: { Popup },
  // Need to use render function instead of template since
  // we need to use the chrome CSP compliant vue runtime build (webpack's default vue file),
  // which doesn't have the compiler. Instead, we put the templates inside
  // .vue components and import them here. This works because
  // webpack + vue-loader will pre-compile the templates in .vue files into js,
  // although not for .js files themselves, hence the need for render() here.
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  render(createElement) {
    return createElement('popup');
  },
});
