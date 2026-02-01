import User from "../models/user.model.js"
import generateToken from "../utils/generateToken.js"

export const registerUser = async(req, res) => {
    try{

        const {name, email, password} = req.body;

        if(!name, !email, !password) {
            return res.status(404).json({error: "All fields are required"})
        }

        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(404).json({error: "User already exists"})
        }

        const user = await User.create({name, email, password})
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                token: generateToken(user._id),
            });
    }catch(err) {
        res.status(500).json({error: err.message});
    }
}



export const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(400).json({error: "Invalid email or password"});
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })

    }catch(err) {
        res.status(500).json({error: err.message});
    }
}