<template>
  <div v-if="!isLoading" class="homepage">
    <div class="title">
      <div class="logo">
        <img id="logo" src="../assets/logo.png" alt="AppLogo" />
      </div>
      <h1>Welcome To <span class="appName">TaskIt</span></h1>
    </div>
    <div class="svg">
      <img id="main" src="../assets/main.svg" alt="mainImage" />
    </div>
    <div>
      <button
        @click="
          this.$store.commit('setIsLoading', true);
          this.$router.push('/account');
        "
        class="button"
        type="submit"
      >
        <i class="fas fa-envelope"></i> Sign in with Email
      </button>
      <button @click="signInWithGoogle" type="submit" class="button white">
        <div class="glogo"></div>
        Sign in with Gmail
      </button>
    </div>
  </div>
  <div class="pageLoader" v-else>
    <FingerprintSpinner
      :animation-duration="1500"
      :size="100"
      :color="'#2f2e41'"
    />
  </div>
</template>

<script>
import FingerprintSpinner from "epic-spinners/src/components/lib/FingerprintSpinner";
import { mapState } from "vuex";

export default {
  name: "HomePage",

  components: {
    FingerprintSpinner,
  },

  computed: {
    ...mapState(["isLoading"]),
  },

  mounted() {
    this.$store.commit("setIsLoading", false);
  },

  methods: {
    async signInWithGoogle() {
      this.$store.commit("setIsLoading", true);
      try {
        await this.$store.dispatch("googleLogin");
        this.$toast.success("Google signin success!");
      } catch (error) {
        this.$toast.warning("An error occurred. Please try again");
        this.$store.commit("setIsLoading", false);
        console.log(error);
        return;
      }
      this.$router.push("/todo");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.homepage {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--main);
}

.loader {
  height: 100%;
  display: grid;
  place-content: center;
}

.pageLoader {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
}

.logo {
  margin-top: 2rem;
  height: 3.8rem;
}

#logo {
  height: 100%;
}

.svg {
  width: 80vw;
  height: 50vh;
}

#main {
  height: 100%;
}

.glogo {
  height: 1rem;
  width: 1rem;
  background: url(../assets/glogo.png) no-repeat;
  background-position: center;
  background-size: contain;
}

h1 {
  margin: 0 0 1rem 0;
}

p {
  font-weight: 500;
  margin: 1rem;
}

.button {
  all: unset;
  cursor: pointer;
  color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 240px;

  height: 2.8rem;
  font-weight: 600;
  background: var(--main);
  border-radius: 0.2rem;
  margin: 1.2rem 0;
  box-shadow: var(--shadow);
}

.white {
  background: white;
  color: var(--main);
}

.button:hover {
  cursor: pointer;
  -webkit-box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
}

@media screen and (max-width: 480px) {
  .svg {
    height: fit-content;
  }

  #main {
    width: 100%;
  }
}

@media screen and (max-width: 800px) {
  h1 {
    font-size: 2rem;
  }
  .button {
    font-size: 1rem;
  }
}
</style>
