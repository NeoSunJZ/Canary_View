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
    path: "/MyNode",
    name: "MyNode",
    component: () => import("@/views/node-manage/MyNode.vue")
  },
  {
    path: "/DataSetBinding",
    name: "DataSetBinding",
    component: () => import("@/views/node-manage/DataSetBinding.vue")
  },
  {
    path: "/ModelBinding",
    name: "ModelBinding",
    component: () => import("@/views/node-manage/ModelBinding.vue")
  },
  {
    path: "/AttackMethodBinding",
    name: "AttackMethodBinding",
    component: () => import("@/views/node-manage/AttackMethodBinding.vue")
  },
  {
    path: "/DefenseMethodBinding",
    name: "DefenseMethodBinding",
    component: () => import("@/views/node-manage/DefenseMethodBinding.vue")
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
    path: "/TestTaskConstruction/ModelTest",
    name: "ModelTestTaskConstruction",
    component: () => import("@/views/test-manage/TestTaskConstruction/ModelTest.vue")
  },
  {
    path: "/TaskRealtimeBoard",
    name: "TaskRealtimeBoard",
    component: () => import("@/views/test-manage/TestTaskConsole/TaskRealtimeBoard.vue")
  },
  {
    path: "/TaskRealtimeBoard/TaskConsole",
    name: "TaskConsole",
    component: () => import("@/views/test-manage/TestTaskConsole/TaskConsole.vue")
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