jQuery(function($){

    var steps = $('.next-step');

    window.nextStep = function(num, args) {
        steps.hide().eq(num).show().trigger('next-step', args);
    };

    $('.prev-step').click(function(){
        var step = $(this).closest('.next-step');
        steps.hide().eq(steps.index(step) - 1).show();
    });

    //======================================================================

    var uploader = $('#fine-uploader').createFineUploader({
        multiple:   false,
        autoUpload: false,
        request: {
            endpoint: '/dialer/uploadFile'
        },
        validation: {
            allowedExtensions: ['csv']
        },
        callbacks: {
            onValidate: function(){
                $('#upload').prop('disabled', false);
            },
            onProgress: function(id, file, uploaded, total){
                $('#progress').css('width', uploaded * 100 / total + '%');
            },
            onComplete: function(id, file, response){

            }
        }
    });

    $('#file-form').submit(function(){
        $('#upload').prop('disabled', true);
        uploader.uploadStoredFiles();
        return false;
    });

    nextStep(0);
});