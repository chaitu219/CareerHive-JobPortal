// document.getElementById('mmm').addEventListener('click',function(){
//     alert("hello world")
// })

document.querySelector("#mmm").addEventListener("click",function(){
    document.querySelector(".container").classList.add("active");
});
    
document.querySelector(".container .close-btn").addEventListener("click",function(){
    document.querySelector(".container").classList.remove("active");
});
    
