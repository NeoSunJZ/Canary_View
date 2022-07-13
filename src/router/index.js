import { createRouter,createWebHistory} from "vue-router";

const MyPoint = () => import("@/views/point-manage/MyPoint.vue")
const LoginPage = () => import("@/views/login/LoginPage.vue")
const DataSetBinding = () => import("@/views/point-manage/DataSetBinding.vue")
const ModelBinding = () => import("@/views/point-manage/ModelBinding.vue")
const AttackMethodBinding = () => import("@/views/point-manage/AttackMethodBinding.vue")
const DefenseMethodBinding = () => import("@/views/point-manage/DefenseMethodBinding.vue")
const TestTaskConstruction=()=>import("@/views/test-manage/TestTaskConstruction.vue")
const TaskRealtimeBoard=()=>import("@/views/test-manage/TaskRealtimeBoard.vue")
const ResultAnalysis=()=>import("@/views/test-manage/ResultAnalysis.vue")
const RankingList=()=>import("@/views/test-manage/RankingList.vue")

const routes = [
  { path: "/", redirect: "/Login" },
  {
    path: "/Login",
    name: "Login",
    component: LoginPage
  },
  {
    path: "/MyPoint",
    name: "MyPoint",
    component: MyPoint
  },
  {
    path: "/DataSetBinding",
    name: "DataSetBinding",
    component: DataSetBinding
  },
  {
    path: "/ModelBinding",
    name: "ModelBinding",
    component: ModelBinding
  },
  {
    path: "/AttackMethodBinding",
    name: "AttackMethodBinding",
    component: AttackMethodBinding
  },
  {
    path: "/DefenseMethodBinding",
    name: "DefenseMethodBinding",
    component: DefenseMethodBinding
  },
  {
    path: "/TestTaskConstruction",
    name: "TestTaskConstruction",
    component:TestTaskConstruction
  },
  {
    path: "/TaskRealtimeBoard",
    name: "TaskRealtimeBoard",
    component: TaskRealtimeBoard
  },
  {
    path: "/ResultAnalysis",
    name: "ResultAnalysis",
    component: ResultAnalysis
  },
  {
    path: "/RankingList",
    name: "RankingList",
    component: RankingList
  }

]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
  })

export default router
