import React from 'react';
import { Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonials';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Ulasan Konsumen
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Cerita & Pengalaman Nyata Pelanggan
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Ribuan pelanggan di Sumatera Utara & Riau telah mempercayakan pembelian motor impian bersama Pandu Motor Group.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-50 border border-gray-200 p-5 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all duration-200 shadow-xs relative group"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Service Tag */}
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-[#0B63E5] mb-2.5 shadow-2xs">
                  {item.serviceType} • {item.vehicleOrCollateral}
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  “{item.comment}”
                </p>
              </div>

              {/* User Profile */}
              <div className="mt-5 pt-3.5 border-t border-gray-200 flex items-center gap-2.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.location} • {item.branch}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
