import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCounter(state, payload) {
      payload.counter += 1;
      console.log(state.cartList);
    },
    addToCart(state, payload) {
      payload.counter = 1;
      payload.checked = true
      state.cartList.push(payload);
      console.log(state.cartList);

    }
  },
  actions: {
    addCart(context, payload) {

      return new Promise((resolve, reject) => {
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
        if (oldProduct) {
          // oldProduct.count += 1
          context.commit('addCounter', oldProduct)
          resolve('当前商品数量+1')
        } else {
          // payload.count = 1;
          // state.cartList.push(payload)
          context.commit('addToCart', payload)
          resolve('添加新商品')
        }
        // state.cartList.push(payload)
      })

    }
  },
  modules: {
  },
  getters
})
