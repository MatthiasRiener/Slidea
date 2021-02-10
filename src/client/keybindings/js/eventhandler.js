// This is where all events are

let optionscount = 0,
    oldval,
    jsondata;
var infoOuter;
var info, oldInfo = null;

var lastEvent;
var heldKeys = [];
let jsondataelem;
let keysPushed = [];
let dublicate = false;

$.getJSON("ajax/shortcuts.json", function (data) {
    jsondata = data;
    data.forEach(element => {
        $("#bindings").append($("#template").html());
        $("#bindings .displayname").eq(optionscount).text(element.displayname);
        if (element.keys.length > 0) {
            $("#bindings .keybindinginput").eq(optionscount).text(element.keys.join(' + ').replace('Key', '').replace(/([A-Z])/g, ' $1').trim());
        } else
            $("#bindings .keybindinginput").eq(optionscount).css('background-color', 'rgba(100, 198, 237, 0.4)');

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
                this.style.backgroundColor = 'rgba(100, 198, 237, 1)';
            if (oldInfo != this && oldInfo != null && oldInfo.dataset.dublicate != "true") {
                oldInfo.style.backgroundColor = 'rgba(100, 198, 237, .7)';
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
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

    if (findDuplicates(keysPushed).length !== 0) {
        dublicate = true;
    } else {
        dublicate = false;
        infoOuter.style.backgroundColor = 'rgba(100, 198, 237, 1)';
    }

    [...$(".keybindinginput")].forEach(keybindingelem => {
        if (keybindingelem.innerText === [...new Set(findDuplicates(keysPushed))].toString()) {
            keybindingelem.style.backgroundColor = "red"
            keybindingelem.dataset.dublicate = "true";
        } else {
            keybindingelem.style.backgroundColor = "rgba(100, 198, 237, .7)"
            keybindingelem.dataset.dublicate = "false";
        }
    });

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
    alert(jsondata)
});