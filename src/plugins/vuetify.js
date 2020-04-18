import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import {
    vProgressLinear,
    /* other imports ... */
} from "vuetify";
Vue.use(Vuetify)

export default new Vuetify({
    components: {
        vProgressLinear,
        /* other imports */
    },
    icons: {
        iconfont: 'mdi'
    }
})