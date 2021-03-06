// This is where all events are

let optionscount = 0,
    oldval,
    jsondata;
let infoOuter;
let info, oldInfo = null;

let lastEvent;
let heldKeys = [];
let jsondataelem;
let keysPushed = [];
let dublicate = false;

let highlightColor = 'rgba(100, 198, 237, 1)';
let outoffocusColor = 'rgba(100, 198, 237, 0.7)';
let emptyslotColor = 'rgba(100, 198, 237, 0.4)';
let dublicateColor = 'rgba(255,50,50,1)';
let dublicateoutoffocusColorColor = 'rgba(255,80,80,0.7)';

sendRequestToServer({type: "GET", url: "/keybinding/getKeybinding"}).then(data => {
    jsondata = data;
    data.res.bindings.forEach(element => {
        $("#bindings").append($("#template").html());
        $("#bindings .displayname").eq(optionscount).text(element.name);
        if (element.keys.length > 0) {
            $("#bindings .keybindinginput").eq(optionscount).text(element.keys.join(' + ').replace('Key', '').replace(/([A-Z])/g, ' $1').trim());
        } else
            $("#bindings .keybindinginput").eq(optionscount).css('background-color', emptyslotColor);

        $("#bindings .keybindinginput").eq(optionscount).on('focusin', function (event) {
            oldval = this.value;
            this.value = ""
            this.placeholder = "Press Any Key"
        });

        $("#bindings .keybindinginput").eq(optionscount).on('focusout', function (event) {
            if (this.value.trim().length == 0) {
                this.placeholder = "Empty"
                this.value = oldval
            }
        });

        $("#bindings .keybindinginput").eq(optionscount).click(function (event) {
            infoOuter = this;
            if (this.dataset.dublicate != "true")
                this.style.backgroundColor = highlightColor;
            else
                this.style.backgroundColor = dublicateColor;
            if (oldInfo != this && oldInfo != null && oldInfo.dataset.dublicate != "true") {
                oldInfo.style.backgroundColor = outoffocusColor;
            }
            if (oldInfo != this && oldInfo != null && oldInfo.dataset.dublicate == "true") {
                oldInfo.style.backgroundColor = dublicateoutoffocusColorColor;
            }
            oldInfo = this;
            jsondataelem = element;
        });

        optionscount++;
    });
});

window.onkeydown = async function (event) {
    if (lastEvent && lastEvent.keyCode == event.keyCode || heldKeys.length >= 3) {
        return;
    }
    if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();
    }
    infoOuter.innerText = "";
    info = infoOuter.appendChild(document.createTextNode(''));
    lastEvent = event;
    heldKeys.push(event.code);
    info.data = heldKeys.join(' + ').replace('Key', '').replace(/([A-Z])/g, ' $1').trim();
    [...$(".keybindinginput")].forEach(element => {
        keysPushed.push(element.innerText)
    });
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);

    [...$(".keybindinginput")].forEach(keybindingelem => {
        if (findDuplicates(keysPushed).indexOf(keybindingelem.innerText) !== -1) {
            keybindingelem.style.backgroundColor = dublicateoutoffocusColorColor;
            if (keybindingelem == infoOuter)
                keybindingelem.style.backgroundColor = dublicateColor;
            keybindingelem.dataset.dublicate = "true";
        } else {
            keybindingelem.style.backgroundColor = "rgba(100, 198, 237, .7)"
            keybindingelem.dataset.dublicate = "false";
        }
    });


    if (findDuplicates(keysPushed).length !== 0) {
        dublicate = true;
    } else {
        dublicate = false;
        infoOuter.style.backgroundColor = highlightColor;
    }

    keysPushed = [];

    jsondataelem.keys = heldKeys;

    $.grep(jsondata, function (n, i) {
        if (n.name === jsondataelem.name && !dublicate)
            n = jsondataelem
    });
};

window.onkeyup = function (event) {
    lastEvent = null;
    heldKeys = [];
};

$("#safe").click(function () {
    if (dublicate) return;
 
    
    sendRequestToServer({type: "POST", url: "/keybinding/saveKeybinding", data: {keybinding: JSON.stringify(jsondata.res.bindings)}}).then(data => {

      
    });
});

$('.back').click(function () {
   window.location = baseURL + "/editor"; 
});

