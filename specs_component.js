import spec from './call_list_spec.js'
import spec from './call_list_spec_2.js'

Vue.component('specs', {
    data: function () {
      return {
        count: 0
      }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
  })