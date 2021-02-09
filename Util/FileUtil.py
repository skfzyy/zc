import functools


class FileTool(object):
    @staticmethod
    def Dir(filePath):
        import os
        return os.path.dirname(filePath)

    @staticmethod
    def createDir(filePath):
        import os
        try:
            os.mkdir(filePath)
        except FileExistsError:
            pass

    @staticmethod
    def checkFileExists(filePath):
        import os
        if os.path.exists(filePath):
            return True
        else:
            return False

    @staticmethod
    def addDirSlash(filePath: str) -> str:
        if len(filePath) <= 0:
            return filePath
        import os
        if filePath[len(filePath) - 1] != os.sep:
            filePath += os.sep
        return filePath

    """
    装饰器接受一个函数作为参数，并且返回一个函数
    以下的调用相当于：
    readPairFile("xxxx")(func)
    """

    @staticmethod
    def readPairFile(filePath: str):
        if not FileTool.checkFileExists(filePath):
            raise Exception("the pair file is not exists")

        def proxy(func):
            @functools.wraps(func)
            def handle():
                with open(filePath, "r") as tmp_file:
                    while True:
                        line = tmp_file.readline()
                        if not line:
                            break
                        else:
                            info = line.strip().split("\t")
                            if len(info) == 2:
                                func(key=info[0], value=info[1])

            return handle

        return proxy

    @staticmethod
    def readTripleFile(filePath: str):
        if not FileTool.checkFileExists(filePath):
            raise Exception("the triple file path is not exists")

        def proxy(func):
            @functools.wraps(func)
            def handle():
                with open(filePath, "r") as triple:
                    while True:
                        line = triple.readline()
                        if not line:
                            break
                        else:
                            info = line.strip().split(" ")
                            if len(info) == 3:
                                func(head=info[0], rel=info[1], tail=info[2])

            return handle

        return proxy
