import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

import ListManga from "../../components/manga/ListManga";
import { Manga } from "../../interfaces/intefaces";
import { getCoverIds, getListManga } from "../../helpers/getMangaInfo";

export default function Search() {
  const [listManga, setListManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const { title } = router.query;

  useEffect(() => {
    axios.get(`/api/manga/search?title=${title}`).then((res) => {
      const data = res.data;
      setLoading(false);
      if (!data.results.length) {
        setNotFound(true);
        return;
      }
      console.log(data);
      const coverIds = getCoverIds(data.results);
      axios
        .get(`/api/cover?coverIds=${coverIds}`)
        .then((res) => {
          const mangas = getListManga(data.results, res.data);
          setListManga(mangas);
        })
        .catch(() => {
          return "";
        });
    });
  }, [title]);

  return (
    <div className="w-11/12 mx-auto">
      <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3 mt-3">
        Result
      </p>
      <div className="grid grid-cols-6 gap-6 mt-5 min-h-screen">
        {listManga.length
          ? listManga.map((manga: Manga) => (
              <Link key={manga.id} href={`/manga/${manga.id}`}>
                <a>
                  <ListManga manga={manga} />
                </a>
              </Link>
            ))
          : null}
        {loading && <p className="text-white col-span-full">Loading...</p>}
        {notFound && (
          <p className="text-white col-span-full">
            No results match title {title}
          </p>
        )}
      </div>
    </div>
  );
}
