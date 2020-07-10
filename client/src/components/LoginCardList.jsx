import React from "react";
import LoginCard from "./LoginCard";
import { buttonsData } from '../data/home';

const CardList = () => {
    return buttonsData.map(app => {
        return (
            <LoginCard app={app} key={app.name} />
        );
    });
};

export default CardList;