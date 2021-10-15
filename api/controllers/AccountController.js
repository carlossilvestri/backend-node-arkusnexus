const Account = require('../models/Account');



/*
==========================================
Register an account: POST - /account Body: (x-www-form-urlencoded)
is_active
id_account
id_team_f
responsible_operations_name
name_client
account_name
==========================================
*/
exports.register = async (req, res) => {
    const { is_active, id_team_f, responsible_operations_name, name_client, account_name } = req.body;
    let objAccount = { is_active, id_team_f, responsible_operations_name, name_client, account_name }
    if (isObjAccountValid(objAccount)) {
        try {
            const team = await Account.create(objAccount);
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
        msg: 'Bad Request: Please register a valid Account.'
    });
}

/**
 * Method: isObjAccountValid. Validate if the object sent through the API is valid / or not empty.
 * @param { is_active : boolean, id_team_f : int, responsible_operations_name : string, name_client : string, account_name : string } objAccount 
 * @returns boolean
 */
const isObjAccountValid = (objAccount) => {
    console.log("objAccount ", objAccount);
    let isValid = false;
    // Check for OBLIGATORY fields.
    if(
        objAccount.id_team_f && objAccount.id_team_f != '' 
    && objAccount.responsible_operations_name && objAccount.responsible_operations_name != ''
    && objAccount.name_client && objAccount.name_client != ''
    && objAccount.account_name && objAccount.account_name != ''
    ){
        isValid = true;
    }else{
        isValid = false; 
    }
    return isValid;
}