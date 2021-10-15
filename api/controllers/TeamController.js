const Team = require('../models/Team');

/*
==========================================
Registrar un team: POST - /team Body: (x-www-form-urlencoded) name
==========================================
*/
exports.register = async (req, res) => {
    const { name } = req.body;
    if (name != '' && name) {
        try {
            const team = await Team.create({
                name
            });
            return res.status(200).json({
                ok: true,
                team
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