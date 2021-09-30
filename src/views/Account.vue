<template>
    <AccountPage />
</template>

<script>
import AccountPage from "@/components/AccountPage.vue";
import store from "@/store";


export default {
  name: "Account",
  components: {
    AccountPage,
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
