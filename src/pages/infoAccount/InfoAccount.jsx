
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import {  selectUserInfo } from '../../redux-toolkit/slice/authSlice';




const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}


const InfoAccount = () => {
  const userinfo = useSelector(selectUserInfo)
  console.log(userinfo)

  let checkInputDone = {
    name: false,
    imgAvatar: false,
    password: false,
    passwordError: false
  }

  const [loading, setLoading] = useState(false);
  const [haveChangeImg, setHaveChangeImg] = useState(false);
  const displayEmail = localStorage.getItem('displayEmail')
  const displayName = localStorage.getItem('displayName')
  const password = localStorage.getItem('password')
  //
  const [allOrders, setAllOrders] = useState([])
  
  // const isGoogleUser = useSelector(state => state.auth.isGoogleUser)
  const dispatch = useDispatch()

  const [fileImg, setFileImg] = useState('')

  const avatar = localStorage.getItem('imgAvatar'); //link avt tren github
  //
  const [vouchers, setVouchers] = useState([])
  const [showVouchers, setShowVouchers] = useState(false)

  // src này `CHỈ ĐỂ KHI MỞ ẢNH MỚI` lên thì nó hiện trong khung, không liên quan gì đến firebase
  //khi reload lại thì phải lấy ảnh trong firebase hiển thị vì cái src này k có tác dụng với internet
  //cái link này không có tác dụng xem trên internet, base64 j đó k nhớ :V thích thì console.log ra mà nhìn
  const [src, setSrc] = useState({
    imgAvatar: "",
  })

  //đây là src ảnh trên firebase
  const [infoChange, setInfoChange] = useState({
    imgAvatar: "",
    name: displayName,
    password: "",
    newPassword: "",
    newPassword2: ""
  })

  const updateInfoChange = (e) => {
    setInfoChange({
      ...infoChange,
      [e.target.name]: e.target.value
    })
  }

  const getVouchers = async () => {

  }

  //kiểm tra đầu vào có đúng chưa, nếu ok hết thì mới cho submit
  const checkInvalidUser = (e) => {
    //Check tên trước, nếu hợp lệ thì mới check 3 ô input password
    if (!(infoChange.name.length >= 5 && infoChange.name.length <= 20)) {
      return {
        notify: "Tên hiển thị phải dài từ 5 đến 20 ký tự",
        status: false,
        changePass: false
      };
    }

    //check 3 ô input password
    let count = 0;
    if (infoChange.password !== "") count++;
    if (infoChange.newPassword !== "") count++;
    if (infoChange.newPassword2 !== "") count++;

    //Nếu không có ô nào được điền
    if (count == 0) {
      return {
        notify: "Thông tin tài khoản đã được cập nhật",
        status: true,
        changePass: false
      };
    }

    //chỉ cần điền 1 ô hoặc 2 ô thì có thông báo 'không được để trông inpout'
    if (count == 1 || count == 2) {
      return {
        notify: "Không được để trống input",
        status: false,
        changePass: false
      };
    }
    //Điền cả 3 ô, phải check điều kiện từng ô một
    else {
      if (!(/^[a-zA-Z0-9]{8,}$/).test(infoChange.newPassword)) {
        return {
          notify: "Mật khẩu mới phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
          status: false,
          changePass: false
        };
      }

      if (infoChange.newPassword !== infoChange.newPassword2) {
        return {
          notify: "Mật khẩu mới không chính xác",
          status: false,
          changePass: false
        };
      }
      //Nếu cả 3 thằng điền hợp lệ
      // handleChangePassword(e)
      return {
        notify: "Thông tin tài khoản đã được cập nhật",
        status: true,
        changePass: true
      };
    }
  }

  //khi cập nhật phải reset các ô input và update các thông tin, mở ra để đọc
  const resetAndUpdateInput = () => {
    //reset value về ô trống
    console.log('reset');
    setInfoChange({
      ...infoChange,
      password: "",
      newPassword: "",
      newPassword2: ""
    })
  }

  //XỬ LÍ KHI ĐĂNG KÍ THÌ UPLOAD AVATAR DEFAULT LUÔN CHO NHANH
  //LÚC XỬ LÍ CÁI BÌNH LUẬN, NẾU USER NÀO CHƯA CÓ AVATAR THÌ DÙNG CÁI ẢNH DEFAULT AVATAR NHƯ TRÊN FAFCEBOOK

  //sovle việc cập nhật avatar của user trên firebase
  //chỉ khi nào ấn cập nhật thì mới up ảnh lên firebase nhé :v tẹo về xử lí nốt că thằng add product
  const handleUpdateAvatar = async () => {
   
  }

  //xử lí việc cập nhật display name
  const handleChangeDisplayName = async (e) => {
    
  }

  //xử lí việc cập nhật mật khẩu
  const handleChangePassword = async (e) => {
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const { notify, status, changePass } = checkInvalidUser();

    if (!status && !changePass) {
      toast.error(notify, {
        autoClose: 1500,
      });
      setLoading(false);
    }

    //change displayName nhưng KHÔNG CHANGE PASSWORD
    else if (status && !changePass) {
      await handleChangeDisplayName(e);
      await handleUpdateAvatar()
      await solveOrders()
      await solveReviews()
      solveUsers()
    }

    //CÓ CHANGE PASSWORD & update password thành công
    else if (status && changePass) {
      if (infoChange.password === infoChange.newPassword) {
        setLoading(false);
        toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại', {
          autoClose: 1200,
        });
      }
      else {
        //await để xử lí việc nếu password hiện tại không đúng thì checkInputDone.passwordError = true và nó sẽ k đổi avt và name
        await handleChangePassword(e) //update password
        if (!checkInputDone.passwordError) {
          await handleChangeDisplayName(e) //update displayName
          await handleUpdateAvatar()
          await solveOrders()
          await solveReviews()
          solveUsers()
          resetAndUpdateInput()
        }
      }
    }
  }

  const solveReviews = async () => {

  }

  const solveOrders = async () => {

  }

  const solveUsers = async () => {

  }

  useEffect(() => {
    getVouchers()
  }, [])

  return (
    <>
      <div className="my-[30px] max-w-[1230px] mx-auto">
        <div className="px-[15px]">
          <div className="mb-4">
            <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thông tin mã giảm giá</span>
            <button
              onClick={() => {
                setShowVouchers(prev => !prev)
              }}
              className='mt-[20px] w-[250px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
              {loading ? <Spinning /> : "Xem mã giảm giá hiện có"}
            </button>
            <div
              style={{
                height: `${showVouchers ? vouchers.length * 32 + 38 : 0}px`
              }}
              className={`${showVouchers || 'h-0 opacity-0'} transition-all ease-linear duration-200 mt-4`}>
              <table className='w-[250px]'>
                <thead className='block w-full pb-2 mb-1 border-[3px] border-t-0 border-l-0 border-r-0 border-[#ccc]'>
                  <tr className='flex w-full justify-between'>
                    <td className="">Mã giảm giá</td>
                    <td className="">Giá trị (VNĐ)</td>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {vouchers.map((voucher) => (
                    <tr
                      key={voucher.voucherID}
                      className="flex justify-between border border-t-0 border-l-0 border-r-0 border-[#ddd] py-1">
                      <td className="">{voucher.code}:</td>
                      <td className="">{solvePrice(voucher.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{
            height: '.1875rem',
            width: '100%',
            backgroundPositionX: '-1.875rem',
            backgroundSize: '7.25rem .1875rem',
            backgroundImage: 'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
          }} className='my-6'></div>
          <form onSubmit={handleSubmit}>
            <div className="w-full mb-12 text-[#222] text-[14px] flex flex-col gap-5 ">
              <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thông tin tài khoản</span>
              <div className=''>
                <label className='mb-2 font-bold block'>Ảnh hiển thị</label>

                <span className='block mt-2 text-[#353535] text-[16px] italic'>Ảnh sẽ được tự động cắt theo hình tròn khi tải lên</span>
              </div>
              <p>
                <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                <input
                  value={displayName}
                  placeholder={displayName}
                  onChange={(e) => updateInfoChange(e)}
                  name="name"
                  className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]' id='account_display_name' type="text" />
                <span className='text-[#353535] text-[16px] italic'>Đây sẽ là cách mà tên của bạn sẽ được hiển thị trong phần tài khoản và trong phần đánh giá</span>
              </p>

              <p>
                <label className='mb-2 font-bold block'>Địa chỉ email *</label>
                <input
                  name="email"
                  autoComplete="off"
                  placeholder={displayEmail}
                  className='align-middle pointer-events-none bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi email</span>
              </p>
            </div>
            {/* HIỆN ĐANG ĐĂNG NHẬP BẰNG TÀI KHOẢN GOOGLE */}
            {/* NÓ BỊ NHẤP NHÁY DO NHẢY TỪ KHÔNG ĐĂNG NHẬP BẰNG GOOGLE -> ĐĂNG NHẬP BẰNG GOOGLE */}
            {/* GIẢI QUYẾT LÀ LƯU BIẾN NÀY VÀO LOCAL STROGATE */}
            
              <div className="w-full text-[#222] text-[14px] flex flex-col gap-5">
                <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thay đổi mật khẩu</span>
                <p>
                  <label className='mb-2 font-bold block' htmlFor="password_current">Mật khẩu hiện tại</label>
                  <input
                    autoComplete="off"
                    name="password"
                    value={password}
                    onChange={(e) => updateInfoChange(e)}
                    placeholder='Bỏ trống nếu không đổi'
                    className='placeholder:italic align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]'
                    id='password_current'
                    type="password" />
                </p>

                <p>
                  <label className='mb-2 font-bold block' htmlFor="password_1">Mật khẩu mới</label>
                  <input
                    value={infoChange.newPassword}
                    autoComplete="off"
                    placeholder='Bỏ trống nếu không đổi'
                    name="newPassword"
                    onChange={(e) => updateInfoChange(e)}
                    className='placeholder:italic align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]'
                    id='password_1'
                    type="password" />
                </p>

                <p>
                  <label className='mb-2 font-bold block' htmlFor="password_2">Xác nhận mật khẩu mới</label>
                  <input
                    autoComplete="off"
                    name="newPassword2"
                    value={infoChange.newPassword2}
                    onChange={(e) => updateInfoChange(e)}
                    className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]'
                    id='password_2'
                    type="password" />
                </p>
              </div>
            

            <button
              type="submit"
              className='mt-[20px] w-[150px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
              {loading ? <Spinning /> : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoAccount;