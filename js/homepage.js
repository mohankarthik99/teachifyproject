(function(){

  var slideout = new Slideout({             ///slideout menu
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 225,
    'tolerance': 70
  });
   document.querySelector('#cool').addEventListener('click', function() {
   	this.classList.toggle("is-active");
    slideout.toggle();
  });

 

var fixed = document.querySelector('.head');

slideout.on('translate', function(translated) {
  fixed.style.transform = 'translateX(' + translated + 'px)';
});

slideout.on('beforeopen', function () {
  fixed.style.transition = 'transform 300ms ease';
  fixed.style.transform = 'translateX(225px)';
});

slideout.on('beforeclose', function () {
  fixed.style.transition = 'transform 300ms ease';
  fixed.style.transform = 'translateX(0px)';
});

slideout.on('open', function () {
  fixed.style.transition = '';
});

slideout.on('close', function () {
  fixed.style.transition = '';
});
//----------------------------slideout menu---------------////


 var auth=firebase.auth();
const firestore=firebase.firestore();
const logout=document.querySelector("#logout"); 
var docref=firestore.collection("teachers");
const checkdetails=document.getElementById("checkdetails");
var signout=false;



auth.onAuthStateChanged((authdata)=>{ //Main controller
	if(authdata){
nameDecide(auth);
	}
	else{
		if(!(signout)){
		alert("Please Login first");
		window.location.href="index.html"
	}
	}
});


/*    Distinguishing between Signup and login and displaying the name of the user
*/var nameDecide=function(auth){
		var final="";
	if(location.search){
		return  function(){
				var replacement=location.search.replace(/%20/g,"");
				if(replacement.indexOf("%20")>=0){
					replacement.replace(/%20/g,"");
				}
	
           var start=replacement.indexOf("=");
           var checkPost=true;
	var end=replacement.indexOf("&");
	for(var i=start+1;i<end;i++){
		final+=replacement[i];
	}
	docref.where('UID',"==",auth.currentUser.uid).get().then(function(querySnapshot){
   querySnapshot.forEach((doc)=>{
	if(doc.data().UID==auth.currentUser.uid){
			checkPost=false;
			final=doc.data().name;
			}
    });
			
		if(checkPost){
			  docref.add({
    	'UID':auth.currentUser.uid,
    	'name':final,
    	'email':auth.currentUser.email
    }).catch((error)=>{
    	alert("Something went wrong"+error.message);
    });
	return nameSet(final);
	}// if new user

		return nameSet(final); ///return exist namee
	}).catch(function(error){
		alert("error"+error.message);
	});
	
		}();

	}
	else{
		return function(){
			return nameListener(auth); //Activate realtime listener for name and get the name
		}();
	}
}


//Realtime listener for name
function nameListener(auth){
	docref.where("UID","==",auth.currentUser.uid).onSnapshot((querySnapshot)=>{
querySnapshot.forEach((doc)=>{
	if(doc.exists){
		document.querySelector("#username").innerHTML="User->"+(doc.data().name);
}
});

},function(error){
		alert(error.message)
	});
}



//Generate html  subjects
checkdetails.addEventListener("click",function(){
		 $.LoadingOverlay("show");
$('.mainpart').html("");
const year=document.querySelector("#year");
const dpt=document.querySelector("#dpt");
represent(year.value,dpt.value);
});

function getData(year,dpt){ //getting the data and digging deep enough to get the subject names  to the subjects array
var details;
var subjects=[];
const dbRef=firestore.collection("subjects").doc(year);
return dbRef.get().then((doc)=>{
details=doc.data();
}).then(()=>{
	Object.keys(details).forEach((data)=>{
if(data=="cse"||data=="mech"||data=="ece"||data=="eee"){
if (data==dpt) {
Object.keys(details[data]).forEach((stream)=>{

Object.keys(details[data][stream]).forEach((streamdeep)=>{
if(streamdeep=="name"){console.log(details[data][stream][streamdeep]+"done");
	subjects.push(details[data][stream][streamdeep])}
});

});
}
else{
	return;
}
}
else{
Object.keys(details[data]).forEach((stream)=>{
if(stream=="name"){console.log(details[data][stream]+"done");
	subjects.push(details[data][stream])}
});

}

});
return subjects;
}).catch((error)=>{
alert(error.message);
});

}

async function represent(year,dpt){
	var $template=$("<div class='shade'><h3 style='color: white;'>Conputer hardware and servicing</h3></div><div class='row'><div class='container-fluid'><div class='col-md-4'><div class='card'><h3>Softcopy-1</h3><div class='placeholder'></div><p>Lorem ipsum dolquibusdam magni, cumque, aspernatur at et inventore ipsum, nemo ullam molestias magnam dolorum accusamus odio nihil, repellendus in provident numquam.</p></div></div><div class='col-md-4'><div class='card'><h3>Softcopy-2</h3><div class='placeholder'></div><p>Lorem ipsum dolor sit amet, consectetur adipinatur at et inventore ipsum, nemo ullam molestias magnam dolorum accusamus odio nihil, repellendus in provident numquam.</p></div></div><div class='col-md-4'><div class='card'><h3>Softcopy-2</h3><div class='placeholder'></div><p>Lorem ipsum dolor sit amet, consectetur aspernatur at et inventore ipsum, nemo ullam molestias magnam dolorum accusamus odio nihil, repellendus in provident numquam.</p></div> card end</div></div></div>");
	var subjects=await getData(year,dpt);
if (subjects) {
	for(i=0;i<subjects.length;i++){
	$(".mainpart").append($template.clone());
	}
	var subtags=document.querySelectorAll(".shade h3");
	for(i=0;i<subjects.length;i++){
		subtags[i].innerHTML=subjects[i];
	}
	 $.LoadingOverlay("hide");
}
	else{
	 throw 'Something went wrong';
	return (alert("Something went wrong Please retry"));
	}

}


//Uploads for teachers





logout.addEventListener("click",function(){ //Logout button
firebase.auth().signOut().then(function(){
        signout=true;
		alert("You have been signed out");
		window.open("index.html","_self");
	}).catch(function(error){
       console.log(error.message);
	});
});






})();