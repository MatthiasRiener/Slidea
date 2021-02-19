$( document ).ready(function() {
    getTasks();
});

function getTasks() {
    sendRequestToServer({type: "GET", url: "/task/getTasks"}).then(data => {
        console.log(data)

        initializeContainers();
        loadCalendar()
    
        initializePresentationContainers(data.res);
    
        loadBackgroundGrid();
        positionCursor();
    });
}

function getPresentations() {
    sendRequestToServer({type: "GET", url: "/task/getPresentations"}).then(data => {
        data.res.forEach(presentation => {
            $('#presentationOutput').append(`
                <div class="presentationPopup-bottom-presentations" data-presentation="${presentation._id}">${presentation.name}</div>
            `);
        });
    });
}

function checkPresentation(id) {
    sendRequestToServer({type: "POST", url: "/task/checkPresentation", data: {p_id: id}}).then(data => {
        $('#currentPresentation').text(data.pres.name);
        $('#currentPresentation').data('presentation', data.pres._id);
        $('#taskPopup-top-left').css('background', data.pres.color);
    
        $('#presentationPopup-top-current').text(data.pres.name);
        $('#presentationPopup-top-current').data('presentation', data.pres._id);
    });
}

function getUsers() {
    sendRequestToServer({type: "POST", url: "/task/getUsers", data: {p_id: $('#currentPresentation').data('presentation')}}).then(data => {
        console.log(data.res);
        data.res.forEach(user => {
            $('#userOutput').append(`
                <div class="personPopup-bottom-persons" data-user="${user._id}"><div class="personPopup-bottom-persons-image" style="background: url('${user.img}'); background-position: center; background-size: cover"></div>${user.name}</div>
            `);
        });
    });
}

function checkUser(id) {
    sendRequestToServer({type: "POST", url: "/task/checkUser", data: {u_id: id}}).then(data => {
        $('#currentUser').text(data.res.name);
        $('#currentUser').data('user', data.res._id);
        $('#personPopup-top-current-image').css('background', 'url(' + data.res.img + ')');
        $('#personPopup-top-current-image').css('background-size', 'cover');
        $('#personPopup-top-current-image').css('background-position', 'center');
    
        $('#popupCurrentUser').text(data.res.name);
        $('#popupCurrentUser').data('user', data.res._id);
        $('#taskPopup-fourth-left-image').css('background', 'url(' + data.res.img + ')');
        $('#taskPopup-fourth-left-image').css('background-size', 'cover');
        $('#taskPopup-fourth-left-image').css('background-position', 'center');
    });
}

let subtasks = [];

function createSubTask(status, name) {
    subtasks.push(status);
    subtasks.push(name)
}

function sendTaskData() {
    let task = {
        presentation: $('#currentPresentation').data('presentation'),
        name: $('#taskPopup-second-headline').text(),
        user: $('#currentUser').data('user'),
        start_date: $('#taskPopup-fifth-date-start').val(),
        end_date: $('#taskPopup-fifth-date-end').val(),
        subtasks: subtasks
    }

    sendRequestToServer({type: "POST", url: "/task/addTask", data: task}).then(data => {
        console.log("created task: " + data);
    });
}