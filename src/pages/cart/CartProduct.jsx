import React, { useEffect, useState } from 'react';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { deleteCartItem } from '../../redux-toolkit/action/cartAction';

const CartProduct = ({
  setLoading,
  setDone,
  quantityCart, setQuantityCart, idCartProduct,
  idProduct, name, category,size, img, price, quantityProduct,
}) => {
  const userID = useSelector(selectUserID) || localStorage.getItem('userID');
  const [quantity, setQuantity] = useState(quantityProduct || 1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteCartProduct = async (idCartProduct) => {
    setLoading(true);
    // Logic to delete product from cart
    dispatch(deleteCartItem(idCartProduct))
    setLoading(false);
    setDone(true)
  };

  
  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  useEffect(() => {
    setQuantityCart(prevState => ({
      ...prevState,
      [idCartProduct]: quantity,
    }));
  }, [quantity, idCartProduct, setQuantityCart]);

  return (
    <tr className='grid items-center gap-5 grid-cols-12 rounded-[4px] py-4 border-top border-bottom border-transparent border-b-[#ececec]'>
      <td className='col-span-6 grid grid-cols-7 gap-3 items-center'>
        <div
          onClick={() => handleDeleteCartProduct(idCartProduct)}
          className="group cursor-pointer hover:border-primary w-[26px] h-[26px] border-[2px] border-[#b8b8b8] rounded-full flex items-center justify-center border-top border-bottom transition-all ease-in-out duration-100">
          <FontAwesomeIcon className='text-[#b8b8b8] group-hover:text-primary text-[16px] transition-all ease-in-out duration-100' icon={faXmark} />
        </div>
        <img
          onClick={() => navigate(`/san-pham/${idProduct}`)}
          className='col-span-2 rounded-[4px] h-[60px] w-full object-cover cursor-pointer'
          src={img} alt={name} />
        <div className="col-span-4 flex flex-col">
          <span
            onClick={() => navigate(`/san-pham/${idProduct}`)}
            className='text-[16] font-medium text-[#334862] cursor-pointer line-clamp-1'>
            {name}
          </span>
          <span className='text-[#888] line-clamp-2'>
            {category}
          </span>
          <span className='text-[#888] line-clamp-2'>
            {size}
          </span>
        </div>
        
      </td>
      <td className='col-span-2'>
        <span className='text-[16px] font-bold'>
          {solvePrice(price)}<p className='inline-block text-[16px] align-top ml-[2px]'>₫</p>
        </span>
      </td>
      <td className='col-span-2 flex items-center border border-[#ddd] py-2'>
        <button
          onClick={() => setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1))}
          type='button' className='flex-1 flex items-center justify-center outline-none text-bgPrimary font-medium'>
          <FontAwesomeIcon className='text-[16px] font-medium' icon={faMinus} />
        </button>
        <div className='flex-1 text-bgPrimary outline-none text-center text-[16px] font-bold'>
          {quantity < 10 ? `0${quantity}` : quantity}
        </div>
        <button
          onClick={() => setQuantity(prevQuantity => prevQuantity + 1)}
          type='button' className='flex-1 flex items-center justify-center outline-none text-bgPrimary font-medium'>
          <FontAwesomeIcon className='text-[16px] font-bold' icon={faPlus} />
        </button>
      </td>
      <td className='col-span-2 flex items-center font-bold'>
        <p className='text-bgPrimary text-center text-[16px]'>{solvePrice(price * quantity)}</p>
        <p className='inline-block text-[16px] align-top ml-[2px]'>₫</p>
      </td>
    </tr>
  );
};

export default CartProduct;
