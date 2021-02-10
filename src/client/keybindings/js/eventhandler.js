// This is where all events are

let optionscount = 0,
    oldval,
    jsondata,
    dublicate = false;
var infoOuter;
var info, oldInfo = null;

var lastEvent;
var heldKeys = [];
let jsondataelem;

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
            this.style.backgroundColor = 'rgba(100, 198, 237, 1)';
            if (oldInfo != this && oldInfo != null) {
                oldInfo.style.backgroundColor = 'rgba(100, 198, 237, .7)';
            }
            oldInfo = this;
            jsondataelem = element;
        });

        optionscount++;
    });
});

window.onkeydown = function (event) {
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

    $.grep(jsondata, function (n, i) {
        if (JSON.stringify(n.keys) === JSON.stringify(heldKeys) && n.name !== jsondataelem.name) {
            dublicate = true;
        } else {
            if (dublicate) return;
            infoOuter.style.backgroundColor = "rgba(100, 198, 237, 1)";
            info.data = heldKeys.join(' + ').replace('Key', '').replace(/([A-Z])/g, ' $1').trim();
            if (n.name === jsondataelem.name)
                n = jsondataelem

            console.log(jsondataelem)
        }
    });

    // jsondataelem.keys = heldKeys;


};

window.onkeyup = function (event) {
    lastEvent = null;
    heldKeys = [];

    if (dublicate)
        $.grep(jsondata, function (n, i) {
            if (n.name === jsondataelem.name) {
                infoOuter.style.backgroundColor = "rgba(100, 198, 237, 1)";
                info.data = n.keys.join(' + ').replace('Key', '').replace(/([A-Z])/g, ' $1').trim()
            }
        });

    dublicate = false;
};

$("#safe").click(function () {
    alert(jsondata)
});