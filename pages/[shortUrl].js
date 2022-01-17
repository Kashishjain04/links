import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ShortUrl = () => {
  const router = useRouter(),
    { shortUrl } = router.query,
    [error, setError] = useState("");

  useEffect(() => {
    if (shortUrl)
      fetch(`/api/get?shortUrl=${shortUrl}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            return setError(res.error);
          }
          const prefix1 = "http://",
            prefix2 = "https://";
          let longUrl = res.long;
          if (
            longUrl.substr(0, prefix1.length) !== prefix1 &&
            longUrl.substr(0, prefix2.length) !== prefix2
          ) {
            longUrl = prefix1 + longUrl;
          }
          location.replace(longUrl);
        })
        .catch((err) => setError(err.message));
  }, [shortUrl]);

  return (
    <div>
      <Head>
        <title>Loading</title>
      </Head>
    <div className="linkScreen h-screen w-screen flex items-center justify-center text-[#636b6f] font-[100]">
      <h3 className="border-r-[2px] text-[26px] px-[15px]">{error ? "Error" : "Loading"}</h3>
      <h3 className="text-[18px] px-[15px]">{error ? error : "Please Wait"}</h3>
    </div>
    </div>
  );
};

export default ShortUrl;
