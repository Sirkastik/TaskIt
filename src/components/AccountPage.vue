<template>
  <div id="account" v-if="!isLoading">
    <div class="sign col">
      <form @submit.prevent="handleSubmit">
        <div class="top">
          <h3 v-if="signup" @click="signup = !signup">
            <i class="fas fa-door-open"></i>
          </h3>
          <h3 v-else @click="signup = !signup">
            <i class="fas fa-user-plus"></i>
          </h3>
          <h2 v-if="signup">Sign Up</h2>
          <h2 v-else>Sign In</h2>
          <h3
            @click.prevent="
              this.$store.commit('setIsLoading', true);
              this.$router.push('/');
            "
          >
            <button class="btns"><i class="fas fa-home"></i></button>
          </h3>
        </div>
        <div
          v-if="signup"
          class="input-container"
          :class="{
            focus: this.usernameInputFocus,
            filled: usernameInputFilled,
          }"
        >
          <h5>Username</h5>
          <div class="icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="input">
            <input
              @keypress.enter.prevent="changeFocus"
              type="text"
              id="0"
              v-model="username"
              @focus="usernameInputFocus = !usernameInputFocus"
              @blur="usernameInputFocus = !usernameInputFocus"
            />
          </div>
        </div>
        <div
          class="input-container"
          :class="{ focus: this.emailInputFocus, filled: emailInputFilled }"
        >
          <h5>Email</h5>
          <div class="icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="input">
            <input
              @keypress.enter.prevent="changeFocus"
              type="email"
              id="1"
              v-model="email"
              @focus="emailInputFocus = !emailInputFocus"
              @blur="emailInputFocus = !emailInputFocus"
            />
          </div>
        </div>
        <div
          class="input-container"
          :class="{ focus: this.passInputFocus, filled: passInputFilled }"
        >
          <h5>Password</h5>
          <div class="icon">
            <i class="fas fa-lock"></i>
          </div>
          <div class="input">
            <input
              @keypress.enter.prevent="handleSubmit"
              type="password"
              id="2"
              v-model="password"
              @focus="passInputFocus = !passInputFocus"
              @blur="passInputFocus = !passInputFocus"
            />
          </div>
        </div>

        <div v-if="signup">
          <button type="submit" class="long">Sign Up</button>
          <p>
            Already have an account?
            <a @click="signup = !signup"><h4>Sign In</h4></a>
          </p>
        </div>
        <div v-else>
          <button type="submit" class="long">Sign In</button>
          <p>
            Don't have an account?
            <a @click="signup = !signup"> <h4>Sign Up</h4> </a>
          </p>
        </div>
      </form>
    </div>
    <div class="svg col"></div>
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
import { mapState } from "vuex";
import FingerprintSpinner from "epic-spinners/src/components/lib/FingerprintSpinner";

export default {
  name: "AccountPage",

  components: {
    FingerprintSpinner,
  },

  data() {
    return {
      username: "",
      email: "",
      password: "",
      usernameInputFocus: false,
      emailInputFocus: false,
      passInputFocus: false,
      signup: false,
    };
  },

  mounted() {
    this.$store.commit("setIsLoading", false);
  },

  computed: {
    ...mapState(["isLoading"]),
    usernameInputFilled() {
      return this.username != "";
    },
    emailInputFilled() {
      return this.email != "";
    },
    passInputFilled() {
      return this.password != "";
    },
  },

  methods: {
    changeFocus(e) {
      document.getElementById(`${parseInt(e.target.id) + 1}`).focus();
    },

    handleSubmit() {
      this.$store.commit("setIsLoading", true);
      return this.signup ? this.handleSignup() : this.handleLogin();
    },

    async handleSignup() {
      if (this.validate() !== "") {
        this.$toast.warning(this.validate());
        this.$store.commit("setIsLoading", false);
      } else {
        try {
          const values = {
            email: this.email,
            username: this.username,
            password: this.password,
          };
          await this.$store.dispatch("register", values);
          this.$toast.success("Sign Up success!");
        } catch (error) {
          this.$toast.warning("Email already exists");
          this.$store.commit("setIsLoading", false);
          console.log(error);
          return;
        }
        this.$router.push("/todo");
      }
    },

    async handleLogin() {
      if (this.email == "" || this.password == "") {
        this.$toast.warning("Enter all credentials please!");
        this.$store.commit("setIsLoading", false);
      } else {
        try {
          const values = {
            email: this.email,
            password: this.password,
          };
          await this.$store.dispatch("login", values);
          this.$toast.success("Sign In success!");
        } catch (error) {
          this.$toast.warning("Invalid login details");
          this.$store.commit("setIsLoading", true);
          console.log(error);
          return;
        }
        this.$router.push("/todo");
      }
    },

    validate() {
      if (this.email == "" || this.password == "" || this.username == "")
        return "Enter all credentials please!";
      if (this.password.length < 6)
        return "Password must be at least 6 characters";
      return "";
    },
  },
};
</script>

<style scoped>
#account {
  min-height: 90vh;
  padding: 5vh 10vw;
  display: flex;
  align-items: center;
  gap: 5rem;
}

.pageLoader {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
}

.col {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.svg {
  height: 90vh;
  background: url(../assets/todo.svg) no-repeat;
  background-position: center;
  background-size: contain;
}

/* form style */
form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.top h3 {
  cursor: pointer;
}

.top h3:hover {
  color: var(--accent);
}

form h2 {
  font-size: 2.9rem;
  text-transform: uppercase;
}

.input-container {
  position: relative;
  height: 3rem;
  display: flex;
  align-items: center;
  margin: 1rem 0;
  padding: 9px;
  border: 2px solid var(--main);
  border-radius: 0.6rem;
  box-shadow: var(--shadow);
}

.input {
  width: 100%;
  color: var(--main);
}

input {
  all: unset;
  text-align: start;
  width: 100%;
}

h5 {
  pointer-events: none;
  z-index: -1;
  font-size: 1em;
  position: absolute;
  opacity: 0.5;
  transform: translateX(2rem);
  transition: transform 0.15s, opacity ease-in 0.15s;
}

.icon {
  margin: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-container.focus {
  border: 2px solid var(--accent);
}

.input-container.focus input,
.input-container.filled input {
  color: var(--accent);
}

.input-container.focus h5 {
  transform: translate(20%, -99%);
  color: var(--accent);
}

.input-container.focus h5,
.input-container.filled h5 {
  background: var(--bg);
  padding: 0 5px;
  font-size: 0.8em;
  transform: translate(20%, -142%);
  z-index: 1;
  opacity: 1;
}

.input-container.focus .icon {
  color: var(--accent);
}

p {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media screen and (max-width: 600px) {
  .svg {
    display: none;
  }
  form h2 {
    font-size: 2rem;
  }
}
</style>
