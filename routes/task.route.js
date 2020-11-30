let express = require("express");
const router = express.Router();

const  tasks = require("../controllers/tasks");
const  checkToken = require("../middleware/auth");

router.get("/get/tasks", checkToken, tasks.getTasks);
router.put("/task/update",checkToken, tasks.update);
router.put("/tasks/updates",checkToken, tasks.updatesTasks);
router.post("/task/create",checkToken, tasks.createTask);

router.delete("/task/delete?:id",checkToken, tasks.deleteTask);
router.delete("/tasks/deletes?:symbol",checkToken, tasks.tasksDelete);


module.exports = router;