/* Count the total number of artifact requests */
/* BUT this is not real-time value and it does include faded/deleted request...*/

$(document).ready(function () {

    $('.edit1').click(function() {
        console.log($(this).parent().parent().next().find("td").get());
        $(this).parent().parent().next().find("td").fadeIn(800);
    });
    $('.cross').click(function() {
        console.log($(this).parent().parent().prev().get());
        $(this).parent().fadeOut(100);
    });

    // Show 'Rejected' text then the entire row fades out
    $('.user-delete-btn').on('click',function() {
        var userId = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/user-delete',
            data: {"userId": userId}});
        $(this).closest('td').text('Approved');
        $(this).closest('tr').find('.text-center').text('Rejected');
        $(this).closest('tr').fadeOut();
    });



    // Show 'Approved' text then the entire row fades out
    $('.user-accept-btn').on('click',function(){
        var userId = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/user-approve',
            data: {"userId": userId}});
        $(this).closest('td').text('Approved');
        $(this).closest('tr').find('.text-center').text('Approved');
        $(this).closest('tr').fadeOut();
    });

    // Show 'Rejected' text then the entire row fades out
    $('.arti-delete-btn').on('click', function () {
        var userId = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/arti-delete',
            data: {"userId": userId}});
        $(this).closest('td').text('Rejected');
        $(this).closest('tr').find('.text-center').text('Rejected');
        $(this).closest('tr').fadeOut();
    });



    // Show 'Approved' text then the entire row fades out
    $('.arti-accept-btn').on('click',function(){
        var userId = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/arti-approve',
            data: {"userId": userId}});
        $(this).closest('td').text('Approved');
        $(this).closest('tr').find('.text-center').text('Approved');
        $(this).closest('tr').fadeOut();
    });

    // Show 'Approved' text then the entire row fades out
    $('.appr-delete-btn').on('click', function () {
        var editID = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/approve-delete',
            data: {'editID': editID, 'approval': true}});
        $(this).closest('td').text('Approved');
        $(this).closest('tr').find('.text-center').text('Approved');
        $(this).closest('tr').fadeOut();
    });



    // Show 'Rejected' text then the entire row fades out
    $('.reje-delete-btn').on('click',function(){
        var editID = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/approve-delete',
            data: {'editID': editID, 'approval': false}});
        $(this).closest('td').text('Rejected');
        $(this).closest('tr').find('.text-center').text('Rejected');
        $(this).closest('tr').fadeOut();
    });

    // Show 'Approved' text then the entire row fades out
    $('.edit-accept-btn').on('click', function () {
        var editID = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/approve-edits',
            data: {'editID': editID, 'approval': true}});
        $(this).closest('td').text('Approved');
        $(this).closest('tr').find('.text-center').text('Approved');
        $(this).closest('tr').fadeOut();
    });



    // Show 'Rejected' text then the entire row fades out
    $('.edit-delete-btn').on('click',function(){
        var editID = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            url: '/admin/approve-edits',
            data: {'editID': editID, 'approval': false}});
        $(this).closest('td').text('Rejected');
        $(this).closest('tr').find('.text-center').text('Rejected');
        $(this).closest('tr').fadeOut();
    });
});
