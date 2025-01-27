"use client";
import React, { useState } from "react";
import Hero from "../Hero/Hero";
import Trending from "../Trending/Trending";
import Share from "../Share/Share";
import Featured from "../Featured/Featured";
import MainContainer from "../MainContainer/MainContainer";
import Navbar from "../Navbar/Navbar";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import { SessionProvider } from "next-auth/react";
import Profilo from "../Profilo/Profilo";

const Home = ({ data, existingAnime }) => {
  const [selectL, setSelectL] = useState("en");
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const lang = (lang) => {
    setSelectL(lang);
  };

  return (
    <div>
      <SessionProvider>
        <Navbar
          lang={lang}
          sign={sign}
          setProfiIsOpen={setProfiIsOpen}
          profiIsOpen={profiIsOpen}
        />
        {profiIsOpen ? (
          <Profilo setProfiIsOpen={setProfiIsOpen} profiIsOpen={profiIsOpen} />
        ) : (
          ""
        )}
        {logIsOpen ? (
          <SignInSignUpModal
            logIsOpen={logIsOpen}
            setLogIsOpen={setLogIsOpen}
            sign={sign}
          />
        ) : (
          ""
        )}
        <div>
          <Hero
            trendingAnime={data?.spotlights || []}
            existingAnime={existingAnime}
            selectL={selectL}
          />
          <Trending data={data?.trending || []} selectL={selectL} />
          <Share ShareUrl="https://animoon.me/" />
          <Featured data={data || {}} selectL={selectL} />
          <MainContainer data={data || {}} selectL={selectL} />
        </div>
        <div>Foot</div>
      </SessionProvider>
    </div>
  );
};

export default Home;
