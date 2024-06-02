import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCancelOrder, fetchOrders } from '../../redux-toolkit/action/orderAction';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import { faLongArrowAltLeft, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Notiflix from 'notiflix';
import { toast } from 'react-toastify';

const solveCategory = (category) => {
  switch (category) {
    case 'giay-nam':
      return 'Giày nam';
    case 'giay-nu':
      return 'Giày nữ';
    case 'giay-tre-em':
      return 'Giày trẻ em';
    default:
      return '';
  }
}

const solveBrand = (brand) => {
  switch (brand) {
    case 'classic':
      return 'Classic';
    case 'sunbaked':
      return 'Sunbaked';
    case 'chuck-07s':
      return 'Chuck 07S';
    case 'one-star':
      return 'One Star';
    case 'psy-kicks':
      return 'PSY Kicks';
    default:
      return '';
  }
}

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const MyOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [allOrdersSort, setAllOrdersSort] = useState([]);
  const [activeStatus, setActiveStatus] = useState('All');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setAllOrdersSort(
      activeStatus !== 'All' ? orders.filter(order => order.status === activeStatus) : orders
    );
  }, [activeStatus, orders]);
console.log(allOrdersSort)
console.log(activeStatus)

  return (
    <>
      <OverlayLoading loading={loading}>
        <div className={`w-full py-[30px] min-h-[800px] bg-white ${loading && 'blur-[2px]'}`}>
          <div className="max-w-[1230px] mx-auto">
            <div className="w-full px-[15px] pb-[30px]">
              <div className='w-full'>
                {orders.length === 0 && !loading
                  ? (
                    <div className="w-full h-[480px] flex flex-col gap-8 items-center justify-center">
                      <div
                        style={{
                          backgroundImage: "url('/emptyOrder.jpg')"
                        }}
                        className="w-[420px] h-[500px] bg-cover bg-no-repeat bg-center"></div>
                      <div className='text-center text-[28px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Chưa có đơn hàng nào được tạo ra
                      </div>
                      <NavLink
                        to='/'
                        className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                        <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                        <span className='text-[20px]'>Quay lại trang chủ</span>
                      </NavLink>
                    </div>
                  )
                  : (
                    <>
                      {/* nav */}
                      <div className="w-full grid grid-cols-5 grid-rows-1 item shadow-shadowPrimary mb-5">
                        {['All', 'Pending', 'Shipping', 'Shipped', 'Cancelled']
                          .map(item => (
                            <button
                              key={item}
                              onClick={() => setActiveStatus(item)}
                              value={item}
                              className={`${activeStatus === item && 'border-b-primary text-primary'} text-center text-bgPrimary cursor-pointer transition-all ease-in-out duration-150 border-[2px] border-transparent hover:text-primary font-medium py-3`}>{item.toUpperCase()}</button>
                          ))}
                      </div>
                      {/* products */}
                      {allOrdersSort.length === 0 && !loading
                        ? (
                          <div className="w-full h-[380px] flex flex-col gap-10 items-center justify-center">
                            <img className='w-full h-[250px] object-contain' src="../../orderNoExist.png" alt="" />
                            <h1 className='text-center text-[22px] font-bold text-bgPrimary leading-[32px] uppercase'>
                              Chưa có đơn hàng nào
                              <p className="inline-block text-primary ml-[6px]">{activeStatus}</p>
                            </h1>
                          </div>
                        )
                        : (
                          allOrdersSort.map((order) => (
                            <OrderProduct key={order.id} order={order} />
                          ))
                        )}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading>
    </>
  );
};

const OrderProduct = ({ order }) => {
  const dispatch= useDispatch();
  const handleCancelOrder = async () => {
    try {
      const resultAction = await dispatch(fetchCancelOrder({orderId : order.id}));
      // Logic to handle cancel order
      toast.success('Hủy đơn hàng thành công', {
        autoClose: 1200
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  const confirmCancelOrder = (e) => {
    e.preventDefault();
    Notiflix.Confirm.show(
      'Hủy đặt hàng',
      'Bạn có muốn hủy đơn hàng này không?',
      'Hủy đơn hàng',
      'Hủy bỏ',
      function okCb() {
        handleCancelOrder();
      },
      function cancelCb() {
        console.log();
      },
      {
        zindex: 2000,
        width: '352px',
        zindex: 999999,
        fontFamily: 'Roboto',
        borderRadius: '4px',
        titleFontSize: '18px',
        titleColor: '#c30005',
        messageFontSize: '16px',
        cssAnimationDuration: 300,
        cssAnimationStyle: 'zoom',
        buttonsFontSize: '16px',
        okButtonBackground: '#c30005',
        cancelButtonBackground: '#a5a3a3',
        backgroundColor: '##d8d8d8',
        backOverlayColor: 'rgba(0,0,0,0.4)',
      },
    );
  }

  return (
    <div className="w-full p-6 pt-3 mb-4 shadow-shadowPrimary">
      {/* top */}
      <div className="pb-3 border border-transparent border-b-[#ddd] flex justify-between items-center">
        <div className="text-bgPrimary font-bold text-[14px] uppercase">
          <p className="inline-block text-primary mr-1">Ngày đặt hàng:</p>
          <p className='inline-block'>{`${order.createdDate} `}</p>
          <div className="inline-flex px-2 border border-[#777] ml-2 text-[14px] items-center justify-center">
            <p className="inline-block text-primary uppercase">{order?.status}</p>
          </div>
        </div>
        <div className='flex gap-3 items-center'>
          <NavLink
            to={`/chi-tiet/${order?.id}`}
            className='bg-primary text-white px-4 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
            <span className='tracking-wider uppercase text-[14px] font-medium'>Xem đơn hàng</span>
          </NavLink>
          {order.status !== 'Shipped' && order.status === 'Pending' && (
            <button
              onClick={confirmCancelOrder}
              className='bg-primary text-white px-4 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
              <span className='tracking-wider uppercase text-[14px] font-medium'>Hủy</span>
            </button>
          )}
        </div>
      </div>
      {/* bottom */}
      <div className="w-full flex items-center justify-between pt-4">
        <div className="flex">
          <NavLink to={`/san-pham/${order.code}`}>
            <img className="h-[80px] object-cover" src={order.path ? order.path.split(',')[0].trim() : ''} alt="" />
          </NavLink>
          <div className="pl-4">
            <div className="">
              <NavLink to={`/san-pham/${order.code}`} className='text-[#334862]'>
                {order.name}
              </NavLink>
              <p className='inline-block ml-1'> ×{order.quantity}</p>
            </div>
            <div className="text-[14px] text-[#777]">
              <p className="mr-1 inline-block">Size: </p>
              <div className="inline-block">
                <p className="mr-1 inline-block">{order.size}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-col items-end">
          
          <div className="text-[#777] text-[14px] flex items-center">
            <p className="inline-block">Thành tiền: </p>
            <p className="text-primary font-medium text-[15px]">
              {solvePrice(order.total)}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrder;
