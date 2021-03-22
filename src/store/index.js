import Vue from 'vue'
import Vuex from 'vuex'
import MISC from '@/js/miscellaneous'

Vue.use(Vuex)

const state = {
  usageDialog: false,
  showSnackbar: false,
  messageSnackbar: "",
  showLayer: false,
  counterDrag: 0,
  messageLayer:"",
  fitToWindow: false,
  frameData: {
    _uid: MISC.getUuid4(),
    _empty: true,
    pred: []
  },
  updateTagging: 0
}

const mutations = {
  usageDialog (state, payload) {
    state.usageDialog = payload.value
  },
  showSnackbar (state, payload) {
    state.showSnackbar = payload.value
  },
  messageSnackbar (state, payload) {
    state.messageSnackbar = payload.value
  },
  showLayer (state, payload) {
    state.showLayer = payload.value
  },
  counterDrag (state, payload) {
    if (payload.op == 'increment')
      state.counterDrag++;
    else if (payload.op == 'decrement')
      state.counterDrag--;
    else if (payload.op == 'clear')
      state.counterDrag = 0;
  },
  messageLayer (state, payload) {
    state.messageLayer = payload.value
  },
  fitToWindow (state, payload) {
    state.fitToWindow = payload.value
  },
  frameData (state, payload) {
    state.frameData = payload.value
  },
  frameDataPred (state, payload) {
    for (let pred of state.frameData.pred) {
      if (pred.id == payload.id) {
        pred[payload.key] = payload.value
      }
    }
  },
  updateTagging (state) {
    state.updateTagging++;
  }
}

/* eslint-disable no-unused-vars */
const store = new Vuex.Store({
  state,
  mutations
})

export default {
  store: store
}
