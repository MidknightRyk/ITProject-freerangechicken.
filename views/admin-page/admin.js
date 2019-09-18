/* Count the total number of artifact requests */
/* BUT this is not real-time value and it does include faded/deleted request...*/
var artiCount = $('.artifact-request').length;
//var userCount = $('.user-request').length;

$(document).ready(function(){


    // Show "deleted" text then the entire row fades out
    $(".user-delete-btn").on('click',function(){
        var user = !{JSON.stringify(user)};
        $.post('/user-delete', {id: user.ObjectID}, function(data, status){
            $(this).closest('tr').find(".text-center").text("deleted");
            $(this).closest('tr').fadeOut();
        })
    });



    // Show "uploaded" text then the entire row fades out
    $(".user-accept-btn").on('click',function(){
        var user = !{JSON.stringify(user)};
        $.post('/user-approve', {id: user.ObjectID}, function(data, status){
            $(this).closest('tr').find(".text-center").text("approved");
            $(this).closest('tr').fadeOut();
        })
    });

    // Show "deleted" text then the entire row fades out
    $(".arti-delete-btn").on('click',function(){
        var artifact = !{JSON.stringify(artifact)};
        $.post('/arti-delete', {id: artifact.ObjectID}, function(data, status){
            $(this).closest('tr').find(".text-center").text("deleted");
            $(this).closest('tr').fadeOut();
        })
    });



    // Show "uploaded" text then the entire row fades out
    $(".arti-accept-btn").on('click',function(){
        var user = !{JSON.stringify(artifact)};
        $.post('/arti-approve', {id: artifact.ObjectID}, function(data, status){
            $(this).closest('tr').find(".text-center").text("deleted");
            $(this).closest('tr').fadeOut();
        })
    });

    // Before Clicking
    $('#artifact-request-count').text(artiCount.toString());

    // Change the number of unread requests to 0 after clicking on "Artifact Request" button
    $("#pills-artifact-tab").on('click',function(){
        $('#artifact-request-count').text("0");
    });

    /*$('#user-request-count').text(userCount.toString());
    $("#pills-user-tab").on('click',function(){
        $('#user-request-count').text("0");
    });*/


});
