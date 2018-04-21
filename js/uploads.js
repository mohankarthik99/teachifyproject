  (function(){
    //NAVBAR//
const auth=firebase.auth();
var signout=false;

auth.onAuthStateChanged((authdata)=>{
  if(authdata){
   if(!(location.search)){
        window.open("home.html","_self")
   }
  }
  else{
if(!(signout)){
    alert("Please Login first");
    window.location.href="index.html"
  }
  }
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


    var staffname=location.search.substring(location.search.indexOf("=")+1,location.search.lastIndexOf("&"));
    $('#username').html(staffname);
  
//-------------------------------------------------------------------------------------------------------------//---------------------------//--------------------//

const titlecard=document.querySelector('#titlecard');
const cardimg=document.querySelector(".cardimg");
const titletxt=document.querySelector('#titletxt');
const desccard=document.querySelector('#desccard');
const desctxt=document.querySelector('#desctxt');
const radiofile=document.querySelector('#fileok');
const radiolink=document.querySelector('#linkok');
var txtbox=document.querySelector(".get");
const pushcloud=document.querySelector(".form-upload");
const yearselect=document.querySelector("#uploadYear");
const deptselect=document.querySelector("#uploadDept");
const subselect=document.querySelector("#uploadSub");
const uploader=document.querySelector("#uploader"); //upload file element
const uploader1=document.querySelector("#uploader1"); //upload file element
const cardflip=document.querySelector(".cardupload");
const firestore=firebase.firestore();
const store=firebase.storage();

//Get the subjects from firebase
var subjects={

first:function(){
   const dbRef=firestore.collection('subjects').doc("firstyear");
        var subarr=[];
   return dbRef.get().then((doc)=>{
     var details=doc.data();
     
     Object.keys(details).forEach((data)=>{
     
     Object.keys(details[data]).forEach((stream)=>{
      if(stream=="name"){
        subarr.push(details[data][stream]);
      }
     })
     });

     return subarr;
   }).catch((error)=>{
    console.log(error.message);
   })

  }(),
  second:function(){
         const dbRef=firestore.collection('subjects').doc("secondyear");
       var subarr=[[],[],[],[]];
       var i=0;
   return dbRef.get().then((doc)=>{
     var details=doc.data();
     Object.keys(details).forEach((data)=>{
 Object.keys(details[data]).forEach((stream)=>{
     
     Object.keys(details[data][stream]).forEach((streamdata)=>{
      if(streamdata=="name"){
        subarr[i].push(details[data][stream][streamdata]);
      }
     })
     });
 i+=1;
     });
    
      return subarr;
   }).catch((error)=>{
    console.log(error.message);
   })
  }(),
   third:function(){
         const dbRef=firestore.collection('subjects').doc("thirdyear");
       var subarr=[[],[],[],[]];
       var i=0;
   return dbRef.get().then((doc)=>{
     var details=doc.data();
     Object.keys(details).forEach((data)=>{
 Object.keys(details[data]).forEach((stream)=>{
     
     Object.keys(details[data][stream]).forEach((streamdata)=>{
      if(streamdata=="name"){
        subarr[i].push(details[data][stream][streamdata]);
      }
     })
     });
 i+=1;
     });
          return subarr;
   }).catch((error)=>{
    console.log(error.message);
   })
  }()
}
                        //resolved promise in subjects object  
var updateSubjects=function(){
  var input=deptselect.value;
var year=yearselect.value;
var selectedDepartment=deptselect.selectedIndex-1;
var subarr;
if(year=="firstyear" && input!="Select the Department"){  //if loop to see first year
  subselect.innerHTML="";
subjects.first.then((data)=>{
   subarr=data;
  for(char of subarr){
    $(subselect).append(("<option value='"+char+"'>"+char+"</option>"));
  }
})
}

if(year=="secondyear" && input!="Select the Department"){
subselect.innerHTML="";
subjects.second.then((data)=>{
  subarr=data;
for(char of subarr[selectedDepartment]){
    $(subselect).append(("<option value='"+char+"'>"+char+"</option>"));
}

});

}

if(year=="thirdyear" && input!="Select the Department"){
subselect.innerHTML="";
subjects.third.then((data)=>{
  subarr=data;
for(char of subarr[selectedDepartment]){
    $(subselect).append(("<option value='"+char+"'>"+char+"</option>"));
}


});
}
}

var upload=function(event){
event.preventDefault();
  document.querySelector("#progress").style.width="0%";
  $('#progress').html('0%');

(function getData(){//needed data-year,sub,title,comments,filetype,uid the same
  var yearvalue=yearselect.value;
  var deptvalue=deptselect.value;
  var subvalue=subselect.value;
  var descvalue=desctxt.value;    //filename,size,type,file basically filedetails array
  var titlevalue=titletxt.value;
  var urltopost=uploader1.value;
  var downloadurl="";
   var fileType;
      var myUpload;

  if(radiofile.checked && uploader.value){

        fileType=uploader.value.substring(uploader.value.lastIndexOf(".")+1,uploader.value.length).toLowerCase();
    var fileDetails=[uploader.files[0],fileType,uploader.files[0].size,uploader.files[0].name];
  

    var validation=validate(fileDetails,yearvalue,deptvalue,subvalue,titlevalue,descvalue);

  if(validation){
  var dbRef=store.ref();

  if(yearvalue=="firstyear"){
    myUpload = dbRef.child("uploads/" + yearvalue + "/" + fileDetails[3]);
   var firstyearupload= myUpload.put(fileDetails[0],validation);

  firstyearupload.on('state_changed',function(snapshot){
  var rate=Math.floor((snapshot.bytesTransferred/snapshot.totalBytes*100));
  console.log(rate);
  if(rate<=90){
  document.querySelector("#progress").style.width=rate+"%";
  $('#progress').html(rate+"%");
 }


  },function(error){
  alert(error.message);
  },function(success){
    downloadurl=firstyearupload.snapshot.downloadURL;
    firebaseUpload(yearvalue,downloadurl,fileType,validation.size,titlevalue,descvalue,subvalue,myUpload.fullPath);
  });//realtimelistener
  }
  else{
    myUpload = dbRef.child("uploads/" + yearvalue + "/" + "/" + deptvalue + "/" + fileDetails[3]);
  var uploadyears=  myUpload.put(fileDetails[0],validation);
  uploadyears.on('state_changed',function(snapshot){

  var rate=snapshot.bytesTransferred/snapshot.totalBytes*100;
  document.querySelector("#progress").style.width=rate+"%";
  $('#progress').html(rate+"%");
  },function(error){
  alert(error.message);
  },function(success){
    downloadurl=uploadyears.snapshot.downloadURL;
    firebaseUpload(yearvalue,downloadurl,fileType,validation.size,titlevalue,descvalue,subvalue,myUpload.fullPath);
  });//realtimelistener
  }

 }
 else{
 $('#myModal').modal('show');
 }
 }
else if((radiolink.checked) && (uploader1.value) && (yearvalue!="Select the Year")&&(deptvalue!="Select the Department")&&(subvalue!="Please select the Department first")){
downloadurl=uploader1.value;
fileType="link";
let size="txtbytes";
    firebaseUpload(yearvalue,downloadurl,fileType,size,titlevalue,descvalue,subvalue,"youtube");


}
else{
       $("#finished").html("Please fill out all the fields");

  $('#myModal').modal('show');
}



})();

function validate(files,year,dept,sub,title,desc){
var formats={
  documents:["doc","docx","rtf","txt","odt","ppt","pptx","pdf","srt","zip","rar"],
  images:["jpeg","jpg","png","bmp","gif","tiff"]
      }
var metaData={
  contentType:"",
  size:files[2]
}
if((year!="Select the Year")&&(dept!="Select the Department")&&(sub!="Please select the Department first")){

 var docfind=formats.documents.filter((data)=>{
    if(files[1]==data){
      return true;
    }
  });
 var imagefind=formats.images.filter((data)=>{
    if(files[1]==data){
      return true;
    }
  });

if(docfind.length &&(metaData.size<8388608)){
  metaData.contentType="Docs";
  metaData.teacherName=staffname;
  return metaData;
}
else if(imagefind.length  &&(metaData.size<8388608)){
  metaData.contentType="images";
  metaData.teacherName=staffname;
  return metaData;
}
else{
  return false;//returning false if format is wrong
}

}//if condition end
else{
  return false;
}

}//validate function end

function firebaseUpload(year,downloadurl,filetype,filesize,titlevalue,descvalue,subvalue,fileRef){ //push to firestore
const dbRef=firestore.collection("Teacheruploads");
dbRef.add({
  metaData:{
  fileType:filetype,
  size:filesize,
  subject:subvalue,
  uploadTimeStamp:firebase.firestore.FieldValue.serverTimestamp(),
  year:year
  },
  uploadInfo:{
   comments:descvalue,
   filePath:downloadurl,
   fileRef:fileRef,
   title:titlevalue,
   uid:firebase.auth().currentUser.uid,
   teacherName:staffname
  }
}).then(()=>{
  document.querySelector("#progress").style.width="100%";
  $('#progress').html("100%");
  cardflip.classList.add("cardflip");
}).catch((error)=>{
  alert("something"+error.message);
});



}//firebase function end

}//upload function end

/*youtube thumbnail generation function
*/var youtubethumb=function(){
  if(uploader1.value.indexOf("youtube.com")>=0){
  let imgid=uploader1.value.substring(uploader1.value.indexOf("=")+1, uploader1.value.length);
  return "https://img.youtube.com/vi/"+imgid+"/0.jpg"
}
else{
  return "images/image-file.png";
}
}
/*-----------------------------------------------------All event Listeners-------------------------------------------------------------------*/
pushcloud.addEventListener("submit",function(event){
  upload(event);
});

radiofile.addEventListener("mousedown",function(){
if(!(radiofile.checked)){
cardimg.src="images/image-file.png";
}
});
radiolink.addEventListener("mousedown",function(){
cardimg.src=youtubethumb();
})


uploader1.addEventListener("blur",function(){
  var data=youtubethumb();
  if(cardimg.src!=data){
cardimg.src=data;
  }
});
document.querySelector("#reset").addEventListener("click",function(){
  yearselect.value="Select the Year";
  deptselect.value="Select the Department";
  subselect.value="Please select the Department first";
  subselect.innerHTML="<option selected='true' class='hidden'>Please select the Department first</option>";
  titletxt.value="";
  desctxt.value="";
  uploader1.value="";
  uploader.value="";
  cardflip.classList.remove("cardflip");
  titlecard.innerHTML="TITLE";
  desccard.innerHTML="Let students know what this is about";
})

deptselect.addEventListener("change",updateSubjects);

yearselect.addEventListener("change",updateSubjects);
//Event listener for textbox title
titletxt.addEventListener("keyup",function(){
  titletxt.value?  titlecard.innerHTML=titletxt.value:titlecard.innerHTML="title";
});

desctxt.addEventListener("keyup",function(){
  desctxt.value?  desccard.innerHTML=desctxt.value:desccard.innerHTML="Let students know something about this";
})




  })();




  