import { createStore } from "vuex";
import {
  auth, db, doc, setDoc, provider, signInWithPopup, updateProfile,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from "@/includes/firebase";

export default createStore({
  state: {
    userLoggedIn: false,
    isLoading: true,
  },
  mutations: {
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn
    },
    setIsLoading(state, stateValue) {
      state.isLoading = stateValue
    }
  },
  actions: {
    async login({ commit }, payload) {
      await signInWithEmailAndPassword(auth, payload.email, payload.password);
      commit('toggleAuth');
    },

    async googleLogin({ commit }) {
      await signInWithPopup(auth, provider);
      commit('toggleAuth');
    },

    async register({ commit }, payload) {
      const userCredentials = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
      await setDoc(doc(db, 'users', userCredentials.user.uid), {
        username: payload.username,
        email: payload.email
      })
      await updateProfile(auth.currentUser, { displayName: payload.username })
      commit('toggleAuth');
    },

    init_login({ commit }) {
      const user = auth.currentUser;
      if (user)
        commit('toggleAuth')
    },

    async signOut({ commit }) {
      await signOut(auth);
      commit('toggleAuth')
    },
  },
});
