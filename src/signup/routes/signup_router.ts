import express, {Application, Request, Response} from 'express';
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../../../.env.development') });
console.log(process.env.MYSQL_DB_HOST);

let mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host:process.env.MYSQL_DB_HOST,
    user:process.env.MYSQL_DB_USER_NAME,
    password:process.env.MYSQL_DB_PASSWORD,
    port:process.env.MYSQL_DB_PORT,
    database:'community'
});

db.connect()

const router = express.Router();

router.post('/', function(req, res) {
    const {email, password, repassword, name} = req.body;
    const param = [email, password, name]
    let result:{} = {}
    if(email && password && name){
        if(password === repassword){
            console.log(param);
            bcrypt.hash(param[1], 10, (err:Error, hash:any) => {
                param[1] = hash
                db.query('INSERT INTO users(`email`, `password`, `name`) VALUES(?, ?, ?)', param, (err:Error, row:any) => {

                    if(err){
                        result = {...result, status:500, message:'db error fail'}
                        console.log('db query error', err);
                        return;
                    };
                    result = {...result, status:200, message:'success', data:{token:''} }
                })
            })
        } else {
            console.log('비밀번호 안맞음');
            result = {...result, status:500, message:'password fail', data:{token:''} }

        }
    }
    res.send(result);
    res.end();
    // res.json({ title: req });
});

    export default router;
