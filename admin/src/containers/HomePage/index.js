import React, { memo } from "react";
import { auth } from "strapi-helper-plugin";
import { Block, Container } from "./components";

const HomePage = ({ global: { plugins }, history: { push } }) => {
  const name = auth?.getUserInfo();

  return (
    <>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Block>Welcome back {name}!</Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
