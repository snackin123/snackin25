"use client";

import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div
      className="min-h-screen text-black"
      style={{
        backgroundImage: "url('/Images/bg2.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-8 tracking-tight text-red-900">
            Contact Us
          </h1>
          <p className="text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Got a question, want to share your favorite snackin' combo, or just
            need to rave about how much you love our raisins? <span className="line-clamp-2">Drop us a message
              - we're all ears (and smiles)!</span>
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 pb-36 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-1 gap-8">
          {/* Quick Contact Cards */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="bg-red-900 rounded-3xl  p-8 hover:bg-gray-800 transition-colors duration-300">
              <div className="flex items-start gap-6">
                <Mail className="w-8 h-8 text-amber-500" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Email Us
                  </h3>
                  <p className="text-white mb-4">
                    For general inquiries and support
                  </p>
                  <Link href="mailto:hello@snackinofficial.com">
                    <span className="text-amber-500 p-0 flex items-center gap-2 hover:text-amber-400">
                      hello@snackinofficial.com
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-red-900 rounded-3xl p-8 hover:bg-gray-800 transition-colors duration-300">
              <div className="flex items-start gap-6">
                <MessageCircle className="w-8 h-8 text-amber-500" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Customer Support
                  </h3>
                  <p className="text-white mb-4">Need help with an order?</p>
                  <Link href="tel:+919028654048">
                    <span className="text-amber-500 p-0 flex items-center gap-2 hover:text-amber-400">
                      +91 90286 54048
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
