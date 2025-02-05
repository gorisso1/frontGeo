import React, {useEffect} from 'react';
import { Alert } from 'react-bootstrap';
import {sendGetRequest} from "../utils/requests";

function NotTask({ plotId }) {

    useEffect(() => {
        sendGetRequest(`tasks/?plot_id=${plotId}`)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [plotId]);
    return (
        <Alert variant="info" className="text-center mt-4">
            <h4>Задач нет</h4>
            <p>Все задачи завершены или не назначены для этого работника.</p>
        </Alert>
    );
}

export default NotTask;