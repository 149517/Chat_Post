import {createRouter, createWebHashHistory} from 'vue-router'
import Home from "../components/page/Home.vue";
import Discover from "../components/children/Discover.vue";
import Chat from "../components/children/Chat.vue";
import Login from "../components/login/Login.vue";
import PostDetails from "../components/children/PostDetails.vue";
import Edit from "../components/children/Edit.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', redirect:'/home'},
        {
            path: '/home', component: Home,
            redirect:'/home/discover',
            children: [
                {path: 'discover', component: Discover},
                {path:'postDetails',component:PostDetails},
                {path: 'chat', component: Chat},
                {path: 'edit', component: Edit},
            ]
        },
        {path: '/login', component: Login},
    ],
})

export default router