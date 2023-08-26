import React, { Fragment } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Banner from "../components/Banner/Banner";
import ListOfCategories from "../components/ListOfCategories/ListOfCategories";
import ListOfProducts from "../components/ListOfProducts/ListOfProducts";
import InfoAnother from "../components/InfoAnother/InfoAnother";

const HomePage = () => {
    const { data = [] } = useLoaderData();

    return (
        <Await
            resolve={data}
            errorElement={<p>Error loading package location!</p>}>
            <Fragment>
                <Banner />
                <ListOfCategories />
                <ListOfProducts data={data} />
                <InfoAnother />
            </Fragment>
        </Await>
    );
};

export default HomePage;
