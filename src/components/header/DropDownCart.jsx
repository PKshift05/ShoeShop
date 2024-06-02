import React, { useEffect } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import './headerScroll.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Spinning } from '../../animation-loading';
import { fetchCartItems, deleteCartItem } from '../../redux-toolkit/action/cartAction';
import { selectCartItems, selectCartStatus, selectTotalPayment } from '../../redux-toolkit/slice/cartSlice';

const DropDownCart = ({ setHoverCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector(selectCartItems);
  const totalPayment = useSelector(selectTotalPayment);
  const status = useSelector(selectCartStatus);
  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  const handleDeleteItem = (itemId) => {
    dispatch(deleteCartItem(itemId));
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 text-[16px] min-w-[260px] rounded-[3px] bg-white shadow-shadowAccount drop-down-cart z-[2] mt-3 p-5 font-medium cursor-default"
    >
      {loading ? (
        <div className="h-[180px] cursor-default">
          <Spinning color='#1f2028' size='30px' />
        </div>
      ) : cartProducts.length === 0 ? (
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          <div
            style={{ backgroundImage: "url('../../emptyCart.png')" }}
            className="w-[200px] h-[180px] bg-contain bg-no-repeat bg-center"
          ></div>
          <div className='text-center text-[16px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>
            Giỏ hàng hiện đang trống
          </div>
        </div>
      ) : (
        <>
          <div className="max-h-[40vh] overflow-y-scroll cursor-default">
            {cartProducts.map(cartProduct => (
              <div
                key={cartProduct.id}
                className='flex items-start justify-between border border-transparent border-b-[#ececec] pt-[10px] pb-[5px]'
              >
                <img
                  onClick={() => {
                    navigate(`/san-pham/${cartProduct.id}`);
                    setHoverCart(false);
                    window.scrollTo({ top: 0 });
                  }}
                  className='w-[60px] h-[60px] object-cover cursor-pointer'
                  src={cartProduct.path ? cartProduct.path.split(',')[0].trim() : ''}
                  alt=""
                />
                <div className="flex-1 text-bgPrimary ml-[10px]">
                  <div
                    onClick={() => {
                      navigate(`/san-pham/${cartProduct.id}`);
                      setHoverCart(false);
                      window.scrollTo({ top: 0 });
                    }}
                    className="text-[#334862] text-[14px] line-clamp-3 mb-[5px] cursor-pointer hover:text-bgPrimary"
                  >
                    {cartProduct.name}
                  </div>
                  <div className="text-[#999] opacity-90 text-[13px]">
                    {cartProduct.quantity} × {solvePrice(cartProduct.price)} ₫
                  </div>
                </div>
                <div
                  onClick={() => handleDeleteItem(cartProduct.id)}
                  className="group cursor-pointer hover:border-primary w-[26px] h-[26px] border-[2px] border-[#b8b8b8] rounded-full flex items-center justify-center transition-all ease-in-out duration-150 mt-2"
                >
                  <FontAwesomeIcon className='text-[#b8b8b8] group-hover:text-primary text-[16px] transition-all ease-in-out duration-100' icon={faXmark} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex py-[10px] justify-center gap-1 text-[#777] font-bold border border-transparent border-b-[#ececec] cursor-default">
            <h1 className=''>Tổng phụ:</h1>
            <p className=''>{solvePrice(totalPayment)} ₫</p>
          </div>
          <div className="w-full pt-[10px] pb-2">
            <button
              onClick={() => {
                setHoverCart(false);
                navigate('/gio-hang');
              }}
              className='w-full flex justify-center bg-primary text-white px-4 py-2 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'
            >
              <span className='text-[16px] text-center uppercase'>Xem giỏ hàng</span>
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => {
                setHoverCart(false);
                navigate('/thanh-toan/bill-info');
              }}
              className='w-full flex justify-center bg-secondary text-white px-4 py-2 hover:bg-[#a6573c] transition-all ease-linear duration-[120ms]'
            >
              <span className='text-[16px] text-center uppercase'>Thanh toán</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DropDownCart;
