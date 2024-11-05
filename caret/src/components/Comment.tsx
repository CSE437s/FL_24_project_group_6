import { delete_comment } from "~api";
import { useState } from "react";

export const Comment = ({isUser, index, username, text, url, selectedText, id }) => {
    const [render, setRender] = useState(true);
    const handleDelete = async () => {
        const result = await delete_comment(id)
        if (result.status == 200) {
          setRender(false)
        }
    }
    if (render) {
      return(
        <div
                    key={index}
                    className="p-4 bg-slate-100 mt-2 rounded-lg drop-shadow"
                  >
                    <div className = "flex">
                    <p className="font-medium text-emerald-600">
                     @ {username} :
                    </p>
                    <p>{text}</p>
                    </div>
                    <p className="italic text-customGreenLight">
                      {selectedText}
                    </p>
                    <div className="flex justify-between">
                    <p className="text-gray-500 truncate text-xs hover:text-gray-600 hover:underline">
                      <a target="_blank" rel="noopener noreferrer" href={url}>{url}</a>
                    </p>
                    {isUser && 
                    <button
            className="rounded inline-flex items-center bg-transparent text-customGreenDark"
            aria-label="Back"
            onClick={handleDelete}
          >
           <svg className = "fill-current w-4 h-4"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
    </svg>
          </button> }
          </div>
                    
                  </div>
    
        );
    }
    else {
      return <></>
    }
    
};