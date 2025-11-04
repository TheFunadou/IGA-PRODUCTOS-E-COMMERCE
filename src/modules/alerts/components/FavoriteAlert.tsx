import { IoMdHeart } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";

type Props = {
    message:string;
    type: "add" | "remove" | null;
};


const FavoriteAlert = ({message,type}:Props) => {

    if(type === null){
        console.error("The favorite type cannot be null, only accept ->  'add' or 'remove' ")
    };

    return(
        <div role="alert" className="alert border-primary bg-blue-900 toast shadow-lg toast-bottom toast-center text-white mb-20">
            <p className="text-lg flex gap-2 items-center justify-center">{message}
                {type === "add" && <IoMdHeart className="text-2xl"/>}
                {type === "remove" && <FaRegCheckCircle className="text-2xl"/>}
            </p>
        </div>
    );
};

export default FavoriteAlert;