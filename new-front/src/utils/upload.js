
export default {
    // 验证用户是否登录，若是不含有Token和uid 则进行提示重新登录
    checkUser() {
        let token = localStorage.getItem('token')
        let uid = localStorage.getItem('uid')
        if (token && uid) {
            return true
        } else if (token || uid) {
            localStorage.setItem('token', null)
            localStorage.setItem('uid', null)
            return false
        } else {
            return false
        }
    },
}