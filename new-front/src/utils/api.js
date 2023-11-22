import axios from 'axios'
import {headers} from "wait-on/exampleConfig.js";

export default {
    login(account, password) {
        return axios.post('/user/login', {user: account, password: password})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    register(account, password) {
        return axios.post('/user/register', {user: account, password: password})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取所有用户
    getAll() {
        return axios.get('/user/all')
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },

    // 通过 id 查询当前用户，返回用户数据，暂时未实现
    getCurrentUser(uid) {
        return axios.post('/user/currentUser', {uid:uid})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取用户的图集
    getUserImages(uid){
        return axios.post('/user/userImages',{uid:uid})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取用户发布过的帖子
    getUserPost(uid){
        return axios.post('/user/userPost',{uid:uid})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 根据 uid 数组，返回用户的头像和名称
    getUserHead(list) {
        return axios.post('/user/userHead', {list: list})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取所有的帖子内容
    getPostList() {
        return axios.get('/post/all')
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 根据用户查询用户的交互记录
    getPostInteract() {
        return axios.get('/post/interact')
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取单条帖子的交互
    getOneInteract(id) {
        return axios.get(`/post/interact/${id}`)
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 上传用户交互的数据
    dataUpload(list) {
        return axios.post('/post/dataUpload', {list: list})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 通过id 获取单个帖子
    getPostOne(id) {
        return axios.get(`/post/list/${id}`)
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 帖子内容发布上传
    fileUpload(fileList) {
        // console.log(fileList)
        return axios.post("/post/upload",
            {file: fileList})
            .then(res => res.data)
            .catch(err => {
                throw err
            })

    },
    // 获取评论
    getComment(pid) {
        return axios.post('/post/getComment', {pid: pid})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 添加评论
    addComment(value, pid) {
        return axios.post('/post/addComment', {
            pid: pid,
            content: value
        })
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取收藏列表
    getCollectData() {
        return axios.get('/post/collect')
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 提取日期
    getDateTime(str){
        // 将字符串解析为日期对象
        const originalDate = new Date(str);
        return originalDate.toISOString().slice(0, 16).replace("T", " ")
    },

    /**
     * 消息请求
     * */

    // 获取所有的消息记录
    getMessageAll(){
        return axios.get('/message/all')
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    }
}