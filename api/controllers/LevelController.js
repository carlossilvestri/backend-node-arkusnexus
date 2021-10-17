const Level = require('../models/Level');

/*
==========================================
Registrar un level: POST - /level Body: (x-www-form-urlencoded) name
==========================================
*/
exports.register = async (req, res) => {
    const { name } = req.body;
    if (name != '' && name) {
        try {
            const level = await Level.create({
                name
            });
            return res.status(200).json({
                ok: true,
                level
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
Edit a level: PUT /level/:id_level Ejm. /level/1
name     (body)
id_level (params)
(x-www-form-urlencoded)
========================================== */
exports.edit = async (req, res) => {
    /*
    // Debugging...
    console.log("req.params ", req.params, "req.body ", req.body);
    */
    // Get the data:
    const id_level = req.params.id_level,
        name = req.body.name;
    if (id_level) {
        try {
            // Validar que no esten vacios los datos.
            if (name != '' && name) {
                const level = await Level.findOne({
                    where: {
                        id_level
                    }
                });
                //Cambiar el nombre del level:
                level.name = name;
                level.updatedAt = new Date();
                //Metodo save de sequelize para guardar en la BDD
                const resultado = await level.save();
                if (!resultado) return next();
                return res.status(200).json({
                    ok: true,
                    msg: 'Level was updated'
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
            msg: 'id_level is required'
        });
    }
}
/*==========================================
Get a specific level by id: GET /level/:id_level == NO TOKEN REQUIRED ==
==========================================*/
exports.getById = async (req, res) => {
    // Get the id_level.
    const id_level = Number(req.params.id_level);
    if (id_level) {
      try {
        const level = await Level.findByPk(id_level);
        if (!level) {
          return res.status(400).json({
            ok: false,
            msg: `No results of levels for id_level = ${id_level}`,
          });
        }
        return res.status(200).json({
          ok: true,
          level,
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
        msg: "Bad Request: Check your request, and id_level (int).",
      });
    }
  };
/* ==========================================
Get all levels (This end point does not have pagination because the idea is just to get the three levels - 1.- Bajo, 2.- Medio, 3.- Alto.): 
GET /level 
========================================== */
exports.getAll = async (req, res) => {
    // console.log(req);
    try {
        const levels = await Level.findAll({
            order: [
              ['createdAt', 'ASC']
            ],
        });
        return res.status(200).json({
            ok: true,
            levels
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
}

/* ==========================================
 Delete a level: DELETE /level/:id_level Ejm. /level/1 
 ========================================== */
exports.delete = async (req, res, next) => {
    /*
    // Debugging...
    console.log("req.params ", req.params, "req.body ", req.body);
    */
    const id_level = req.params.id_level;
    if (id_level) {
        try {
            const resultado = await Level.destroy({ where: { id_level } });
            if (!resultado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'id_level not found.'
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Level was deleted'
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
            msg: 'id_level is obligatory.'
        });
    }
}