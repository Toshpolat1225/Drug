const {
    Router
} = require('express')
const router = Router()
const Drug = require('../models/Drugs')
const auth = require("../middleware/auth")

router.get('/', async (req, res) => {
    const drugs = await Drug.find()
        .populate("userId", "email name")
        .select("sort model price img1 img2 img3 amount country")
    res.render('drugs', {
        title: 'Лекарственные препараты',
        isDrugs: true,
        drugs // massiv
    })
})

router.get('/:id', async (req, res) => {
    const drug = await Drug.findById(req.params.id) // obyekt
    res.render('drug', {
        layout: 'empty',
        title: `Drug model ${drug.total}`,
        drug
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        res.redirect('/')
    }
    const drug = await Drug.findById(req.params.id) // obyekt

    res.render('drug-edit', {
        title: `Редактировать`,
        drug
    })
})

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Drug.findByIdAndUpdate(id, req.body)
    res.redirect('/drugs')
})
router.post("/remove", auth, async (req, res)=>{
    try {
        await Drug.deleteOne({_id: req.body.id})
    res.redirect("/drugs")
    } catch(e){
        console.log(e, "drug js 48")
    }

})

module.exports = router