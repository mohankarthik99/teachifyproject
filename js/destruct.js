(function(){
    const auth=firebase.auth();
    const firestore=firebase.firestore();
var signIn=false;
var signOut=false;
    auth.onAuthStateChanged((authdata) => { //Main controller
        if (authdata) {
            signIn = true;
            nameListener(auth);
        } else if (signIn == false) {
            window.location.href = "404.html"
        }
        else if (signOut) {
            window.location.href = "index.html"
        }
    });
    logout.addEventListener("click", function () { //Logout button
        firebase.auth().signOut().then(function () {
            signOut = true;
        }).catch(function (error) {
            console.log(error.message);
        });
    });

/*    Distinguishing between Signup and login and displaying the name of the user*/



    //Realtime listener for name
    function nameListener(auth) {
        const docref=firestore.collection("teachers");
        docref.where("UID", "==", auth.currentUser.uid).onSnapshot((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    document.querySelector("#username").innerHTML = (doc.data().name);
                }
            });

        }, function (error) {
            alert(error.message)
        });
    }



    document.querySelector("#terminate").addEventListener("click", function () {
        document.querySelector(".modal").style.display = "block";
        if (document.querySelector(".modal-content").classList.contains("zoomOut")) {
            document.querySelector(".modal-content").classList.replace("zoomOut", "zoomIn");
        }
        else {
            document.querySelector(".modal-content").classList.add("animated", "zoomIn");
        }
    });
    document.querySelector(".close button").addEventListener("click", function () {
        document.querySelector(".modal-content").classList.remove("animated", "zoomIn");
        document.querySelector(".modal-content").classList.add("animated", "zoomOut");

        setTimeout(function () { document.querySelector(".modal").style.display = "none"; }, 700)
    });

    window.onclick = function (event) {
        if (event.target == document.querySelector(".modal")) {
            document.querySelector(".modal").style.display = "none";
        }

    }

    var dBref=firestore.collection("subjects").doc("firstyear");

    firestore.runTransaction((transaction)=>{
        return transaction.get(dBref).then((data)=>{
            if(!(data.exists))
            {
                throw("Document doesnt exist");
            }
            return data.data().subject1.name.substring(0, data.data().subject1.name.length-3);
        }).then((datas)=>{
         transaction.update(dBref,{
            "subject1.name":datas
        });
        return datas;
        })
    }).then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    });
})();