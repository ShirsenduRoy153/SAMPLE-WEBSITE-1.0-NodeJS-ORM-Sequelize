const express = require('express');
const router = express.Router();
const user = require('../models').u;
const user2 = require('../models').u2;
const bcrypt = require('bcrypt');
const multer = require('multer');

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
        return cb(null, "public/uploads2/");
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



//------------------------------------------------------C R E A T E--------------------------------------------------//
router.post("/post", upload.single("cv"), async(req, res) => {
    console.log(req.body)
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email

    const contno = req.body.contno
    const contno2 = await user.findOne({
        where: {
            contno: contno
        },
        attributes: ['contno']
    })
    if (contno2) {
        return res.send({
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
        return res.send({
            success: false,
            code: 400,
            message: "username already taken"
        })
    }
    const hash = req.body.password
    const password = await bcrypt.hash(hash, 5);
    console.log(req.body)
    console.log(req.file)

    try {
        const users = await user.create({ firstname, lastname, email, contno, username, password })
            //const education = await edu.create({user.id,degree,ins}) // loop will run...
        return res.send({
                success: true,
                code: 200
            })
            //res.json(users)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
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
    console.log(req.body); // Log the request body to see the updated user data

    const id = req.body.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const contno = req.body.contno;
    const username = req.body.username;
    const password = req.body.password;


    const user_update = await user.update({
        firstname: firstname,
        lastname: lastname,
        email: email,
        contno: contno,
        username: username,
        password: password
    }, {
        where: {
            id: id
        }
    })
    res.json({
        success: true,
        code: 200,
        message: "User updated"
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

router.post("/loginpost", async(req, res) => {
    console.log("loginpost")
    const username = req.body.username
    const password = req.body.password

    const usern = await user.findOne({
        where: {
            username: username
        },
        attributes: ['username', 'password']
    })


    if (!usern) {
        console.log("username invalid")
        res.send({
            success: false,
            code: 400,
            message: "Wrong username"
        })

    } else if (await bcrypt.compare(password, usern.password) == false) {
        //console.log("password error")
        res.send({
            success: false,
            code: 400,
            message: "Wrong password"
        })
        return
    } else {
        res.send({
            success: true,
            code: 200,
            message: "User log in successful"
        })
    }
})



//--------------------------------ADD EDu.------------------------//


router.post("/postaddedu", upload2.single("addedu"), async(req, res) => {
    console.log(req.body)
    const addedu_id = req.body.addedu_id
    const universityname = req.body.universityname
    const degreename = req.body.degreename
    const year = req.body.year

    try {
        const users2 = await user2.create({ addedu_id, universityname, degreename, year })
        return res.send({
            success: true,
            code: 200
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});




module.exports = router;