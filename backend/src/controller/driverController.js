import driverModel from "../models/drivers.js"

const driverController = {};

driverController.getDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.find();
        return res.status(200).json(drivers)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

driverController.updateDrivers = async (req, res) => {
    try {
        let{
            name,
            lastName,
            licenseNumber,
            email,
            password,
            phone,
            isActive,
            isVerified,
            loginAttemps,
            timeOut
        } = req.body;

        name = name?.trim();
        email = email?.trim();

        if(!name || !email || !password){
            return res.status(400).json({message: "Fields required"})
        }

        if(name.length < 3 || name.length > 15){
            return res.status(400).json({message: "Please insert a valid name"})
        }

        const driverUpdated = await driverModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            licenseNumber,
            email,
            password,
            phone,
            isActive,
            isVerified,
            loginAttemps,
            timeOut
        }, 
        { new: true},);

        if(!driverUpdated){
            return res.status(404).json({message: "Driver not found"})
        }

        return res.status(200).json({message: "Driver Updated"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

driverController.deleteDriver = async (req, res) => {
    try{
        const deletedDriver = driverModel.findByIdAndDelete(req.params.id);

        if(!deletedDriver){
            return res.status(404).json({message: "Driver not found"})
        }

        return res.status(200).json({message: "Driver deleted"})
    } catch(error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default driverController;