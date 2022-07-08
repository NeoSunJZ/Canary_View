import { createRouter,createWebHistory} from "vue-router";

const MainPage = () => import("@/views/MainPage.vue")
const LoginPage = () => import("@/views/LoginPage.vue")

const routes = [
  { path: "/", redirect: "/Login" },
  {
    path: "/Mainpage",
    name: "MainPage",
    component: MainPage
  },
  {
    path: "/Login",
    name: "Login",
    component: LoginPage
  }
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
  })

export default router
