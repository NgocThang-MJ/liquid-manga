// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Result, SubTag } from "../../../interfaces/intefaces";

export default async function GetMangaInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const response = await axios.get(`https://api.mangadex.org/manga/${id}`);
    const mangaInfo: Result = response.data;

    const coverId = mangaInfo.relationships.find(
      (relation) => relation.type === "cover_art"
    )?.id;
    const coverInfo = await axios.get(
      `${process.env.BASE_URL_DEX}/cover/${coverId}`
    );
    const fileName = coverInfo.data.data.attributes.fileName;

    const tags = mangaInfo.data.attributes.tags.map((tag: SubTag) => {
      return { id: tag.id, name: tag.attributes.name.en };
    });
    const altTitles = mangaInfo.data.attributes.altTitles
      .map((title: { en: string }) => title.en)
      .slice(0, 3)
      .join("; ");

    res.status(200).json({
      id,
      title: mangaInfo.data.attributes.title.en,
      altTitles,
      description: mangaInfo.data.attributes.description.en,
      tags,
      urlImage: `https://uploads.mangadex.org/covers/${mangaInfo.data.id}/${fileName}`,
      status: mangaInfo.data.attributes.status,
    });
  } catch (err) {
    return res.status(404).json({ msg: "Couldn't find this manga" });
  }
}
