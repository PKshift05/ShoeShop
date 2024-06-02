import React, { useState, useEffect } from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Spinning } from '../../animation-loading';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../../redux-toolkit/action/authAction';
import { useForm } from 'react-hook-form';

const SignUp = ({ signUp, setSignUp }) => {
  const navigate = useNavigate();
  const { loading, userInfo, error, success } = useSelector((state) => state.auth);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const submitForm = (data) => {
    if (data.password !== data.Cpassword) {
      toast.error('Password mismatch', {
        autoClose: 1500,
      });
      return;
    }
    setCredentials({ username: data.username, password: data.password });
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        autoClose: 1500,
      });
    }
    if (success){
      toast.success("Sign Up Success",{
        autoClose: 1500,
      })
      
      dispatch(loginUser(credentials))
    }
  }, [error,success]);

  return (
    <>
      <div
        className={`absolute top-0 transition-all duration-[0.6s] ease-in-out w-1/2 h-full left-0 opacity-0 z-[1] ${signUp ? 'translate-x-[100%] opacity-100 z-[5] animate-showSignUp' : ''
          }`}
      >
        <form onSubmit={handleSubmit(submitForm)} className='bg-white flex justify-center flex-col px-[50px] h-full text-center'>
          <h1 className="font-bold m-0 text-[30px]">Tạo tài khoản</h1>
          <input
            name="username"
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-2 px-[15px] my-1 w-full'
            type="text"
            placeholder="User Name"
            {...register('username')}
            required
          /><input
            name="firstName"
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-2 px-[15px] my-1 w-full'
            type="text"
            placeholder="First Name"
            {...register('firstName')}
            required
          /><input
            name="lastName"
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-2 px-[15px] my-1 w-full'
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
            required
          />
          <input
            name="contactNumber"
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-2 px-[15px] my-1 w-full'
            type="text"
            placeholder="SDT"
            {...register('contactNumber')}
            required
          />
          <input
            name="password"
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-2 px-[15px] my-1 w-full'
            type="password"
            placeholder="Password"
            {...register('password')}
            required
          />
          <input
            name="Cpassword"
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-2 px-[15px] my-1 w-full'
            type="password"
            placeholder="Nhập lại Password"
            {...register('Cpassword')}
            required
          />
          <button
            type="submit"
            className='mt-[10px] disabled:bg-blue-400 bg-primary text-white text-[13px] leading-5 font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'
          >
            {loading ? <Spinning /> : "Đăng ký"}
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
