import clsx from "clsx";

type Props = {
    message:string;
    type: "Succesfull" | "Message" | "Error";
};


const Alert = ({type,message}:Props) => {
    return(
        <div role="alert" className={
            clsx(
                "alert toast shadow-lg toast-bottom toast-center duration-130 ease-in-out text-white mb-20",
                type === "Succesfull" && "bg-blue-900",
                type === "Message" && "bg-info",
                type === "Error" && "bg-error"
            )
        }>
            <p className="text-lg">{message}</p>
        </div>
    );
};

export default Alert;