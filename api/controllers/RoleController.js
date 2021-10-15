const Role = require('../models/Role');

/*
==========================================
Registrar un role: POST - /role Body: (x-www-form-urlencoded) name
==========================================
*/
exports.register = async (req, res) => {
    const { name } = req.body;
    if (name != '' && name) {
        try {
            const role = await Role.create({
                name
            });
            return res.status(200).json({
                ok: true,
                role
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Internal server error'
            });
        }
    }

    return res.status(400).json({
        msg: 'Bad Request: Please register a valid level.'
    });
}