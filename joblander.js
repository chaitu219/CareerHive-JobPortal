const j1 = document.getElementById('nj');
const j2 = document.getElementById('nsl');
const j3 = document.getElementById('ne');
const j4 = document.getElementById('nl');
const j5 = document.getElementById('nnd');
const j6 = document.getElementById('nsk');

jobform.addEventListener('submit',e =>{
    const newjobValue = newjob.value.trim();
    const newsalaryValue = newsalary.value.trim();
    const newexperianceValue = newexperiance.value.trim();
    const newlocationValue = newlocation.value.trim();
    const newdescriptionValue = newdescription.value.trim();
    const newskillValue = newskill.value.trim();

    if(newjobValue === ''){
        e.preventDefault();
        alert("Mention Job Name");
    }else if(newsalaryValue === ''){
        e.preventDefault();
        alert("Mention Salary");
    }else if(newexperianceValue === ''){
        e.preventDefault();
        alert("Mention Experiance required for the job");
    }else if(newlocationValue === ''){
        e.preventDefault();
        alert("Mention Work Location");
    }else if(newdescriptionValue === ''){
        e.preventDefault();
        alert("Enter description of the job");
    }else if(newskillValue === ''){
        e.preventDefault();
        alert("Mention Skills required for the job");
    }
});



