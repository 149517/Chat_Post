const express = require('express');
const db = require("../db/db");
const router = express.Router();


/**
 * 公共频道
 * */

// 获取公共频道的所有记录

router.get('/all',(req,res)=>{
    let sql = 'SELECT * FROM public_messages';
    db.query(sql,(err,results)=>{
        if(err){
            console.log('消息查询出错')
            res.status(400).send('消息查询出错')
        }
        // console.log(results)
        res.status(200).send(results)
    })
})


module.exports = router;
