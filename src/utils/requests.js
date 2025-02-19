import { saveAs } from 'file-saver';

//export const baseUrl = "http://localhost:8000";
export const baseUrl = "http://188.225.36.203:8000"; //  http://127.0.0.1:8000 http://188.225.36.203:8000
export const baseApiUrl = baseUrl + "/api/";
//timer/?task_id=${taskId}&employee_id=${employeeId}
export async function sendPostRequest(url, data) {
    try {
        const response = await fetch(baseApiUrl + url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return response.json();
    } catch (e) {
        return "404";
    }
}

export async function sendPostRequestEmployee(url, data) {
    try {
        const response = await fetch(baseApiUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return { ok: response.ok, data: await response.json() };
    } catch (e) {
        return { ok: false, error: "Ошибка" };
    }
}

export async function sendGetRequest(url) {
    try {
      const response = await fetch(baseApiUrl + url);
      return response.json();
    } catch {
      return "404";
    }
  }

  export async function sendPutRequest(url, data) {
    try {
        const response = await fetch(baseApiUrl + url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return response.json();
    } catch (e) {
        return "404";
    }
}
export async function sendDeleteRequest(url) {
  try {
      const response = await fetch(baseApiUrl + url, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          // No need for a request body in a DELETE request
      });

      return response.json();
  } catch (e) {
      return "404"; // You can customize the error handling as needed
  }
}

export async function sendGetRequestAndDownloadFile(url, fileName) {
    try {
        const response = await fetch(baseApiUrl + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const blob = await response.blob();


        saveAs(blob, fileName);
    } catch (e) {
        console.error('Ошибка при загрузке файла:', e);
    }
}
