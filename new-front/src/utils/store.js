import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            dark: false,
            eject:false,
            login:true,
            send:null,
            chatPage:false,

            // User
            user:localStorage.getItem('user'),
            pic:localStorage.getItem('pic'),
            intro:localStorage.getItem('intro'),
            uid:localStorage.getItem('uid'),

            // 选中用户Id，用于控制左侧和聊天
            selectUid:localStorage.getItem('uid'),
        }
    },
    mutations: {
        toggleDark (state,value) {
            state.dark = value
        },
        toggleEject(state,value){
            state.eject = value
        },
        toggleLogin(state,value){
            state.login = value
        },
        toggleChatPage(state,value){
            state.chatPage = value
        },
        toggleSelectUid(state,value){
            state.selectUid = value
        },
        changeSend(state,value){
            state.send = value
        },
        addUser(state,value){
            state.user = value
        },
        addPic(state,value){
            state.pic = value
        },
        addIntro(state,value){
            state.intro = value
        },
        addUid(state,value){
            state.uid = value
        },
    }
})

export default store
