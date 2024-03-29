
"use client"

import FolderManager from "@/features/FolderManager";
import NoteEditor from "@/features/NoteEditor"
import NoteManager from "@/features/NoteManager";
import Footer from "@/layouts/Footer";
import Navbar from "@/features/NavbarFeature";


import { getAccessToken } from "@/lib/authUtils";
import { useEffect } from "react";



export default function () {

    //verify token and query new token at every interval before token expire
    //access_token lifetime is 10 minutes



    useEffect(() => {

        const gati = setInterval(() => { //get access token interval
            getAccessToken().then((jsonResponse) => {
                if (jsonResponse.error) alert(jsonResponse.error.message)
                else {
                    if (!jsonResponse.success) alert(jsonResponse.info)
                }
                console.log("new auth token received")
            }).catch((err) => {
                console.log(err)
            })
        }, 600000) // this time corresponds to the validity period of a token, ideally should be a few tens of seconds lower than the actual token validity period

        return () => {
            clearInterval(gati)
        }

    }, [])

    return (
        <main className="flex flex-col gap-6 min-h-screen bg-default-100">
            <Navbar />
            <div className="flex-grow flex flex-row justify-center">

                <div className="w-4/5 flex flex-row gap-8">
                    <div className=" w-1/5">
                        <FolderManager />
                    </div>
                    <div className="flex flex-row gap-8 flex-grow">

                        <div className="w-2/5 rounded-xl bg-neutral-50">
                            {/* noteManager */}
                            <NoteManager />
                        </div>
                        <div className="flex-grow w-3/5 flex flex-col ">
                            <NoteEditor />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}