import Vue from 'vue'
import Vuex from 'vuex'
import Notification from '../lib/Notification'

Vue.use(Vuex);

const state = {
  notifications: []
}

const getters = {
  getNotifications: state => state.notifications
}

export const mutations = {
  addNotification (state: any, notification: Notification) {
    const exists = state.notifications.find(n => {
      if (n.type) {
        return n.id === notification.id && n.type === notification.type;
      } else {
        return n.id === notification.id;
      }
    });
    if (!exists) { 
      console.log('not exists -> pushing', notification);
      state.notifications.push(notification);
      console.log('pushed new notification', state);
    } else {
      console.log('notification already exists');
    }
  },
  deleteNotification (state: any, notification: Notification) {
    console.log('before delete', state.notifications);
    state.notifications = state.notifications.filter(n => {
      if (n.type) {
        return `${n.id}|${n.type}` !== `${notification.id}|${notification.type}`; 
      } else {
        return n.id !== notification.id;
      }
    });
    console.log('after delete', state.notifications);
  },
  markRead (state: any, notification: Notification) {
    state.notifications.forEach((n: Notification) => {
      // match type only if exists
      if (n.id === notification.id && (!n.type || n.type === notification.type)) {
        n.unread = false;
      }
    });
  },
  markAllRead (state: any) {
    state.notifications.forEach((notification: Notification) => {
      notification.unread = false;
    });
  },
  deleteAll (state: any) {
    state.notifications = [];
  }
}

export const actions = {
  addNotification ({ commit }, notification: Notification) {
    commit('addNotification', notification);
  },

  deleteNotification ({ commit }, notification: Notification) {
    commit('deleteNotification', notification);
  },

  markRead ({ commit }, notification: Notification) {
    commit('markRead', notification);
  },

  markAllRead ({ commit }) {
    commit('markAllRead');
  },

  deleteAll ({ commit }) {
    commit('deleteAll');
  }
}

/**
 * Defined as a module so that it can be imported into other Vuex stores.
 */
export const raiseTheAppModule = {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}

export const options = {
  modules: {
    raiseTheApp: raiseTheAppModule
  }
}

export default new Vuex.Store(options)
