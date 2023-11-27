import { supabase } from "../supabaseClient";
import { useSessionContext } from "../hooks/useSession";
import { useState } from "react";
import Table from "./Table";
import Forecasting from "./Forecasting";

export default function Dashboard() {
    const { session } = useSessionContext();
    const [section, setSection]  = useState("Dashboard");

    return (
        <>
            <div className="bg-slate-900 w-full text-white">
                <div className="flex justify-between px-5">
                {/* Left section */}
                    <div className="inline-flex items-center space-x-4">
                        <h3 className="text-2x1 font-bold" style={{fontSize: '1.4em'}}>Telematica weather station</h3>
                            <p className="cursor-pointer" style={{fontSize: '1.1em'}} onClick={()=> setSection("Dashboard")}>Dashboard</p>
                            <p className="cursor-pointer" style={{fontSize: '1.1em'}} onClick={()=> setSection("Forecasting")}>Forecasting</p>
                    </div>


                    {/* Right section */}
                    <div className="py-2">
                        <p className="inline-flex items-center space-x-4 text-white text-align:center mx-2" style={{fontSize: '1.1em'}}>Correo: {session.user.email}</p>
                        <button className="p-3 rounded-full bg-slate-100 font-bold text-black" onClick={() => supabase.auth.signOut()}> Cerrar Sesi&oacute;n </button>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="w-full">
                <div className="px-5 py-4 border-b border-black">
                    <h1 className="text-4x1 font-bold" style={{fontSize: '1.5em'}}> {section} </h1>
                </div>
            </div>



            <div className="px-5 py-8">
                {section === "Dashboard" && <Table />}
                {section === "Forecasting" && <Forecasting />}
            </div>

        </>
    );
}