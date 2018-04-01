  (function(){
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


const titlecard=document.querySelector('#titlecard');
const titletxt=document.querySelector('#titletxt');
const desccard=document.querySelector('#desccard');
const desctxt=document.querySelector('#desctxt');
  var p=document.querySelector("p");
  var txtbox=document.querySelector(".get");
  const pushcloud=document.querySelector("#pushcloud");

  const uploader=document.querySelector("#uploader");
  uploader.addEventListener("change",execute);

              const firestore=firebase.firestore();

  function execute(event){
          const store=firebase.storage();
    var formats={
      documents:["doc","docx","rtf","txt","odt","ppt","pptx","pdf","srt"],
      images:["jpeg","jpg","png","bmp","gif","tiff"]
               }
var metaData={
  contentType:"",
  size:""
}
    file=uploader.files[0];
        metaData.size=file.size;
      var type=file.name.substring(file.name.lastIndexOf(".")+1,file.name.length).toLowerCase();
var iterate= function(data,types){
formats[data].forEach((datas)=>{
            if(datas==type){
              metaData.contentType=types;
            }
});
}
      
iterate("documents","Docs");
iterate("images","images");

if(!(metaData.contentType)){
return ($('#myModal').modal('open'));
}
    var ref=store.ref('docs/'+file.name);

    var task=ref.put(file,metaData);

           task.on('state_changed',(snapshot)=>{
            document.querySelector("progress").value=(snapshot.bytesTransferred/snapshot.totalBytes*100);
           },function(error){
            alert("Something went wrong,Size must be lesser than 8mb"+error.message);
           },function complete(){
           console.log(task.snapshot.downloadURL);
           });



  }
function addData(){

  var reference=firestore.collection("Teacheruploads");
     
     reference.get().then((data)=>{
      console.log("entered");
      data.forEach((docs)=>{
         reference.doc(docs.id).update({
          'uploadInfo.uid':'someuserid'
         }).then(()=>{
          console.log("Successfully updated")
         }).catch((error)=>{
          console.log(error.message);
         })
        
      });
     }).catch((error)=>{
      p.innerHTML=error.message;
        p.style.color="red;"
     })

}


//Event listener for textbox title
titletxt.addEventListener("keyup",function(){
  titletxt.value?  titlecard.innerHTML=titletxt.value:titlecard.innerHTML="title";
});

desctxt.addEventListener("keyup",function(){
  desctxt.value?  desccard.innerHTML=desctxt.value:desccard.innerHTML="Let students know something about this";
})




  })();




  