import {createRouter, createWebHashHistory} from 'vue-router'
import Home from "../components/page/Home.vue";
import Discover from "../components/children/Discover.vue";
import Chat from "../components/children/Chat.vue";
import Login from "../components/login/Login.vue";
import PostDetails from "../components/children/PostDetails.vue";
import Edit from "../components/children/Edit.vue";
import Welcome from "../components/page/Welcome.vue";
import Collect from "../components/children/Collect.vue";
import Person from "../components/children/Person.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: Welcome},
        // {path: '/', redirect:'/home'},
        {
            path: '/home', component: Home,
            redirect: '/home/discover',
            children: [
                {path: 'discover', component: Discover},
                {path: 'postDetails', component: PostDetails},
                {path: 'chat', component: Chat, meta: {keepAlive: true}},
                {path: 'edit', component: Edit},
                {path: 'collect', component: Collect},
                {path: 'person', component: Person},
            ]
        },
        {path: '/login', component: Login},
    ],
})

export default router