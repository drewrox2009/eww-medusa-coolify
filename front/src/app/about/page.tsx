export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              About Octochems
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Lab-tested compounds for researchers worldwide
            </p>
          </div>

          <div className="space-y-16">
            {/* Mission */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We provide researchers with access to quality compounds backed by third-party testing.
                Every batch comes with certificates of analysis, ensuring you know exactly what you're working with.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Beyond just products, we support the research community with documentation, guidance,
                and a commitment to transparency at every step.
              </p>
            </div>

            {/* Quality Standards */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
                Quality Standards
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="h-6 w-6 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Third-Party Testing
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Independent lab testing with COA documentation for every batch
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="h-6 w-6 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Research Documentation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Research papers, usage guidelines, and safety data for all compounds
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="h-6 w-6 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Secure & Compliant
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Compliant handling and secure shipping with full privacy protection
                  </p>
                </div>
              </div>
            </div>

            {/* Research Support */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Research Support
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Supporting researchers with more than just products:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  Access to research literature and documentation
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  Expert consultation for research protocols
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  Quality verification and batch testing results
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  Educational resources and research guides
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                Need Research Support?
              </h2>
              <p className="text-gray-700 mb-6">
                Our team is here to help with compound selection and answer your questions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Get in Touch
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Browse Compounds
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
