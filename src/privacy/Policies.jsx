import React, { useState } from "react";
import "./Policies.css";

const Policies = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="policies-container">
      <div className="policies-content">
        <iframe
          src="/Policies.pdf"
          type="application/pdf"
          width="100%"
          height="800px"          
          onLoad={() => setIsLoading(false)}
          className={isLoading ? "loading" : "loaded"}
        />
      </div>
    </div>
  );
};

export default Policies;
