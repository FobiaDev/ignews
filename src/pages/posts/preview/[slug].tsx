import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from "../../../styles/post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string | string[];
    title: string;
    content: string;
    updatedAt: string;
  };
}

const PostPreview: NextPage<PostPreviewProps> = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PostPreviewProps> = async ({
  params,
}: GetStaticPropsContext) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID<any>("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response?.data.title),
    content: RichText.asHtml(response?.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};

export default PostPreview;
