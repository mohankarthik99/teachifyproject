var cool=[];
var raj=[];
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
		console.log(querySnapshot);
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
					raj.push(querySnapshot);

querySnapshot.forEach((doc)=>{
	if(doc.exists){
		document.querySelector("#username").innerHTML=(doc.data().name);
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

var retrieveDocs=function(subs){
const dbRef=firestore.collection("Teacheruploads");
const year=document.querySelector("#year");
	var uploads={};
	for(let i=0;i<subs.length;i++){
	search=subs[i];
uploads[search]=dbRef.where("metaData.subject","==",search).orderBy("metaData.uploadTimeStamp","desc").get().then((snapshot)=>{
	var arrdocs=[];
		snapshot.forEach((doc)=>{
				var docs=doc.data();
			if(docs.metaData.year==year.value)
			{
			arrdocs.push(doc.data());
		}
			
			
		});
		return arrdocs;
	}).catch((error)=>{
    console.log(error.message);
	});
}

return uploads;
}

async function represent(year,dpt){
	var $barelement;
var $template;
var subjects=await getData(year,dpt);
var uploads=retrieveDocs(subjects);
console.log(uploads);
var flexita="";
if (subjects) {
	for(let i=0;i<subjects.length;i++){
  $barelement=$(" <div class='row'> <div class='col-md-12'><h2 class='fontsemibold text-center shade'>"+subjects[i]+"</h2> </div></div><div class='flexita'></div>")
	$(".mainpart").append($barelement.clone());
flexita=document.querySelectorAll(".flexita");

uploads[subjects[i]].then((data)=>{
var dataArr=[];
if(data.length>0){
data.forEach((data)=>{
Object.keys(data).forEach((doc)=>{
if(doc=="uploadInfo"){
dataArr.push([data[doc]["title"],data[doc]["comments"],data[doc]["filePath"],data[doc]["teacherName"]]);
}
});
});
for(let j=0;j<dataArr.length;j++){
$template=$("<div class='card'> <h3 style='color: #000' class='fontbold' id='titlecard'>"+dataArr[j][0]+"</h3> <div class='flexit'> <img class='cardimguser' src='images/image-file.png'> </div><h3 class='fontsemibold' style='color: #000;padding:5px 0px;'>Description</h3> <p class='text-center black fontsemibold' style='font-size: 1.4rem;padding: 10px' id='desccard'>"+dataArr[j][1]+"</p><a href="+dataArr[j][2]+" target='_blank'><button class='btn btn-info extend fontsemibold'>Download</button></a> <h4 class='fontsemibold black text-center'>Uploaded By"+dataArr[j][3]+"</h4></div>");
$(flexita[i]).append($template);
}

}
else{
	flexita[i].style.display="block";
	$(flexita[i]).html("<div class='row'><div class=\"col-md-12\"><p class=\"fontsemibold text-center black\">No documents are present for now!</p></div></div>");

/*"<div class=\"row\"><div class=\"col-md-12\"><p class=\"fontsemibold black\">No documents is present for now!</p></div></div>"
*/}

});
	}
	 $.LoadingOverlay("hide");
}
/*var $template;=$("<div class='card'> <h3 style='color: #000' class='fontbold' id='titlecard'>Title</h3> <div class='flexit'> <img class='cardimguser' src='images/image-file.png'> </div><h3 class='fontsemibold' style='color: #000;padding:5px 0px;'>Description</h3> <p class='text-center black fontsemibold' style='font-size: 1.4rem;padding: 10px' id='desccard'>Let students know what this is about here.......</p><a href=''><button class='btn btn-info extend fontsemibold'>Download</button></a> <h4 class='fontsemibold black text-center'>Uploaded by Rajamani</h4>
 </div>");
*/
	else{
	 throw 'Something went wrong';
	return (alert("Something went wrong Please retry"));
	}

}


//Uploads for teachers


var uploadpage=document.querySelector("#uploadpage");
uploadpage.addEventListener("click",(event)=>{
event.preventDefault();
window.open("uploads.html?uid="+document.querySelector('#username').innerHTML+"&","_self");
});


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