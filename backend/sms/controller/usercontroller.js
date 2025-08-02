const user = require('../model/usermodel');
const product = require('../model/productmodel');
const bcrypt = require('bcrypt');

require("dotenv").config();
const jwt = require('jsonwebtoken');
const { get } = require('../router/userroute');

const createuser = async (req, res) => {
    console.log(req.body)
    console.log(req.files?.length ? req.files[0].path:null)
    
    try {
        const { username, name, address, email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const userExists = await user.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({success:false, message:"already exixt", error: "User already exists with this email" });
        }
        const image = req.files?.length ? req.files[0].path:null
        

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Use name if provided, otherwise use email as username
        const finalUsername = username || name || email.split('@')[0];
        const finalRole = role || 'admin'; // Default to admin for testing
        
        const newUser = await user.create({ 
            username: finalUsername, 
            address: address || "Default Address", 
            email, 
            password: hashedPassword,
            role: finalRole,
            Image: image 
        });
        return res.status(201).json({success:true, message:"user created",newUser});
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getallusers = async (req, res) => {
    console.log(req.headers.authorization);
    // const token = req.headers.authorization.split(" ")[1];
    try {
        const users = await user.findAll({attributes:{ exclude: ['password'] }});
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateuser = async (req, res) => {
    const userid = req.params.id;
    try {
        const userexists = await user.findByPk(userid);
        if (userexists) {
            const { username, address, email, password } = req.body;
            const image = req.files?.length ? req.files[0].path : null;
            const updatedUser = await user.update(
                { username, address, email, password,image },
                { where: { id: userid } }
            );
            return res.status(200).json(updatedUser);
        } else {
            return res.json({ error: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateuserbyself = async (req, res) => {
    const userid = req.user.id; // Assuming user ID is stored in req.user.id after authentication
    try {
        const userexists = await user.findByPk(userid);
        if (userexists) {
            const { username, address, email, password } = req.body;
            const image = req.files?.length ? req.files[0].path : null;
            const updatedUser = await user.update(
                { username, address, email, password, image },
                { where: { id: userid } }
            );
            return res.status(200).json(updatedUser);
        } else {
            return res.json({ error: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


const getuserbyid = async (req, res) => {
    const userid = req.params.id;
    try {
        const userexists = await user.findByPk(userid, { attributes: { exclude: ['password'] } });
        if (userexists) {
            return res.status(200).json(userexists);
        } else {
            return res.json({ error: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteuser = async (req, res) => {
    const userid = req.params.id;
    try {
        const userexists = await user.findByPk(userid);
        if (userexists) {
            const userexists = await user.destroy({
                where: { id: userid }
            });
            res.join({ 
                success: true, 
                message: "user deleted",deleteuser });
        } else {
            return res.json({ success:false, message:"User not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

const createProduct = async (req, res) => {
    console.log(req.body);
    try {
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const image = req.files?.length ? req.files[0].path : null;

        const newProduct = await product.create({ name, price, description, image });
        return res.status(201).json({ success: true, message: "Product created", newProduct });
    } catch (error) {
        console.error("Error creating product:", error);     
}
}

const getallproduct = async (req, res) => {
    console.log(req.headers.authorization);
    // const token = req.headers.authorization.split(" ")[1];
    try {
        const product = await product.findAll();
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = {
    createuser,
    getallusers,
    updateuser,
    deleteuser,
    getuserbyid,
    updateuserbyself,
    createProduct,
    getallproduct
};

