const express=require('express');
const router=express.Router();
const multer  = require('multer');   //https://github.com/expressjs/multer
const {storage}=require('../cloudinary');
const upload = multer({ storage });