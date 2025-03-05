import { component$ } from "@builder.io/qwik";

export const Hero = component$(() => {
  return (
    <section class="pt-20 pb-10 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Main News */}
          <div class="space-y-4">
            <span class="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
              Breaking News
            </span>
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Perkembangan Teknologi AI di Indonesia Semakin Pesat
            </h1>
            <p class="text-lg text-gray-600">
              Artificial Intelligence telah mengubah cara kerja berbagai sektor industri di Indonesia. 
              Para ahli memprediksi pertumbuhan yang signifikan dalam adopsi AI di tahun 2024.
            </p>
            <div class="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/40"
                alt="Author"
                class="w-10 h-10 rounded-full"
              />
              <div>
                <p class="text-sm font-medium text-gray-900">Ditulis oleh John Doe</p>
                <p class="text-sm text-gray-500">5 Maret 2024 • 5 menit baca</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div class="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://via.placeholder.com/800x600"
              alt="Featured News"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>

        {/* Quick Links */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { title: "Teknologi", color: "bg-blue-100 text-blue-600" },
            { title: "Bisnis", color: "bg-green-100 text-green-600" },
            { title: "Lifestyle", color: "bg-purple-100 text-purple-600" },
            { title: "Olahraga", color: "bg-orange-100 text-orange-600" },
          ].map((category) => (
            <a
              key={category.title}
              href={`/kategori/${category.title.toLowerCase()}`}
              class={`${category.color} rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}
            >
              <h3 class="font-medium">{category.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}); 