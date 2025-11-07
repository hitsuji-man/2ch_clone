"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import useSWR from "swr";
import Layout from "@/components/layout";
import { useParams } from "next/navigation";

// ------------------- 型定義 -------------------
type Response = {
  id: number;
  response_no: number;
  name: string | null;
  content: string;
  created_at: string;
};

type Thread = {
  id: number;
  title: string;
  name: string | null;
  content: string;
  created_at: string;
  responses: Response[];
};

// ------------------- コンポーネント -------------------
const Thread = () => {
  const { id } = useParams();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR<{ data: Thread }>(
    id ? `${process.env.NEXT_PUBLIC_API_URL}/threads/${id}` : null,
    fetcher
  );
  const thread = data?.data;
  const [response, setResponse] = useState({
    name: "",
    email: "",
    content: "",
  });

  const createResponse = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/threads/${id}/responses`,
        {
          method: "POST",
          body: JSON.stringify(response),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("レスの作成に失敗しました");
      mutate();
      setResponse({ name: "", email: "", content: "" });
    } catch (err) {
      alert(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResponse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Layout title="スレッド詳細" bg="bg-gray-300">
      <section className="mb-8">
        <h2 className="p-3 text-xl font-semibold">スレッド詳細</h2>
        <hr className="mb-2 border-black" />
        {thread && (
          <>
            <div className="mb-4">
              <h2 className="mb-4 text-xl text-red-600">{thread.title}</h2>
              <p>
                {"1: "}
                <span className="text-green-700 font-semibold">
                  {thread.name}
                </span>
                {" : "}
                {thread.created_at}
              </p>
              <p className="px-8 whitespace-pre-wrap">{thread.content}</p>
            </div>
            {thread.responses &&
              thread.responses.map((response) => (
                <div className="mb-4" key={response.id}>
                  <p>
                    {response.response_no + 1}
                    {" : "}
                    <span className="text-green-700 font-semibold">
                      {response.name}
                    </span>
                    {" : "}
                    {response.created_at}
                  </p>
                  <p className="px-8 whitespace-pre-wrap">{response.content}</p>
                </div>
              ))}
          </>
        )}
      </section>

      <hr className="mb-4 border-black" />

      <section>
        <div className="mb-4">
          <Link href="/" className="text-sm text-blue-900 underline">
            掲示板に戻る
          </Link>
        </div>
        <form onSubmit={createResponse}>
          <div className="space-x-1">
            <button className="px-1.5 py-0.5 text-sm bg-gray-300 border border-gray-500 rounded">
              書き込む
            </button>
            <label htmlFor="name">名前{" : "}</label>
            <input
              id="name"
              name="name"
              className="p-0.5 text-sm border border-gray-500 bg-white rounded"
              type="text"
              value={response.name}
              onChange={handleChange}
            />
            <label htmlFor="email">
              E-mail<span className="text-xs">(省略可)</span>
              {" : "}
            </label>
            <input
              id="email"
              name="email"
              className="p-0.5 text-sm border border-gray-500 bg-white rounded"
              type="text"
              value={response.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex">
            <textarea
              id="content"
              name="content"
              className="p-0.5 w-[583px] text-sm border border-gray-500 bg-white rounded"
              value={response.content}
              onChange={handleChange}
              rows={5}
            ></textarea>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Thread;
