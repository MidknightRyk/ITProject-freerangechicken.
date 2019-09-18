/* Count the total number of artifact requests */
/* BUT this is not real-time value and it does include faded/deleted request...*/

$(document).ready(function () {

    // Show 'deleted' text then the entire row fades out
    $('.user-delete-btn').on('click',function() {
        var userId = $(this).attr('data-id');
        $.ajax({
           method: 'POST',
           url: '/admin/user-delete',
           data: {"userId": userId}}).done(
               function (data) {
                   if (data === userId){
                       $(this).closest('tr').find('.text-center').text('Rejected');
                       $(this).closest('tr').fadeOut();
                   }
              }
        );
    });



    // Show 'uploaded' text then the entire row fades out
    $('.user-accept-btn').on('click',function(){
        var userId = $(this).attr('data-id');
        $.ajax({
           method: 'POST',
           url: '/admin/user-approve',
           data: {"userId": userId}}).done(
               function (data) {
                   if (data === userId){
                       $(this).closest('tr').find('.text-center').text('Approved');
                       $(this).closest('tr').fadeOut();
                   }
              }
        );
    });

    // Show 'deleted' text then the entire row fades out
    $('.arti-delete-btn').on('click',function(){
        var userId = $(this).attr('data-id');
        $.ajax({
           method: 'POST',
           url: '/admin/arti-delete',
           data: {"userId": userId}}).done(
               function (data) {
                   if (data === userId){
                       $(this).closest('tr').find('.text-center').text('Rejected');
                       $(this).closest('tr').fadeOut();
                   }
              }
        );
    });



    // Show 'uploaded' text then the entire row fades out
    $('.arti-accept-btn').on('click',function(){
        var userId = $(this).attr('data-id');
        $.ajax({
           method: 'POST',
           url: '/admin/arti-approve',
           data: {"userId": userId}}).done(
               function (data) {
                   if (data === userId){
                       $(this).closest('tr').find('.text-center').text('Uploaded');
                       $(this).closest('tr').fadeOut();
                   }
              }
        );
    });
});
