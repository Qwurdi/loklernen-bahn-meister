
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";
import { signalSubCategories } from "@/api/questions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function SignalePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Signale</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Signale</h1>
            <p className="text-gray-500 max-w-2xl">
              Lerne die wichtigsten Signale der Eisenbahn kennen. Diese Kategorie ist kostenlos und ohne Anmeldung zugänglich. 
              Wähle eine Signalart, um mit dem Lernen zu beginnen.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signalSubCategories.map((subcategory) => (
              <CategoryCard
                key={subcategory}
                title={subcategory}
                description="Lerne die wichtigsten Signale dieser Kategorie."
                progress={0}
                link={`/signale/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
              />
            ))}
          </div>
          
          <div className="mt-12 rounded-lg border bg-blue-50 p-6">
            <h2 className="text-lg font-medium text-loklernen-sapphire mb-2">Die Bedeutung von Signalen</h2>
            <p className="mb-4 text-gray-600">
              Signale sind die Sprache der Eisenbahn. Sie regeln den Bahnverkehr und sorgen für Sicherheit. 
              Als Triebfahrzeugführer*in musst du alle Signale sofort erkennen und richtig interpretieren können.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/register">
                <Button variant="outline">
                  Fortschritt speichern (Registrieren)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
