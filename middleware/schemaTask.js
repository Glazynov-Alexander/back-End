const joi = require("joi");





module.exports = async (req, res, next) => {
    const schemaTask =  joi.object({
        textTask: joi.string().min(3).max(20).required(),
        taskChecked: joi.boolean(),
        symbol: joi.string()
    });

    const result = await schemaTask.validate(req.body);
    if (result.error) {
        return res.status(417).json({status: result.error.details[0].message});
    }
    next();
};

