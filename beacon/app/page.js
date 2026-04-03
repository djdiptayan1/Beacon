"use client"
import React from 'react';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import CTA from '../components/CTA/CTA';
import EmailForm from '../components/EmailForm/EmailForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />
            <Features />
            <EmailForm />
            <CTA />
        </main>
    );
}
