import React from "react";
import Navbar from "./Navbar";
function Editor({ onLogout }) {
  return (
    <div>
      <Navbar onLogout={onLogout} />
    </div>
  );
}

export default Editor;
