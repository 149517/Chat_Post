import axios from 'axios'
import {headers} from "wait-on/exampleConfig.js";

export default {
    login(account, password) {
        return axios.post('/login', {user: account, password: password})
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    register(account, password) {
        return axios.post('/register', {user: account, password: password})
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

    // 通过Token查询当前用户，返回用户数据，暂时未实现
    getCurrentUser(token) {
        return axios.post('/user/currentUser', {token: token})
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
        return axios.post('/post/interact')
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    // 获取单条帖子的交互
    getOneInteract(id) {
        return axios.post('/post/interact', {pid: id})
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
        console.log(fileList)
        return axios.post("/post/upload",
            {file: fileList})
            .then(res => res.data)
            .catch(err => {
                throw err
            })

    }

}