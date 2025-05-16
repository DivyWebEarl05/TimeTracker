import express from 'express';
import { 
    // appAdminSignUp,
    appAdminSignIn,
    getappAdminProfile,
    updateappAdminProfile,
    appAdminchangePassword,
    getAllUsers,
    getUserById
} from '../Controller/admin.Controller.js';
import { AppAdminprotect } from '../Middleware/authMiddleware.js';

const router = express.Router();

// router.post('/register', appAdminSignUp);
router.post('/login', appAdminSignIn);
router.get('/getadminprofile', AppAdminprotect, getappAdminProfile);
router.put('/updateprofile', AppAdminprotect, updateappAdminProfile);
router.put('/changepassword', AppAdminprotect, appAdminchangePassword);
router.get('/getallusers', AppAdminprotect, getAllUsers);
router.get('/getuser/:id', AppAdminprotect, getUserById);

export default router;