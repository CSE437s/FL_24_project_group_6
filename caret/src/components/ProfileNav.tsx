import { useNavigate } from "react-router-dom";


export const ProfileNav = (props) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/other_profile", {
          state: { "user": props.current_user }
        });
    };
// <div className="absolute top-0 right-0 flex justify-end p-2">
console.log("rendered!");
    
    return (
        <div className="flex bg-white justify-between p-3 sticky top-0 z-50">
         <div>
          <p className = "text-customGreenDark font-bold">@{props.current_user}</p>
         </div>
       <div>
        <button
        className="rounded inline-flex items-center bg-transparent text-customGreenDark hover:text-customGreenLight"
        aria-label="Back"
        onClick={handleClick}
      >
        <svg className ="fill-current w-4 h-4"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
      </button>
        </div>
        </div>
            
      );
    }
    