var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;
var currentContactIndex = 0;

// Functions
function viewCurrentContact() {
    currentContact = contactArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("nameID").value = currentContact.preferredName;
    document.getElementById("emailID").value = currentContact.email;
    document.getElementById("phoneID").value = currentContact.phoneNumber;
    document.getElementById("classID").value = currentContact.class;
    document.getElementById("cityID").value = currentContact.city;
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;

    // Todo: Add additional fields. DONE! I have added phone number and class.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex + 1) + " of " + contactArray.length;
}

function previous() {
    if (currentContactIndex > 0) {
        currentContactIndex--;
    } else if (currentContactIndex <= 0) {
        currentContact = contactArray[currentContactIndex];
    }
    document.getElementById('next').style.visibility = 'visible';
    viewCurrentContact();

    // Todo: Disable previous button when currentContactIndex equal to 0.       DONE!
    // Todo: Save changed items to contacts array and resort array.   DONE!
}

function next() {
    if (currentContactIndex < (contactArray.length - 1)) {
        currentContactIndex++;
    } else {
        currentContact = contactArray[currentContactIndex];
        document.getElementById('next').style.visibility = 'hidden';
    }
    viewCurrentContact();

    // Todo: Disable next button when there is no next item.    DONE!!
    // Todo: Save changed items to contacts array and resort array.  DONE!!
}

function add() {
    newContact = {
        preferredName: document.getElementById("nameID").value,
        email: document.getElementById("emailID").value,
        phoneNumber: document.getElementById("phoneID").value,
        class: document.getElementById("classID").value,
        city: document.getElementById("cityID").value,
        state: document.getElementById("stateID").value,
        zip: document.getElementById("zipID").value,
    };
    contactArray.push(newContact);
    viewCurrentContact();
    showContacts();
}

function remove() {
    console.log('remove()');
    if (contactArray.length > 1) {
        contactArray.splice(currentContactIndex, 1)
        if (currentContactIndex >= 1) {
            currentContactIndex = currentContactIndex - 1;
        }
        viewCurrentContact();
    } else {
        console.log("You must enter at least one contact")
    }
    showContacts();


    // Todo: Implement delete functionality by deleting element from array.   DONE!!
}

function zipFocusFunction() {
    console.log('focusFunction()');

    // Todo: Remove the function as it is not needed.
}

function zipBlurFunction() {
    getPlace();
}

function keyPressed() {
    console.log('keyPressed()');

    // This type of function should be useful in search as it implements keyPressed.
}

function getPlace() {
    var zip = document.getElementById("zipID").value
    console.log("zip:" + zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:" + result);
            var place = result.split(', ');
            if (document.getElementById("cityID").value == "" || document.getElementById("cityID").value == " ")
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "" || document.getElementById("stateID").value == " ")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

function initApplication() {
    console.log('Mustang v2 Lite - Starting!');
    loadIndex();
}

function loadIndex() {
    // Load the Mustang index file.
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        console.log("Index JSON:" + indexRequest.responseText);
        document.getElementById("indexID").innerHTML = indexRequest.responseText;
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i = 0; i < contactIndex.length; i++) {
            contactURLArray.push(contactIndex[i].ContactURL);
        }
        console.log("ContactURLArray: " + JSON.stringify(contactURLArray));
        loadContacts();
    }
    indexRequest.send();
}

function loadContacts() {
    // Clear the current contactArray.
    contactArray.length = 0;
    loadingContact = 0;

    // Note that W3C documentation and my experimentation indicate that each XMLHttpRequest callback function must be a 
    // unique instance of a function. A better implmentation would have had an array of callback functions instead of a 
    // recursive call to loadNextContact().
    if (contactURLArray.length > loadingContact) {
        loadNextContact(contactURLArray[loadingContact]);
    }
}

function loadNextContact(URL) {
    console.log("URL: " + URL);
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', URL);
    contactRequest.onload = function() {
        console.log(contactRequest.responseText);
        var contact;
        contact = JSON.parse(contactRequest.responseText);
        showContacts();
        console.log("Contact: " + contact.firstName);
        contactArray.push(contact);

        document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;

        loadingContact++;
        if (contactURLArray.length > loadingContact) {
            loadNextContact(contactURLArray[loadingContact]);
        } else {
            document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
            viewCurrentContact()

            //Todo: Sort contacts array.  DONE!!
        }
    }

    contactRequest.send();
}

function showContacts() {
    document.getElementById("contactsID").innerHTML = " ";
    for (i = 0; i < contactArray.length; i++) {
        var contactDiv = document.getElementById('contactsID');


        var contactLine = "Name: " + JSON.stringify(contactArray[i].preferredName) +
            "</br>" + "Phone Number: " + JSON.stringify(contactArray[i].phoneNumber) + "</br>" + "Class: " + JSON.stringify(contactArray[i].class) + "</br>" +
            "Email: " + JSON.stringify(contactArray[i].email) + "</br>" + "City: " + JSON.stringify(contactArray[i].city) + "</br>" +
            "State: " + JSON.stringify(contactArray[i].state) + "</br>" + "Zipcode: " + JSON.stringify(contactArray[i].zip) + "</br>" + "</br>" + "</br>";
        contactDiv.innerHTML += contactLine;
    }
}