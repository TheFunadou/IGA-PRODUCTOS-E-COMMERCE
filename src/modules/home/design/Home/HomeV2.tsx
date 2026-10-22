import HeroV3 from "../../components/hero/HeroV3";
// import Promos from "../../components/promotions/Promos";
import ShopV3 from "../../../shop/design/shop/ShopV3";
import Banner1 from "../../components/banner/Banner1";
import MoreAbout from "../../components/MoreAbout";


export const HomeV2 = () => {
    return (
        <div>
            <HeroV3 />
            {/* <Promos /> */}
            <ShopV3 />
            <Banner1 />
            <MoreAbout />
        </div>
    );
};

export default HomeV2;
