<template>
  <div class="todoApp" :class="{ isEmpty: todoEmpty, isLoading: isLoading }">
    <div class="bg" v-if="!todoEmpty"></div>
    <h2>{{ getUser }}'s Todos</h2>
    <div class="input-container">
      <div class="input">
        <i class="fas fa-plus"></i>
        <input
          @keyup.enter.prevent="handleAdd"
          placeholder="Add an item to do..."
          type="text"
          v-model="todoDescription"
        />
      </div>
      <button class="add-button" @click="handleAdd">Add</button>
    </div>

    <div class="todoList">
      <div
        v-for="todo in offlineTodos"
        v-bind:key="todo.id"
        :class="{ hide: !offline }"
        class="todo"
      >
        <div class="todoInfo">
          <div class="description">
            <button class="btns pointerless">
              <i class="fas fa-clock"></i>
            </button>
            <span class="name pointerless">{{ todo.description }}</span>
          </div>
        </div>
        <div class="buttons">
          <button class="btns" @click="handleOfflineDelete(todo.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="loader" v-if="isLoading">
        <FingerprintSpinner
          :animation-duration="1500"
          :size="100"
          :color="'#2f2e41'"
        />
      </div>
      <div v-else v-for="todo in todos" v-bind:key="todo.id" class="todo">
        <div class="todoInfo">
          <div class="description">
            <button class="btns pointerless">
              <i class="fas fa-tasks"></i>
            </button>
            <span class="name pointerless">{{ todo.description }}</span>
          </div>
        </div>
        <div class="buttons">
          <button class="btns" @click="handleDelete(todo.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <p @click="handleSignout">
      Sign Out
      <button class="sign">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  auth,
  db,
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
} from "@/includes/firebase";
import FingerprintSpinner from "epic-spinners/src/components/lib/FingerprintSpinner";

export default {
  name: "TodoApp",
  components: {
    FingerprintSpinner,
  },

  data() {
    return {
      todos: [],
      offlineTodos: [],
      todoDescription: "",
    };
  },

  computed: {
    ...mapState(["userLoggedIn", "isLoading"]),
    todoEmpty() {
      return !this.isLoading && this.todos[0] == undefined ? true : false;
    },
    getUser() {
      return this.userLoggedIn ? auth.currentUser.displayName : "User";
    },
    offline() {
      return navigator.onLine ? false : true;
    },
  },

  async created() {
    if (this.offline) this.$store.commit("setIsLoading", false);
    if (navigator.onLine) {
      const count = localStorage.getItem("todosCount");
      if (count) {
        for (let index = 0; index < count; index++) {
          const uid = localStorage.getItem(`uid${index}`);
          const newDescription = localStorage.getItem(`description${index}`);
          const newItem = {
            uid: uid,
            description: newDescription,
          };
          try {
            await addDoc(collection(db, "todos"), newItem);
            this.$store.commit("setIsLoading", false);
            localStorage.removeItem(`uid${index}`);
            localStorage.removeItem(`description${index}`);
          } catch (error) {
            this.$toast.warning("Couldn't Add Todo");
            console.log(error);
            this.$store.commit("setIsLoading", false);
          }
        }
      }
      localStorage.removeItem("todosCount");
    }
    const snapshot = await getDocs(
      query(collection(db, "todos"), where("uid", "==", auth.currentUser.uid))
    );
    snapshot.forEach(this.getTodos);
    this.$store.commit("setIsLoading", false);
  },

  methods: {
    getTodos(document) {
      const todo = {
        ...document.data(),
        id: document.id,
      };
      this.todos.unshift(todo);
    },

    /* ---- add new todo ---- */
    async handleAdd() {
      if (!navigator.onLine) {
        var count = localStorage.getItem("todosCount");
        if (!count) count = 0;
        localStorage.setItem(`description${count}`, this.todoDescription);
        localStorage.setItem(`uid${count}`, auth.currentUser.uid);
        localStorage.setItem("todosCount", parseInt(count) + 1);
        this.offlineTodos.unshift({
          id: count,
          uid: auth.currentUser.uid,
          description: this.todoDescription,
        });
        this.todoDescription = "";
      } else if (this.todoDescription == "")
        this.$toast.warning("Enter a todo please...");
      else {
        this.$store.commit("setIsLoading", true);
        try {
          const todoRef = await addDoc(collection(db, "todos"), {
            uid: auth.currentUser.uid,
            description: this.todoDescription,
          });
          const todoSnapshot = await getDoc(todoRef);
          this.getTodos(todoSnapshot);
          this.$store.commit("setIsLoading", false);
        } catch (error) {
          this.$toast.warning("Couldn't Add Todo");
          console.log(error);
          this.$store.commit("setIsLoading", false);
        }
        this.todoDescription = "";
      }
    },

    /* ---- delete a todo ---- */
    async handleDelete(id) {
      this.$store.commit("setIsLoading", true);
      try {
        await deleteDoc(doc(db, "todos", id));
        // update the Frontend to reflect Backend
        this.todos = this.todos.filter((todo) => todo.id != id);
        this.$store.commit("setIsLoading", false);
      } catch (error) {
        this.$toast.warning("Couldn't Delete Todo");
        console.log(error);
        this.$store.commit("setIsLoading", false);
      }
    },

    /* ---- delete offline todo ---- */
    handleOfflineDelete(id) {
      var count = localStorage.getItem("todosCount");
      localStorage.setItem("todosCount", parseInt(count) - 1);
      localStorage.removeItem(`uid${id}`);
      localStorage.removeItem(`description${id}`);
      this.offlineTodos = this.offlineTodos.filter((todo) => todo.id != id);
    },

    async handleSignout() {
      localStorage.removeItem("todosCount");
      this.$store.commit("setIsLoading", true);
      await this.$store.dispatch("signOut");
      this.$toast.success("Sign out success!");
      this.$router.push("/");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin: 1rem;
}

.todoApp {
  padding: 1rem;
  min-height: 97vh;
  position: relative;
}

.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  opacity: 0.3;
  background: url(../assets/bg.svg) no-repeat;
  background-position: -1rem 20rem;
  background-size: cover;
}

.loader {
  height: 50vh;

  display: grid;
  place-content: center;
}

.isEmpty .todoList {
  height: 50vh;
  background: url(../assets/todoo.svg) no-repeat;
  background-position: top;
  background-size: contain;
}

.hide {
  display: none;
}

.input-container {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  border: 2px solid var(--main);
  border-radius: 0.6rem;
  box-shadow: var(--shadow);
}

.input {
  color: var(--main);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding-left: 5px;
}

input {
  all: unset;
  text-align: start;
  width: 100%;
}

.add-button {
  all: unset;
  cursor: pointer;
  color: white;
  background: var(--main);
  padding: 0.45rem 0.8rem;
  border-radius: 0.4rem;
}

.add-button:hover {
  color: var(--bg);
  background: #242323;
  box-shadow: var(--shadow);
}

.todoList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2.5rem 0;
  padding-bottom: 4rem;
}

.todo {
  display: flex;
  justify-content: space-between;
  background: var(--main);
  color: var(--bg);
  padding: 1rem;
  border-radius: 0.4rem;
  box-shadow: var(--shadow);
}

.description {
  display: flex;
}

.name {
  padding-left: 0.5rem;
}

.btns {
  all: unset;
  cursor: pointer;
  color: var(--bg);
}

.btns:hover {
  color: var(--accent);
}

.pointerless {
  pointer-events: none;
  margin-right: 0.5rem;
}

p {
  font-weight: 500;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1rem;
  text-align: center;
  cursor: pointer;
}

p:hover {
  color: var(--accent);
  text-shadow: 1px 1px 3px 1px hsl(0, 0%, 100%);
}
.sign {
  all: unset;
  cursor: pointer;
  color: inherit;
}

p:hover .btns {
  color: var(--accent);
}

@media screen and (min-width: 800px) {
  .todoApp {
    padding: 0 25vw;
  }
}
</style>
