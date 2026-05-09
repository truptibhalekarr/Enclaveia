import base64

def generate_banner():
    with open(r'C:\Insight IQ G4\frontend\public\enclaveia-logo.png', 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')
    
    svg = f"""<svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5e3e6" />
          <stop offset="100%" stop-color="#e3c8cd" />
        </linearGradient>
        <path id="wave" d="M0,200 C300,300 600,100 1200,250 L1200,400 L0,400 Z" />
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="400" fill="url(#bg)"/>
      
      <!-- Grid pattern for data feel -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#5c1731" stroke-width="0.5" stroke-opacity="0.1"/>
      </pattern>
      <rect width="1200" height="400" fill="url(#grid)"/>
      
      <!-- Bottom Wave -->
      <use href="#wave" fill="#5c1731" fill-opacity="0.9"/>
      <path d="M0,220 C300,320 600,120 1200,270 L1200,400 L0,400 Z" fill="#7a2142" fill-opacity="0.4"/>
      
      <!-- Logo Image -->
      <image href="data:image/png;base64,{logo_b64}" x="350" y="50" width="500" height="150" />
      
      <!-- Text -->
      <text x="600" y="320" font-family="sans-serif" font-size="28" font-weight="600" fill="#f5e3e6" text-anchor="middle" letter-spacing="1">AI-POWERED DECISION INTELLIGENCE</text>
    </svg>"""
    
    with open(r'C:\Insight IQ G4\frontend\public\github-banner.svg', 'w') as f:
        f.write(svg)
    print('Banner generated.')

if __name__ == "__main__":
    generate_banner()
