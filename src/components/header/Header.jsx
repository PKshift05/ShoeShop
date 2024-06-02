import React, { useState, useEffect, useCallback } from 'react';
import { faSearch, faShapes, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './Nav';
import './headerScroll.scss';
import { navData } from './navData';
import DropDownAccount from './DropDownAccount';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT, selectIsLoggedIn, selectEmail } from '../../redux-toolkit/slice/authSlice';
import DropDownCart from './DropDownCart';
import DropDownSearch from './DropDownSearch';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoverAccount, setHoverAccount] = useState(false);
  const [hoverCart, setHoverCart] = useState(false);
  const [hoverSearch, setHoverSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userEmail = localStorage.getItem('displayName')

  const handleScroll = useCallback(() => {
    if (window.pageYOffset > 254) {
      setScrolled(true);
    } else if (window.pageYOffset === 0) {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const logoutUser = () => {
    dispatch(LOGOUT());
    navigate('/');
  };

  return (
    <>
      <div className={`${scrolled ? "" : "absolute"} z-[99999] h-[125px] w-full`}></div>
      <header className={`${scrolled ? "stuck fixed" : "relative"} z-[99999] h-[125px] w-full text-white/80`}>
        <div className="h-[72px] bg-bgPrimary">
          <div className="grid grid-cols-12 grid-rows-1 h-full px-[15px] max-w-[1230px] mx-auto">
            <div className='col-span-4 flex items-center'>
              {isLoggedIn ? (
                <div
                  onMouseEnter={() => setHoverAccount(true)}
                  onMouseLeave={() => setHoverAccount(false)}
                  className='cursor-pointer text-[13px] py-[10px] font-bold tracking-[0.32px] no-underline text-white/80 hover:text-white transition-all ease-linear duration-200 relative'>
                  <FontAwesomeIcon icon={faUser} className='cursor-pointer pr-[10px] text-[18px]' />
                  <p className='uppercase inline-block'>{userEmail}</p>
                  {hoverAccount && <DropDownAccount logoutUser={logoutUser} setHoverAccount={setHoverAccount} />}
                </div>
              ) : (
                <NavLink
                  to="/dang-nhap"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className='text-[13px] cursor-pointer py-[10px] hover:text-white transition-all ease-linear duration-200 font-bold tracking-[0.32px] no-underline uppercase text-white/80'>
                  Đăng nhập / Đăng ký
                </NavLink>
              )}
            </div>
            <NavLink
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="col-span-4 py-[10px] h-full">
              <div
                style={{ backgroundImage: "url(../../logo.png)" }}
                className="w-full h-full bg-contain bg-no-repeat bg-center"></div>
            </NavLink>
            <div className="col-span-4 ml-auto flex gap-[15px] items-center">
              <div
                onMouseEnter={() => setHoverSearch(true)}
                onMouseLeave={() => setHoverSearch(false)}
                className="relative flex items-center py-[22px] pl-4 pr-2">
                <FontAwesomeIcon icon={faSearch} className='cursor-pointer text-[18px]' />
                {hoverSearch && <DropDownSearch setHoverSearch={setHoverSearch} />}
              </div>
              <div
                onMouseEnter={() => {
                  if (window.location.pathname !== '/gio-hang') setHoverCart(true);
                }}
                onMouseLeave={() => {
                  if (window.location.pathname !== '/gio-hang') setHoverCart(false);
                }}
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  navigate(isLoggedIn ? '/gio-hang' : '/dang-nhap');
                  setHoverCart(false);
                }}
                className="flex gap-[10px] cursor-pointer py-[22px] text-[13px] font-bold items-center no-underline tracking-[0.32px] hover:text-white transition-all ease-linear duration-200 relative">
                <span className="uppercase">Giỏ hàng / Thanh toán</span>
                <FontAwesomeIcon icon={faShoppingCart} className='text-[18px]' />
                {hoverCart && isLoggedIn && <DropDownCart setHoverCart={setHoverCart} />}
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-[25px] w-full shadow-shadowAccounts bg-[#d3d3d3]">
          <div className="px-[15px] max-w-[1230px] mx-auto">
            <ul className="flex w-full gap-[30px] justify-center">
              {navData.map((nav) => (
                <Nav key={nav.name} name={nav.name} to={nav.to} />
              ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
