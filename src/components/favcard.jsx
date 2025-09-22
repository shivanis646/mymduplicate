import React from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryCard.css"; // or your card styling
// memory prop contains: id, title, tags, preview, image
import { FaHeart, FaRegHeart } from 'react-icons/fa';
function FavCard({ memory }) {
  return (
    <div className="memory-card2">
      <div className="memory-image2">
        <img src={memory.images[0]} alt={memory.title} />
      </div>
      <div className="memory-info2">
        <h2>{memory.title}</h2>
        <p>{memory.tags}</p>
        <p>{memory.preview}<Link to={`/favmemory/${memory.id}`} className="read-more-btn">...Read More</Link></p>

      </div>
      <div
        className={`status-tag ${memory.isFavorite ? 'liked' : 'unliked'}`}
      >
        {memory.isFavorite ? <FaHeart size={25} color='#ec4e4eff' /> : <FaRegHeart size={25} color='#ec4e4eff' />}
      </div>
    </div>
  );
}

export default FavCard; 
