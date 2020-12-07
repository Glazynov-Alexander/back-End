const jwt = require("jsonwebtoken");
const { Tasks } = require("../models/task");

const getTasksUser = async (authorization) => {
  const token = await authorization.replace("Bearer ", "");
  const candidate = await jwt.decode(token);
  if (!candidate) return "not tasks";
  return await Tasks.find({ symbol: candidate.userId });
};

exports.tasksDelete = async function (req, res) {
  await Tasks.deleteMany({ taskChecked: true, symbol: req.query.symbol }, (err) => {
    if (err) return res.status(410).json({ taskChecked: true, status: "you not deletes tasks" });
  });
  return res.status(200).json({ taskChecked: true, status: "you deleted completed tasks" });
};

exports.deleteTask = async function (req, res) {
  await Tasks.deleteOne({ _id: req.query.id }, (err) => {
    if (err) return res.status(410).json({ status: "you not delete task" });
    return res.status(200).json({ id: req.query.id, status: "you delete one task" });
  });
};

exports.createTask = async (req, res, next) => {
  const product = new Tasks({
    taskChecked: req.body.taskChecked,
    textTask: req.body.textTask,
    symbol: req.body.symbol
  });
  product.save((err) => {
    if (err) {
      return next(err);
    }
    return res.status(201).json(product);
  });
};

exports.getTasks = async (req, res) => {
  const tasks = await getTasksUser(req.headers.authorization);
  if (tasks.length !== 0) return res.status(200).json({ tasks, status: "tasks" });
  return res.status(204).json({ status: "not tasks" });
};

exports.update = async (req, res) => {
  await Tasks.findOneAndUpdate({ _id: req.body.id }, { taskChecked: req.body.checked }, (err) => {
    if (err) return res.status(400);
    return res.status(200).json({ task: { taskChecked: req.body.checked, id: req.body.id }, status: "update task" });
  });
};

exports.updatesTasks = async (req, res) => {

  await Tasks.updateMany(req.body.checked === true ? { taskChecked: false } : { taskChecked: true }, { taskChecked: req.body.checked }, (err) => {
    if (err) return res.status(404).json({ status: "this task is not" });
    return res.status(200).json({ taskChecked: req.body.checked, status: "update tasks" });
  });
};
