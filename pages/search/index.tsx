import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";

import ListManga from "../../components/manga/ListManga";
import { Manga } from "../../interfaces/intefaces";
import { getCoverIds, getListManga } from "../../helpers/getMangaInfo";
import ListMangaSke from "../../components/skeleton/ListMangaSke";
import Pagination from "../../components/pagination/Pagination";

export default function Search() {
  const [listManga, setListManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const router = useRouter();
  const { title } = router.query;
  let p = parseInt(router.query.p as string);
  p = p || 1;

  useEffect(() => {
    setLoading(true);
    setListManga([]);
    if (!router.isReady) return;
    axios.get(`/api/manga/search?title=${title}&p=${p}`).then((res) => {
      setNotFound(false);
      const data = res.data;
      if (!data.results.length) {
        setLoading(false);
        setNotFound(true);
        return;
      }
      console.log(data);
      setTotalPage(Math.ceil(data.total / 100));
      const coverIds = getCoverIds(data.results);
      axios
        .get(`/api/cover?coverIds=${coverIds}`)
        .then((res) => {
          const mangas = getListManga(data.results, res.data);
          setListManga(mangas);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        })
        .catch(() => {
          return "";
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [title, p, router.isReady]);

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <div className="container">
        <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3 mt-3">
          Result
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6 mt-5">
          {listManga.length
            ? listManga.map((manga: Manga) => (
                <Link key={manga.id} href={`/manga/${manga.id}`}>
                  <a>
                    <ListManga manga={manga} />
                  </a>
                </Link>
              ))
            : null}
          {loading && (
            <>
              {Array.from(Array(12).keys()).map((_, index) => (
                <ListMangaSke key={index} />
              ))}
            </>
          )}
          {notFound && (
            <p className="text-white col-span-full h-screen">
              No results match title {title}
            </p>
          )}
        </div>

        <Pagination p={p} totalPage={totalPage} />
      </div>
    </>
  );
}
