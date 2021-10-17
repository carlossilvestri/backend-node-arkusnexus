const Team = require('../models/Team');

/*
==========================================
Register a team: POST - /team Body: (x-www-form-urlencoded) name
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
/* ==========================================
Get all teams with pagination: GET /team?desde=0
========================================== */
exports.getTeams = async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log(req);
    if (desde == 0 || desde > 0) {
      try {
        const teams = await Team.findAll({
          limit: 10,
          offset: desde,
          order: [["createdAt", "ASC"]]
        });
        if (!teams) {
          // 400 (Bad Request)
          return res.status(400).json({
            ok: false,
            msg: "No teams were found.",
          });
        }
        const team_quantity = teams.length;
        return res.status(200).json({
          ok: true,
          desde,
          team_quantity,
          teams,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Internal server error",
        });
      }
    } else {
      // 400 (Bad Request)
      return res.status(400).json({
        ok: false,
        msg: "The parameter is not valid.",
      });
    }
  };
/*==========================================
Get a specific teams by id: GET /team/:id_team == NO TOKEN REQUIRED ==
==========================================*/
exports.getById = async (req, res) => {
    // Obtener los datos por destructuring.
    const id_team = Number(req.params.id_team);
    // console.log(user);
    // console.log(req);
    if (id_team) {
      try {
        const team = await Team.findByPk(id_team);
        if (!team) {
          return res.status(400).json({
            ok: false,
            msg: `No results of teams for id_team = ${id_team}`,
          });
        }
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
    } else {
      // 400 (Bad Request)
      return res.status(400).json({
        ok: false,
        msg: "Bad Request: Check your request, and id_team (int).",
      });
    }
  };
/* ==========================================
Edit a team: PUT /team/:id_team Ejm. /team/1
name     (body)
id_team (params)
(x-www-form-urlencoded)
========================================== */
exports.edit = async (req, res) => {
    /*
    // Debugging...
    console.log("req.params ", req.params, "req.body ", req.body);
    */
    // Get the data:
    const id_team = req.params.id_team,
        name = req.body.name;
    if (id_team) {
        try {
            // Validar que no esten vacios los datos.
            if (name != '' && name) {
                const team = await Team.findOne({
                    where: {
                        id_team
                    }
                });
                //Cambiar el nombre del team:
                team.name = name;
                team.updatedAt = new Date();
                //Metodo save de sequelize para guardar en la BDD
                const resultado = await team.save();
                if (!resultado) return next();
                return res.status(200).json({
                    ok: true,
                    msg: 'Team was updated'
                });
            }
            return res.status(400).json({
                ok: false,
                msg: 'Bad Request'
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Internal server error'
            });
        }
    } else {
        // Accion prohibida. (Error)
        return res.status(403).json({
            ok: false,
            msg: 'id_team is required'
        });
    }
}

/* ==========================================
 Delete a team: DELETE /team/:id_team Ejm. /team/1 
 ========================================== */
 exports.delete = async (req, res, next) => {
    /*
    // Debugging...
    console.log("req.params ", req.params, "req.body ", req.body);
    */
    const id_team = req.params.id_team;
    if (id_team) {
        try {
            const resultado = await Team.destroy({ where: { id_team } });
            if (!resultado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'id_team not found.'
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Team was deleted'
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Internal server error.'
            });
        }
    } else {
        // Accion prohibida. (Error)
        return res.status(403).json({
            ok: false,
            msg: 'id_team is required.'
        });
    }
}