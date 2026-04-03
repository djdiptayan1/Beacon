"use client"
import React from 'react';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import Testimonials from '../components/Testimonials/Testimonials';
import Pricing from '../components/Pricing/Pricing';
import CTA from '../components/CTA/CTA';
import EmailForm from '../components/EmailForm/EmailForm';


export default function Home() {
    return (
        <main className="min-h-screen bg-white">

            <Hero />
            <Features />
            <EmailForm />
            {/* <Testimonials /> */}
            {/* <Pricing /> */}
            <CTA />
        </main>
    );
} 