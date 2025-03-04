import React, {useEffect, useState} from "react";
import {sendGetRequest} from "../utils/requests";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {useNavigate} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import '../css/page.css';

function Plots() {
    const [spots, setSpots] = useState([]);

    const navigate = useNavigate();  // Хук для навигации

    const handleClick = (id) => {
        // Редирект на маршрут с id
        navigate(`/admin-employee/${id}`);
    };
    useEffect(() => {
        sendGetRequest('plots/')
            .then((response) => {
                console.log(response);

                setSpots(response);

            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, []);





    return (
        <>
            <Container>
                <div style={{ position: 'relative' }}>
                    <Button
                        variant="outline-dark"
                        style={{
                            borderWidth: '2px',
                            borderRadius: '20px',
                            marginTop: '35px',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            zIndex: '1',
                        }}
                        href='/admin-page'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </Button>
                    <div className='header'>GD TIME</div>
                </div>
                <div className='block'>
                    <div className='spot-list-admin-task'>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2">
                                    {spots.map((spot, index) => (
                                        <div key={spot.id}>
                                            <Button
                                                className='admin-button-color'
                                                variant="dark"
                                                size="lg"
                                                style={{ width: '100%', borderRadius: '20px',  backgroundColor: '#273870' }}
                                                onClick={() => handleClick(spot.id, index)}
                                            >
                                                {spot.title}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </>
    );


}
export default Plots;