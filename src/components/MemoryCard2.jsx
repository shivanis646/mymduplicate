import React from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryCard.css"; // or your card styling
// memory prop contains: id, title, tags, preview, image
function MemoryCard2({ memory }) {
  return (
    <div className="memory-card2">
      <div className="memory-image2">
        <img src={memory.images[0]} alt={memory.title} />
      </div>
      <div className="memory-info2">
        <h2>{memory.title}</h2>
        <p>{memory.tags}</p>
        <p>{memory.preview}<Link to={`/vaultmemory/${memory.id}`} className="read-more-btn">...Read More</Link></p>
        
      </div>
      <div
        className={`status-tag ${memory.isPublic ? 'public' : 'private'}`}
      >
        {memory.isPublic ? 'Public' : 'Private'}
      </div>
    </div>
  );
}

export default MemoryCard2;
