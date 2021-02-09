$(function () {
    $("#search").click(() => {
        if ($("#word_in").val() == "") {
            alert("请输入查询词")
        } else {
            d3.json("/semantic_query?query_word=" + $("#word_in").val()).then(data => {
                if (parseInt(data.nodeCounts) == 0) {
                    alert("请确认您输入的实体ID是否正确")
                } else {
                    console.log(data);
                    if($("#save_cir").length==1){
                        $("#save_cir").remove();
                    }
                    tmp_width = $("#canvas").width();
                    tmp_height = $("#canvas").height();
                    let simmulation = d3.forceSimulation(data.nodes, (d) => {
                        return d.nodeName;
                    })
                        .force("charge", d3.forceManyBody().strength(-20))
                        .force("center", d3.forceCenter((parseInt(tmp_width) - 170) / 2, (parseInt(tmp_height) - 170) / 2))
                        .force("collision", d3.forceCollide().radius(d => {
                            return 20;
                        }))
                        .force("link", d3.forceLink(data.edges).id((d) => {
                            return d.nodeName;
                        }).distance(10))
                        .on("tick", ticked);
                    var u = d3.select("#canvas").append("g").attr("width", tmp_width - 50)
                        .attr("height", tmp_height - 50).attr("transform", "translate(50 50)")
                        .attr("id", "save_cir")


                    u.selectAll("circle").data(data.nodes, d => {
                        return d.nodeName;
                    }).enter()
                        .append("circle").attr("r", 7).attr("fill", (d) => {
                        return "green";
                    });
                    var link=u.selectAll("line").data(data.edges).enter().append("line").attr("stroke","#000000")
                        .attr("stroke_width",3).attr("x1",(d)=>{
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
                }


            })
        }
    })

})