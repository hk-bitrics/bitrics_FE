import axiosInstance from "@/api/axiosInstance";
import { load } from "cheerio";

export const getHTML = async (keyword) => {
  try {
    const html = await axiosInstance
      .get(`/search/news?query=${encodeURI(keyword)}`)
      .then((res) => res.data);
    return html;
  } catch {
    console.log("에러발생");
    // TODO: go back to previous page
  }
};

export const getNews = async (keyword) => {
  const html = await getHTML(keyword);
  const $ = load(html);

  const newsHref = $(".article .txt_wrap a")
    .map(function () {
      return $(this).has("em.tit").prop("href");
    })
    .toArray();

  const newsTitle = $(".article .txt_wrap .tit")
    .contents()
    .map(function () {
      return $(this).text();
    })
    .toArray();

  const newsContent = $(".article .txt_wrap p.txt")
    .map(function () {
      return $(this).text();
    })
    .toArray();

  const newsMedia = $(".article .txt_wrap p.info")
    .children("span")
    .not(".date_time")
    .map(function () {
      return $(this).first().text();
    })
    .toArray();

  const newsCreatedAt = $(".article .txt_wrap p.info")
    .children("span.date_time")
    .map(function () {
      return $(this).text();
    })
    .toArray();

  const news = [];
  for (let i = 0; i < newsTitle.length; i++) {
    news.push({
      title: newsTitle[i],
      content: newsContent[i],
      media: newsMedia[i],
      createdAt: newsCreatedAt[i],
      href: newsHref[i],
    });
  }
  return news;
};
