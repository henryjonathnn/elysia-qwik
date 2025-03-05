import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Hero } from "~/components/hero/Hero";
import { NewsGrid } from "~/components/news/NewsGrid";
import { Sidebar } from "~/components/sidebar/Sidebar";

export default component$(() => {
  return (
    <>
      <Hero />
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-grow">
            <NewsGrid />
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "NewsPortal - Portal Berita Modern Indonesia",
  meta: [
    {
      name: "description",
      content: "Portal berita modern Indonesia yang menyajikan informasi terkini dengan akurat dan berimbang",
    },
    {
      name: "keywords",
      content: "berita, news, portal berita, indonesia, teknologi, bisnis, lifestyle",
    },
  ],
};