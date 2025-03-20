'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  price: {
    amount: number;
    unit: string;
  };
  category: ServiceCategory;
  availability: boolean;
  provider?: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
}

type ServiceCategory = 'rental' | 'consultation' | 'class' | 'therapy';

const services: Service[] = [
  {
    id: 'service1',
    title: 'Breast Pump Rental - Hospital Grade',
    description: 'Rent a high-quality, hospital-grade breast pump for efficient expression. Includes all necessary accessories and cleaning kit.',
    image: '/images/breast-pump.jpg',
    price: {
      amount: 45,
      unit: 'week',
    },
    category: 'rental',
    availability: true,
  },
  {
    id: 'service2',
    title: 'Baby Crib Rental',
    description: 'Rent a safety-certified baby crib with mattress for your newborn. Perfect for visitors or temporary needs.',
    image: '/images/crib.jpg',
    price: {
      amount: 60,
      unit: 'month',
    },
    category: 'rental',
    availability: true,
  },
  {
    id: 'service3',
    title: 'Car Seat Rental',
    description: 'Rent a car seat for your infant or toddler. All our car seats meet safety standards and are thoroughly cleaned between rentals.',
    image: '/images/car-seat.jpg',
    price: {
      amount: 35,
      unit: 'week',
    },
    category: 'rental',
    availability: false,
  },
  {
    id: 'service4',
    title: 'Postpartum Massage',
    description: 'Relax and recover with a massage specifically designed for postpartum mothers. Our certified therapists specialize in postpartum care.',
    image: '/images/massage.jpg',
    price: {
      amount: 85,
      unit: 'session',
    },
    category: 'therapy',
    availability: true,
    provider: {
      name: 'Sarah Williams',
      avatar: '/images/provider1.jpg',
      rating: 4.9,
      verified: true,
    },
  },
  {
    id: 'service5',
    title: 'Lactation Consultation',
    description: 'Get expert advice and support for breastfeeding from our certified lactation consultants. Available in-person or virtually.',
    image: '/images/lactation.jpg',
    price: {
      amount: 75,
      unit: 'hour',
    },
    category: 'consultation',
    availability: true,
    provider: {
      name: 'Emily Rodriguez',
      avatar: '/images/provider2.jpg',
      rating: 5.0,
      verified: true,
    },
  },
  {
    id: 'service6',
    title: 'Newborn Care Class',
    description: 'Learn essential newborn care skills in this comprehensive class. Topics include bathing, diapering, feeding, and sleep.',
    image: '/images/newborn-class.jpg',
    price: {
      amount: 120,
      unit: 'class',
    },
    category: 'class',
    availability: true,
    provider: {
      name: 'Jessica Thompson',
      rating: 4.8,
      verified: true,
    },
  },
  {
    id: 'service7',
    title: 'Baby Sleep Consultation',
    description: 'Work with our sleep specialists to develop healthy sleep habits for your baby and improve rest for the whole family.',
    image: '/images/sleep-consult.jpg',
    price: {
      amount: 90,
      unit: 'session',
    },
    category: 'consultation',
    availability: true,
    provider: {
      name: 'Michelle Davis',
      avatar: '/images/provider3.jpg',
      rating: 4.7,
      verified: true,
    },
  },
  {
    id: 'service8',
    title: 'Infant Massage Class',
    description: 'Learn how to perform gentle, therapeutic massage on your baby to promote bonding, relaxation, and development.',
    image: '/images/infant-massage.jpg',
    price: {
      amount: 65,
      unit: 'class',
    },
    category: 'class',
    availability: true,
    provider: {
      name: 'Amanda Wilson',
      rating: 4.6,
      verified: true,
    },
  },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'rental', label: 'Equipment Rentals' },
    { id: 'consultation', label: 'Consultations' },
    { id: 'class', label: 'Classes & Workshops' },
    { id: 'therapy', label: 'Therapy & Wellness' },
  ];
  
  // Filter services based on active category and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Additional Services</h1>
        <p className="text-text-light">
          Beyond our marketplace, we offer specialized services to support you during your motherhood journey.
        </p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-full pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-text-light"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category filters */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-background-alt text-text-light hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveCategory(category.id as ServiceCategory | 'all')}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">😕</div>
          <h3 className="text-xl font-bold mb-2">No services found</h3>
          <p className="text-text-light mb-6">
            We couldn't find any services matching your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="btn-primary"
          >
            View All Services
          </button>
        </div>
      )}
      
      {/* Contact CTA */}
      <div className="mt-16 bg-background-alt rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
        <p className="text-text-light mb-6 max-w-2xl mx-auto">
          Don't see what you're looking for? Contact us to discuss your specific needs, and we'll connect you with the right professional or service.
        </p>
        <Link href="/contact" className="btn-primary px-6 py-3">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card card-hover overflow-hidden"
    >
      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!service.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Currently Unavailable
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
          {getCategoryLabel(service.category)}
        </div>
      </div>
      
      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
      <p className="text-text-light text-sm mb-4 line-clamp-2">{service.description}</p>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="font-bold text-primary text-xl">
            ${service.price.amount}
            <span className="text-sm text-text-light font-normal"> / {service.price.unit}</span>
          </p>
          
          {service.provider && (
            <div className="flex items-center mt-2 gap-1">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                {service.provider.avatar ? (
                  <Image
                    src={service.provider.avatar}
                    alt={service.provider.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary text-white text-xs">
                    {service.provider.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs text-text-light">
                {service.provider.name}
                {service.provider.verified && (
                  <span className="ml-1 text-secondary" title="Verified Provider">✓</span>
                )}
              </span>
              <div className="flex items-center ml-1">
                <span className="text-accent-dark text-xs">★</span>
                <span className="text-xs">{service.provider.rating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
        
        <Link
          href={`/services/${service.id}`}
          className={`btn-primary py-2 px-4 text-sm ${!service.availability ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {service.availability ? 'Book Now' : 'Unavailable'}
        </Link>
      </div>
    </motion.div>
  );
};

function getCategoryLabel(category: ServiceCategory): string {
  switch (category) {
    case 'rental':
      return 'Equipment Rental';
    case 'consultation':
      return 'Consultation';
    case 'class':
      return 'Class';
    case 'therapy':
      return 'Therapy';
    default:
      return 'Service';
  }
} 