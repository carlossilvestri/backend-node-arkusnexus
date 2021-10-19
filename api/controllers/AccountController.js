const { isObjAccountValid } = require("../functions/function");
const Account = require("../models/Account");
const Team = require("../models/Team");

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
  const {
    is_active,
    id_team_f,
    responsible_operations_name,
    name_client,
    account_name,
  } = req.body;
  let objAccount = {
    is_active,
    id_team_f,
    responsible_operations_name,
    name_client,
    account_name,
  };
  if (isObjAccountValid(objAccount)) {
    try {
      const team = await Account.create(objAccount);
      return res.status(200).json({
        ok: true,
        team,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  }

  return res.status(400).json({
    msg: "Bad Request: Please register a valid Account.",
  });
};

/*
==========================================
Get accounts: GET - /account Params: ?desde=0 (It will return an array of Accounts of maximum 10, using desde as a parameter) if the user did not send the desde parameter, desde will be 0 by default.
 The most recent ones first. (Order by DESC) 
==========================================
*/
exports.getAll = async (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  if (desde == 0 || desde > 0) {
    try {
      let accounts = await Account.findAll({
        limit: 10,
        offset: desde,
        order: [["createdAt", "DESC"]],
        where: {
            is_active: true
          },
        include: [
          {
            model: Team,
            as: "Team",
            required: true,
          },
        ],
      });
      const AccountsQuantity = accounts.length;
      return res.status(200).json({
        ok: true,
        account_quantity_for_the_request: AccountsQuantity,
        accounts,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Internal server error",
      });
    }
  } else {
    // 400 (Bad Request)
    return res.status(400).json({
      ok: false,
      msg: "Bad Request. The parameter desde (int) must be a number.",
    });
  }
};

/*
==========================================
                  Edit an account: 
PUT - /account/:id_account Body: (x-www-form-urlencoded)

is_active
id_account
id_team_f
responsible_operations_name
name_client
account_name
==========================================
*/
exports.editById = async (req, res) => {
  // Debugging
  const id_account = Number(req.params.id_account);
  // Get the data by a destructuring.
  const {
    is_active,
    id_team_f,
    responsible_operations_name,
    name_client,
    account_name,
  } = req.body;
  try {
    let account = await Account.findByPk(id_account);
    // Update data:
    account.is_active = is_active;
    account.id_team_f = id_team_f;
    account.responsible_operations_name = responsible_operations_name;
    account.name_client = name_client;
    account.account_name = account_name;
    account.updatedAt = new Date();
    //Metodo save de sequelize para guardar en la BDD
    const resultado = await account.save();
    if (!resultado) {
      return res.status(400).json({
        ok: false,
        msg: "There was an mistake, trying to save the account.",
        account,
      });
    }
    account = await Account.findByPk(id_account, {
        include: [
            {
              model: Team,
              as: "Team",
              required: true,
            },
          ],
    });
    return res.status(200).json({
      ok: true,
      msg: "account was updated",
      account,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

/*
==========================================
            Get a specific user by id.
GET - /account/:id_account
is_active
id_account
id_team_f
responsible_operations_name
name_client
account_name
==========================================
*/
exports.getById = async (req, res) => {
  let id_account = req.params.id_account;
  id_account = Number(id_account);
  if (!id_account || id_account <= 0) {
    return res.status(400).json({
      ok: false,
      message: "id_account is not valid.",
    });
  }
  // Find the account
  try {
    let account = await Account.findByPk(id_account, {
      include: [
        {
          model: Team,
          as: "Team",
          required: true,
        },
      ],
    });
    // If the user exists:
    if (account) {
      return res.status(200).json({
        ok: true,
        account,
      });
    }
    // I does not exist:
    return res.status(400).json({
      ok: false,
      message: "Could not find the account.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};
