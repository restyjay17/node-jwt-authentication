const jwt = require('jsonwebtoken');
const getdate = require('../helpers/getdate');

const {
    verifyUser,
    getAllTasks,
    saveTaskDetails,
    saveTaskUser,
    checkTaskUser,
    updateTask,
    updateTaskStatus,
    updateTaskDetails,
    deleteTaskDetails
} = require('./service');

module.exports = {
    authenticate: (req, res) => {
        const body = req.body;

        if (!body.uname || !body.pword) {
            return res.status(401).json({
                status: 'error',
                response: 'Missing username or password'
            });
        }

        verifyUser(body, (err, results) => {
            if (err || !results) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Invalid user credentials.'
                });
            }

            // create jwt
            let jwtdata = {
                id: results.id,
                uname: results.uname,
                exp: Date.now() + 86400000 // 24 hours
            }
            const token = jwt.sign(jwtdata, process.env.JWT_KEY);

            return res.status(200).json({
                status: 'success',
                token
            });
        })
    },
    getTasks: (req, res) => {
        const header = req.headers;

        if (!header['authorization']) {
            return res.status(401).json({
                status: 'error',
                response: 'Missing access token.'
            });
        }

        try {
            const token = header['authorization'].replace('Bearer ', '');
            const verify = jwt.verify(token, process.env.JWT_KEY);

            if (!verify) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Access denied!'
                });
            }

            getAllTasks([], (err, results) => {
                if (err || !results) {
                    return res.status(401).json({
                        status: 'error',
                        response: 'Something went wrong while retrieving tasks!'
                    });
                }

                return res.status(200).json({
                    status: 'succcess',
                    response: results
                });
            })
        
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                response: error.name + ': ' + error.message
            });
        }
    },
    createTask: (req, res) => {
        const header = req.headers;
        const body = req.body;

        if (!header['authorization']) {
            return res.status(401).json({
                status: 'error',
                response: 'Missing access token.'
            });
        }

        try {
            const token = header['authorization'].replace('Bearer ', '');
            const verify = jwt.verify(token, process.env.JWT_KEY);

            if (!verify) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Access denied!'
                });
            }

            if (!body.task) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Missing data fields'
                });
            }

            const data = {
                task: body.task,
                uname: verify.uname,
                datetoday: getdate()
            };

            saveTaskDetails(data, (err, results) => {
                if (err || !results) {
                    return res.status(401).json({
                        status: 'error',
                        response: 'Something went wrong while saving task details!'
                    });
                }

                saveTaskUser({
                    task: results.insertId,
                    uname: verify.uname
                }, (err, results) => {
                    if (err || !results) {
                        return res.status(401).json({
                            status: 'error',
                            response: 'Something went wrong while saving task details!'
                        });
                    }
                })
                
                return res.status(200).json({
                    status: 'succcess',
                    response: "Task successfully created"
                });
            })

            
        
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                response: error.name + ': ' + error.message
            });
        }
    },
    assignTask: (req, res) => {
        const header = req.headers;
        const body = req.body;

        if (!header['authorization']) {
            return res.status(401).json({
                status: 'error',
                response: 'Missing access token.'
            });
        }

        try {
            const token = header['authorization'].replace('Bearer ', '');
            const verify = jwt.verify(token, process.env.JWT_KEY);

            if (!verify) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Access denied!'
                });
            }

            if (!body.task || !body.uname) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Missing data fields'
                });
            }

            const data = {
                task: body.task,
                uname: body.uname
            };

            saveTaskUser(data, (err, results) => {
                if (err || !results) {
                    return res.status(401).json({
                        status: 'error',
                        response: 'Something went wrong while saving task details!'
                    });
                }

                return res.status(200).json({
                    status: 'succcess',
                    response: 'Task successfully assigned to user'
                });
            })
        
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                response: error.name + ': ' + error.message
            });
        }
    },
    updateTask: (req, res) => {
        const header = req.headers;
        const body = req.body;

        if (!header['authorization']) {
            return res.status(401).json({
                status: 'error',
                response: 'Missing access token.'
            });
        }

        try {
            const token = header['authorization'].replace('Bearer ', '');
            const verify = jwt.verify(token, process.env.JWT_KEY);

            if (!verify) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Access denied!'
                });
            }

            if (!body.id) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Missing data fields'
                });
            }
            
            checkTaskUser({
                task: body.id,
                uname: verify.uname
            }, (err, results) => {
                if (err || !results || results.length === 0) {
                    return res.status(401).json({
                        status: 'error',
                        response: 'You are not qualified to update this task'
                    });
                }

                if (body.task && !body.status) {
                    updateTask({
                        task: body.task,
                        id: body.id
                    }, (err, results) => {
                        if (err || !results || results.length === 0) {
                            return res.status(401).json({
                                status: 'error',
                                response: 'Something went wrong while updating task!'
                            });
                        }
                
                        return res.status(200).json({
                            status: 'succcess',
                            response: 'Task successfully updated'
                        });
                    })
                } else if (!body.task && body.status) {
                    updateTaskStatus({
                        status: body.status,
                        id: body.id
                    }, (err, results) => {
                        if (err || !results || results.length === 0) {
                            return res.status(401).json({
                                status: 'error',
                                response: 'Something went wrong while updating task!'
                            });
                        }
                
                        return res.status(200).json({
                            status: 'succcess',
                            response: 'Task successfully updated'
                        });
                    })
                } else if (body.task && body.status) {
                    updateTaskDetails({
                        task: body.task,
                        status: body.status,
                        id: body.id
                    }, (err, results) => {
                        if (err || !results || results.length === 0) {
                            return res.status(401).json({
                                status: 'error',
                                response: 'Something went wrong while updating task!'
                            });
                        }
                
                        return res.status(200).json({
                            status: 'succcess',
                            response: 'Task successfully updated'
                        });
                    })
                }

            })
        
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                response: error.name + ': ' + error.message
            });
        }
    },
    deleteTask: (req, res) => {
        const header = req.headers;
        const param = req.query;

        if (!header['authorization']) {
            return res.status(401).json({
                status: 'error',
                response: 'Missing access token.'
            });
        }

        try {
            const token = header['authorization'].replace('Bearer ', '');
            const verify = jwt.verify(token, process.env.JWT_KEY);

            if (!verify) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Access denied!'
                });
            }

            if (!param.id) {
                return res.status(401).json({
                    status: 'error',
                    response: 'Missing data fields'
                });
            }
            
            checkTaskUser({
                task: param.id,
                uname: verify.uname
            }, (err, results) => {
                if (err || !results || results.length === 0) {
                    return res.status(401).json({
                        status: 'error',
                        response: 'You are not qualified to delete this task'
                    });
                }

                deleteTaskDetails(
                    param.id
                , (err, results) => {
                    if (err || !results || results.length === 0) {
                        return res.status(401).json({
                            status: 'error',
                            response: 'Something went wrong while deleting task!'
                        });
                    }
            
                    return res.status(200).json({
                        status: 'succcess',
                        response: 'Task successfully deleted'
                    });
                })

            })

            
        
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                response: error.name + ': ' + error.message
            });
        }
    }
}