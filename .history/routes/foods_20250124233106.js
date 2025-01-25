const express=require('express');
const router=express.Router();
const multer  = require('multer');   
const {storage}=require('../cloudinary');
const upload = multer({ storage });