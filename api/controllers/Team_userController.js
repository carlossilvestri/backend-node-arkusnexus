const Team_user = require('../models/Team_user');

/*
==========================================
Register an team_user: POST - /team_user Body: (x-www-form-urlencoded)
ending_date
beggining_date
id_user_f
id_team_f
id_team_user
==========================================
*/
exports.register = async (req, res) => {
    const { 
        ending_date,
        beggining_date,
        id_user_f,
        id_team_f,
        id_team_user } = req.body;
    let objTeamUser = { 
        ending_date,
        beggining_date,
        id_user_f,
        id_team_f,
        id_team_user }
    if (isObjTeamUserValid(objTeamUser)) {
        try {
            const team_user = await Team_user.create(objTeamUser);
            return res.status(200).json({
                ok: true,
                team_user
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Internal server error'
            });
        }
    }

    return res.status(400).json({
        msg: 'Bad Request: Please register a valid Team_user.'
    });
}

/**
 * Method: isObjTeamUserValid. Validate if the object sent through the API is valid / or not empty.
 * @param { 
 *      ending_date : Date,
        beggining_date : Date,
        id_user_f : int,
        id_team_f : int
    } objTeamUser 
 * @returns boolean
 */
const isObjTeamUserValid = (objTeamUser) => {
    console.log("TeamUser ", objTeamUser);
    let isValid = false;
    // Check for OBLIGATORY fields.
    if(
        objTeamUser.ending_date && objTeamUser.ending_date != '' 
    && objTeamUser.beggining_date && objTeamUser.beggining_date != ''
    && objTeamUser.id_user_f && objTeamUser.id_user_f != ''
    && objTeamUser.id_team_f && objTeamUser.id_team_f != ''
    ){
        isValid = true;
    }else{
        isValid = false; 
    }
    return isValid;
}