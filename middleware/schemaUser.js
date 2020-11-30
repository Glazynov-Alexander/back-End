const joi = require("joi");




module.exports = async (req, res, next) => {
    const schemaUser =  joi.object({
        name: joi.string().min(3).max(15).required(),
        password: joi.string().max(16).required()
    });
    const result = await schemaUser.validate(req.body);
    if (result.error) {
        return res.status(417).json({status: result.error.details[0].message});
    }
    next();
};

