
document.querySelector("#show-login").addEventListener("click",function(){
    document.querySelector(".popup").classList.add("active");
});

document.querySelector(".popup .close-btn").addEventListener("click",function(){
    document.querySelector(".popup").classList.remove("active");
});

const usermail = document.querySelector("#email");
const userpassword = document.querySelector("#password");




var swiper = new Swiper(".slide-content2", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
    },
  });











 
const openNavMenu = document.querySelector(".open-nav-menu"),
    closeNavMenu = document.querySelector(".close-nav-menu"),
    navMenu = document.querySelector(".nav-menu"),
    menuOverlay = document.querySelector(".menu-overlay"),
    mediaSize = 991;
  
    openNavMenu.addEventListener("click", toggleNav);
    closeNavMenu.addEventListener("click", toggleNav);
    // close the navMenu by clicking outside
    menuOverlay.addEventListener("click", toggleNav);
  
    function toggleNav() {
      navMenu.classList.toggle("open");
      menuOverlay.classList.toggle("active");
      document.body.classList.toggle("hidden-scrolling");
    }
  
    navMenu.addEventListener("click", (event) =>{
        if(event.target.hasAttribute("data-toggle") && 
          window.innerWidth <= mediaSize){
          // prevent default anchor click behavior
          event.preventDefault();
          const menuItemHasChildren = event.target.parentElement;
          // if menuItemHasChildren is already expanded, collapse it
          if(menuItemHasChildren.classList.contains("active")){
            collapseSubMenu();
          }
          else{
            // collapse existing expanded menuItemHasChildren
            if(navMenu.querySelector(".menu-item-has-children.active")){
            collapseSubMenu();
            }
            // expand new menuItemHasChildren
            menuItemHasChildren.classList.add("active");
            const subMenu = menuItemHasChildren.querySelector(".sub-menu");
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";
          }
        }
    });
    function collapseSubMenu(){
      navMenu.querySelector(".menu-item-has-children.active .sub-menu")
      .removeAttribute("style");
      navMenu.querySelector(".menu-item-has-children.active")
      .classList.remove("active");
    }
    function resizeFix(){
       // if navMenu is open ,close it
       if(navMenu.classList.contains("open")){
         toggleNav();
       }
       // if menuItemHasChildren is expanded , collapse it
       if(navMenu.querySelector(".menu-item-has-children.active")){
            collapseSubMenu();
       }
    }
  
    window.addEventListener("resize", function(){
       if(this.innerWidth > mediaSize){
         resizeFix();
       }
});
