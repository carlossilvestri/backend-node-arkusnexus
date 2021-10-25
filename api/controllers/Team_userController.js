const { isObjTeamUserValid } = require('../functions/function');
const Team_user = require('../models/Team_user');
const Team = require('../models/Team');
const User = require('../models/User');

/*
==========================================
Register an team_user: POST - /team_user Body: (x-www-form-urlencoded)
ending_date
beggining_date
id_user_f
id_team_f
==========================================
*/
exports.register = async (req, res) => {
    const { 
        ending_date,
        beggining_date,
        id_user_f,
        id_team_f } = req.body;
    let objTeamUser = { 
        ending_date,
        beggining_date,
        id_user_f,
        id_team_f
        }
    if (isObjTeamUserValid(objTeamUser)) {
        try {
            const team_user_created = await Team_user.create(objTeamUser);
            if(team_user_created){
                const team_user = await Team_user.findByPk(team_user_created.id_team_user, {
                    include: [
                        {
                          model: Team,
                          as: "Team",
                          required: true,
                        },
                        {
                          model: User,
                          as: "User",
                          required: true,
                        },
                      ],
                });
                return res.status(200).json({
                    ok: true,
                    team_user
                });
            }
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

/*
==========================================
                  Edit an account: 
PUT - /team_user/:id_team_user Body: (x-www-form-urlencoded)

ending_date
beggining_date
id_user_f
id_team_f
==========================================
*/
exports.editById = async (req, res) => {
    const id_team_user = Number(req.params.id_team_user);
    // Get the data by a destructuring.
    const {
        ending_date,
        beggining_date,
        id_user_f,
        id_team_f
    } = req.body;
    try {
      let team_user = await Team_user.findByPk(id_team_user);
      // Update data:
      team_user.ending_date = ending_date;
      team_user.beggining_date = beggining_date;
      team_user.id_user_f = id_user_f;
      team_user.id_team_f = id_team_f;
      team_user.updatedAt = new Date();
      //Metodo save de sequelize para guardar en la BDD
      const result = await team_user.save();
      if (!result) {
        return res.status(400).json({
          ok: false,
          msg: "There was an mistake when trying to save the team_user.",
          team_user,
        });
      }
      team_user = await Team_user.findByPk(id_team_user, {
          include: [
              {
                model: Team,
                as: "Team",
                required: true,
              },
              {
                model: User,
                as: "User",
                required: true,
              },
            ],
      });
      return res.status(200).json({
        ok: true,
        msg: "Team_user was updated",
        team_user,
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
                  Edit an account: 
PUT - /team_user/:id_team_user Body: (x-www-form-urlencoded)

ending_date
beggining_date
id_user_f
id_team_f
==========================================
*/
exports.updateIsActive = async (req, res) => {
  const id_team_user = Number(req.params.id_team_user);
  // Get the data by a destructuring.
  const { is_active } = req.body;
  try {
    let team_user = await Team_user.findByPk(id_team_user);
    // Update data:
    team_user.is_active = is_active;
    team_user.updatedAt = new Date();
    //Metodo save de sequelize para guardar en la BDD
    const result = await team_user.save();
    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "There was an mistake when trying to save the team_user.",
        team_user,
      });
    }
    team_user = await Team_user.findByPk(id_team_user, {
        include: [
            {
              model: Team,
              as: "Team",
              required: true,
            },
            {
              model: User,
              as: "User",
              required: true,
            },
          ],
    });
    return res.status(200).json({
      ok: true,
      msg: "Team_user was updated",
      team_user,
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
Get Team_users: GET - /team_user Params: ?desde=0 (It will return an array of Team_users of maximum 10, using desde as a parameter) if the user did not send the desde parameter, desde will be 0 by default.
 The most recent ones first. (Order by DESC) 
==========================================
*/
exports.getAll = async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
  
    if (desde == 0 || desde > 0) {
      try {
        let team_users = await Team_user.findAll({
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
            {
              model: User,
              as: "User",
              required: true,
            },
          ],
        });
        const TeamUsersQuantity = team_users.length;
        return res.status(200).json({
          ok: true,
          team_user_quantity_for_the_request: TeamUsersQuantity,
          team_users,
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
Get Team_users: GET - /team_user_by_team_f/:id_team_f Params: ?desde=0 (It will return an array of Team_users of maximum 10, using desde as a parameter) if the user did not send the desde parameter, desde will be 0 by default.
 The most recent ones first. (Order by DESC) 
==========================================
*/
exports.getByTeamF = async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    const id_team_f = Number(req.params.id_team_f);
    if (desde == 0 || desde > 0) {
      try {
        let team_users = await Team_user.findAll({
          limit: 10,
          offset: desde,
          order: [["createdAt", "DESC"]],
          where: {
            id_team_f,
            is_active: true
          },
          include: [
            {
              model: Team,
              as: "Team",
              required: true,
            },
            {
              model: User,
              as: "User",
              required: true,
            },
          ],
        });
        const TeamUsersQuantity = team_users.length;
        return res.status(200).json({
          ok: true,
          team_user_quantity_for_the_request: TeamUsersQuantity,
          team_users,
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
Get Team_users: GET - /team_user_by_user_f/:id_user_f Params: ?desde=0 (It will return an array of Team_users of maximum 10, using desde as a parameter) if the user did not send the desde parameter, desde will be 0 by default.
 The most recent ones first. (Order by DESC) 
==========================================
*/
exports.getByUserF = async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    const id_user_f = Number(req.params.id_user_f);
    if (desde == 0 || desde > 0) {
      try {
        let team_users = await Team_user.findAll({
          limit: 10,
          offset: desde,
          order: [["createdAt", "DESC"]],
          where: {
            id_user_f,
            is_active: true
          },
          include: [
            {
              model: Team,
              as: "Team",
              required: true,
            },
            {
              model: User,
              as: "User",
              required: true,
            },
          ],
        });
        const TeamUsersQuantity = team_users.length;
        return res.status(200).json({
          ok: true,
          team_user_quantity_for_the_request: TeamUsersQuantity,
          team_users,
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

/* ==========================================
 Delete a team user: DELETE /team_user/:id_team_user Ejm. /team_user/1 
 ========================================== */
 exports.delete = async (req, res, next) => {
    const id_team_user = req.params.id_team_user;
    if (id_team_user) {
        try {
            const result = await Team_user.destroy({ where: { id_team_user } });
            if (!result) {
                return res.status(400).json({
                    ok: false,
                    msg: 'id_team_user not found.'
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Team_user was deleted'
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Internal server error.'
            });
        }
    } else {
        // Forbidden Action
        return res.status(403).json({
            ok: false,
            msg: 'id_team_user is obligatory.'
        });
    }
}
