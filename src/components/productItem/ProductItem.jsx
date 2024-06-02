import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ButtonPrimary from '../button/ButtonPrimary';
import "../../components/lineClamp.scss";
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUserID } from '../../redux-toolkit/slice/authSlice';
import { toast } from 'react-toastify';
import { addItemToCart } from '../../redux-toolkit/action/cartAction';

const ProductItem = ({
  setIdxActive, setHoverShowProduct, setTranslateShowX,
  setTranslateX, setHoverSimilarProduct,
   productCode, img, name, price, text, width, setLoadingPage
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userID = useSelector(selectUserID) || localStorage.getItem('userID');
  const logined = useSelector(selectIsLoggedIn) || JSON.parse(localStorage.getItem('logined'));

  const handleAddToCart = async () => {
    if (loading) return;

    setLoading(true);
    navigate(`/san-pham/${productCode}`)
  };

  return (
    <div className={`bg-white ${width ? "" : 'w-full'}`}>
      <div>
        <NavLink
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className='block h-[150px] touch-none'
          draggable="false"
          onClick={(e) => {
            if (setTranslateX) setTranslateX(0);
            if (setHoverSimilarProduct) setHoverSimilarProduct(false);
            if (setIdxActive) setIdxActive(0);
            if (setHoverShowProduct) setHoverShowProduct(false);
            if (setTranslateShowX) setTranslateShowX(0);
            if (setLoadingPage) setLoadingPage(true);
            window.scrollTo({
              top: 0,
            });
          }}
          to={`/san-pham/${productCode}`}
        >
          <img className='w-full h-full object-contain' src={img} alt="" />
        </NavLink>
      </div>
      <div className="pt-[10px] px-[10px] pb-[20px] flex flex-col justify-center">
        <div className="mb-[10px] text-bgPrimary line-clamp-1 text-center">
          <NavLink
            onDragStart={(e) => e.preventDefault()}
            onMouseUp={(e) => e.preventDefault()}
            onClick={() => {
              if (setTranslateX) setTranslateX(0);
              if (setHoverSimilarProduct) setHoverSimilarProduct(false);
              if (setLoadingPage) setLoadingPage(true);
              window.scrollTo({
                top: 0,
              });
            }}
            to={`/san-pham/${productCode}`}
          >
            {name}
          </NavLink>
        </div>
        <div className="text-bgPrimary font-bold flex justify-center">
          {price}
          <p className='inline-block text-[14px] align-top ml-[2px]'>₫</p>
        </div>
        <div>
          <ButtonPrimary
            loading={loading}
            onClick={() => {
              if (!logined) {
                window.scroll({
                  top: 0,
                  behavior: 'smooth',
                });
                navigate('/dang-nhap');
              } else {
                handleAddToCart();
              }
            }}
            text={text}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
