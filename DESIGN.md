TradeCouncil // 设计范式 (Design Paradigm) V1.0
完整的首页HTML（包含CSS）代码：
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradeCouncil // VAULT // FINAL_V4</title>
    <style>
        /* =========================================
           CORE VARIABLES & RESET
           ========================================= */
        :root {
            --bg-deep: #0a0a0a;
            --glass-bg: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
            --text-dim: #666;
            --primary: #ffffff;
            --accent: #00E676; /* 金融绿 */
            --danger: #FF1744; /* 跌势红 */
            --concrete-noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg-deep);
            background-image: var(--concrete-noise);
            color: var(--primary);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            overflow-x: hidden;
        }

        .mono { font-family: 'Courier New', monospace; letter-spacing: -0.5px; }
        a { text-decoration: none; color: inherit; transition: 0.3s; }

        /* =========================================
           NAVBAR
           ========================================= */
        nav {
            display: grid;
            grid-template-columns: 200px 1fr 200px;
            align-items: center;
            padding: 15px 40px; 
            position: fixed; top: 20px; left: 50%;
            transform: translateX(-50%); 
            width: 95%; max-width: 1600px;
            background: rgba(10, 10, 10, 0.8); 
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border); 
            border-radius: 100px; 
            z-index: 1000;
        }

        .logo { font-weight: 900; letter-spacing: -1px; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }
        .logo span { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); }

        .nav-center { display: flex; justify-content: center; gap: 40px; }
        .nav-center a { color: #888; font-size: 0.9rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
        .nav-center a:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }

        .nav-right { display: flex; justify-content: flex-end; align-items: center; gap: 20px; }

        .lang-switch {
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            color: #666;
            border: 1px solid #333;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        .lang-switch:hover { border-color: #666; color: #fff; }
        .lang-active { color: #fff; font-weight: bold; }

        .btn-login {
            background: #fff; color: #000; 
            padding: 8px 20px; 
            border-radius: 50px; 
            font-weight: 700; 
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }
        .btn-login:hover { background: var(--accent); box-shadow: 0 0 15px var(--accent); }

        /* =========================================
           HERO
           ========================================= */
        .hero {
            min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
            text-align: center; position: relative; padding-top: 100px;
        }

        .spotlight {
            position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
            width: 800px; height: 800px;
            background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%);
            pointer-events: none; z-index: 0;
        }

        h1 {
            font-size: clamp(3rem, 5.5vw, 6rem); line-height: 0.9; font-weight: 800; letter-spacing: -3px;
            background: linear-gradient(180deg, #fff 0%, #666 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 20px; position: relative; z-index: 2; text-transform: uppercase;
        }

        .hero-desc {
            color: #888; font-size: 1.25rem; max-width: 800px; margin: 0 auto 50px; line-height: 1.6;
        }

        .vault-interface {
            width: 100%; max-width: 700px; aspect-ratio: 16/9;
            background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid var(--glass-border); border-radius: 20px;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
            transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            position: relative; overflow: hidden; margin-bottom: 30px;
        }
        .vault-interface:hover { transform: scale(1.02); border-color: rgba(255,255,255,0.2); }
        
        .scan-line {
            position: absolute; top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, transparent, #fff, transparent);
            opacity: 0; animation: scan 3s infinite ease-in-out;
        }
        @keyframes scan { 0% { top: 0; opacity: 0;} 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

        .btn-core {
            background: #fff; color: #000; padding: 15px 40px; border-radius: 50px;
            font-weight: 600; text-decoration: none; box-shadow: 0 0 20px rgba(255,255,255,0.2);
            transition: 0.3s; z-index: 5; font-size: 1.1rem;
        }
        .btn-core:hover { background: #ccc; box-shadow: 0 0 40px rgba(255,255,255,0.4); }

        .social-proof {
            font-family: 'Courier New', monospace; font-size: 0.75rem; color: #444; letter-spacing: 1px; margin-top: 20px; text-transform: uppercase;
        }

        /* =========================================
           ENGINE (BEAM)
           ========================================= */
        .beam-section {
            padding: 150px 0;
            max-width: 1400px; width: 90%; margin: 0 auto;
            display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: center;
        }

        .beam-visual-container {
            background: #0e0e0e;
            border: 1px solid #222;
            border-radius: 12px;
            aspect-ratio: 16/10;
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 0 0 1px rgba(255,255,255,0.05),
                0 20px 50px rgba(0,0,0,0.5);
        }
        
        .beam-mockup-content {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: 
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 20px 20px;
            display: flex; flex-direction: column;
        }
        .beam-header { height: 40px; border-bottom: 1px solid #333; background: #111; display:flex; align-items:center; padding: 0 15px; gap:10px;}
        .beam-dot { width: 8px; height: 8px; border-radius: 50%; background: #333; }
        .beam-dot.active { background: var(--accent); box-shadow: 0 0 10px var(--accent); }
        
        .beam-split-view {
            flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #333;
        }
        .beam-col { background: #050505; padding: 20px; font-family: monospace; font-size: 10px; color: #666; overflow: hidden; position: relative; }
        .beam-col::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: var(--accent); opacity: 0.5; }
        
        .beam-text-content h2 {
            font-size: 3.5rem; line-height: 1; margin-bottom: 30px; font-weight: 800;
            background: linear-gradient(135deg, #fff 50%, #666 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .beam-label {
            color: var(--accent); font-family: 'Courier New'; letter-spacing: 2px; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 10px; display: block;
        }

        .beam-quote {
            border-left: 2px solid #333; padding-left: 30px; margin-bottom: 30px;
        }
        .beam-quote p {
            font-size: 1.2rem; color: #bbb; line-height: 1.6; margin-bottom: 20px;
        }
        .beam-quote p:last-child { margin-bottom: 0; color: #888; }

        /* =========================================
           PROTOCOL (FLOW)
           ========================================= */
        .protocol-section {
            padding: 80px 0;
            border-top: 1px solid #111;
            border-bottom: 1px solid #111;
            background: #0e0e0e;
        }
        
        .protocol-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
            max-width: 1400px; margin: 0 auto; width: 90%;
            background: #222; /* Gap color */
            border: 1px solid #222;
        }

        .protocol-step { background: #0a0a0a; padding: 40px; position: relative; }
        .protocol-step h3 { font-size: 1.5rem; margin-bottom: 10px; color: #fff; text-transform: uppercase; }
        .protocol-step p { color: #666; font-size: 0.9rem; line-height: 1.5; }
        .step-num { font-family: 'Courier New'; color: var(--accent); margin-bottom: 15px; display: block; font-size: 0.8rem; }

        /* =========================================
           FEATURE SLABS
           ========================================= */
        .feature-section {
            padding: 100px 0;
            display: flex; flex-direction: column; align-items: center; gap: 150px;
            /* 确保与下方Privacy有一定的间距视觉感 */
            margin-bottom: 0; 
        }

        .feature-slab {
            width: 85%; max-width: 1400px;
            background: #111; border: 1px solid #222; border-radius: 4px;
            position: relative; overflow: hidden;
            box-shadow: 0 30px 60px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
            transition: transform 0.5s ease;
        }
        .feature-slab:hover { transform: translateY(-5px); border-color: #333; }

        .slab-content { padding: 80px 60px; position: relative; z-index: 2; }
        .slab-index {
            font-family: 'Courier New', monospace; font-size: 14px; color: var(--accent);
            border: 1px solid var(--accent); padding: 4px 8px; display: inline-block;
            margin-bottom: 30px; letter-spacing: 2px;
        }
        .slab-title {
            font-size: clamp(3rem, 5vw, 5rem); font-weight: 800; line-height: 0.9; text-transform: uppercase;
            letter-spacing: -2px; margin-bottom: 30px;
            background: linear-gradient(135deg, #fff 50%, #444 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .slab-desc { font-size: 1.2rem; color: #888; max-width: 600px; line-height: 1.6; margin-top: 10px; border-left: 2px solid #333; padding-left: 20px; }
        .slab-visual {
            width: 100%; height: 500px; background: #0e0e0e; border-top: 1px solid #222;
            position: relative; display: flex; align-items: center; justify-content: center;
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .placeholder-text { font-family: monospace; color: #333; font-size: 1.5rem; letter-spacing: 5px; text-transform: uppercase; border: 1px dashed #333; padding: 20px 40px; }
        .corner-deco {
            position: absolute; top: 0; right: 0; width: 100px; height: 100px;
            background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.05) 50%);
            border-left: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        /* =========================================
           UPDATED PRIVACY: SWISS GRID STYLE
           ========================================= */
        .privacy-section {
            padding: 0;
            border-top: 1px solid #222;
            border-bottom: 1px solid #222;
            background: #080808;
            margin-top: 50px;
        }
        .privacy-grid-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-width: 1400px; margin: 0 auto;
            width: 100%;
        }
        .privacy-visual {
            padding: 100px;
            display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
            border-right: 1px solid #222;
            position: relative;
            overflow: hidden;
        }
        .privacy-visual::after {
            content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
            background-image: radial-gradient(#222 1px, transparent 1px);
            background-size: 20px 20px; opacity: 0.3;
        }
        
        /* CSS Lock Art */
        .lock-art {
            width: 80px; height: 100px;
            border: 2px solid #fff;
            border-radius: 10px;
            position: relative;
            z-index: 2;
        }
        .lock-shackle {
            position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
            width: 50px; height: 50px;
            border: 2px solid #666; border-bottom: none;
            border-radius: 50px 50px 0 0;
        }
        
        .privacy-content {
            padding: 100px;
            display: flex; flex-direction: column; justify-content: center;
        }
        .privacy-tag {
            font-family: 'Courier New', monospace; font-size: 0.9rem; color: var(--accent);
            margin-bottom: 20px; letter-spacing: 2px;
        }
        .privacy-headline {
            font-size: 3rem; font-weight: 800; line-height: 1; margin-bottom: 30px;
            text-transform: uppercase; color: #fff;
        }
        .privacy-sub {
            color: #666; font-size: 1rem; line-height: 1.6;
        }

        @media (max-width: 900px) {
            .privacy-grid-wrapper { grid-template-columns: 1fr; }
            .privacy-visual { border-right: none; border-bottom: 1px solid #222; padding: 60px; }
            .privacy-content { padding: 60px; }
        }

        /* =========================================
           PRICING & FAQ & FOOTER
           ========================================= */
        .pricing-section { padding: 150px 0; background: #080808; border-top: 1px solid #222; }
        .pricing-header { text-align: center; margin-bottom: 80px; }
        .pricing-header h2 { font-size: 3rem; margin-bottom: 10px; font-weight: 200; }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; width: 85%; max-width: 1200px; margin: 0 auto; }
        .pricing-card { background: #111; border: 1px solid #333; padding: 60px; position: relative; display: flex; flex-direction: column; justify-content: space-between; }
        .pricing-card.pro { border: 1px solid var(--accent); background: linear-gradient(180deg, rgba(0, 230, 118, 0.05) 0%, #111 40%); box-shadow: 0 0 50px rgba(0, 230, 118, 0.05); }
        .pricing-card.pro::before { content: 'RECOMMENDED'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #000; color: var(--accent); border: 1px solid var(--accent); padding: 4px 12px; font-size: 12px; letter-spacing: 2px; }
        .price-tag { font-size: 4rem; font-weight: 800; line-height: 1; margin: 30px 0; }
        .feature-list { list-style: none; margin-bottom: 40px; }
        .feature-list li { padding: 15px 0; border-bottom: 1px dashed #222; color: #999; font-family: 'Courier New', monospace; display: flex; justify-content: space-between; }
        .btn-pricing { display: block; text-align: center; width: 100%; padding: 20px; text-transform: uppercase; letter-spacing: 2px; border: 1px solid #444; color: #fff; transition: 0.2s; }
        .btn-pricing:hover { background: #fff; color: #000; border-color: #fff; }
        .btn-pricing.primary { background: var(--accent); border-color: var(--accent); color: #000; font-weight: bold; }
        .btn-pricing.primary:hover { background: #fff; border-color: #fff; }

        .faq-section { padding: 100px 0; width: 85%; max-width: 1000px; margin: 0 auto; }
        .faq-header { margin-bottom: 60px; font-size: 2rem; font-weight: 300; border-left: 4px solid var(--accent); padding-left: 20px; }
        details { border-bottom: 1px solid #222; padding: 20px 0; cursor: pointer; transition: all 0.3s; }
        details[open] { background: rgba(255,255,255,0.02); padding: 20px; }
        summary { font-size: 1.2rem; font-weight: 500; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        summary::after { content: '+'; font-family: monospace; font-size: 1.5rem; color: #666; }
        details[open] summary::after { content: '-'; color: var(--accent); }
        .faq-answer { margin-top: 20px; color: #888; line-height: 1.6; max-width: 90%; }

        .final-cta-section { padding: 120px 0; text-align: center; background: linear-gradient(to top, #000, #0a0a0a); position: relative; overflow: hidden; }
        .cta-big-text { font-size: clamp(3rem, 8vw, 8rem); font-weight: 900; color: #1a1a1a; -webkit-text-stroke: 1px #333; margin-bottom: -40px; position: relative; z-index: 1; }
        .cta-content { position: relative; z-index: 2; }
        .cta-content h3 { font-size: 2rem; margin-bottom: 30px; color: #fff; }
        .btn-massive { font-size: 1.5rem; padding: 25px 60px; background: #fff; color: #000; border-radius: 100px; font-weight: 900; box-shadow: 0 0 40px rgba(255,255,255,0.3); display: inline-flex; align-items: center; gap: 15px; }
        .btn-massive:hover { transform: scale(1.05); background: var(--accent); }

        .ticker-wrap { width: 100%; overflow: hidden; background: #000; border-top: 1px solid #222; border-bottom: 1px solid #222; padding: 15px 0; display: flex; margin-bottom: 0; }
        .ticker-move { display: flex; animation: ticker 20s linear infinite; white-space: nowrap; }
        .ticker-item { padding: 0 40px; color: #444; font-size: 0.8rem; font-family: 'Courier New', monospace; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
        .ticker-item span.on { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 5px var(--accent); }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }

        footer { padding: 100px 0; text-align: center; border-top: 1px solid #222; background: #050505; }
        .footer-cta { margin-bottom: 40px; color: #888; font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px; }
        .footer-link { color: #666; margin: 0 15px; text-decoration: none; font-size: 0.9rem; }
        .footer-link:hover { color: #fff; }

    </style>
</head>
<body>

    <nav>
        <div class="logo">
            <span></span> TRADE COUNCIL
        </div>
        <div class="nav-center">
            <a href="#engine">ENGINE</a>
            <a href="#features">FEATURES</a>
            <a href="#pricing">PRICING</a>
            <a href="#faq">FAQ</a>
        </div>
        <div class="nav-right">
            <div class="lang-switch">
                <span class="lang-active">EN</span> / CN
            </div>
            <a href="#" class="btn-login">LOGIN</a>
        </div>
    </nav>

    <div class="hero">
        <div class="spotlight"></div>
        <h1>Don't Trust a<br>Single AI.</h1>
        <div style="font-size: 1.5rem; color: #fff; font-weight: 300; margin-bottom: 20px;">Let the Trade Council Decide.</div>
        
        <p class="hero-desc">
            Upload any chart, earnings report, or news snippet. Instantly get a consensus analysis from GPT-5, Claude 4.5, Gemini 3 pro, and Deepseek— identifying risks and opportunities you might miss.
        </p>
        
        <div class="vault-interface">
            <div class="scan-line"></div>
            <a href="#" class="btn-core">ANALYZE MY TRADE NOW</a>
            <p style="margin-top: 20px; font-size: 0.8rem; color: #555;">
                Drag & Drop Chart Image or Paste Text
            </p>
        </div>

        <div class="social-proof">
            Powered by the world's best intelligence: OpenAI // Anthropic // Google DeepMind
        </div>
    </div>

    <div class="protocol-section">
        <div style="text-align:center; margin-bottom:40px; color:#444; font-family:'Courier New'; letter-spacing:2px;">HOW TO WORK</div>
        <div class="protocol-grid">
            <div class="protocol-step">
                <span class="step-num">STEP 01</span>
                <h3>Ingest</h3>
                <p>Upload chart screenshots, paste earnings calls, or link news. Our system vectorizes the data for multi-modal analysis.</p>
            </div>
            <div class="protocol-step">
                <span class="step-num">STEP 02</span>
                <h3>Debate</h3>
                <p>Selected AI models analyze data independently. We enable "Adversarial Mode" where they challenge each other's conclusions.</p>
            </div>
            <div class="protocol-step">
                <span class="step-num">STEP 03</span>
                <h3>Execute</h3>
                <p>Receive a finalized "Trade Council Report" with actionable probabilities, entry points, and risk invalidation levels.</p>
            </div>
        </div>
    </div>

    <section class="beam-section" id="engine">
        <div class="beam-visual-container">
            <div class="beam-mockup-content">
                <div class="beam-header">
                    <div class="beam-dot active"></div>
                    <div class="beam-dot"></div>
                    <div style="font-family:monospace; color:#444; font-size:10px; margin-left:10px;">TRADE_COUNCIL_ACTIVE</div>
                </div>
                <div class="beam-split-view">
                    <div class="beam-col">
                        [GPT-5]<br>...Identifying Head & Shoulders pattern on 4H...
                    </div>
                    <div class="beam-col">
                        [CLAUDE 4.5]<br>...Volume divergence detected. Risk level elevated...
                    </div>
                    <div class="beam-col">
                        [GEMINI 3]<br>...Correlating with macro news event...
                    </div>
                </div>
            </div>
        </div>

        <div class="beam-text-content">
            <span class="beam-label">CORE TECHNOLOGY</span>
            <h2>The Consensus<br>Engine.</h2>
            
            <div class="beam-quote">
                <p>Why rely on one analyst when you can have a team? TradeCouncil runs your data through multiple reasoning engines simultaneously.</p>
                <p>Disagreement is good. See where the models diverge to understand the volatility; see where they agree to find your conviction."</p>
            </div>

            <a href="#" style="border-bottom:1px solid #fff; padding-bottom:5px; font-size:0.9rem;">See how Trade Council works -></a>
        </div>
    </section>

    <section class="feature-section" id="features">
        
        <div class="feature-slab">
            <div class="corner-deco"></div>
            <div class="slab-content">
                <span class="slab-index">01 // VISION</span>
                <div class="slab-title">
                    Eliminate<br>Blind Spots.
                </div>
                <div class="slab-desc">
                    Scanning 100+ technical indicators instantly. Our optical engine sees the chart like a human expert—but with pixel-perfect precision. It identifies hidden divergences and liquidity zones you missed.
                </div>
            </div>
            <div class="slab-visual">
                <div class="placeholder-text">UI: CHART PATTERN RECOGNITION</div>
            </div>
        </div>

        <div class="feature-slab">
            <div class="corner-deco"></div>
            <div class="slab-content">
                <span class="slab-index">02 // DISCIPLINE</span>
                <div class="slab-title">
                    Emotional<br>Discipline.
                </div>
                <div class="slab-desc">
                    Pure logic. Zero FOMO. Enable "Adversarial Mode" where a dedicated AI agent acts as the Risk Manager, actively trying to debunk your trade thesis to save your capital.
                </div>
            </div>
            <div class="slab-visual">
                <div class="placeholder-text">UI: SPLIT-SCREEN DEBATE</div>
            </div>
        </div>

    </section>

    <section class="privacy-section">
        <div class="privacy-grid-wrapper">
            <div class="privacy-visual">
                <div style="position:relative;">
                    <div class="lock-shackle"></div>
                    <div class="lock-art">
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:10px; height:10px; background:#fff; border-radius:50%;"></div>
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, 0); width:2px; height:20px; background:#fff;"></div>
                    </div>
                </div>
                <div style="margin-top:40px; font-family:'Courier New'; color:#444; z-index:2;">
                    // SECURE_ENCLAVE_ACTIVE
                </div>
            </div>
            
            <div class="privacy-content">
                <div class="privacy-tag">PRIVACY MANIFESTO</div>
                <h2 class="privacy-headline">Your Alpha<br>Stays Yours.</h2>
                <p class="privacy-sub">
                    We believe financial data is sacred. TradeCouncil uses ephemeral processing instances. Once the consensus report is generated, the raw data is cryptographically shredded. <br><br>
                    <strong style="color:#fff;">No Logs. No Training. No Leaks.</strong>
                </p>
            </div>
        </div>
    </section>

    <section class="pricing-section" id="pricing">
        <div class="pricing-header">
            <h2>Access the Vault.</h2>
            <p>Select your tier of intelligence.</p>
        </div>

        <div class="pricing-grid">
            <div class="pricing-card">
                <div>
                    <h4 style="color:#888; letter-spacing:2px; font-size:0.9rem;">OBSERVER</h4>
                    <div class="price-tag">$0<span>/mo</span></div>
                    <ul class="feature-list">
                        <li><span>Analysis Limit</span> <strong>3 / Day</strong></li>
                        <li><span>Models</span> <strong>GPT-4o Only</strong></li>
                        <li><span>Adversarial Mode</span> <strong>Disabled</strong></li>
                        <li><span>Speed</span> <strong>Standard</strong></li>
                    </ul>
                </div>
                <a href="#" class="btn-pricing">INITIATE</a>
            </div>

            <div class="pricing-card pro">
                <div>
                    <h4 style="color:var(--accent); letter-spacing:2px; font-size:0.9rem;">ARCHITECT</h4>
                    <div class="price-tag">$29<span>/mo</span></div>
                    <ul class="feature-list">
                        <li><span>Analysis Limit</span> <strong>Unlimited</strong></li>
                        <li><span>Models</span> <strong>All 5 Models</strong></li>
                        <li><span>Adversarial Mode</span> <strong>Enabled</strong></li>
                        <li><span>Speed</span> <strong>Turbo</strong></li>
                    </ul>
                </div>
                <a href="#" class="btn-pricing primary">SECURE ACCESS</a>
            </div>
        </div>
    </section>

    <section class="faq-section" id="faq">
        <h2 class="faq-header">FAQ</h2>
        
        <details>
            <summary>Can I trust the AI's prediction?</summary>
            <div class="faq-answer">TradeCouncil is a decision-support tool, not a crystal ball. By aggregating multiple top-tier models, we reduce the hallucination rate significantly compared to using a single AI. We provide the consensus logic, but the final trade decision is always yours.</div>
        </details>

        <details>
            <summary>Do I need to pay for GPT-4 or Claude separately?</summary>
            <div class="faq-answer">No. Your TradeCouncil subscription includes access to all top-tier models (GPT-4o, Claude 3.5, Gemini Pro, etc.) in one simple interface without needing separate API keys.</div>
        </details>

        <details>
            <summary>Is my financial data safe?</summary>
            <div class="faq-answer">Absolutely. We are privacy-first. Your charts and documents are processed in an ephemeral environment and are strictly prohibited from being used to train any AI models.</div>
        </details>

        <details>
            <summary>Is this for crypto or stocks?</summary>
            <div class="faq-answer">Both. The Council is trained to analyze candlestick patterns, technical indicators, and financial news, making it effective for Crypto, Equities, Forex, and Commodities.</div>
        </details>
    </section>

    <section class="final-cta-section">
        <div class="cta-big-text">EXECUTE</div>
        <div class="cta-content">
            <h3>Ready to decode the market?</h3>
            <a href="#" class="btn-massive">
                Start Your Council Session <span style="font-size:1rem;">-></span>
            </a>
        </div>
    </section>

    <div class="ticker-wrap">
        <div class="ticker-move">
            <div class="ticker-item"><span class="on"></span> GPT-4o [CONNECTED]</div>
            <div class="ticker-item"><span class="on"></span> CLAUDE 3.5 SONNET [CONNECTED]</div>
            <div class="ticker-item"><span class="on"></span> GEMINI 1.5 PRO [CONNECTED]</div>
            <div class="ticker-item"><span class="on"></span> LLAMA 3 70B [Local]</div>
            <div class="ticker-item">/// SEARCH_WEB [ACTIVE]</div>
            <div class="ticker-item"><span class="on"></span> GPT-4o [CONNECTED]</div>
            <div class="ticker-item"><span class="on"></span> CLAUDE 3.5 SONNET [CONNECTED]</div>
        </div>
    </div>

    <footer>
        <div style="margin-bottom:20px; font-weight:900; font-size:1.5rem; color:#fff;">TRADE COUNCIL</div>
        
        <p class="footer-cta">
            Stop Guessing. Let 5 Top AIs (GPT-4o, Claude 3.5, Gemini Pro) analyze your next trade to identify risks and opportunities you might miss.
        </p>
        
        <div style="margin-top:40px;">
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Terms</a>
            <a href="#" class="footer-link">Twitter</a>
        </div>
        <div style="margin-top:20px; font-size:0.7rem; color:#333;">
            &copy; 2024 TRADECOUNCIL. NOT FINANCIAL ADVICE.
        </div>
    </footer>

</body>
</html>
1. 核心理念 (Core Philosophy)
关键词：Vault (金库)、Institutional (机构级)、Raw Data (原始数据)、Cyber-Noir (赛博黑色电影)。

视觉隐喻：网页不仅是一个展示页面，更是一个精密的“终端”或“控制台”。

情绪：冷峻、理性、高压、极度安全。消除一切“可爱”或“亲切”的元素（如 Emoji、圆润插画），取而代之的是数据流、网格和加密感。

2. 色彩体系 (Color System)
整体采用 “极致深色模式”，依靠微弱的灰度变化来区分层级，仅用极少量的亮色作为功能指示。

A. 背景与基调 (Foundation)
Deep Void (主背景): #0a0a0a (接近纯黑，但带有极细微的亮光，不许用 #000000)。

Surface (卡片/板块): #111111 或 rgba(255, 255, 255, 0.03) (极低透明度的白)。

Borders (分割线): #222222 或 rgba(255, 255, 255, 0.08) (在黑色背景上仅可见轮廓)。

B. 文字 (Typography Color)
Primary (主标题): #ffffff (纯白)。

Secondary (正文): #888888 (中灰，降低视觉干扰)。

Dim (注释/代码): #666666 (暗灰，融入背景)。

Gradient Text (特效): linear-gradient(180deg, #fff 0%, #666 100%) (模拟金属反光质感)。

C. 强调色 (Accents)
Signal Green (金融/安全): #00E676 (用于由涨、安全、连接成功、主按钮)。

Signal Red (危险/下跌): #FF1744 (用于下跌、错误、警报)。

光晕 (Glow): 强调色通常伴随 box-shadow 使用，例如 box-shadow: 0 0 10px var(--accent)。

3. 材质与纹理 (Texture & FX)
这是本设计区别于普通 SaaS 网站的核心。

A. 混凝土噪点 (Concrete Noise)
所有背景必须叠加一层 SVG 噪点滤镜，使黑色具有“砂砾感”或“混凝土感”，而非平滑的塑料感。

实现方式: 使用 SVG feTurbulence 滤镜，透明度 0.05。

B. 磨砂玻璃 (Glassmorphism)
仅用于悬浮层（如 Navbar、Modal）。

参数: backdrop-filter: blur(20px) + background: rgba(10, 10, 10, 0.8) + border: 1px solid rgba(255,255,255,0.08)。

C. 扫描线与光束 (Scanlines & Beams)
使用 CSS 渐变模拟雷达扫描或光束传输。

常用于边框高亮或背景流动，暗示数据正在传输。

4. 排版系统 (Typography)
采用 "双字体策略"：一种用于营销呐喊，一种用于数据陈述。

A. Display Font (Inter / System UI)
用途: H1, H2, 主按钮, 宣传文案。

特征:

极粗: font-weight: 800/900。

紧凑: letter-spacing: -1px 到 -3px (字距极紧，产生力量感)。

大写: 标题通常全大写 text-transform: uppercase。

描边: 偶尔使用 -webkit-text-stroke 制作空心字。

B. Data Font (Courier New / Monospace)
用途: 标签, 数据值, 代码片段, 注释, 装饰性文字 (如 // SECTION_01)。

特征:

等宽: 必须是等宽字体。

小字号: 通常 0.8rem - 0.9rem。

宽字距: letter-spacing: 1px 或 2px。

颜色: 通常为 #666 或 #444，仅作为背景信息。

5. 布局原则 (Layout Principles)
A. 瑞士网格 (Swiss Grid / Bento)
页面被细线 (1px solid #222) 严格切割成矩形区域。

不留白原则: 尽量让边框填满屏幕宽度，内容在网格内对齐。

参考 Privacy 模块和 Pricing 模块：利用线条本身的分割来构建结构，而不是靠留白。

B. 板块化 (Slabs)
内容被封装在独立的“板块”中，像是一个个物理模块。

板块具有内阴影 inset 和微弱的边框，模拟嵌入式硬件的感觉。

6. 组件规范 (Component Library)
A. 按钮 (Buttons)
Core Button (核心操作):

形状：完全圆角 (border-radius: 50px)。

填充：纯白 (#fff) 或 金融绿 (#00E676)。

文字：黑色 (#000)，加粗。

交互：Hover 时产生强烈光晕 (box-shadow)。

Terminal Button (次级/功能):

形状：矩形或微圆角 (4px)。

填充：透明或深黑。

边框：1px solid #333。

文字：等宽字体，大写。

B. 标签与徽章 (Tags & Badges)
样式: 纯文字，带方括号 [GPT-4] 或带细边框。

位置: 通常位于标题上方或卡片右上角。

字体: 必须使用 Monospace 等宽字体。

C. 图标 (Iconography)
绝对禁止: Emojis (🚫 🔒 🚫 🚀)。

推荐:

CSS Shapes: 用 div 和 border 绘制简单的几何图形（如现在的锁、圆点）。

Stroke SVG: 细线条 (stroke-width: 1.5px 或 2px)，无填充的 SVG 图标。

ASCII Art: 在装饰性元素中使用字符画（如 /// 或 >>>）。

D. 装饰元素 (Decorations)
Corner Decos: 在卡片角落添加直角折线 (L 形)，模拟取景器或HUD界面。

Status Dots: 闪烁的绿色/红色圆点，表示系统在线状态。

Serial Numbers: 随处可见的编号（如 STEP 01, REF_2024），增加工业感。

7. 动画指南 (Motion Guidelines)
类型: 线性 (Linear) 或 极简缓动 (Ease-in-out)。

Ticker (跑马灯): 底部必须有类似股市行情的滚动条，保持匀速运动。

Pulse (呼吸): 状态指示灯应有缓慢的呼吸效果 (opacity 变化)。

Scan (扫描): 只有关键交互区域（如上传区）才使用扫描光效。

拒绝: 弹跳 (Bounce)、果冻效果 (Jelly) 等卡通化物理效果。

设计检查清单 (Designer Checklist)
在交付设计稿前，请确认：

[ ] 是否去掉了所有的彩色插画和 Emoji？

[ ] 所有的辅助说明文字是否都用了等宽字体 (Courier)？

[ ] 背景是否应用了噪点纹理？

[ ] 线条颜色是否足够深 (#222)，不至于刺眼？

[ ] 标题字间距是否足够紧凑 (-2px)？

[ ] 是否使用了绿色作为唯一的亮色点缀？
