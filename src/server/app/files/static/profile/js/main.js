$('.content-main-section').click(function() {
    var index = $(this).index();
    $('.content-container').removeClass("active");
    $('.content-container').eq(index).addClass("active");
})

/*
// dropzone test

$('#ppContainer').click(
    function () { $('#imgupload').trigger('click'); }
);

$('#secppContainer').click(
    function () { $('#imgupload').trigger('click'); }
);



$('#imgupload').on('change', function(evt) {
    var files = evt.target.files;
    var reader = new FileReader();

    reader.onload = function(fileData) {
        var img = fileData.target.result;


        sendRequestToServer({type: "POST", url: "/profile/uploadImage", data: {"img": img, "name": files[0].name, "lm": files[0].lastModified}}).then(data => {
            $('#ppContainer').css('background-image', 'url("' + data.res.img + '")');
            $('#secppContainer').css('background-image', 'url("' + data.res.img + '")');

        })
    }
    

    reader.readAsDataURL(files[0])
})
*/