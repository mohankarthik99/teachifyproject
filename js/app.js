(function(){
 const email=document.querySelector("#email");
const password=document.querySelector("#pass");
const login=document.querySelector("#login");
const emailsign=document.querySelector("#emailsign");
const passsign=document.querySelector("#passsign");
const adminsign=document.querySelector("#signup");
const adminpin=document.querySelector("#adminpin");
const nameassign=document.querySelector("#nameassign");
var signedUp=false;
const auth=firebase.auth();

login.addEventListener("click",function(event){
    event.preventDefault();
   if(((email.value)&&(password.value))==false){
    return alert("Please fill out all the fields");
  }

  $.LoadingOverlay("show");
const  txtEmail=email.value;
const txtpass=password.value;

const getpromise=auth.signInWithEmailAndPassword(txtEmail,txtpass);

getpromise.catch(function(error){
    $.LoadingOverlay("hide");

  alert(error.message);
})

});
/*realtime listener
*/

auth.onAuthStateChanged(function(authdata){
  console.log(authdata==firebase.auth().currentUser);
  if(authdata){
        $.LoadingOverlay("hide");

if(signedUp){
  alert("Successfully signed up"); 
   signedUp=false;
  window.open("home.html?name="+nameassign.value+"&","_self");
  return true;
}

      window.open("home.html","_self");
  }else{
    console.log("user not  valid");
  }
})

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.message);
  });

adminsign.addEventListener("click",function(event){
    event.preventDefault();
  if(((nameassign.value)&&(adminpin.value)&&(emailsign.value)&&(passsign.value))==false){
    return alert("Please fill out all the fields");
  }
  const pin=adminpin.value;
  if(pin!=1049){
      return alert("Admin pin is wrong");
  }
    $.LoadingOverlay("show");
  const email=emailsign.value;
  const password=passsign.value;
  auth.createUserWithEmailAndPassword(email,password).then(function(success){
    console.log(success);
    signedUp=true;
  }).catch(function(error){
      $.LoadingOverlay("hide");
    alert(error.code+" "+error.message);
  });

 

   
});

})();