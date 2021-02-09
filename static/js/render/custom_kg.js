$(function () {
    $("#upload_file").click(() => {
        $("#upload_file_in").trigger("click");
    })

    $("#upload_file_in").change(() => {
        $("#kg_file_in").val($("#upload_file_in").val());
    })

    $("#reback").click(()=>{
        // $("#upload_file").val("");
        $("#kg_file_in").val("");
        $("#kg_name_in").val("");
        $("#upload_file_in").val("")
    })

    $("#button_construct").click(() => {
        if (($("#kg_name_in").val() != "") && ($("#upload_file_in").val() != "")) {
            var data_files = new FormData($("#upload_file_form")[0]);
            $.ajax({
                url: "/upload_custom_file",
                type: "POST",
                data: data_files,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (data, status) {
                    console.log(data);
                    $("#des").html("节点数：" + data.node + "<br/>关系数：" + data.relation
                        + "<br/>三元组数：" + data.triple);
                },
                error: function (e) {
                    console.log("there is an error")
                    console.log(e);
                }
            })
        } else {
            alert("请确认已经输入知识图谱名字和选择了文件")
        }
    })
})