"use client"
import {Provider} from "react-redux";
import {store} from "@/store/store";
import "../style/globals.scss";
import React from "react";






export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
        <body>
        <Provider store={store}>
            {children}
        </Provider>
        </body>
        </html>
    );
}
