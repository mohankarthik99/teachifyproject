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
const firestore=firebase.firestore();

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
  }else{
    console.log("user not  valid");
  }
});

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
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

  auth.createUserWithEmailAndPassword(email,password).then((authdata)=>{
    const dbRef=firestore.collection('teachers');
    return dbRef.add({
      'UID':authdata.uid,
      'name': nameassign.value,
      'email': authdata.email
    })
  }).then(() => window.open("home.html", "_self")
 ).catch(function(error){
      $.LoadingOverlay("hide");
    alert(error.code+" "+error.message);
  });




});

})();