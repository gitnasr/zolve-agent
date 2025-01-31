import "../public/index.css";

import React, { useEffect, useState } from "react";

import { Claude } from "./components/Claude";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";

const Options = () => {
   







    return (
        <>
        <Toaster position="bottom-center"/>
            <div className="min-h-screen bg-gray-950 p-4 text-white">
                <h1 className="my-5 text-2xl font-bold">Options</h1>
                <div className="container">
                  <Claude />
                </div>
            </div>

        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);