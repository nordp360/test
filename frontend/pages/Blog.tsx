import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const articles = [
      {
          id: 1,
          title: "Rozwód bez orzekania o winie - jak przebiega i ile trwa?",
          excerpt: "Postępowanie rozwodowe nie musi wiązać się z wieloletnią walką w sądzie. Sprawdź, jak przygotować się do rozwodu za porozumieniem stron i jakie dokumenty są wymagane.",
          author: "Mec. Anna Nowak",
          date: "15 Lis 2023",
          category: "Prawo Rodzinne",
          image: "https://placehold.co/600x400/1e293b/FFF?text=Rozwód"
      },
      {
          id: 2,
          title: "Zmiany w Kodeksie Pracy 2024 - Praca Zdalna",
          excerpt: "Nowelizacja przepisów wprowadza nowe obowiązki dla pracodawców w zakresie pracy zdalnej. Dowiedz się, jak dostosować regulaminy w swojej firmie.",
          author: "Mec. Piotr Kowalski",
          date: "10 Lis 2023",
          category: "Prawo Pracy",
          image: "https://placehold.co/600x400/d4af37/000?text=Kodeks+Pracy"
      },
      {
          id: 3,
          title: "Dziedziczenie długów - jak uchronić się przed kłopotami?",
          excerpt: "Odrzucenie spadku czy przyjęcie z dobrodziejstwem inwentarza? Wyjaśniamy różnice i terminy, których należy dochować, aby nie odziedziczyć długów.",
          author: "Marta Wiśniewska",
          date: "05 Lis 2023",
          category: "Prawo Spadkowe",
          image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Spadki"
      },
      {
          id: 4,
          title: "Umowa B2B a stosunek pracy - na co uważać?",
          excerpt: "Kiedy kontrakt B2B może zostać uznany przez ZUS za ukrytą umowę o pracę? Analiza ryzyka dla programistów i specjalistów IT.",
          author: "Mec. Anna Nowak",
          date: "01 Lis 2023",
          category: "Dla Biznesu",
          image: "https://placehold.co/600x400/1e293b/d4af37?text=B2B+vs+UoP"
      }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
       <div className="bg-white border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4 font-sans">Blog Prawniczy</h1>
              <p className="text-slate-500 max-w-2xl mx-auto">
                  Baza wiedzy, poradniki i komentarze do aktualnych zmian w prawie. Piszemy prostym językiem o skomplikowanych przepisach.
              </p>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {articles.map(article => (
               <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col group">
                   <div className="h-48 overflow-hidden relative">
                       <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-slate-900 uppercase tracking-wide">
                           {article.category}
                       </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                       <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                           <span className="flex items-center gap-1"><User className="w-3 h-3"/> {article.author}</span>
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {article.date}</span>
                       </div>
                       <h2 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                           {article.title}
                       </h2>
                       <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                           {article.excerpt}
                       </p>
                       <Link to="#" className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 mt-auto">
                           Czytaj dalej <ArrowRight className="w-4 h-4" />
                       </Link>
                   </div>
               </div>
           ))}
       </div>

       <div className="bg-slate-900 text-white py-16 mt-8">
           <div className="max-w-4xl mx-auto px-4 text-center">
               <h2 className="text-2xl font-bold mb-4 font-sans">Bądź na bieżąco z prawem</h2>
               <p className="text-slate-300 mb-8">Zapisz się do newslettera, aby otrzymywać najważniejsze informacje prawne i wzory pism prosto na e-mail.</p>
               <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                   <input type="email" placeholder="Twój adres e-mail" className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                   <button className="bg-amber-500 text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-400 transition-colors">Zapisz się</button>
               </div>
               <p className="text-xs text-slate-500 mt-4">Zapisując się akceptujesz Politykę Prywatności.</p>
           </div>
       </div>
    </div>
  );
};

export default Blog;