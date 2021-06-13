import { GetServerSideProps } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";

import { getListChapter } from "../../helpers/getMangaInfo";
import NotFound from "../../components/error/NotFound";
import { Chapter } from "../../interfaces/intefaces";

interface IParams extends ParsedUrlQuery {
  id: string;
}

export default function ChapterDetail(props: {
  id: string;
  base_url: string;
  temp_token: string;
}) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { id, base_url, temp_token } = props;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(`/api/chapter/${id}`, fetcher);

  useEffect(() => {
    if (!data) return;
    const mangaId = data.relationships.find(
      (relation: any) => relation.type === "manga"
    ).id;
    const getChapters = async () => {
      const listChapter = await getListChapter(mangaId);
      return listChapter;
    };
    getChapters().then((res) => {
      setChapters(res);
    });
    console.log(chapters);
  }, [data]);
  // if (error && error.response.status === 404) return <NotFound />;

  if (!data) {
    return <div className="h-screen">Loading...</div>;
  }

  return (
    <div className="w-11/12 mx-auto flex flex-col items-center">
      {data &&
        data.data.attributes.data.map((fileName: string) => (
          <div className="m-3" key={fileName}>
            <Image
              width={1000}
              height={1200}
              src={`${base_url}/${temp_token}/data/${data.data.attributes.hash}/${fileName}`}
              alt="fetching image, please wait..."
              layout="intrinsic"
              priority={true}
            />
          </div>
        ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as IParams;
  return {
    props: {
      id,
      base_url: process.env.BASE_URL,
      temp_token: process.env.TEMP_TOKEN,
    },
  };
};
