import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <React.Fragment>
      <div>
        <Link href="/dashboard">Please visit here</Link>
      </div>
    </React.Fragment>
  );
}
