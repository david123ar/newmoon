import ResetPass from "@/component/ResetPass/page";
import React from "react";

export default async function page({ params }) {
  const param = await params;
  return (
    <div>
      <ResetPass token={param.token} />
    </div>
  );
}
