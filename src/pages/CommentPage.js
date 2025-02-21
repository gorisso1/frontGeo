import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import {Card, Modal} from 'react-bootstrap';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {sendGetRequest} from '../utils/requests';
import {sendPutRequest} from '../utils/requests';
import {sendPostRequest} from '../utils/requests';
import {useNavigate} from 'react-router-dom';
import {useRef} from 'react';

import '../css/page.css'

function CommentPage() {

    const [timeRework, setTimeRework] = useState({hours: 0, minutes: 0, seconds: 0})
    const [timerReworkRunning, setTimerReworkRunning] = useState(false);
    const [shiftTime, setShiftTime] = useState(false)

    const [employeeTaskId, setEmployeeTaskId] = useState(null)

    const navigate = useNavigate();
    const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0});
    const [timerRunning, setTimerRunning] = useState(false);
    const {id, employeeId, taskId} = useParams();
    const [showStartButton, setShowStartButton] = useState(true)
    const [showRedButton, setShowRedButton] = useState(false)
    const [showSaveButton, setShowSaveButton] = useState(false)
    const [showFinishModal, setShowFinishModal] = useState(false)
    const [disabled, setDisabled] = useState(false);
    const textareaRef1 = useRef(null);
    const textareaRef2 = useRef(null);
    const [data, setData] = useState({
        name: '',
        item: '',
        paused_message: 'Не начал',

        admin: '',

        surname: '',
        title: '',
        task: '',
        comment: '',
        created_by: '',
    })

    const [formData, setFormData] = useState({
        comment: '',
    })


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    useEffect(() => {
        sendGetRequest(`employees/?plot_id=${id}`)
            .then((response) => {
                console.log("response:", response)
                const filteredResponse = response.filter(res => res.task_info !== null && res.task_info !== undefined);
                console.log("filter", filteredResponse)
                const findResponse = filteredResponse.find(res => res.id === parseInt(employeeId, 10))
                console.log("findResponse", findResponse)
                setEmployeeTaskId(findResponse.task_info.employee_task_id)
                console.log("employee_task_id: ",findResponse.task_info.employee_task_id)
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [])


    useEffect(() => {
        if (textareaRef1.current) {
            // Устанавливаем высоту textarea в зависимости от содержимого
            textareaRef1.current.style.height = 'auto';
            textareaRef1.current.style.height = `${textareaRef1.current.scrollHeight}px`;
        }
    }, [data.comment]);

    useEffect(() => {
        if (textareaRef2.current) {
            // Устанавливаем высоту textarea в зависимости от содержимого
            textareaRef2.current.style.height = 'auto';
            textareaRef2.current.style.height = `${textareaRef2.current.scrollHeight}px`;
        }
    }, [formData.comment]);


    useEffect(() => {
        let interval;

        if (timerRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const newSeconds = prevTime.seconds + 1;
                    const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
                    const newHours = prevTime.hours + Math.floor(newMinutes / 60);

                    return {
                        hours: newHours,
                        minutes: newMinutes % 60,
                        seconds: newSeconds % 60,
                    };
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [timerRunning]);

    // useEffect(() => {
    //     let intervalRework;
    //
    //     if (timerReworkRunning) {
    //         intervalRework = setInterval(() => {
    //             setTimeRework((prevTime) => {
    //                 const newSeconds = prevTime.seconds + 1;
    //                 const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
    //                 const newHours = prevTime.hours + Math.floor(newMinutes / 60);
    //
    //                 return {
    //                     hours: newHours,
    //                     minutes: newMinutes % 60,
    //                     seconds: newSeconds % 60,
    //                 };
    //             });
    //         }, 1000);
    //     } else {
    //         clearInterval(intervalRework);
    //     }
    //
    //     return () => {
    //         clearInterval(intervalRework);
    //     };
    // }, [timerReworkRunning]);


    useEffect(() => {
        sendGetRequest(`employee-tasks/?employee_id=${employeeId}&task_id=${taskId}`)
            .then((response) => {
                console.log('response start: ', response)
                if (response.detail !== "not found") {
                    setShowRedButton(true);
                    const secondsStr = response.useful_time;
                    setTime({
                        seconds: secondsStr % 60,
                        minutes: Math.floor(secondsStr / 60) % 60,
                        hours: Math.floor(secondsStr / 3600),
                    });
                    setFormData({...formData, comment: response.employee_comment});
                    setDisabled(true);
                    setShowStartButton(false);

                    if (response.is_after_shift_work === true){
                        setShiftTime(response.is_after_shift_work)
                    }

                    if (response.is_paused === true) {
                        // Пауза - приоритет, останавливаем все
                        setTimerRunning(false);
                        setTimerReworkRunning(false);
                        console.log("Пауза");
                    } else if (response.is_reworking === true) {
                        // Переделка - останавливаем таймер и отмечаем состояние переделки
                        setTimerRunning(false);
                        setTimerReworkRunning(true);
                        console.log("Переделка");
                    } else {
                        // Нет ни паузы, ни переделки - таймер работает
                        setTimerRunning(true);
                        setTimerReworkRunning(false);
                        console.log("Таймер запущен");
                    }

                    // setTimerReworkRunning(true);
                    // setTimerRunning(!response.is_reworking);

                } else {
                    setShowRedButton(false);
                    setShowStartButton(true);
                }
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [employeeId, taskId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeeResponse, plotResponse, taskResponse] = await Promise.all([
                    sendGetRequest(`employees/${employeeId}/`),
                    sendGetRequest(`plots/${id}`),
                    sendGetRequest(`tasks/${taskId}`),
                ]);

                console.log('Employee Data:', employeeResponse);
                console.log('Plot Data:', plotResponse);
                console.log('Task Data:', taskResponse);

                // Используем функциональные обновления состояния
                setData(prevData => ({
                    ...prevData,
                    name: employeeResponse.name,
                    surname: employeeResponse.surname,
                    title: plotResponse.title,
                    task: taskResponse.title,
                    admin: taskResponse.admin,
                    item: taskResponse.item,
                    comment: taskResponse.admin_comment,
                    plot: taskResponse.plot,
                    type_of_task: taskResponse.type_of_task,
                    created_by: taskResponse.created_by,
                }));
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData();
    }, [employeeId, id, taskId]);

    const handleStartAfterShiftWork = () => {
        sendPostRequest(`check-shift/`, {task_id: employeeTaskId})
            .then((data) => {
                if (data.message === 'Смена еще не закончилась.') {
                    alert("Смена еще не закончилась")
                }
                else {
                    setShiftTime(true)
                    console.log(data)
                }
            })
    }

    const handleStopAfterShiftWork = () => {
        sendPostRequest(`stop-non-working-time/`, {task_id: employeeTaskId})
            .then((data) => {
                    setShiftTime(false)
                    console.log(data)
            })
    }


    const handleReworkRunningButtonClick = () => {
        setTimerReworkRunning(true);
        setTimerRunning(false)

        const putData = {
            admin_comment: data.comment,
            employee_comment: formData.employee_comment,
            title: data.task,
            plot: data.plot,
            type_of_task: data.type_of_task,
            created_by: data.created_by
        };

        setData((prevState) => ({
            ...prevState,
            paused_message: "Переделка"
        }));

        console.log("put data: ", putData)
        sendPostRequest(`start-rework/`, {task_id: employeeTaskId}).then((data) => console.log("Кидаем второй запрос на продолжение: ", data))

    };

    const handleReworkStopButtonClick = () => {
        setTimerReworkRunning(false);
        setTimerRunning(true)
        const putData = {
            admin_comment: data.comment,
            employee_comment: formData.employee_comment,
            title: data.task,
            plot: data.plot,
            type_of_task: data.type_of_task,
            created_by: data.created_by
        };

        setData((prevState) => ({
            ...prevState,
            paused_message: "В работе"
        }));

        console.log("put data: ", putData)
        sendPostRequest(`end-rework/`, {task_id: employeeTaskId}).then((data) => console.log("Кидаем второй запрос на продолжение: ", data))

    };


    const handleStartButtonClick = () => {
        console.log(data.title)
        const putData = {
            admin_comment: data.comment,
            employee_comment: formData.employee_comment,
            title: data.task,
            plot: data.plot,
            type_of_task: data.type_of_task,
            created_by: data.created_by
        };

        setData((prevState) => ({
            ...prevState,
            paused_message: "В работе"
        }));

        const postData = {
            action: 'start',
        };
        console.log("task", taskId)

        // Отправка первого запроса
        sendPutRequest(`tasks/${taskId}/`, putData)
            .then(responseData => {
                console.log('Успешный ответ:', responseData);

                // Установка состояний и отправка следующего запроса
                setShowRedButton(true)
                setDisabled(true);
                setTimerRunning(true);
                setShowStartButton(false);
                console.log(formData)
                return sendPostRequest(`choose-task/?employee_id=${employeeId}&task_id=${taskId}&admin_id=${data.admin}&item_id=${data.item}`, formData);
            })
            .then(responseData => {
                console.log(responseData);

                // Отправка последнего запроса
                return sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, postData);
            })
            .then(responseData => {
                console.log(responseData);
                sendPostRequest(`start-useful-time/`, {task_id: employeeTaskId}).then((data) => console.log("Кидаем второй запрос: ", data))
                // Возможно, здесь могут быть дополнительные действия после выполнения всех запросов
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    };

    const handleRedClick = () => {
        setShowRedButton(false)
        setDisabled(false)
        setShowSaveButton(true)
    }

    const handleSaveClick = () => {
        setShowSaveButton(false)
        setDisabled(true)
        const putData = {
            employee_comment: formData.comment,
            employee: employeeId,
            task: taskId
        };
        sendPutRequest(`employee-tasks/?employee_id=${employeeId}&task_id=${taskId}`, putData)
            .then(responseData => {
                console.log('Успешный ответ:', responseData);
            })
        setShowRedButton(true)
    }


    const handleContinue = () => {
        const startData = {
            action: 'start',
        };
        sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, startData)
            .then(responseData => {
                console.log(responseData);
                sendPostRequest(`start-useful-time/`, {task_id: employeeTaskId}).then((data) => console.log("Кидаем второй запрос на продолжение: ", data))

            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        setData((prevState) => ({
            ...prevState,
            paused_message: "В работе"
        }));

        setTimerRunning(!timerRunning);


    }

    const handlePauseButtonClick = (message) => {

        setData((prevState) => ({
            ...prevState,
            paused_message: message
        }));
        const stopData = {
            action: 'pause',
            message: message,
        };
        sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, stopData)
            .then(() => {
                setTimerRunning(false);
                sendPostRequest(`stop-useful-time/`, {task_id: employeeTaskId}).then((data) => console.log("Кидаем второй запрос на паузу: ", data))

            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });
    };

    const handleFinishButtonClick = () => {
        setShowFinishModal(true);
    };

    const handleModalClick = () => {
        const finishData = {
            action: 'end',
        };

        sendPostRequest(`end-task/`, {task_id: employeeTaskId}).then((data) => console.log("Кидаем второй запрос: ", data))
            .then(() => {

                navigate('/start');
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });

        setShowStartButton(true);
        setFormData({...formData, comment: ''});
        setDisabled(false);
        setShowFinishModal(false);
        setTimerRunning(false);
        setTime({hours: 0, minutes: 0, seconds: 0});
    };


    return (
        <>
            <Container>

                <div style={{position: 'relative'}}>
                    {showStartButton && (
                        <Button
                            variant="outline-dark"
                            style={{
                                borderWidth: '2px',
                                borderRadius: '20px',
                                marginTop: '70px',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                zIndex: '1', // Ensure the button is above other elements
                            }}
                            onClick={() => {
                                window.location.href = `/task/${id}/${employeeId}`;
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                                 class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                            </svg>
                        </Button>
                    )}

                    {!showStartButton && (
                        <Button
                            variant="outline-dark"
                            style={{
                                borderWidth: '2px',
                                borderRadius: '20px',
                                marginTop: '70px',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                zIndex: '1', // Ensure the button is above other elements
                            }}
                            onClick={() => {
                                window.location.href = `/spot/${id}`;
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                                 class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                            </svg>
                        </Button>
                    )}

                    <div className='header'>{data.title}<br/>{data.name} {data.surname}<br/>{data.task}</div>
                </div>

                <div className='block'>
                    <p className='spot-name'>Комментарий администратора</p>
                </div>
                <div className='block'>
                    <Col className='admin-botton'>
                        <Form>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">

                                <Form.Control
                                    ref={textareaRef1}
                                    className='comment-textarea'
                                    as="textarea"
                                    size='lg'
                                    disabled='true'
                                    value={data.comment}/>
                            </Form.Group>


                            <div className='block' style={{marginTop: '70px'}}>
                                <p className='spot-name'>Комментарий работника</p>
                            </div>
                            <div>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">

                                    <Form.Control
                                        ref={textareaRef2}
                                        name="comment"
                                        className='comment-textarea'
                                        as="textarea"

                                        size='lg'
                                        disabled={disabled}
                                        value={formData.comment}
                                        onChange={handleInputChange}/>

                                </Form.Group>
                            </div>


                            {showRedButton && (
                                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button variant="secondary" size='lg' onClick={handleRedClick}>
                                        Редактировать
                                    </Button>
                                </div>
                            )}
                            {showSaveButton && (
                                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button variant="primary" size='lg' onClick={handleSaveClick}>
                                        Сохранить
                                    </Button>
                                </div>
                            )}

                        </Form>
                    </Col>
                </div>


                {showStartButton && (
                    <Row>
                        <div className='block'>
                            <Col className='admin-botton'>
                                <div className="d-grid gap-2">
                                    <Button variant="success" size='lg'
                                            onClick={handleStartButtonClick}>
                                        Начать
                                    </Button>
                                </div>
                            </Col>
                        </div>
                    </Row>
                )}
                <div className="d-flex justify-content-center align-items-center">
                    <div
                        className="p-3"
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            '@media (min-width: 768px)': {maxWidth: '400px'},
                        }}
                    >
                        <Card className="mb-3">
                            <Card.Header as="h5">Статус</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {data.paused_message}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>


                {!showStartButton && (
                    <Row>
                        <div className='block'>
                            <Row>
                                <div className="timer">
                                    <span>Полезное время: </span>
                                    {String(time.hours).padStart(2, '0')}:
                                    {String(time.minutes).padStart(2, '0')}:
                                    {String(time.seconds).padStart(2, '0')}
                                </div>
                            </Row>
                        </div>
                        {/*<div className='block'>*/}
                        {/*    <Row>*/}
                        {/*        <div className="timer">*/}
                        {/*            <span>Время переделки: </span>*/}
                        {/*            {String(timeRework.hours).padStart(2, '0')}:*/}
                        {/*            {String(timeRework.minutes).padStart(2, '0')}:*/}
                        {/*            {String(timeRework.seconds).padStart(2, '0')}*/}
                        {/*        </div>*/}
                        {/*    </Row>*/}
                        {/*</div>*/}
                        <div className='block'>
                            <Col className='admin-botton'>
                                <Row>
                                    {!timerReworkRunning && (
                                        <Col>
                                            <div className="d-grid gap-2">
                                                {timerRunning ? (
                                                    <>
                                                        <Button className='buttons-timer' variant="warning" size='lg'
                                                                onClick={() => handlePauseButtonClick("Ожидание по комплектующим")}>
                                                            Ожидание по комплектующим
                                                        </Button>


                                                        <Button className='buttons-timer' variant="warning" size='lg'
                                                                onClick={() => handlePauseButtonClick("Ожидание по браку")}>
                                                            Ожидание по браку
                                                        </Button>
                                                    </>


                                                ) : (
                                                    <Button className='buttons-timer' variant="warning" size='lg'
                                                            onClick={handleContinue}>
                                                        Продолжить
                                                    </Button>
                                                )}

                                            </div>
                                        </Col>
                                    )}
                                    <Col>
                                        <div className="d-grid gap-2">

                                            {!timerReworkRunning && (
                                                <Button className='buttons-timer' variant="danger" size='lg'
                                                        onClick={handleFinishButtonClick}>
                                                    Закончить
                                                </Button>
                                            )}
                                        </div>

                                        <div className="d-grid gap-2">

                                            {!timerReworkRunning && timerRunning &&
                                                <Button className='buttons-timer' variant="danger" size='lg'
                                                        onClick={handleReworkRunningButtonClick}>
                                                    Переделка
                                                </Button>
                                            }
                                            {timerReworkRunning &&
                                                <Button className='buttons-timer' variant="danger" size='lg'
                                                        onClick={handleReworkStopButtonClick}>
                                                    Закончить переделку
                                                </Button>
                                            }
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <div className="d-grid gap-2">

                                        {!shiftTime &&
                                            <Button
                                                className='buttons-timer'
                                                variant="secondary"
                                                size='lg'
                                                onClick={handleStartAfterShiftWork}
                                            >
                                                Начать работу после смены
                                            </Button>
                                        }
                                        {shiftTime &&
                                            <Button
                                                className='buttons-timer'
                                                variant="secondary"
                                                size='lg'
                                                onClick={handleStopAfterShiftWork}
                                            >
                                                Закончить работу после смены
                                            </Button>
                                        }
                                    </div>
                                </Row>

                                <Row>
                                    <div className="d-grid gap-2">
                                        <Button className='buttons-timer' href='/start' variant="secondary" size='lg'
                                        >
                                            Меню

                                        </Button>
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                )}


                <Modal show={showFinishModal} onHide={() => setShowFinishModal(false)} centered>
                    <Modal.Header closeButton>

                    </Modal.Header>
                    <Modal.Body>Вы уверены, что хотите закончить?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFinishModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={handleModalClick}>
                            Закончить
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Container>
        </>
    )
}

export default CommentPage
