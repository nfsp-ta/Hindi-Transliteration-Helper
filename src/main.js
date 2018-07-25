import Vue from 'vue'
import Vuetify from 'vuetify'
import axios from 'axios'
import App from './App.vue'
Vue.use(Vuetify);

Vue.prototype.$http = axios;

Vue.directive('focus', {
  componentUpdated: function (el, binding) {
    if(binding.value != binding.oldValue)
      el.select();
    el.focus();
  }
});

Vue.directive('autosize', {
  componentUpdated: function (el, binding) {
    var tmp = document.createElement("span");
    Object.assign(tmp.style, {visibility: 'hidden', whiteSpace: 'pre', padding: '4px'});
    tmp.innerHTML = el.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    document.body.appendChild(tmp);
    var theWidth = tmp.getBoundingClientRect().width;
    document.body.removeChild(tmp);
    el.style.width = theWidth + "px";    
  }
});

window.app = new Vue({
  el: '#app',
  render: h => h(App)
});