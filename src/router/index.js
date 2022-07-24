import {
  createRouter,
  createWebHistory
} from "vue-router";

const routes = [{
    path: "/",
    redirect: "/Login"
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("@/views/login/LoginPage.vue") // 而不是 const LoginPage = () => import("@/views/login/LoginPage.vue")
  },
  {
    path: "/MyPoint",
    name: "MyPoint",
    component: () => import("@/views/point-manage/MyPoint.vue")
  },
  {
    path: "/DataSetBinding",
    name: "DataSetBinding",
    component: () => import("@/views/point-manage/DataSetBinding.vue")
  },
  {
    path: "/ModelBinding",
    name: "ModelBinding",
    component: () => import("@/views/point-manage/ModelBinding.vue")
  },
  {
    path: "/AttackMethodBinding",
    name: "AttackMethodBinding",
    component: () => import("@/views/point-manage/AttackMethodBinding.vue")
  },
  {
    path: "/DefenseMethodBinding",
    name: "DefenseMethodBinding",
    component: () => import("@/views/point-manage/DefenseMethodBinding.vue")
  },
  {
    path: "/TestTaskConstruction/DefenseTest",
    name: "DefenseTestTaskConstruction",
    component: () => import("@/views/test-manage/TestTaskConstruction/DefenseTest.vue")
  },
  {
    path: "/TestTaskConstruction/AttackTest",
    name: "AttackTestTaskConstruction",
    component: () => import("@/views/test-manage/TestTaskConstruction/AttackTest.vue")
  },
  {
    path: "/TaskRealtimeBoard",
    name: "TaskRealtimeBoard",
    component: () => import("@/views/test-manage/TaskRealtimeBoard.vue")
  },
  {
    path: "/ResultAnalysis",
    name: "ResultAnalysis",
    component: () => import("@/views/test-manage/ResultAnalysis.vue")
  },
  {
    path: "/RankingList",
    name: "RankingList",
    component: () => import("@/views/test-manage/RankingList.vue")
  }

]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router