  (function(){
    //NAVBAR//
   var slideout = new Slideout({
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
//-------------------------------------------------------------------------------------------------------------//---------------------------//--------------------//

const titlecard=document.querySelector('#titlecard');
const titletxt=document.querySelector('#titletxt');
const desccard=document.querySelector('#desccard');
const desctxt=document.querySelector('#desctxt');
var txtbox=document.querySelector(".get");
const pushcloud=document.querySelector(".form-upload");
const yearselect=document.querySelector("#uploadYear");
const deptselect=document.querySelector("#uploadDept");
const subselect=document.querySelector("#uploadSub");
const uploader=document.querySelector("#uploader"); //upload file element
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
console.log(input);
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

(function getData(){
  var yearvalue=yearselect.value;
  var deptvalue=deptselect.value;
  var subvalue=subselect.value;
  var descvalue=desctxt.value;
  var titlevalue=titletxt.value;
  var fileType=uploader.value.substring(uploader.value.lastIndexOf(".")+1,uploader.value.length);
  var fileDetails=[uploader.files[0],fileType,uploader.files[0].size,uploader.files[0].name];
  var validation=validate(fileDetails,yearvalue,deptvalue,subvalue,titlevalue,descvalue);

if(validation){
  console.log(validation);
  console.log("Time to push data");
}
else{
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
 console.log(docfind);
 var imagefind=formats.images.filter((data)=>{
    if(files[1]==data){
      return true;
    }
  });

if(docfind.length){
  metaData.contentType="Docs";
  return metaData;
}
else if(imagefind.length){
  metaData.contentType="images";
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

}
   

/*-----------------------------------------------------All event Listeners-------------------------------------------------------------------*/
pushcloud.addEventListener("submit",function(event){
  upload(event);
});

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




  