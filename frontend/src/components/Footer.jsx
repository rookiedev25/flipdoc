export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-medium-gray border-opacity-10 mt-16 sm:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16 mb-10 sm:mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📝</span>
              <span className="font-semibold text-primary text-lg">docuAssist</span>
            </div>
            <p className="text-sm text-light-gray leading-relaxed">
              Document verification made simple.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-primary mb-6 text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-primary mb-6 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-primary mb-6 text-sm uppercase tracking-widest">Connect</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="text-light-gray hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-medium-gray border-opacity-10 pt-12">
          <p className="text-sm text-light-gray text-center">
            © {currentYear} docuAssist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
