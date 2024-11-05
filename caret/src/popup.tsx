import { MemoryRouter } from "react-router-dom";
import { Routing } from "./routes";
import "~style.css";

function IndexPopup() {
  return (
    <div className="w-[320px] h-[450px] bg-white rounded-lg shadow-md">
      <MemoryRouter>
        <Routing />
      </MemoryRouter>
    </div>
  );
}

export default IndexPopup;