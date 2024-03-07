import Post from "@/components/post";
import { api } from "@/trpc/server";
import React from "react";

const Page = async () => {
  const posts = await api.post.getPosts.query();
  return (
    <div className="px-2.5 md:py-4 py-16 mx-auto max-w-lg">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Page;
