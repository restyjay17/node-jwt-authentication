const pool = require('../config/database');
const { updateTask } = require('./contoller');

module.exports = {
    verifyUser: (data, callBack) => {
        pool.query(
            `SELECT * FROM users WHERE uname = ? and pword = ?`,
            [
                data.uname,
                data.pword
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }

                return callBack(null, results[0]);
            }
        )
    },
    getAllTasks: (data, callBack) => {
        pool.query(
            `SELECT * FROM tasks`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }

                return callBack(null, results);
            }
        )
    },
    saveTaskDetails: (data, callBack) => {
        pool.query(
            `INSERT INTO tasks (task, status) VALUES (?, ?)`,
            [
                data.task,
                1
            ],
            (error, results, fields) => {
                if (error) return callBack(error);

                return callBack(null, results);
            }
        )
    },
    saveTaskUser: (data, callBack) => {
        pool.query(
            `INSERT INTO task_users (task, user) VALUES (?, ?)`,
            [
                data.task,
                data.uname
            ],
            (error, results, fields) => {
                if (error) return callBack(error);

                return callBack(null, results);
            }
        )
    },
    checkTaskUser: (data, callBack) => {
        pool.query(
            `SELECT * FROM task_users WHERE task = ? AND user = ?`,
            [
                data.task,
                data.uname
            ],
            (error, results, fields) => {
                if (error) return callBack(error);

                return callBack(null, results);
            }
        )
    },
    updateTask: (data, callBack) => {        
        pool.query(
            'UPDATE tasks SET task = ? WHERE id = ?', 
            [
                data.task,
                data.id
            ],
            (error, results, fields) => {
                if (error) return callBack(error);

                return callBack(null, results);
            }
        )
    },
    updateTaskStatus: (data, callBack) => {        
        pool.query(
            'UPDATE tasks SET status = ? WHERE id = ?', 
            [
                data.status,
                data.id
            ],
            (error, results, fields) => {
                if (error) return callBack(error);

                return callBack(null, results);
            }
        )
    },
    updateTaskDetails: (data, callBack) => {        
        pool.query(
            'UPDATE tasks SET task = ?, status = ? WHERE id = ?', 
            [
                data.task,
                data.status,
                data.id
            ],
            (error, results, fields) => {
                if (error) return callBack(error);

                return callBack(null, results);
            }
        )
    },
    deleteTaskDetails: (id, callBack) => {
        pool.query(
            `DELETE FROM tasks WHERE id = ?`,
            [ parseInt(id) ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }

                return callBack(null, results)
            }
        )
    }
}