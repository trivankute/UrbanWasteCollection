import { memo } from 'react'
import { Outlet } from 'react-router-dom';
import home from "../../assets/Backgrounds/Home.png"
import { useSelector } from 'react-redux';
import MenuResponsiveBar from '../../Components/MenuResponsiveBar/MenuResponsiveBar';

function HomePageLayout() {
    const backgroundImageStyle = {
        backgroundImage: `url(${home})`,
        backgroundSize: "cover",
        backgroundPosition: "center center"
    };
    return (<>
        <div className="min-h-screen w-full h-full" style={backgroundImageStyle}>
            <Outlet/>
        </div>
        <MenuResponsiveBar/>
    </>);
}

export default memo(HomePageLayout);