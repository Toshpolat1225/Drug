const {
    Router
} = require('express')
const router = Router()
const Drug = require('../models/Drugs')
const auth = require("../middleware/auth")

function isOwner(drug, req) {
   return drug.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try{
    const drugs = await Drug.find()
        .populate("userId", "email name")
        .select("sort model price img1 img2 img3 amount country")
    const userId =  req.user ? req.user._id.toString(): null
    console.log(drugs); //  [ {},  {},  {}]

    res.render('drugs', {
        title: 'Лекарственные препараты',
        isDrugs: true,
        userId,
        drugs // massiv
    })
    }catch(err){
        console.log(err);
    }
    
})

router.get('/:id', async (req, res) => {
    try {
        const drug = await Drug.findById(req.params.id) // obyekt
    res.render('drug', {
        layout: 'empty',
        title: `Drug model ${drug.total}`,
        drug
    })
        
    } catch (error) {
        console.log(error);
    }
    
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        res.redirect('/')
    }
    try {
        const drug = await Drug.findById(req.params.id) // obyekt

            if(!isOwner(drug, req)){
                return res.redirect("/drugs")
            }

        res.render('drug-edit', {
        title: `Редактировать`,
        drug
    })
    } catch (error) {
        console.log(error);
    }
})

router.post('/edit', auth, async (req, res) => {
    try {
         const {id} = req.body
    delete req.body.id
    const drug = await Drug.findById(id)
    if(!isOwner(drug, req)){
        return res.redirect("/drugs")
    }
    Object.assign(drug, req.body)
    await drug.save()
    res.redirect('/drugs')
        
    } catch (error) {
        console.log(error);
    }
})
router.post("/remove", auth, async (req, res)=>{
    try {
        await Drug.deleteOne({
            _id: req.body.id,
            userId: req.user._id
            })
    res.redirect("/drugs")
    } catch(e){
        console.log(e, "drug js 48")
    }

})

module.exports = router