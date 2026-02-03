import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ name, price, image, slug }) => {
  return (
    <Link to={`/produk/${slug}`} className="text-decoration-none text-dark">
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
        <div style={{ height: '250px' }}>
          <img src={image} className="w-100 h-100 object-fit-cover" alt={name} />
        </div>
        <div className="card-body p-3 text-center">
          <h6 className="fw-bold mb-1 text-truncate">{name}</h6>
          <p className="text-warning fw-bold small mb-0">{price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;