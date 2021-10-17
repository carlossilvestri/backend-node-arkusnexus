const express = require("express");
const router = express.Router();

const UserController  = require("../../api/controllers/UserController");
const LevelController  = require("../../api/controllers/LevelController");
const RoleController  = require("../../api/controllers/RoleController");
const TeamController  = require("../../api/controllers/TeamController");
const AccountController  = require("../../api/controllers/AccountController");
const Team_userController  = require("../../api/controllers/Team_userController");

const swaggerDocumentOne = require('../../api/swagger-doc/swagger-one.json');
//Middleware para proteger las rutas.
const auth = require("../../api/middlewares/auth");
const auth2 = require("../../api/middlewares/auth2");
// Swagger
const swaggerUI = require("swagger-ui-express");
const { validarTodosLosCamposDelEstado, validarPatchDelEstado } = require("../../api/middlewares/stateValidation");
const { validateNewUser, validateEditUser } = require("../../api/middlewares/userValidation");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Administracion ArkusNexus API",
      version: "1.0.0",
      description: "Administracion ArkusNexus Api for code challenge 2",
      contact: {
        name: "Carlos Silvestri"
      },
    },
  },
  apis: ["./publicRoutes"],
};
module.exports = () => {
  /* SWAGGER */
  router.use('/api-docs-one', swaggerUI.serveFiles(swaggerDocumentOne, swaggerOptions), swaggerUI.setup(swaggerDocumentOne));
  /* USERS */
  router.get("/users", UserController.getUsers);
  /* LEVELS */
  router.post("/level", LevelController.register);
  router.get("/level", LevelController.getAll);
  router.get("/level/:id_level", LevelController.getById);
  router.put("/level/:id_level", LevelController.edit);
  router.delete("/level/:id_level", LevelController.delete);
  /* ROLES */
  router.post("/role", RoleController.register);
  router.get("/role", RoleController.getAll);
  router.get("/role/:id_role", RoleController.getById);
  router.put("/role/:id_role", RoleController.edit);
  router.delete("/role/:id_role", RoleController.delete);
  /* TEAMS */
  router.post("/team", TeamController.register);
  router.get("/team", TeamController.getTeams);
  router.get("/team/:id_team", TeamController.getById);
  router.put("/team/:id_team", TeamController.edit);
  router.delete("/team/:id_team", TeamController.delete);
  /* ACCOUNTS */
  router.post("/account", AccountController.register);
  /* TEAM_USERS */
  router.post("/team_user", Team_userController.register);
  // 
  // router.get("/users", UserController.getUsers);
  /* PRUEBAS */
  router.get("/", (req, res) => {
    res.send("inicio");
  });
  return router;
};
