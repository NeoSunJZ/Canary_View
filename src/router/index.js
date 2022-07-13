import { createRouter,createWebHistory} from "vue-router";

const MyPoint = () => import("@/views/MyPoint.vue")
const LoginPage = () => import("@/views/LoginPage.vue")

const routes = [
  { path: "/", redirect: "/Login" },
  {
    path: "/MyPoint",
    name: "MyPoint",
    component: MyPoint
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
