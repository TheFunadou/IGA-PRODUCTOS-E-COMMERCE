import { useState } from "react";

type Props = {
    rate: number;
};

const RatingReadComponent = ({ rate }: Props) => {
    const [list, setList] = useState<boolean[]>([false, false, false, false]);

    const newList = [...list];

    if (rate >= 1 && rate <= newList.length) {
        newList[rate - 1] = true;
    };
    setList(newList);

    return (
        <div className="rating [&_div]:bg-blue-500">
            {list.map ((rate,index) => (
                <div key={index} className="mask mask-star" aria-label={`${index} star`} aria-checked={rate}></div>
            ))}

        </div>
    );
};

export default RatingReadComponent;