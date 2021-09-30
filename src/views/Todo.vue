<template>
  <TodoApp />
</template>

<script>
import TodoApp from "@/components/TodoApp.vue";
import store from "@/store";

export default {
  name: "Todo",
  components: {
    TodoApp,
  },

  beforeRouteEnter(to, from, next) {
    if (store.state.userLoggedIn) {
      next();
    } else {
      next({ name: "Home" });
    }
  },
};
</script>
