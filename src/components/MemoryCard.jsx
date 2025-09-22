import React from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryCard.css"; // or your card styling
// memory prop contains: id, title, tags, preview, image

const MemoryCard = ({ memory }) => {
  return (
    <div className="memory-card">
      <img src={memory.images[0]}  />
      <div className="mem">
      <h2>{memory.title}</h2>
      <p>{memory.tags}</p>
      <p>{memory.preview.slice(0, 100)}

      {/* ✅ Link to dynamic memory detail page */}
      <Link to={`/memory/${memory.id}`} className="read-more-btn">
        ...Read More
      </Link>
      </p>
      </div>
    </div>
  );
};

export default MemoryCard;

