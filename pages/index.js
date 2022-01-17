import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState(""),
    [readOnly, setReadOnly] = useState(false);

  const shorten = () => {
    const prefix1 = "http://",
      prefix2 = "https://";
    let longUrl = url;
    if (
      longUrl.substr(0, prefix1.length) !== prefix1 &&
      longUrl.substr(0, prefix2.length) !== prefix2
    ) {
      longUrl = prefix1 + longUrl;
    }
    fetch("/api/shorten", {
      method: "POST",
      body: JSON.stringify({ longUrl }),
    })
      .then((res) => res.json())
      .then((res) => {
        setUrl(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.short);
        setReadOnly(true);
      })
      .catch((err) => console.log(err.message));
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <Head>
        <title>Links</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="bg-gray-100 min-h-screen px-2">
        <h1 className="text-center text-3xl md:text-4xl font-bold py-10">
          Links
        </h1>
        <div className="bg-white rounded-md w-full max-w-3xl mx-auto flex items-center p-2 md:p-4 space-x-0 space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
          <input
            disabled={readOnly}
            type="url"
            placeholder="URL Here..."
            className={
              "text-sm md:text-lg flex-1 border p-2 rounded-md w-full sm:w-auto" +
              (readOnly && "cursor-not-allowed")
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={readOnly ? copyHandler : shorten}
            className="bg-[#eb7f00] text-white text-sm md:text-lg font-medium p-2 rounded-md w-full sm:w-auto"
          >
            {readOnly ? "Copy URL" : "Shorten"}
          </button>
        </div>
      </main>
    </div>
  );
}
