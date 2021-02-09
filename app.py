from flask import Flask
from flask import redirect, url_for, request
from setting import Base
from Util.FileUtil import FileTool

app = Flask(__name__)
app.config.from_object(Base)


@app.route('/')
def get_main():
    return redirect(url_for("static", filename="pages/main.html"))


@app.route("/index")
def get_index():
    return redirect(url_for("static", filename="pages/index.html"))


@app.route("/semantic")
def get_semantic():
    return redirect(url_for("static", filename="pages/semantic.html"))


@app.route("/semantic_query")
def get_semantic_query():
    query_word = request.args["query_word"].strip()
    import csv
    nodes = []
    edges = []
    nodes_delete_dup=[]
    with open("./static/resources/kg/dulong.csv", "r") as read_file:
        readder = csv.reader(read_file)
        index = 0
        for item in readder:
            if index == 0:
                index += 1
                continue
            else:
                if item[0] == query_word or item[2] == query_word:
                    if item[0] not in nodes_delete_dup:
                        nodes_delete_dup.append(item[0])
                        nodes.append({"nodeName": item[0]})
                    if item[2] not in nodes_delete_dup:
                        nodes_delete_dup.append(item[2])
                        nodes.append({"nodeName": item[2]})
                    edges.append({"source": item[0], "target": item[2]})
    result = {"edges": edges, "nodes": nodes, "nodeCounts": len(nodes)}
    import json
    return json.dumps(result)


@app.route("/upload_custom_file", methods=["POST"])
def get_custom_kg():
    """
    这里需要遍写一个处理上传自定义知识图谱的函数，函数返回文件中的节点数等需要的信息
    """
    # =========================
    # example:
    import json
    result = {"node": 10, "relation": 10, "triple": 10}
    return json.dumps(result)
    # =========================


@app.route("/default_kg")
def get_default():
    return redirect(url_for("static", filename="pages/default_kg.html"))


@app.route("/custom_kg")
def get_custom():
    return redirect(url_for("static", filename="pages/custom_kg.html"))


@app.route("/dulong_csv")
def getDuLongCsv():
    import json
    import csv
    node_delete_dumplicate = []
    node = {"nodes": [], "edges": []}
    with open("./static/resources/kg/dulong.csv", "r") as dulong_file:
        csv_reader = csv.reader(dulong_file)
        index = 0
        for item in csv_reader:
            if index == 0:
                index += 1
                continue
            else:
                if item[0] not in node_delete_dumplicate:
                    node["nodes"].append({"nodeName": item[0]})
                    node_delete_dumplicate.append(item[0])
                if item[2] not in node_delete_dumplicate:
                    node["nodes"].append({"nodeName": item[2]})
                    node_delete_dumplicate.append(item[2])
                node["edges"].append({"source": item[0], "target": item[2]})
    return json.dumps(node)


@app.route("/update_add_file")
def getAddFile():
    return redirect(url_for("static", filename="pages/uploadfile.html"))


@app.route("/upload_update", methods=["POST", "GET"])
def getUpdateFile():
    import hashlib
    # ===========================================================#
    if request.method == "POST":
        file = request.files["add_upload_file"]
        file.seek(0)
        MD5 = hashlib.md5(file.read()).hexdigest()
        if not FileTool.checkFileExists(app.config["TMP_FILE_PATH"] + MD5):
            FileTool.createDir(app.config["TMP_FILE_PATH"] + MD5)
        """
        这里要做几件事情
        函数需要返回一个字典，字典大概长这样：
        {"add_nodes_count":xx,"add_relations_count":xx,"add_triple_count":xx,"nodes":[{"nodeName":xxx},{"nodeName":xxx}....],
        "edges":[{"source":xx,"target":xx},{},{}...]}
        """
        # =======================#
        # example:
        import json
        import csv
        node_delete_dumplicate = []
        node = {"nodes": [], "edges": []}
        with open("./static/resources/kg/dulong.csv", "r") as dulong_file:
            csv_reader = csv.reader(dulong_file)
            index = 0
            for item in csv_reader:
                if index == 0:
                    index += 1
                    continue
                else:
                    if item[0] not in node_delete_dumplicate:
                        node["nodes"].append({"nodeName": item[0]})
                        node_delete_dumplicate.append(item[0])
                    if item[2] not in node_delete_dumplicate:
                        node["nodes"].append({"nodeName": item[2]})
                        node_delete_dumplicate.append(item[2])
                    node["edges"].append({"source": item[0], "target": item[2]})
        node["add_nodes_count"] = 10
        node["add_relations_count"] = 10
        node["add_triple_count"] = 10
        # 正常node为你的函数需要返回的内容
        # =======================#
        # ===========================================================#
        with open(app.config["TMP_FILE_PATH"] + MD5 + "/" + app.config["ADD_INCREASEMENT"], "w") as json_file:
            json.dump(node, json_file)
        return redirect(
            url_for("static", filename="pages/default_kg.html") + "?add_nodes_count=" + str(node["add_nodes_count"]) +
            "&add_relations_count=" + str(node["add_relations_count"]) + "&add_triple_count=" + str(
                node["add_triple_count"]) + "&update_result=1&md5=" + MD5)


@app.route("/update_data")
def get_update_data():
    md5 = request.args.get("md5")
    if FileTool.checkFileExists(app.config["TMP_FILE_PATH"] + md5 + "/" + app.config["ADD_INCREASEMENT"]):
        with open(app.config["TMP_FILE_PATH"] + md5 + "/" + app.config["ADD_INCREASEMENT"], "r") as json_file:
            return json_file.read()


if __name__ == '__main__':
    app.run()
