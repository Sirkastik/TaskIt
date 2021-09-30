<template>
  <HomePage />
</template>

<script>
import HomePage from "@/components/HomePage.vue";
import store from "@/store";

export default {
  name: "Home",
  components: {
    HomePage,
  },

  beforeRouteEnter(to, from, next) {
    if (store.state.userLoggedIn) {
      next({ name: "Todo" });
    } else {
      next();
    }
  },
};
</script>
