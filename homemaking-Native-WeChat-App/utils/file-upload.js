import APIConfig from "../config/api";
import Http from "./http";
import wxToPromise from "./wx";

class FileUpload extends Http {
  static async upload(filePath, key = "file") {
    let res;
    try {
      res = await wxToPromise("uploadFile", {
        url: APIConfig.baseURL + "v1/file",
        filePath,
        name: key,
      });
    } catch (e) {
      FileUpload._showError(-1);
      throw Error(e.errMsg);
    }

    const serverData = JSON.parse(res.data);
    if (res.statusCode !== 201) {
      FileUpload._showError(serverData.error_code, serverData.message);
      throw Error(serverData.message);
    }

    return serverData.data;
  }
}

export default FileUpload;
