const {leaveTypeService} = require("../services");

const createLeaveType = async (req,res)=>{

    try {
        const {label,value,description,color} = req.body;
    const orgId = req.user.orgId;

    const leaveType = await leaveTypeService.createLeaveType(label,value,description,color,orgId);
    res.status(201).json(leaveType);
    } catch (error) {

        res.status(500).json({message:error.message});
        
    }
}

const getLeaveTypes = async (req,res)=>{
    try {
        const orgId = req.user.orgId;
        const leaveTypes = await leaveTypeService.getLeaveTypes(orgId);
        res.status(200).json(leaveTypes);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const getLeaveTypeById = async (req,res)=>{
    try {
        const leaveTypeId = req.params.id;
        const orgId = req.user.orgId;
        const leaveType = await leaveTypeService.getLeaveTypeById(orgId,leaveTypeId);
        res.status(200).json(leaveType);
    } catch (error) {
            res.status(500).json({message:error.message});
    }
}

const updateLeaveType = async (req,res)=>{
    try {
        const leaveTypeId = req.params.id;
        const orgId = req.user.orgId;
        const {label,value,description,color} = req.body;
        const leaveType = await leaveTypeService.updateLeaveType(orgId,leaveTypeId,label,value,description,color);
        if(leaveType){
            res.status(200).json({
                message:"Leave Type Updated Successfully"
            });
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
const deleteLeaveType = async (req,res)=>{
    try {
        const leaveTypeId = req.params.id;
        const orgId = req.user.orgId;
        const leaveType = await leaveTypeService.deleteLeaveType(orgId,leaveTypeId);
        if(leaveType){
            res.status(200).json({
                message:"Leave Type Deleted Successfully"
            });
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const getleaveTypeDataForDropDown = async (req,res)=>{
    try {
        const orgId = req.user.orgId;
        const leaveTypes = await leaveTypeService.getLeaveTypes(orgId);
        const leaveTypeData = leaveTypes.map((leaveType)=>{
            return {
                label:leaveType.label,
                value:leaveType.value
            }
        })
        res.status(200).json(leaveTypeData);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
module.exports = {
    createLeaveType,
    getLeaveTypes,
    getLeaveTypeById,
    updateLeaveType,
    deleteLeaveType,
    getleaveTypeDataForDropDown
}