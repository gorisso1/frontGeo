import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {useState, useEffect} from 'react';
import {sendGetRequest, sendPostRequest} from '../utils/requests';

import '../css/page.css'

function StartPage() {
    const [spots, setSpots] = useState([]);
    useEffect(() => {
        sendGetRequest('plots/')
            .then((response) => {
                console.log(response)
                setSpots(response);
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [])
    const handleStartWork = () => {
        const userId = localStorage.getItem('id')
        sendPostRequest(`start-shift/`, {employee_id: userId})
            .then((data) => {
                if (data.error === 'Shift has not started yet'){
                    alert("Смена еще не началась")
                }
                else if (data.error === 'Shift is already over'){
                    alert("Смена уже закончилась")
                }
                else if (data.error ==='employee_id is required'){
                    alert("Войдите как работник")
                }
                else if (data.message === 'Employee is already on shift'){
                    alert("Вы уже вышли на смену")
                }
                else {
                    alert("Вы начали смену")
                }
                console.log(data)
            })
    }
    return (
        <>
            <Container>
                <div className='header'>GD TIME</div>
                <Row>
                    <div className='block'>
                        <Col className='admin-botton'>
                            <div className="d-grid gap-2">
                                <Button className='admin-botton-color' variant="dark" onClick={handleStartWork}
                                        size='lg'>Начать смену</Button>
                            </div>
                        </Col>
                    </div>
                </Row>
                <div className='block'>
                    <div className='spot-list'>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2">
                                    {spots.map((spot) => (
                                        <Button className='spot-botton'
                                                variant="outline-dark"
                                                size="lg"
                                                onClick={() => {
                                                    window.location.href = `/spot/${spot.id}`;
                                                }}

                                        >
                                            {spot.title}</Button>
                                    ))}

                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <Row>
                    <div className='block'>
                        <Col className='admin-botton'>
                            <div className="d-grid gap-2">
                                <Button className='admin-botton-color' variant="dark" href='/login'
                                        size='lg'>Администратор</Button>
                            </div>
                        </Col>
                    </div>
                </Row>

            </Container>
        </>
    )
}

export default StartPage