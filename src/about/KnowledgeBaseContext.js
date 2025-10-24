import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const KnowledgeBaseContext = createContext();

export const KnowledgeBaseProvider = ({ children }) => {
  const [knowledgeBaseData, setKnowledgeBaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/knowledgeBase`;

  // Fetch Knowledge Base Data from Admin Panel
  const fetchKnowledgeBase = async () => {
    try {
      console.log("Fetching Knowledge Base data..."); // Debug Log
      const response = await axios.get(API_URL);
      console.log("Data received:", response.data); // Debug Log
      setKnowledgeBaseData(response.data);
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  return (
    <KnowledgeBaseContext.Provider value={{ knowledgeBaseData, loading }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
};

export const useKnowledgeBase = () => {
  return useContext(KnowledgeBaseContext);
};
