(function () {
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    var signIn = false;
    var signOut = false;
    const pleaseWait = document.querySelector(".wait");
    const displaycontain = document.querySelector(".after");
    const formsubmit = document.querySelector("form");
    const progress = document.querySelector(".progress-bar")
    progress.style.width = "20%";
    progress.innerHTML = progress.style.width;
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
        const docref = firestore.collection("teachers");
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
    //Adding event listener to form submit

    var waitIndex = 0;
    var content;
    var waiting = setInterval(() => {
        console.log(waitIndex);
        content = pleaseWait.textContent;
        if (waitIndex < 4) {
            pleaseWait.textContent = content + ".";
            waitIndex += 1;
        }
        else {
            waitIndex = 0;
            pleaseWait.textContent = "Please wait"
        }
    }, 500);

    //modal window js
    for (index of document.querySelectorAll(".closes")) {
        index.addEventListener("click", function () {
            document.querySelector(".modal-content").classList.remove("animated", "zoomIn");
            document.querySelector(".modal-content").classList.add("animated", "zoomOut");

            setTimeout(function () {
                document.querySelector(".modal").style.display = "none";
            }, 700)
        });
    }
    window.onclick = function (event) {
        if (event.target == document.querySelector(".modal")) {
            document.querySelector(".modal").style.display = "none";
        }
        else if (event.target == document.querySelector(".proceed")) {
            processData();
        }

    }
    //--------------------------------------------------------///






    //SUBJECTS
    function getData(year, dpt) { //getting the data and digging deep enough to get the subject names  to the subjects array
        console.log(dpt + " received");
        var details;
        var subjects = [];
        const dbRef = firestore.collection("subjects").doc(year);
        return dbRef.get().then((doc) => {
            details = doc.data();
        }).then(() => {
            Object.keys(details).forEach((data) => {
                if (data == "cse" || data == "mech" || data == "ece" || data == "eee") {
                    if (data == dpt) {
                        Object.keys(details[data]).forEach((stream) => {

                            Object.keys(details[data][stream]).forEach((streamdeep) => {
                                if (streamdeep == "name") {
                                    console.log(details[data][stream][streamdeep]);
                                    subjects.push(details[data][stream][streamdeep])
                                }
                            });

                        });
                    }
                    else {
                        return;
                    }
                }
                else {
                    Object.keys(details[data]).forEach((stream) => {
                        if (stream == "name") {
                            console.log(details[data][stream]);
                            subjects.push(details[data][stream])
                        }
                    });

                }

            });
            return subjects;
        }).catch((error) => {
            alert(error.message);
        });

    }

    async function subjectFetch() {

        var subject = {
            firstyear: {},
            secondyear: {},
            thirdyear: {}
        }
        var departments = ["cse", "eee", "ece", "mech"];
        console.log("lol");
        subject.firstyear = await getData("firstyear", "cse");
        for (dept of departments) {
            subject.secondyear[dept] = await getData("secondyear", dept);
        }
        for (dept of departments) {
            subject.thirdyear[dept] = await getData("thirdyear", dept)
        }
        progress.style.width = "100%";
        progress.innerHTML = "100%"
        var delay = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(console.log("delay added"));
            }, 1000);
        });
        return delay.then((data) => {
            return subject;
        })
    }

    (async function domManipulate() {
        progress.style.width = "60%";
        progress.classList.replace("progress-bar-danger", "progress-bar-success");
        progress.innerHTML = progress.style.width;
        var subjectData = await subjectFetch();

        var cardData;
        Object.keys(subjectData).forEach((elem) => {

            if (Array.isArray(subjectData[elem])) {

                var card = document.createElement("div");
                card.classList.add("card");
                var innercontent = "<h3 class='fontbold text-center' style='color:black;'>Common</h3>";
                innercontent += "<div class='addition'><i class='fas fa-plus-circle fa-3x'></i></div><div class='detect'><i class='fas fa-minus-circle fa-3x'></i></div>";

                subjectData[elem].forEach((data, index) => {
                    innercontent += "<label>Subject " + (index + 1) + "</label><input type='text' class='form-control' value='" + data + "' required>";
                });

                card.innerHTML = innercontent;
                document.querySelector("#firstyear").appendChild(card);
                assignController("true");

            }

            else {



                Object.keys(subjectData[elem]).forEach((data, index) => {
                    var card = document.createElement("div");
                    card.classList.add("card");
                    var innercontent = "<h3 class='fontbold text-center' style='color:black;'>" + data + "</h3>";
                    innercontent += "<div class='addition'><i class='fas fa-plus-circle fa-3x'></i></div><div class='detect'><i class='fas fa-minus-circle fa-3x'></i></div>";
                    subjectData[elem][data].forEach((data, index) => {
                        innercontent += "<label>Subject " + (index + 1) + "</label><input type='text' class='form-control' value='" + data + "' required>";
                    });
                    card.innerHTML = innercontent;
                    document.querySelector("#" + elem).appendChild(card);

                    assignController("", cardData);

                });


            }

        });

        clearInterval(waiting);
        document.querySelector(".temp").style.display = "none";
        document.querySelector(".progress").style.display = "none";
        pleaseWait.style.display = "none";
        displaycontain.style.display = "block";
        document.querySelector(".afters").style.display = "flex";
    })();

    function assignController(data, card) {
        if (data) {
            document.querySelector(".addition").addEventListener("click", function () {
                var $template = $("<label>Subject " + ((document.querySelector("#firstyear .card").childNodes.length - 3) / 2 + 1) + "</label><input type='text' class='form-control' value='' required>");
                $("#firstyear .card").append($template);
            });
            document.querySelector(".detect").addEventListener("click", function () {
                if (document.querySelector("#firstyear .card").childNodes.length > 9) {
                    document.querySelector("#firstyear .card").removeChild(document.querySelector("#firstyear .card").childNodes[document.querySelector("#firstyear .card").childNodes.length - 1]);
                    document.querySelector("#firstyear .card").removeChild(document.querySelector("#firstyear .card").childNodes[document.querySelector("#firstyear .card").childNodes.length - 1]);
                }
                else {
                    alert("A minimum of three subjects is needed");
                }
            });
        }
        else {
            (function () {
                var addbtn = document.querySelectorAll(".addition");
                var currentPos = addbtn.length - 1;
                var card = document.querySelectorAll(".card");
                var detectbtn = document.querySelectorAll(".detect");

                addbtn[currentPos].addEventListener("click", function () {
                    var $template = $("<label>Subject " + ((card[currentPos].childNodes.length - 3) / 2 + 1) + "</label><input type='text' class='form-control' value='' required>");
                    $(card[currentPos]).append($template);
                });

                detectbtn[currentPos].addEventListener("click", function () {

                    if (card[currentPos].childNodes.length > 9) {

                        card[currentPos].removeChild(card[currentPos].childNodes[card[currentPos].childNodes.length - 1]);
                        card[currentPos].removeChild(card[currentPos].childNodes[card[currentPos].childNodes.length - 1]);
                    } else {
                        alert("A minimum of three subjects is needed");
                    }
                });

            })();
        }

    }
    function modalData(d) {
        d.preventDefault();
        document.querySelector(".modal").style.display = "block";
        if (document.querySelector(".modal-content").classList.contains("zoomOut")) {
            document.querySelector(".modal-content").classList.replace("zoomOut", "zoomIn");
        } else {
            if (!(document.querySelector(".modal-content").classList.contains("animated"))) {
                document.querySelector(".modal-content").classList.add("animated", "zoomIn");

            } else {
                document.querySelector(".modal-content").classList.add("zoomIn");
            }
        }

    }



    formsubmit.addEventListener("submit", modalData);

    function processData() {
        var cards = document.querySelectorAll(".card");
        var subjectDoc = {};
        subjectDoc.scheme = document.querySelector("input[type='text']").value;

        cards.forEach((data, index) => {
            if (index == 0) {
                console.log(data.childNodes.length);
                subjectDoc["backupfirstyear"] = {};
                for (let i = 3; i < data.childNodes.length; i++) {
                    if (i % 2 === 0) {
                        var label = data.childNodes[i - 1].innerHTML.replace(" ", "").toLowerCase();
                        var content = data.childNodes[i].value;
                        subjectDoc["backupfirstyear"][label] = {}
                        subjectDoc["backupfirstyear"][label]["name"] = content;
                    }
                }

            } else {

                var deptname = data.childNodes[0].innerHTML.toLowerCase();
                console.log(deptname);
                var year = "backup" + data.parentElement.id;
                if (!(subjectDoc[year])) {
                    subjectDoc[year] = {};
                }
                subjectDoc[year][deptname] = {};
                for (let i = 3; i < data.childNodes.length; i++) {
                    if (i % 2 === 0) {
                        var label = data.childNodes[i - 1].innerHTML.replace(" ", "").toLowerCase();
                        var content = data.childNodes[i].value;
                        subjectDoc[year][deptname][label] = {}
                        subjectDoc[year][deptname][label]["name"] = content;
                    }
                }
            }
        });
    }
    //Subjects
    //stack like architecture
    //uploads storage-->new random directory which will be used here on forth while
    //Teacher uploads collection

})();