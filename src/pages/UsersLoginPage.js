import React, {useEffect, useState} from "react";
import {sendGetRequest, sendPostRequest} from "../utils/requests";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function StartPage() {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        "id": "",
        "pin_code": ""
    });

    const [employees, setEmployees] = useState([]); // Список сотрудников
    const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([])

    useEffect(() => {
        sendGetRequest(`employees/`)
            .then((response) => {
                console.log(response)
                setEmployees(response);
                setFilteredEmployees(response)
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [])



    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        if (name === 'id'){
            setSelectedEmployeeName(value)
            console.log(value)
            const findEmployee = employees.find((employee) => value.includes(employee.name) && value.includes(employee.surname))
            if (findEmployee){
                console.log("найден")
                setFormData({ ...formData, id: findEmployee.id });
            }
            const filteredEmployee = employees.filter(employee => employee.name.includes(value) || employee.surname.includes(value))
            setFilteredEmployees(filteredEmployee)
            console.log(filteredEmployee)
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await sendPostRequest("auth/", formData);
            console.log(formData)
            console.log(response)
            if (response && response.redirect_url) {
                console.log(response.redirect_url)
                localStorage.setItem("authenticated", true);
                localStorage.setItem("id", formData.id);
                navigate('/start')
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const handleDropdownToggle = () => {
        setShowDropdown(true);
        console.log('открыть ')
    };

    const handleNameClick = (item) => {
        setShowDropdown(false);
        console.log(item)
        setFormData({ ...formData, id: item.id }); // Сохраняем ID выбранного сотрудника
        setSelectedEmployeeName(item.name + " " + item.surname); // Отображаем имя
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div className="form-container-login d-flex flex-column"> {/* Изменили тут */}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <div className="title">
                                        <Form.Label>Войдите, чтобы начать работу</Form.Label>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="id"
                                        placeholder="Введите имя и фамилию"
                                        value={selectedEmployeeName}
                                        onChange={handleInputChange}
                                        onClick={() => handleDropdownToggle()}
                                    />
                                </Form.Group>

                                {showDropdown && (
                                    <div className='block'>
                                        <div className='search-list' >
                                            <Row>
                                                <Col>
                                                    <div className="d-grid gap-2">
                                                        {filteredEmployees.map((item) => (

                                                            <Button key={item.id}
                                                                    className='admin-botton-color'
                                                                    variant="dark"
                                                                    size='lg'

                                                                    onClick={() => handleNameClick(item)}>
                                                                {item.name + "  " + item.surname}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                )
                                }

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control
                                        type="password"
                                        name="pin_code"
                                        placeholder="Пароль"
                                        value={formData.pin_code}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Alert show={showError} variant="danger" className='custom-alert'
                                               onClose={() => setShowError(false)} dismissible>
                                            Неправильный логин или пароль
                                        </Alert>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{textAlign: 'right'}}>
                                        <Button variant="primary" type="submit">
                                            Войти
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>

                            <div className='mt-3'>  {/* Добавили mt-3 для отступа сверху */}
                                <div className="d-grid gap-2">
                                    <Button className='admin-botton-color' variant="dark" href='/login'
                                            size='lg'>Администратор</Button>
                                </div>
                            </div>
                        </div>

                    </Col>
                </Row>
            </Container>
        </>
    )
}



export default StartPage