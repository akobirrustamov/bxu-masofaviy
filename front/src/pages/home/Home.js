import React, { useEffect, useState } from 'react';
import "./home.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import ApiCall, {baseUrl} from '../../config/index';
import {useNavigate} from "react-router-dom";





function Home(props) {
    const navigate = useNavigate()

    return (
        <div className="my-bg-second text-center  my-12">


            <button className={"bg-blue-600 rounded-2xl p-4 text-white"} onClick={()=>navigate("/admin/login")}>Login</button>
        </div>
    );
}

export default Home;
