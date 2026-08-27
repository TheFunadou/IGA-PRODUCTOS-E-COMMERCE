import Marquee from "react-fast-marquee";
import { FaPeopleGroup, FaTruck } from "react-icons/fa6";
import { HiShieldCheck } from "react-icons/hi2";
import { useMediaQuery } from "../../global/hooks/useMediaQuery";

const BANNER_ITEMS = [
    { icon: FaTruck, text: "Envíos a todo México" },
    { icon: HiShieldCheck, text: "Compra segura" },
    { icon: FaPeopleGroup, text: "Atención a empresas" },
];

const NavbarBannerDesktop = () => (
    <div className="bg-blue-950 flex items-center justify-center py-2 text-white">
        {BANNER_ITEMS.map((item, i) => (
            <div key={i} className="flex gap-2 px-5 items-center justify-center text-center">
                <item.icon />
                <p className="text-center text-base">{item.text}</p>
            </div>
        ))}
    </div>
);

const NavbarBannerMobile = () => (
    <div className="bg-blue-950 py-2 text-white overflow-hidden">
        <Marquee speed={40} pauseOnHover gradient={false}>
            {[...BANNER_ITEMS, ...BANNER_ITEMS].map((item, i) => (
                <div key={i} className="flex gap-2 px-5 items-center whitespace-nowrap">
                    <item.icon />
                    <p className="text-sm">{item.text}</p>
                </div>
            ))}
        </Marquee>
    </div>
);

export const NavbarBanner = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    return isDesktop ? <NavbarBannerDesktop /> : <NavbarBannerMobile />;
};

export default NavbarBanner;
