"use client";

import dynamic from "next/dynamic";
import IssDataProvider, { IssContext } from "./_components/issDataProvider";
import { useContext } from "react";

const IssMap = dynamic(() => import("./_components/issMap"), { ssr: false });

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center z-50">
      <h1 className="text-2xl font-bold mb-4">Startseite</h1>
      <p className="mb-6">Hier kannst du die ISS-Daten sehen:</p>
      <IssDataProvider>
        <IssMapWrapper />
      </IssDataProvider>
    </div>
  );
}

function IssMapWrapper() {
  const { data, orbitPath } = useContext(IssContext);
  return <IssMap data={data} orbitPath={orbitPath} />;
}
