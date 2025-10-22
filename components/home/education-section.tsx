"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, TrendingUp, Lightbulb, LineChart, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Sample data - would come from API in real implementation
const educationalResources = [
  {
    id: 1,
    title: 'How to Choose the Right Forex Broker',
    category: 'Guide',
    icon: <Lightbulb className="h-5 w-5" />,
    minutesToRead: 8,
    slug: 'how-to-choose-forex-broker'
  },
  {
    id: 2,
    title: 'Understanding Forex Leverage and Margin',
    category: 'Education',
    icon: <TrendingUp className="h-5 w-5" />,
    minutesToRead: 12,
    slug: 'understanding-leverage-margin'
  },
  {
    id: 3,
    title: 'Top 5 Technical Indicators for Forex Trading',
    category: 'Strategy',
    icon: <LineChart className="h-5 w-5" />,
    minutesToRead: 15,
    slug: 'top-technical-indicators'
  }
];

export default function EducationSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Forex Education Center</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              Learn to trade with confidence through our expert-created guides, tutorials, and market analysis.
            </p>
          </div>
          <Link href="/education" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
            Browse all resources <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {educationalResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/education/${resource.slug}`}>
                <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        {resource.icon}
                      </div>
                      <span className="ml-2 text-sm font-medium text-blue-600">
                        {resource.category}
                      </span>
                      <div className="ml-auto flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{resource.minutesToRead} min read</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <div className="flex items-center text-blue-600 font-medium mt-4">
                      Read article <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-3 rounded-full w-fit mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Forex Trading Courses</h3>
            <p className="text-gray-600 mb-5">
              Step-by-step learning paths from beginner to advanced. Each course includes video tutorials, practice exercises, and quizzes.
            </p>
            <Button asChild>
              <Link href="/education/courses">
                Explore Courses <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-3 rounded-full w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Weekly Market Analysis</h3>
            <p className="text-gray-600 mb-5">
              Stay updated with expert technical analysis and fundamental insights on major currency pairs.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/analysis">
                Read Analysis <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}