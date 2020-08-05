const express=require('express');
const path=require('path');
const port=8001;
// const fs=require('fs');
// const formiadable=require('formidable');

const db=require('./config/mongoose');
const Contact=require('./models/contact');




const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views1'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('assets'));


app.get('/',(req,res)=>{
    Contact.find({},(err,contacts)=>{
         if(err){
             console.log("Error in fetching contact from db");
             return;
         }
        contacts.sort((a,b)=>{
            return a.name.localeCompare(b.name);
        });
        return res.render('home',{ 
            title:"my contact list",
            contact_list: contacts
        });
    });
    
});

app.get('/search',(req,res)=>{
    let namePhone=req.query.NamePhone;
    let f=false;
    namePhone.toLowerCase();
    for(let i=0;i<namePhone.length;i++){
        if(namePhone[i]<'0'||namePhone[i]>'9'){
            f=true;
            break;
        }
    }
    if(f){
        Contact.find({},(err,contacts)=>{
            if(err){
                console.log("Error in fetching contact from db");
                return;
            }
            for(let i=0;i<contacts.length;i++){
                if(!contacts[i].name.includes(namePhone)){
                    contacts.splice(i,1);
                    i--;
                }
            }
            contacts.sort((a,b)=>{
                return a.name.localeCompare(b.name);
            });
            return res.render('home',{ 
               title:"my contact list",
               contact_list: contacts
           });
        });
    }else{
        Contact.find({},(err,contacts)=>{
            if(err){
                console.log("Error in fetching contact from db");
                return;
            }
            for(let i=0;i<contacts.length;i++){
                if(!contacts[i].phone.includes(namePhone)){
                    contacts.splice(i,1);
                    i--;
                }
            }
            contacts.sort((a,b)=>{
                return a.name.localeCompare(b.name);
            });
            return res.render('home',{ 
               title:"my contact list",
               contact_list: contacts
           });
        });
    }
});

app.post('/create-contact',(req,res)=>{
    let newName=req.body.name.toLowerCase();
    let newPhone=req.body.phone;
    Contact.create({
        name:newName,
        phone:newPhone},
        (err,newContact)=>{
        if(err){
            console.log("error in creating a contact");
            return;
        }
        return res.redirect('back');
    });
});
//for deleteing a conatct
app.get('/delete-contact',(req,res)=>{
    //get the query form url
    let id=req.query.id;
    Contact.findByIdAndDelete(id,(err)=>{
        if(err){
            console.log("error in deleting the contact");
            return;
        }else{
            console.log("contact deleted");
            return res.redirect('back');
        }
    });
    
    
});
app.listen(port,(err)=>{
    if(err){
        console.log("error");
    }
    console.log("Yup!my express server is running on port:",port);
});
