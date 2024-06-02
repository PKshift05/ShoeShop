import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, itemsPerPage, totalItems }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (pageNumber) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setCurrentPage(pageNumber);
  }

  return (
    <nav >
      <ul className='pagination  justify-content-center'>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => handleClick(number)} href="#!" className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;