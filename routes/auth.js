const { Router } = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypto = require("crypto")
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY }
}))
router.get("/login", async(req, res) => {
    res.render("auth/login", {
        title: "Авторизация",
        isLogin: true,
        loginError: req.flash("loginError"),
        registerError: req.flash("registerError")
    })
})
router.get("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login#login")
    })
})
router.post("/login", async(req, res) => {

    try {
        const { email, phone, password } = req.body

        const condidate = await User.findOne({ email, phone })
        if (condidate) {
            const areSame = await bcrypt.compare(password, condidate.password)

            if (areSame) {
                req.session.user = condidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect("/")
                })
            } else {
                req.flash("loginError", "Неверний пароль")
                res.redirect("/auth/login#login")
            }
        } else {
            req.flash("loginError", "Токого пользователя не существует")
            res.redirect("/auth/login#login")
        }
    } catch (e) {
        console.log(e)
    }
})
router.post("/register", async(req, res) => {
    try {
        const { name, email, phone, password } = req.body
        console.log(req.body)
        const condidate = await User.findOne({ email })
        if (condidate) {
            req.flash("registerError", "Пользователь с таким email уже существует")
            res.redirect("/auth/login#register")
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                name,
                email,
                phone,
                password: hashPassword,
                cart: { items: [] }
            })
            await user.save()
            await transporter.sendMail(regEmail(email))
            res.redirect("/auth/login#login")
        }

    } catch (e) {
        console.log(e)
    }
})



router.get("/reset", async(req, res) => {
    res.render("auth/reset", {
        title: "Reset",
        error: req.flash("error"),
    })
})




router.post("/reset", (req, res) => {
    try {
        crypto.randomBytes(32, async(err, buffer) => {
            if (err) {
                req.flash("error", "Problema")
                return res.redirect("/auth/reset")
            }
            const token = buffer.toString("hex")
            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect("/auth/login")
            } else {
                req.flash("error", "No email")
                res.redirect("/auth/reset")
            }
        })
    } catch (err) {
        console.log(err);
    }
})



router.get("/password/:token", async (req, res) => {
    if (!req.params.token) {
        return res.redirect("/auth/login")
    }
    try {
        async () => {
            const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        })
        if (!user) {
            return res.redirect("/auth/login")
        } else {
            res.render("auth/password", {
                title: "New password",
                error: req.flash("error"),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
        }
        
        


    } catch (error) {
        console.log(error);
    }

})
router.post("/password", async (req, res) => {
    try {
         const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
             res.redirect("/auth/login")
        } else {
            
            req.flash("loginError", "Token Deadline")
             res.redirect("/auth/login")

        }

        crypto.randomBytes(32, async(err, buffer) => {
            if (err) {
                req.flash("error", "Problema")
                return res.redirect("/auth/reset")
            }
            const token = buffer.toString("hex")
            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect("/auth/login")
            } else {
                req.flash("error", "No email")
                res.redirect("/auth/reset")
            }
        })
    } catch (err) {
        console.log(err);
    }
})

module.exports = router