import React from 'react';
import { faInfoCircle, faSignOutAlt, faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux-toolkit/slice/authSlice';
import './headerScroll.scss';

const DropDownAccount = ({ setHoverAccount }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(LOGOUT());
    navigate('/');
    window.scrollTo({ top: 0 });
  };

  return (
    <ul className="absolute top-full text-[16px] min-w-[240px] rounded-[3px] bg-white shadow-shadowAccount drop-down-account z-[2] mt-3">
      <li
        onClick={() => {
          navigate('/don-hang');
          setHoverAccount(false);
          window.scrollTo({ top: 0 });
        }}
        className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
        <div className='flex items-center gap-1'>
          <FontAwesomeIcon icon={faTruckMoving} className='cursor-pointer pr-[10px] text-[18px]' />
          <p className='inline-block'>Đơn hàng</p>
        </div>
      </li>

      <li
        onClick={() => {
          navigate('/tai-khoan');
          setHoverAccount(false);
          window.scrollTo({ top: 0 });
        }}
        className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
        <div className='flex items-center gap-1'>
          <FontAwesomeIcon icon={faInfoCircle} className='cursor-pointer pr-[10px] text-[18px]' />
          <p className='inline-block'>Thông tin tài khoản</p>
        </div>
      </li>

      <li
        onClick={handleLogout}
        className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
        <div className='flex items-center gap-1'>
          <FontAwesomeIcon icon={faSignOutAlt} className='cursor-pointer pr-[10px] text-[18px]' />
          <p className='inline-block'>Đăng xuất</p>
        </div>
      </li>
    </ul>
  );
};

export default DropDownAccount;
