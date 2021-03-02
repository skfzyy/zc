$(function (){
    $("#upload_icon").click(()=>{
        $("#upload_file").trigger("click");
    })

    $("#upload_file").change(()=>{
        $("#file_name").val($("#upload_file").val());
    })

    $("#reback").click(()=>{
        $("#upload_file").val("");
    })

    $("#add_construct").click(()=>{
        if($("#upload_file").val()!=""){
            $("#upload_file_form").submit();
        }
    })
})