'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api/customAxios';
import { Movie } from '@/types/movie';
import { IMovieReview } from '@/types/review';
import Link from 'next/link';
import Image from 'next/image';
import profileBasicImg from '@/public/basicImg.jpeg';

export default function MovieDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [movieDetail, setMovieDetail] = useState<Movie>();
  //좋아요, 즐찾 버튼 추가
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    api
      .get(`/api/movies/${params.id}/detail`)
      .then((res) => {
        setMovieDetail(res.data);
        setIsLiked(res.data.isLiked);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await api.get(`api/movies/${params.id}/reviews`);
      setReviews(res.data.data.slice(0, 3));
    };
    fetchReviews();
  }, []);
  if (movieDetail === undefined) {
    return <h1>Error</h1>;
  }

  function handleClickLike() {
    api.post(`/api/movies/${params.id}/like`, { nextLike: !isLiked });
    setIsLiked((prev) => !prev);
  }

  function validateReview(review: {
    title: string;
    content: string;
    rating: number;
  }) {
    if (!review.title) return false;
    if (!review.content) return false;
    if (review.rating < 0 || review.rating > 10) return false;
    return true;
  }
  const handleClick = async (e) => {
    e.preventDefault();
    const reviewBody = { title, content, rating };
    if (validateReview(reviewBody)) {
      await api
        .post(`api/movies/${params.id}/reviews`, reviewBody)
        .then((res) => {
          console.log(res.data);
        });

      const res = await api.get(`api/movies/${params.id}/reviews`);
      setReviews(res.data.data.slice(0, 3));
    }
  };

  return (
    <div className="main">
      <div className="l-container">
        <img src={movieDetail.backdropUrl} className="back-img" />
        <div className="s-container">
          <img src={movieDetail.posterUrl} className="main-img" />
          <div className="text">
            <button onClick={handleClickLike}>
              {!isLiked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
              )}
            </button>
            <p>Title : {movieDetail.title}</p>
            <p>
              Genres :
              {movieDetail.genres.map((item) => {
                const url = `/movie?genre=${item}`;
                return <Link href={url}>{item},</Link>;
              })}
            </p>
            <p>Grade Average : {movieDetail.voteAverage}</p>
            <p>Overview : {movieDetail.overview}</p>
          </div>
        </div>
      </div>

      <div className="bg-white w-10/12 px-14 py-10 mx-auto">
        <form className="container mx-auto px-4 py-4 mb-4 border">
          <div className="grid grid-cols-3">
            <input
              placeholder="title"
              required
              type="text"
              className="col-span-2 mr-4 border rounded-lg px-2"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="0-10"
              type="number"
              min="0"
              max="10"
              className="appearance-none w-40 border rounded-lg px-2"
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <input
              placeholder="content"
              required
              className="col-span-3 my-4 border rounded-lg px-2"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button
            className="rounded-lg bg-blue-500 text-white px-4 py-2 mx-2 mt-2"
            onClick={(e) => handleClick(e)}
          >
            작성하기
          </button>
          <Link
            className="rounded-lg bg-green-500 text-white px-4 py-3 mx-2 mt-2"
            href={`/movie/reviews/${params.id}`}
          >
            리뷰 목록
          </Link>
        </form>
        <p>최신 리뷰</p>
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Writer</th>
              <th>Title</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review: IMovieReview, index: number) => (
              <tr key={index}>
                <td className="flex items-center space-x-3">
                  <div className="mask mask-squircle w-12 h-12">
                    {review.author.avatarUrl === null && (
                      <Image src={profileBasicImg} alt="profilebasicimage" />
                    )}
                    <img
                      src={`http://localhost:8080${review.author.avatarUrl}`}
                    />
                  </div>
                  <div>{review.author.name}</div>
                </td>
                <td>{review.title}</td>
                <td>{review.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>
        {`
          .main {
            min-height: 110vh;
            padding-top: 70px;
          }
          .back-img {
            position: absolute;
            opacity: 0.7;
            object-fit: cover;
          }
          .l-container {
            align-items: end;
            height: 800px;
            border: solid black 1px;
          }
          .s-container {
            position: relative;
            width: 70%;
            display: flex;
            align-items: end;
            margin-left: 10%;
            margin-top: 30%;
          }
          .text {
            color: white;
          }
          .main-img {
            width: 25%;
            margin-left: 10%;
            margin-right: 10px;
            border: white 5px solid;
          }
        `}
      </style>
    </div>
  );
}
