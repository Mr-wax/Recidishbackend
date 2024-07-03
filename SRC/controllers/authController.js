import cryptoHash from 'crypto';
import User from '../models/UserModel.js';
import {signUpValidator, signInValidator} from "../validators/authValidator.js";
import { formatZodError } from '../utils/errorMessage.js';
import generateTokenAndSetCookie from '../utils/genTokenAndSetCookies.js';

function hashValue(value) {
    const hash = cryptoHash.createHash('sha256');
    hash.update(value);
    return hash.digest('hex');
}
function comparePasswords(inputPassword, hashedPassword){
return hashValue(inputPassword) === hashedPassword;
}

export const signUp = async (req, res) => {
    const registerResults = signUpValidator.safeParse(req.body)
    if (!registerResults) {
        return res.status(400).json(formatZodError(registerResults.error.issues))
    }
    try{
        const {userName, phoneNumber, email} = req.body
        const user =await User.findOne({$or:[{userName},{email},{phoneNumber}]})
        if (user) {
            res.status(409).json({message:'User already exists', user})
        } else {
            const {
                name,
                userName,
                email,
                phoneNumber,
                password,
                confirmPassword,
                gender,
                bio,
            } = req.body

            if (password!== confirmPassword) {
                return res.status(400).json({message:'Passwords do not match'})
            };
            const encryption = hashValue(password)
            const newUser = new User({
                name,
                userName,
                password:encryption,
                email,
                phoneNumber,
                bio,
                gender
            })
            await newUser.save()
            res.status(200).json({message: 'User registered successfully',newUser})
            console.log('User registered successfully', newUser)
        }
      }  catch (error) {
            res.status(500).json({message:error.message})
            console.log('INTERNAL SERVER ERROR', error.message)
        }
    };
    export const signIn = async (req, res) => {
        const loginResults = signInValidator.safeParse(req.body)
        if(!loginResults) {
            return res.status(400).json(formatZodError(loginResults.error.issues))
        } try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({message:'User not found'})
            }
            const comparePass = comparePasswords(password,user.password)
            if (!comparePasswords){
                return res.status(400).json({message:'Incorrect password'})
            };
        
            const accesstoken = generateTokenAndSetCookie(user._id, res)
            res.status(200).json({message:'User logged in successfully', accesstoken})
            console.log('User logged in successfully', user)
        } catch (error) {
            res.status(500).json({message:error.message})
            console.log('INTERNAL SERVER ERROR', error.message)
        
}}
export const logout = async (req, res, next) =>{}