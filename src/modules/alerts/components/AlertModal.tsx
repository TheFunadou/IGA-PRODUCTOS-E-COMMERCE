import {type RefObject } from "react";

type Props = {
    title: string;
    message: string;
    refName: RefObject<HTMLDialogElement | null>;
    onClose?: () => void | undefined;
}

const AlertModal = ({title,message,refName, onClose}:Props) => {

    return (
        <dialog className="modal" ref={refName}>
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
            </div>
        </dialog>
    );
};

export default AlertModal;