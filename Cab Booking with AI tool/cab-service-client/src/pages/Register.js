import React from "react";
import { Row, Col, Form, Input } from "antd";
import { Link } from "react-router-dom";
import {useDispatch , useSelector} from 'react-redux'
import { userRegister } from "../redux/actions/userActions";
import AOS from 'aos';
import Spinner from '../components/Spinner';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init()
function Register() {
  const dispatch = useDispatch()
  const {loading} = useSelector(state=>state.alertsReducer)
    function onFinish(values) {
           dispatch(userRegister(values))
           console.log(values)
    }

  return (
    <div className="login">
      {loading && (<Spinner />)}
      <Row gutter={16} className="d-flex align-items-center">
        <Col lg={16} style={{ position: "relative" }}>
          <img 
           className='w-100'
           data-aos='slide-left'
           data-aos-duration='1500'
          src="data:image/jpeg;base64,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" />
          <h1 className="login-logo">Infer Car</h1>
        </Col>
        <Col lg={8} className="text-left p-5">
          <Form layout="vertical" className="login-form p-5" onFinish={onFinish}>
            <h1>Register</h1>
            <hr />
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cpassword"
              label="Confirm Password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <button className="btn1 mt-2 mb-3">Register</button>
            <br />

            <Link to="/login">Click Here to Login</Link>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
