const express = require('express');
const router = express.Router();

//--------DB-----//
const user = require('../models').u;
const user2 = require('../models').u2;
const user3 = require('../models').u3;

//--------PASSWORd-//
const bcrypt = require('bcrypt');

//---Photos---//
const multer = require('multer');
const { json } = require('sequelize');

//--------PASSPORT-------//
const passport = require("passport");
const auth = require("../middleware/auth");
//const e = require('express');

//-------------------U P L O A D--------///
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "public/uploads/");
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({ storage })


const storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "public/uploads/");
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload2 = multer({ storage2 })


// //----------------------------------------------------O P E N I N G-------------------------------------------------//
router.get("/registrations", async(req, res, next) => {
    const users = await user.findAll({
        raw: true
    })
    res.render('registration', { title: 'Registrations', users })
})

//-----------------------------------------------------profile------------------------//
router.get("/profile/:id", auth, async(req, res, next) => {
    const id = req.params.id;
    const userfind = await user.findOne({
        where: {
            id: id
        },
        attributes: ['id', 'firstname', 'lastname', 'email', 'contno', 'username']
    })
    res.render("profile", { userfind })
})



//------------------------------------------------------C R E A T E--------------------------------------------------//
router.post("/post", upload.single("cv"), async(req, res) => {
    console.log(req.file.path)
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const email2 = await user.findOne({
        where: {
            email: email
        },
        attributes: ['email']
    })
    if (email2) {
        return res.json({
            success: false,
            code: 400,
            message: "email no. already taken"
        })
    }

    const contno = req.body.contno
    const contno2 = await user.findOne({
        where: {
            contno: contno
        },
        attributes: ['contno']
    })
    if (contno2) {
        return res.json({
            success: false,
            code: 400,
            message: "Contact no. already taken"
        })
    }

    const username = req.body.username
    const user2 = await user.findOne({
        where: {
            username: username
        },
        attributes: ['username']
    })
    if (user2) {
        return res.json({
            success: false,
            code: 400,
            message: "username already taken"
        })
    }
    const hash = req.body.password
    const password = await bcrypt.hash(hash, 5);
    console.log(req.body)
    console.log(req.file)
    const edurow = JSON.parse(req.body.edurow)

    try {
        const users = await user.create({ firstname, lastname, email, contno, username, password })

        console.log("ID : " + users.id);

        const degree = edurow.map(value => value.degree)
        const board = edurow.map(value => value.board)
        const year = edurow.map(value => value.year)
        const marks = edurow.map(value => value.marks)

        for (let i = 0; i < edurow.length; i++) {
            const users3 = await user3.create({ addedu_id: users.id, degree: degree[i], board: board[i], year: year[i], marks: marks[i] })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
    res.json({
        success: true,
        code: 200
    })
});





//---------------------------------------------------V I E W----------------------------------------//
router.post("/view-details", async(req, res) => {
    const showdata = await user.findOne({
        where: {
            id: req.body.id
        },
        attributes: ['firstname', 'lastname', 'email', 'contno', 'username', 'password'],
    })
    res.json({ showdata })
})

//-------------------------------------------------U P D A T E----------------------------------------------------------------------//
router.post('/postupdate', async(req, res) => {
    console.log(req.body);
    const id = req.body.up_id;
    const firstname = req.body.update_firstname;
    const lastname = req.body.update_lastname;
    const email = req.body.update_email;
    const contno = req.body.update_contno;
    const username = req.body.update_username;

    const users = await user.update({ firstname, lastname, email, contno, username }, {
        where: {
            id: id
        }
    })

    res.json({
        success: true,
        code: 200
    })
})


//----------------------------------------------------------------D E L E T E-------------------------------------------------------//
router.post('/postdelete', async(req, res) => {

    const id = req.body.id

    const users = await user.destroy({
        where: {
            id
        }
    })
    const users3 = await user3.destroy({
        where: {
            addedu_id: id
        }
    })

    res.json({
        success: true,
        code: 200,
        message: "User deleted succesfully"
    })
});






//---------------------------L O G I N------------------------------//
router.get("/login", async(req, res) => {
    res.render('login', { title: 'Login' })
})

router.post("/loginpost", passport.authenticate("local", {

    failureRedirect: "/loginpost",
    failureFlash: true
}), async(req, res) => {
    const userid = req.user.id;
    res.json({
        success: true,
        code: 200,
        message: "successfull login",
        userid: userid
    })
})





module.exports = router;