const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth')
const UserModel = require('../models/user')

// Registration Router
router.post('/register', async (req, res) => {

    const userDoc = new UserModel(req.body);
    
    try {
        await userDoc.save()
        const token = await userDoc.generateAuthToken()
        res.status(200).send({userDoc, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    
    try {
        const userDoc = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await userDoc.generateAuthToken()
        res.status(200).send({userDoc, token})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutall', auth, async (req,res) => {
    try {
        req.user.tokens = []
        req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/me', auth, async (req,res) => {
   res.send(req.user)
})


module.exports = router