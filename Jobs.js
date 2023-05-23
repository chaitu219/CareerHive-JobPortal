const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/careerhiveDB"),{
    useNewUrlParser:true
}

const userSchema = mongoose.Schema({
    USERNAME:String,
    EMAIL:String,
    PASSWORD1:String,
    PASSWORD2:String,
    PHONENUMBER:Number,
    APPLIED: Object,
    SAVED: Object,
    FOLLOWING: Object
});
const user = new mongoose.model("user",userSchema);

const employeeSchema = mongoose.Schema({
    EMPCOMPANYNAME:String,
    EMPEMAIL:String,
    EMPPASSWORD1:String,
    EMPPASSWORD2:String,
    FOLLOWERS: Object,
    RATING: Object,
    END: String
});
const employee = new mongoose.model("employee",employeeSchema);

const profileSchema = mongoose.Schema({CLOUDMAIL: String,
    FULLNAME: String,DOB: String,CITY: String,
    SMN: String,GENDER: String,COUNTRY: String,
    EDUCATION: String,EMPLOYMENT: String,EXPERIANCE: Number,
    KEYSKILLS: String,PROJECTS: String,JOBINTREST: String
});

const profile = new mongoose.model("profile",profileSchema);

const jobdataSchema = mongoose.Schema({
    JOBMAIL: String,
    JOBCOMPANY: String,
    JOBNAME: String,
    JOBDATE: String,
    JOBSALARY: Number,
    JOBEXPERIANCE: Number,
    JOBLOCATION: String,
    JOBDESCRIPTION: String,
    JOBSKILLS: String,
    DEFAULT: String,
    APPLICANTS: Object
});

const jobdata = new mongoose.model("job",jobdataSchema);

app.get("/",function(req,res){
    res.render("HomePage.ejs");
});

app.post("/",function(req,res){
    res.render("HomePage.ejs");
});

app.get("/Register",function(req,res){
    res.render("Register",{message: ""})
});

app.get("/employer.html",function(req,res){
    res.sendFile(__dirname+"/employer.html");
});

app.get("/jobsection.ejs",async function(req,res){
    var alljobspage =await jobdata.find({DEFAULT: "alljobs"})
    res.render("jobsection",{ump:alljobspage})
});

app.get("/companysection.ejs",async function(req,res){
    var allcomppage =await employee.find({END:"allcomp"})
    res.render("companysection",{vmp:allcomppage})
})

app.post("/jobsdisplay",async function(req,res){
    var con1 = req.body.sfcomp;
    var con2 = req.body.sfexp;
    var sfresult= await jobdata.find({JOBCOMPANY: con1,JOBEXPERIANCE: con2})
    if(sfresult.length>0){
        res.render("jobdisplay",{wmp:sfresult})
    }
        res.render("Homepage")
});

app.post("/companyprofile",async function(req,res){
    var dec = req.body.cpro
    if(dec == "filter"){
        var Applymail = req.body.applymail;
        var Applyid = req.body.applyid;
        var apnamed = await user.find({EMAIL: Applymail})
        var apname = apnamed[0].USERNAME;
        var follow = apnamed[0].FOLLOWING;
        var abc = await jobdata.find({_id: Applyid})
        var apjobname = abc[0].JOBNAME;
        var Cpro = abc[0].JOBCOMPANY
        var abcd = abc[0].APPLICANTS;
        abcd[Applymail]=apname;
        await jobdata.updateOne({_id:Applyid},{$set:{APPLICANTS:abcd}});

        var apaplied = apnamed[0].APPLIED;
        apaplied[Applyid]=apjobname;
        await user.updateOne({EMAIL:Applymail},{$set:{APPLIED:apaplied}});
        var cfind = await jobdata.find({JOBCOMPANY: Cpro})
        var efind = await employee.find({EMPCOMPANYNAME: Cpro})
        var el = efind[0].EMPEMAIL
        var aml =await user.find({EMAIL: Applymail})
        var njobs= aml[0].APPLIED;
        var nsave= aml[0].SAVED;
        var fls = efind[0].FOLLOWERS
        res.render("companyprofile",{coc: follow,count: fls,elc: el,hhh:Cpro,secretMail:Applymail,imp: cfind,NJ: njobs,NS: nsave})
    }
    else if(dec == "saveit"){
        var Applymail = req.body.applymail;
        var Applyid = req.body.applyid;
        var apnamed = await user.find({EMAIL: Applymail})
        var follow = apnamed[0].FOLLOWING
        var apname = apnamed[0].USERNAME;
        var abc = await jobdata.find({_id: Applyid})
        var apjobname = abc[0].JOBNAME;
        var Cpro = abc[0].JOBCOMPANY
        var apsaved = apnamed[0].SAVED;
        apsaved[Applyid]=apjobname;
        await user.updateOne({EMAIL:Applymail},{$set:{SAVED:apsaved}});
        var cfind = await jobdata.find({JOBCOMPANY: Cpro})
        var efind = await employee.find({EMPCOMPANYNAME: Cpro})
        var el = efind[0].EMPEMAIL
        var aml =await user.find({EMAIL: Applymail})
        var njobs= aml[0].APPLIED;
        var nsave= aml[0].SAVED;
        var fls = efind[0].FOLLOWERS
        res.render("companyprofile",{coc: follow,count: fls,elc: el,hhh:Cpro,secretMail:Applymail,imp: cfind,NJ: njobs,NS: nsave})
    }
    else if(dec == "follow"){
        var umail = req.body.Umail
        var cname = req.body.Cname
        var  QQ = await user.find({EMAIL: umail})
        var njobs=QQ[0].APPLIED;
        var nsave=QQ[0].SAVED;
        var uname = QQ[0].USERNAME
        var WW = await employee.find({EMPCOMPANYNAME: cname})
        var cmail= WW[0].EMPEMAIL
        var follow = QQ[0].FOLLOWING
        follow[cmail]=cname
        await user.updateOne({EMAIL: umail},{$set:{FOLLOWING: follow}});
        var follower = WW[0].FOLLOWERS
        follower[umail]=uname
        await employee.updateOne({EMPEMAIL: cmail},{$set:{FOLLOWERS: follower}});
        var cfind = await jobdata.find({JOBCOMPANY: cname})
        res.render("companyprofile",{coc: follow,count: follower,elc: cmail,hhh: cname,secretMail: umail,imp: cfind,NJ: njobs,NS: nsave})
    }
    else if(dec=="review"){}
    else{
    var Cpro = req.body.cpro;
    var PRmail = req.body.promail
    var pml =await user.find({EMAIL:PRmail})
    var njobs= pml[0].APPLIED;
    var nsave= pml[0].SAVED;
    var follow=pml[0].FOLLOWING
    var efind = await employee.find({EMPCOMPANYNAME: Cpro})
    var el = efind[0].EMPEMAIL
    var cfind = await jobdata.find({JOBCOMPANY: Cpro})
    var fls = efind[0].FOLLOWERS
    res.render("companyprofile",{coc:follow,count: fls,elc: el,hhh:Cpro,secretMail:PRmail,imp: cfind,NJ: njobs,NS: nsave})
    }
})


app.post("/Applicants",async function(req,res){
    var Viewid = req.body.viewid;
    var vvid = await jobdata.find({_id: Viewid})
    var vvd = vvid[0].APPLICANTS

    res.render("practice",{vvap: vvd})
})

app.post("/viewonly",async function(req,res){
    var fimail = req.body.viewonly
    var zmp = await profile.find({CLOUDMAIL: fimail})
    var randdd = await user.find({EMAIL: fimail})
    res.render("viewonlyprofile",{vifonder: randdd,vifinder: zmp})
})

app.post("/appliedjobs",async function(req,res){
    var nedmail = req.body.viewappl
    var pml = await user.find({EMAIL: nedmail})
    var njobs= pml[0].APPLIED;
    var nsave=pml[0].SAVED;
    var ging= await jobdata.find({_id: Object.keys(njobs)})
    res.render("appliedjobs",{simp: ging,secretMail: nedmail,NJ: njobs,NS: nsave})
})

app.post("/savedjobs",async function(req,res){
    var nedmail = req.body.viewsaved
    var pml = await user.find({EMAIL: nedmail})
    var njobs= pml[0].APPLIED;
    var nsave=pml[0].SAVED;
    var ging= await jobdata.find({_id: Object.keys(nsave)})
    res.render("appliedjobs",{simp: ging,secretMail: nedmail,NJ: njobs,NS: nsave})
})












app.post("/userhome",async function(req,res){
    var logic = req.body.save;
    var hello =await jobdata.find({DEFAULT: "alljobs"})
    if(logic=="submit"){
        var loginmail = req.body.Loginmail
        var loginpassword = req.body.Loginpassword
        var eml =await user.find({EMAIL:loginmail})
        var usr = eml[0].USERNAME;
        
        if(eml[0].PASSWORD1 == loginpassword){
            var njobs= eml[0].APPLIED;
            var nsave= eml[0].SAVED;
            res.render("Jobseeker",{simp: hello,ussrname: usr,secretMail:loginmail,NJ: njobs,NS: nsave,message:"",Q1: "",Q2: "",Q3: ""})
            
            app.post("/userprofile",async function(req,res){
                async function chai(){
                    var cheese = req.body.HiddenMail;
                    var finder = await profile.find({CLOUDMAIL: cheese});
                    if(finder.length>0){
                        var pick1 = finder[0].FULLNAME;
                        var pick2 = finder[0].DOB;
                        var pick3 = finder[0].CITY;
                        var pick4 = finder[0].SMN;
                        var pick5 = finder[0].GENDER;
                        var pick6 = finder[0].COUNTRY;
                        var pick7 = finder[0].EDUCATION;
                        var pick8 = finder[0].EMPLOYMENT;
                        var pick9 = finder[0].EXPERIANCE;
                        var pick10 = finder[0].KEYSKILLS;
                        var pick11 = finder[0].PROJECTS;
                        var pick12 =finder[0].JOBINTREST;
                        let www =req.body.HiddenMail
                        async function f1(){
                        var eee =await user.find({EMAIL:www})
                        res.render("userprofile",{simp: hello,
                            fixedName:eee,newCode1:pick1,
                            newCode2:pick2,newCode3:pick3,
                            newCode4:pick4,newCode5:pick5,
                            newCode6:pick6,newCode7:pick7,
                            newCode8:pick8,newCode9:pick9,
                            newCode10:pick10,newCode11:pick11,newCode12:pick12,
                            load1:pick1,load2:pick2,
                            load3:pick3,load4:pick4,
                            load5:pick5,load6:pick6,
                            load7:pick7,load8:pick8,
                            load9:pick9,load10:pick10,load11:pick11,load12:pick12})
        
        
        
        
                            app.post("/updatedprofile",function(req,res){
                                var pick0 = req.body.cloud;
                                pick1 = req.body.code11;
                                pick2 = req.body.code12;
                                pick3 = req.body.code13;
                                pick4 = req.body.code14;
                                pick5 = req.body.code15;
                                pick6 = req.body.code16;
                                pick7 = req.body.code17;
                                pick8 = req.body.code18;
                                pick9 = req.body.code19;
                                pick10 = req.body.code20;
                                pick11 = req.body.code21;
                                pick12 = req.body.code22;
                    
                    
                                async function connection(){
                                const a = await profile.updateMany({CLOUDMAIL:pick0},{$set: {FULLNAME: pick1,DOB: pick2,CITY: pick3,
                                             SMN: pick4,GENDER: pick5,COUNTRY: pick6,
                                             EDUCATION: pick7,EMPLOYMENT: pick8,EXPERIANCE: pick9,
                                             KEYSKILLS: pick10,PROJECTS: pick11,JOBINTREST: pick12}})
                                }
                            connection();
                                
                    
                                res.render("userprofile",{
                                    fixedName:eee,newCode1:pick1,
                                    newCode2:pick2,newCode3:pick3,
                                    newCode4:pick4,newCode5:pick5,
                                    newCode6:pick6,newCode7:pick7,
                                    newCode8:pick8,newCode9:pick9,
                                    newCode10:pick10,newCode11:pick11,newCode12:pick12,
                                    load1:pick1,load2:pick2,
                                    load3:pick3,load4:pick4,
                                    load5:pick5,load6:pick6,
                                    load7:pick7,load8:pick8,
                                    load9:pick9,load10:pick10,load11:pick11,load12:pick12})
                    
                            })
                    }
                    f1();
                   
                    }else {
                        console.log(finder);
                        var pick1 = "";
                        var pick2 = "";
                        var pick3 = "";
                        var pick4 = "";
                        var pick5 = "";
                        var pick6 = "";
                        var pick7 = "";
                        var pick8 = "";
                        var pick9 = "";
                        var pick10 = "";
                        var pick11 = "";
                        var pick12 = "";
                        let www =req.body.HiddenMail
                        async function f1(){
                        var eee =await user.find({EMAIL:www})
                        res.render("userprofile",{
                            fixedName:eee,newCode1:pick1,
                            newCode2:pick2,newCode3:pick3,
                            newCode4:pick4,newCode5:pick5,
                            newCode6:pick6,newCode7:pick7,
                            newCode8:pick8,newCode9:pick9,
                            newCode10:pick10,newCode11:pick11,newCode12:pick12,
                            load1:pick1,load2:pick2,
                            load3:pick3,load4:pick4,
                            load5:pick5,load6:pick6,
                            load7:pick7,load8:pick8,
                            load9:pick9,load10:pick10,load11:pick11,load12:pick12})
        
        
        
        
                            app.post("/updatedprofile",function(req,res){
                                var pick0 = req.body.cloud;
                                pick1 = req.body.code11;
                                pick2 = req.body.code12;
                                pick3 = req.body.code13;
                                pick4 = req.body.code14;
                                pick5 = req.body.code15;
                                pick6 = req.body.code16;
                                pick7 = req.body.code17;
                                pick8 = req.body.code18;
                                pick9 = req.body.code19;
                                pick10 = req.body.code20;
                                pick11 = req.body.code21;
                                pick12 = req.body.code22;
                    
                                async function connection(){
                                    const a = await profile.create({CLOUDMAIL:pick0, FULLNAME: pick1,DOB: pick2,CITY: pick3,
                                        SMN: pick4,GENDER: pick5,COUNTRY: pick6,
                                        EDUCATION: pick7,EMPLOYMENT: pick8,EXPERIANCE: pick9,
                                        KEYSKILLS: pick10,PROJECTS: pick11,JOBINTREST: pick12});
                                    console.log(a);
                                }
                            connection();
                    
                    
                                res.render("userprofile",{
                                    fixedName:eee,newCode1:pick1,
                                    newCode2:pick2,newCode3:pick3,
                                    newCode4:pick4,newCode5:pick5,
                                    newCode6:pick6,newCode7:pick7,
                                    newCode8:pick8,newCode9:pick9,
                                    newCode10:pick10,newCode11:pick11,newCode12:pick12,
                                    load1:pick1,load2:pick2,
                                    load3:pick3,load4:pick4,
                                    load5:pick5,load6:pick6,
                                    load7:pick7,load8:pick8,
                                    load9:pick9,load10:pick10,load11:pick11,load12:pick12})
                    
                              
                            })
                    }
                    f1();
                    }    
                    
                }
                chai()

            })

        }else{
            res.send("invalid password");
        }
    }
    else if(logic=="unq"){
        var reccmail = req.body.recmail;
        var rml = await user.find({EMAIL: reccmail})
        var rsr = rml[0].USERNAME;
        var njobs= rml[0].APPLIED;
        var nsave= rml[0].SAVED;
        var ping = await profile.find({CLOUDMAIL: reccmail});
        var ping1 = ping[0].JOBINTREST;
        var ping2 = await jobdata.find({JOBNAME: ping1})
        if(ping2.length==0){
            res.render("Jobseeker",{simp:ping2,ussrname: rsr,secretMail: reccmail,NJ: njobs,NS: nsave,message:"No jobs to display here",Q1: "",Q2: "",Q3: ""})
        }
        else{
            res.render("Jobseeker",{simp:ping2,ussrname: rsr,secretMail: reccmail,NJ: njobs,NS: nsave,message:"",Q1: "",Q2: "",Q3: ""})
        }
        
    }
    else if(logic=="searchjobs"){
        var reccmail = req.body.recmail;
        var rml = await user.find({EMAIL: reccmail})
        var rsr = rml[0].USERNAME;
        var njobs= rml[0].APPLIED;
        var nsave= rml[0].SAVED;
        var C1=req.body.cri1;
        var C2=req.body.cri2;
        var C3=req.body.cri3;
        var CR = await jobdata.find({JOBNAME:C1,JOBCOMPANY:C2,$and: [ { JOBSALARY: { $gt: (C3-10) } }, { JOBSALARY: { $lte: (C3+10) } } ]})
        if(CR.length==0){
            res.render("Jobseeker",{simp:CR,ussrname: rsr,secretMail: reccmail,NJ: njobs,NS: nsave,message:"No jobs to display here.Try another Job/Company/Salary Range",Q1:C1,Q2:C2,Q3:C3})
        }
        else{
            res.render("Jobseeker",{simp:CR,ussrname: rsr,secretMail: reccmail,NJ: njobs,NS: nsave,message:"",Q1: C1,Q2:C2,Q3:C3})
        }
        
    }
    else if(logic=="filter"){
        var Applymail = req.body.applymail;
        var Applyid = req.body.applyid;
        var apnamed = await user.find({EMAIL: Applymail})
        var apname = apnamed[0].USERNAME;
        var abc = await jobdata.find({_id: Applyid})
        var apjobname = abc[0].JOBNAME;
        var abcd = abc[0].APPLICANTS;
        abcd[Applymail]=apname;
        await jobdata.updateOne({_id:Applyid},{$set:{APPLICANTS:abcd}});

            var apaplied = apnamed[0].APPLIED;
            apaplied[Applyid]=apjobname;
            await user.updateOne({EMAIL:Applymail},{$set:{APPLIED:apaplied}});

        var aml =await user.find({EMAIL: Applymail})
        var asr = aml[0].USERNAME
        var njobs= aml[0].APPLIED;
        var nsave= aml[0].SAVED;
        res.render("Jobseeker",{simp:hello,ussrname: asr,secretMail: Applymail,NJ: njobs,NS: nsave,message:"",Q1: "",Q2: "",Q3: ""})
    }
    else if(logic=="saveit"){
        var Applymail = req.body.applymail;
        var Applyid = req.body.applyid;
        var apnamed = await user.find({EMAIL: Applymail})
        var abc = await jobdata.find({_id: Applyid})
        var apjobname = abc[0].JOBNAME;
        var apsaved = apnamed[0].SAVED;
        // await user.updateOne({EMAIL: Applymail},{$unset: {"SAVED.Applyid": ""}})
        apsaved[Applyid]=apjobname;
        await user.updateOne({EMAIL:Applymail},{$set:{SAVED:apsaved}});

        var aml =await user.find({EMAIL: Applymail})
        var asr = aml[0].USERNAME
        var njobs= aml[0].APPLIED;
        var nsave= aml[0].SAVED;
        res.render("Jobseeker",{simp:hello,ussrname: asr,secretMail: Applymail,NJ: njobs,NS: nsave,message:"",Q1:"",Q2:"",Q3:""})
    }
    else if(logic=="foll"){
        var reccmail = req.body.recmail;
        var rml = await user.find({EMAIL: reccmail})
        var rsr = rml[0].USERNAME;
        var njobs= rml[0].APPLIED;
        var nsave= rml[0].SAVED;

        var fing = rml[0].FOLLOWING
        var fing1 = await jobdata.find({JOBMAIL: Object.keys(fing)})
        
        res.render("Jobseeker",{simp:fing1,ussrname: rsr,secretMail: reccmail,NJ: njobs,NS: nsave,message:"",Q1:"",Q2:"",Q3:""})
    }
    else if(logic=="home"){
        var Homemail = req.body.recmail
        var hml = await user.find({EMAIL:Homemail})
        var hsr = hml[0].USERNAME
        var njobs= hml[0].APPLIED;
        var nsave= hml[0].SAVED;
        res.render("Jobseeker",{simp:hello, ussrname: hsr,secretMail: Homemail,NJ: njobs,NS: nsave,message:"",Q1:"",Q2:"",Q3:""});
    }
    else{
        var Homemail = req.body.homemail
        var hml = await user.find({EMAIL:Homemail})
        var hsr = hml[0].USERNAME
        var njobs= hml[0].APPLIED;
        var nsave= hml[0].SAVED;
        res.render("Jobseeker",{simp:hello, ussrname: hsr,secretMail: Homemail,NJ: njobs,NS: nsave,message:"",Q1:"",Q2:"",Q3:""});
    }
      
})



app.post("/Register",async function(req,res){
    var username = req.body.UserName;
    var email = req.body.Email;
    var password1 = req.body.Password;
    var password2 = req.body.Password2;
    var phonenumber = req.body.Phnumber;
    // console.log(email);
    var hello =await jobdata.find({DEFAULT: "alljobs"})
    var picard =await user.find({EMAIL:email});
    if(picard.length==0){
        async function connection(){
            const a = await user.create({
                USERNAME:username,EMAIL:email,
                PASSWORD1:password1,PASSWORD2:password2,
                PHONENUMBER:phonenumber,
                APPLIED: [],
                SAVED: [],
                FOLLOWING: []
            });
        }
    connection();
    let reml =await user.find({EMAIL:email})
    var rrml = reml[0].EMAIL
    let rusr = reml[0].USERNAME;

    var njobs= reml[0].APPLIED;
    var nsave= reml[0].SAVED;
    res.render("Jobseeker",{simp: hello,ussrname: rusr,secretMail:rrml,NJ: njobs,NS: nsave,message: ""})
    app.post("/userprofile",async function(req,res){
        async function chait(){
            var cheese = req.body.HiddenMail;
            var finder = await profile.find({CLOUDMAIL: cheese});
            if(finder.length>0){
                var pick1 = finder[0].FULLNAME;
                var pick2 = finder[0].DOB;
                var pick3 = finder[0].CITY;
                var pick4 = finder[0].SMN;
                var pick5 = finder[0].GENDER;
                var pick6 = finder[0].COUNTRY;
                var pick7 = finder[0].EDUCATION;
                var pick8 = finder[0].EMPLOYMENT;
                var pick9 = finder[0].EXPERIANCE;
                var pick10 = finder[0].KEYSKILLS;
                var pick11 = finder[0].PROJECTS;
                var pick12 =finder[0].JOBINTREST;
                let www =req.body.HiddenMail
                async function f2(){
                var eee =await user.find({EMAIL:www})
                res.render("userprofile",{simp: hello,
                    fixedName:eee,newCode1:pick1,
                    newCode2:pick2,newCode3:pick3,
                    newCode4:pick4,newCode5:pick5,
                    newCode6:pick6,newCode7:pick7,
                    newCode8:pick8,newCode9:pick9,
                    newCode10:pick10,newCode11:pick11,newCode12:pick12,
                    load1:pick1,load2:pick2,
                    load3:pick3,load4:pick4,
                    load5:pick5,load6:pick6,
                    load7:pick7,load8:pick8,
                    load9:pick9,load10:pick10,load11:pick11,load12:pick12})




                    app.post("/updatedprofile",function(req,res){
                        var pick0 = req.body.cloud;
                        pick1 = req.body.code11;
                        pick2 = req.body.code12;
                        pick3 = req.body.code13;
                        pick4 = req.body.code14;
                        pick5 = req.body.code15;
                        pick6 = req.body.code16;
                        pick7 = req.body.code17;
                        pick8 = req.body.code18;
                        pick9 = req.body.code19;
                        pick10 = req.body.code20;
                        pick11 = req.body.code21;
                        pick12 = req.body.code22;
            
            
                        async function connection(){
                        const a = await profile.updateMany({CLOUDMAIL:pick0},{$set: {FULLNAME: pick1,DOB: pick2,CITY: pick3,
                                     SMN: pick4,GENDER: pick5,COUNTRY: pick6,
                                     EDUCATION: pick7,EMPLOYMENT: pick8,EXPERIANCE: pick9,
                                     KEYSKILLS: pick10,PROJECTS: pick11,JOBINTREST: pick12}})
                        }
                    connection();
                        
            
                        res.render("userprofile",{
                            fixedName:eee,newCode1:pick1,
                            newCode2:pick2,newCode3:pick3,
                            newCode4:pick4,newCode5:pick5,
                            newCode6:pick6,newCode7:pick7,
                            newCode8:pick8,newCode9:pick9,
                            newCode10:pick10,newCode11:pick11,newCode12:pick12,
                            load1:pick1,load2:pick2,
                            load3:pick3,load4:pick4,
                            load5:pick5,load6:pick6,
                            load7:pick7,load8:pick8,
                            load9:pick9,load10:pick10,load11:pick11,load12:pick12})
            
                    })
            }
            f2();
           
            }else {
                console.log(finder);
                var pick1 = "";
                var pick2 = "";
                var pick3 = "";
                var pick4 = "";
                var pick5 = "";
                var pick6 = "";
                var pick7 = "";
                var pick8 = "";
                var pick9 = "";
                var pick10 = "";
                var pick11 = "";
                var pick12 = "";
                let www =req.body.HiddenMail
                async function f2(){
                var eee =await user.find({EMAIL:www})
                res.render("userprofile",{
                    fixedName:eee,newCode1:pick1,
                    newCode2:pick2,newCode3:pick3,
                    newCode4:pick4,newCode5:pick5,
                    newCode6:pick6,newCode7:pick7,
                    newCode8:pick8,newCode9:pick9,
                    newCode10:pick10,newCode11:pick11,newCode12:pick12,
                    load1:pick1,load2:pick2,
                    load3:pick3,load4:pick4,
                    load5:pick5,load6:pick6,
                    load7:pick7,load8:pick8,
                    load9:pick9,load10:pick10,load11:pick11,load12:pick12})




                    app.post("/updatedprofile",function(req,res){
                        var pick0 = req.body.cloud;
                        pick1 = req.body.code11;
                        pick2 = req.body.code12;
                        pick3 = req.body.code13;
                        pick4 = req.body.code14;
                        pick5 = req.body.code15;
                        pick6 = req.body.code16;
                        pick7 = req.body.code17;
                        pick8 = req.body.code18;
                        pick9 = req.body.code19;
                        pick10 = req.body.code20;
                        pick11 = req.body.code21;
                        pick12 = req.body.code22;
            
                        async function connection(){
                            const a = await profile.create({CLOUDMAIL:pick0, FULLNAME: pick1,DOB: pick2,CITY: pick3,
                                SMN: pick4,GENDER: pick5,COUNTRY: pick6,
                                EDUCATION: pick7,EMPLOYMENT: pick8,EXPERIANCE: pick9,
                                KEYSKILLS: pick10,PROJECTS: pick11,JOBINTREST: pick12});
                            console.log(a);
                        }
                    connection();
            
            
                        res.render("userprofile",{
                            fixedName:eee,newCode1:pick1,
                            newCode2:pick2,newCode3:pick3,
                            newCode4:pick4,newCode5:pick5,
                            newCode6:pick6,newCode7:pick7,
                            newCode8:pick8,newCode9:pick9,
                            newCode10:pick10,newCode11:pick11,newCode12:pick12,
                            load1:pick1,load2:pick2,
                            load3:pick3,load4:pick4,
                            load5:pick5,load6:pick6,
                            load7:pick7,load8:pick8,
                            load9:pick9,load10:pick10,load11:pick11,load12:pick12})
            
                      
                    })
            }
            f2();
            }    
            
        }
        chait()

    })
    }
    else{
        res.render("Register",{message: "Email already in use. Use a different mail id to register"})
    }
    

})


/*----------------------------------------------------------------------------------------------------------------------------------------- */

app.post("/employerhomepage",async function(req,res){
    var inp = req.body.logged;
    if(inp == "Login"){
        var emplogeml = req.body.empeml
        var emplogpass = req.body.emppass
        var empEml =await employee.find({EMPEMAIL: emplogeml})
        var lpass = empEml[0].EMPPASSWORD1;
        var dnm = empEml[0].EMPCOMPANYNAME;
        if(lpass == emplogpass){
            res.render("emphome",{secretcmail: emplogeml,displayname: dnm})
            app.post("/joblander",function(req,res){
                // var today = new Date();
                // var options = {
                //     day: "numeric",
                //     month: "long",
                // }
                async function lawda(){
                    var dire=req.body.dir;
                    if(dire=="forward"){
                        var lddddmail=req.body.hiddenMail;
                    var sss = await jobdata.find({EMPEMAIL: lddddmail})
                    var lddddname = sss[0].EMPCOMPANYNAME

                    var zxc =await jobdata.find({JOBCOMPANY: lddddname})
                    // var day = today.toLocaleDateString("en-US",options);
                    var day = new Date();

                    res.render("joblander",{ldddmail: lddddmail,ldddname: lddddname,temp:zxc,kindOfDay: day})
                    }

                    else if(dire=="backward"){
                    // let Today = new Date();
                    // let Options = {
                        
                    //     month: "long",
                    //     day: "numeric"
                    // }
                    
                    // let day = Today.toLocaleDateString("en-us",Options)
                    let day = new Date();
                    var mail = req.body.cmpml;
                    var name = req.body.cmpnm;
                    var job = req.body.newJob;
                    var salary = req.body.newSalary;
                    var experiance = req.body.newExperiance;
                    var location = req.body.newLocation;
                    var description = req.body.newDescription;
                    var skill = req.body.newSkill;

                    async function connection(){
                        const b = await jobdata.create({
                            JOBMAIL: mail,
                            JOBCOMPANY: name,
                            JOBNAME: job,
                            JOBDATE: day,
                            JOBSALARY: salary,
                            JOBEXPERIANCE: experiance,
                            JOBLOCATION: location,
                            JOBDESCRIPTION: description,
                            JOBSKILLS: skill,
                            DEFAULT: "alljobs",
                            APPLICANTS: []
                        });
                        console.log(b);
                    }
                connection();
                var zxc =await jobdata.find({JOBCOMPANY: name})
                res.render("joblander",{ldddmail: mail,ldddname: name,temp:zxc,kindOfDay: day})

                    }
            }
                lawda();

            })
        }
        else{
            res.send("invalid password");
        }
    }else if(inp== "goback"){
        var mi = req.body.edokati;
        var dude = await employee.find({EMPEMAIL: mi})
        var bob = dude[0].EMPCOMPANYNAME
        res.render("emphome",{secretcmail: mi,displayname: bob})
    }else{
        var empcompanyname = req.body.EmpCompanyName;
        var empemail = req.body.EmpEmail;
        var emppassword1 = req.body.EmpPassword1;
        var emppassword2 = req.body.EmpPassword2;
        async function connection(){
            const c = await employee.create({EMPCOMPANYNAME:empcompanyname,EMPEMAIL:empemail,EMPPASSWORD1:emppassword1,EMPPASSWORD2:emppassword2,END: "allcomp",FOLLOWERS: [],RATING: []});
        }
    connection();
        res.render("emphome",{secretcmail: empemail,displayname: empcompanyname})
    }
})







app.listen(3000,function(){

    console.log("connection at port 3000 done!");
})
