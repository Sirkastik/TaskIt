<template>
  <router-view />
</template>

<script>

export default {
  name: "App",

  created() {
    this.$store.dispatch("init_login");
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap");
@import url("./assets/css/fontawesome.min.css");
@import url("./assets/css/solid.min.css");

/* global styles */
* {
  --bg: #f6f5fd;
  --main: #2f2e41;
  --accent: #513cd6;
  --shadow: 0px 14px 14px 0 #bfc5e05b;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Karla", "Baloo 2", Roboto, "Acme", "Source Sans Pro",
    "Bona Nova", Poppins, Avenir, arial, -apple-system, "Open Sans", sans-serif;
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  display: grid;
  place-content: center;
}

::-webkit-scrollbar {
  opacity: 0;
  width: 0.2em;
  height: 0;
}

::-webkit-scrollbar-thumb {
  border-radius: 100vw;
  background-color: var(--main);
}

a {
  cursor: pointer;
  color: var(--main);
  text-decoration: none;
  font-size: 1em;
  transition: 0.5s;
}

a:hover {
  color: var(--accent);
  text-shadow: 1px 1px 3px 1px hsl(0, 0%, 100%);
}

#app {
  color: var(--main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100vw;
  height: 100vh;
}

.btn {
  all: unset;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  width: 1.6em;
  height: 1.6em;
  border-radius: 5px;
  margin: 0 0.3em;
  font-size: 1em;
  transition: 0.5s;
}

.long {
  all: unset;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  height: 2.7rem;
  border-radius: 0.6rem;
  background: var(--main);
  color: var(--bg);
  display: block;
  width: 100%;
  margin: 1.2rem 0;
  box-shadow: var(--shadow);
  transition: 0.5s;
}

.long:hover {
  -webkit-box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
}

.btn:hover {
  background: var(--accent);
  color: var(--main);
}

.btns {
  all: unset;
}
</style>
