function getArgus() {
    var str = window.location.search;
    str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
    // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
    var arr = str.split("&");
    var obj = new Object();
    // 将每一个数组元素以=分隔并赋给obj对象
    for (var i = 0; i < arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj;
}

$(function () {
    if(getArgus()["update_result"]==undefined){
        d3.json("/dulong_csv").then(data => {
            $("#add_update").on("click",()=>{
                window.location.href="/update_add_file";
            })
            console.log(data);
            tmp_width = $("#canvas_draw").width();
            tmp_height = $("#canvas_draw").height();
            let simmulation = d3.forceSimulation(data.nodes,(d)=>{
                return d.nodeName;
            })
                .force("charge", d3.forceManyBody().strength(-20))
                .force("center", d3.forceCenter((parseInt(tmp_width) - 170) / 2, (parseInt(tmp_height) - 170) / 2))
                .force("collision", d3.forceCollide().radius(d => {
                    return 20;
                }))
                .force("link",d3.forceLink(data.edges).id((d)=>{
                    return d.nodeName;
                }).distance(10))
                .on("tick", ticked);

            var u = d3.select("#canvas_draw").append("g").attr("width", tmp_width - 50)
                .attr("height", tmp_height - 50).attr("transform", "translate(50 50)")
                .attr("id", "save_cir")


            u.selectAll("circle").data(data.nodes, d => {
                console.log("the d is: ");
                console.log(d);
                return d.nodeName;
            }).enter()
                .append("circle").attr("r", 7).attr("fill", (d) => {
                return "green";
            });
            var link=u.selectAll("line").data(data.edges).enter().append("line").attr("stroke","#000000")
                .attr("stroke_width",3).attr("x1",(d)=>{
                    console.log("why");
                    console.log(d);
                    return d.source.x;
                }).attr("y1",(d)=>{
                    return d.source.y;
                }).attr("x2",(d)=>{
                    return d.target.x;
                }).attr("y2",(d)=>{
                    return d.target.y;
                })
            var nodeT = u.selectAll("text").data(data.nodes, d => {
                return d.nodeName;
            }).enter().append("text").style("fill", "#000000")
                .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
                .text((d) => {
                    return d.nodeName;
                })
            function ticked() {
                link.attr('x1', function (d) { return d.source.x })
                    .attr('y1', function (d) { return d.source.y })
                    .attr('x2', function (d) { return d.target.x })
                    .attr('y2', function (d) { return d.target.y })
                d3.selectAll("circle").attr("cx", (d) => {
                    // console.log(d);
                    return d.x
                })
                    .attr("cy", (d) => {
                        return d.y
                    })
                nodeT.attr("x", (d) => {
                    return d.x;
                }).attr("y", (d) => {
                    return d.y+13;
                })
            }
        })
    }else{
        //update info
        d3.json("/update_data?md5="+getArgus()["md5"]).then(data => {
            $("#add_update").on("click",()=>{
                window.location.href="/update_add_file";
            })
            console.log(data);
            tmp_width = $("#canvas_draw").width();
            tmp_height = $("#canvas_draw").height();
            let simmulation = d3.forceSimulation(data.nodes,(d)=>{
                return d.nodeName;
            })
                .force("charge", d3.forceManyBody().strength(-20))
                .force("center", d3.forceCenter((parseInt(tmp_width) - 170) / 2, (parseInt(tmp_height) - 170) / 2))
                .force("collision", d3.forceCollide().radius(d => {
                    return 20;
                }))
                .force("link",d3.forceLink(data.edges).id((d)=>{
                    return d.nodeName;
                }).distance(10))
                .on("tick", ticked);
            var u = d3.select("#canvas_draw").append("g").attr("width", tmp_width - 50)
                .attr("height", tmp_height - 50).attr("transform", "translate(50 50)")
                .attr("id", "save_cir")


            u.selectAll("circle").data(data.nodes, d => {
                console.log("the d is: ");
                console.log(d);
                return d.nodeName;
            }).enter()
                .append("circle").attr("r", 7).attr("fill", (d) => {
                return "green";
            });
            var link=u.selectAll("line").data(data.edges).enter().append("line").attr("stroke","#000000")
                .attr("stroke_width",3).attr("x1",(d)=>{
                    console.log("why");
                    console.log(d);
                    return d.source.x;
                }).attr("y1",(d)=>{
                    return d.source.y;
                }).attr("x2",(d)=>{
                    return d.target.x;
                }).attr("y2",(d)=>{
                    return d.target.y;
                })
            var nodeT = u.selectAll("text").data(data.nodes, d => {
                return d.nodeName;
            }).enter().append("text").style("fill", "#000000")
                .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
                .text((d) => {
                    return d.nodeName;
                })
            function ticked() {
                link.attr('x1', function (d) { return d.source.x })
                    .attr('y1', function (d) { return d.source.y })
                    .attr('x2', function (d) { return d.target.x })
                    .attr('y2', function (d) { return d.target.y })
                d3.selectAll("circle").attr("cx", (d) => {
                    // console.log(d);
                    return d.x
                })
                    .attr("cy", (d) => {
                        return d.y
                    })
                nodeT.attr("x", (d) => {
                    return d.x;
                }).attr("y", (d) => {
                    return d.y+13;
                })
            }
        })
        $("#add_update").remove();
        $("#content").append("<div id='des'>新增节点数："+getArgus()["add_nodes_count"]
            +"<br/>"+"新增关系数："+getArgus()["add_relations_count"]+"<br/>"+"新增三元组："
            +getArgus()["add_triple_count"]
            +"</div>")
        $("#des").attr("style","height:74px;width:134px;margin:auto;border-radius:24px;"
            +"border-color: red;border-width: 3px;color:red;"
            +"border-style: solid;float:left;")
        $("#canvas_draw").attr("style","float:left;")
    }
})



