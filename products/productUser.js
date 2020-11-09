const {Users} = require('../module/modules');


exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};


exports.brigada = async function (req, res) {
   await Users.find({}, (err, products) => {
    if(err) return  next(err)

       res.send(products)
   }).select("-__v").exec()
};

exports.obj = (req, res) => {
    let product = new Users({
        email: req.body.email, name: req.body.name
    })
    product.save((err) => {
        if(err) {
            return next(err)
        }
        res.send('you update collection')
    })
}

exports.eget = (req,res) => {
    Users.findById(req.params.id,  (err, product) => {
        if(err) return next(err)

        res.send(product)
    }).select("-__v").exec()
}