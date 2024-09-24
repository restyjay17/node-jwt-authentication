const router = require('express').Router()

const {
    authenticate,
    getTasks,
    createTask,
    assignTask,
    updateTask,
    deleteTask
} = require('./contoller');

router.post('/authenticate', authenticate);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.post('/tasks/user', assignTask);
router.patch('/tasks', updateTask);
router.delete('/tasks', deleteTask);

module.exports = router;