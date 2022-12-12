const {userService } = require("../services");
const { createUserSchema } = require("../validations/userSchema");

const createUser = async (req, res) => {
    try{
        const { name,email,policyId } = req.body;
        let userData = {
            name,
            email,
            policyId,
            orgId: req.user.orgId
        }
        const user = await userService.createUser(userData);
        return res.status(200).json({
            message: "User created successfully",
            user
        });
    }catch(err){
        const Json = JSON.parse(err.message);
        res.status(500).json({
            ...Json,
        })
    }
}

const getUser = async (req, res) => {
    try{
        const user = await userService.getUser(req.params.id);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "User found",
            user
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getUsers = async (req, res) => {
    try{
        const users = await userService.getUsers(req.user.orgId,req.query.limit,req.query.page);
        if(!users){
            return res.status(404).json({
                message: "No users found"
            })
        }
        return res.status(200).json({
            message: "Users found",
            users
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const setUserLeaveBalance = async (req, res) => {
    try{
        const allowance = await userService.setLeaveAllowance(req.params.id, req.body.leaveType, req.body.amount);
        if(!allowance){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "User updated successfully",
            allowance
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const updateUser = async (req, res) => {
    try{
        const user = await userService.updateUser(req.params.id, req.body);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "User updated successfully",
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}
const deleteUser = async (req, res) => {
    try{
        const user = await userService.deleteUser(req.params.id);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "User deleted successfully",
            user

        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}
module.exports = {
    createUser,
    getUser,
    getUsers,
    setUserLeaveBalance,
    updateUser,
    deleteUser
}