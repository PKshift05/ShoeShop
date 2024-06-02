import React, { useState } from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import { Spinning } from '../../animation-loading';
import { toast } from 'react-toastify';
import { loginUser } from '../../redux-toolkit/action/authAction';
import { useDispatch, useSelector } from 'react-redux';

const SignIn = ({ signUp, setResetPassword }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: '',
  });

  const handleInput = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  const checkInvalidUser = () => {
    if (!/^[a-zA-Z0-9]{8,}$/.test(loginInfo.password)) {
      return {
        notify: 'Mật khẩu phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt',
        status: false,
      };
    }

    return {
      notify: 'Đăng nhập thành công',
      status: true,
    };
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { notify, status } = checkInvalidUser();
    if (!status) {
      toast.error(notify, {
        autoClose: 1500,
      });
    } else {
      dispatch(loginUser(loginInfo));
    }
  };

  return (
    <>
      <div className={`absolute top-0 transition-all duration-[0.6s] ease-in-out h-full left-0 w-1/2 z-[2] ${signUp ? 'translate-x-[100%]' : ''}`}>
        <form onSubmit={handleSignIn} className='bg-white flex justify-center flex-col px-[50px] h-full'>
          <h1 className="font-bold m-0 text-[30px] text-center">Đăng nhập</h1>
          <NavLink className="w-full my-3 flex text-white gap-[15px] items-center justify-center cursor-pointer bg-[#dd4b39]">
            <span className="no-underline flex h-[40px] text-[18px] items-center justify-center">
              <FontAwesomeIcon className='icon' icon={faGoogle} />
            </span>
            <p>Continue with Google</p>
          </NavLink>
          <span className='text-[13px] mb-3  flex items-center'>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
            <p className='mx-[5px]'>Hoặc đăng nhập bằng tài khoản</p>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
          </span>
          <input
            name="username"
            onChange={handleInput}
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-3 px-[15px] my-2 w-full' type="text" placeholder="User Name" />
          <input
            name="password"
            onChange={handleInput}
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-3 px-[15px] my-2 w-full' type="password" placeholder="Password" />
          <NavLink
            onClick={() => setResetPassword(true)}
            className=' text-[#333] text-[14px] underline my-[15px]'>
            Quên mật khẩu?
          </NavLink>
          <button
            type='submit'
            className='bg-primary text-white text-[13px] leading-5 font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'>
            {loading ? <Spinning /> : "Đăng nhập"}
          </button>
        </form>
      </div>
    </>
  );
};

export default SignIn;
