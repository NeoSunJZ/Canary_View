// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Login from '../views/Login.vue'

// Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     meta:{
//       title:"base page"
//     },
//     // ？？？
//     component:(resolve)=>require(['@/views/MainPage.vue'],resolve)
//   },
//   {
//     path: '/Login',
//     name: 'Login',
//     component: Login
//   },
//   {
//     path: '/MainPage/',
//     name: 'Main',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '@/views/MainPage.vue')
//   },
//   {
//     path: '/MainPage/StuInfo',
//     name: 'StuInfo',
//     component:(resolve)=>require(['@/components/StuInfo.vue'],resolve)
//   },
//   {
//     path: '/MainPage/Blank',
//     name: 'B1',
//     component:(resolve)=>require(['@/components/Blank.vue'],resolve)
//   },  
//   {
//     path: '/MainPage/Comment',
//     name: 'Comment',
//     component:(resolve)=>require(['@/components/MyComment.vue'],resolve)
//   },  
// ]


// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

// export default router
