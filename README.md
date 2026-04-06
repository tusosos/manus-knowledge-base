# Wiedza i Umiejętności Manus AI

## Wprowadzenie

Jestem Manus, autonomiczny agent AI ogólnego przeznaczenia, stworzony przez zespół Manus. Moim celem jest efektywne wykonywanie szerokiego zakresu zadań poprzez iteracyjne działanie w środowisku piaskownicy, wykorzystując dostępne narzędzia i umiejętności.

## Możliwości

Posiadam szeroki zakres możliwości, które pozwalają mi na realizację różnorodnych zadań. Obejmują one:

*   **Gromadzenie informacji i analiza danych**: Wyszukiwanie, sprawdzanie faktów, przetwarzanie danych, analiza i tworzenie wizualizacji.
*   **Tworzenie treści**: Pisanie artykułów, raportów badawczych, dokumentacji technicznej i kreatywnej.
*   **Rozwój oprogramowania**: Budowanie stron internetowych, aplikacji interaktywnych i rozwiązań programistycznych.
*   **Generowanie mediów**: Tworzenie i edycja obrazów, wideo, audio, muzyki i mowy.
*   **Automatyzacja i optymalizacja**: Automatyzacja przepływów pracy, wykonywanie zaplanowanych zadań i rozwiązywanie problemów za pomocą programowania.
*   **Interakcja z użytkownikiem**: Współpraca z użytkownikiem w celu realizacji celów i dostarczania wyników.

## Dostępne Narzędzia

Dysponuję zestawem narzędzi, które umożliwiają mi interakcję ze środowiskiem piaskownicy i wykonywanie zadań:

*   `shell`: Interakcja z sesjami powłoki w środowisku piaskownicy.
*   `file`: Wykonywanie operacji na plikach w systemie plików piaskownicy (czytanie, pisanie, edycja).
*   `search`: Wyszukiwanie informacji w różnych źródłach (web, obrazy, API, wiadomości, narzędzia, dane, badania).
*   `browser`: Nawigacja po stronach internetowych i interakcja z nimi.
*   `plan`: Tworzenie, aktualizowanie i rozwijanie ustrukturyzowanego planu zadań.
*   `message`: Wysyłanie wiadomości do użytkownika (informacje, pytania, wyniki).
*   `generate`: Wchodzenie w tryb generowania obrazów, wideo, audio, muzyki i mowy.
*   `slides`: Wchodzenie w tryb tworzenia i dostosowywania prezentacji.
*   `webdev_init_project`: Inicjalizacja nowego projektu webowego lub mobilnego.
*   `schedule`: Planowanie zadań do uruchomienia w określonym czasie lub interwale.
*   `expose`: Upublicznianie lokalnego portu w piaskownicy dla tymczasowego dostępu publicznego.
*   `match`: Znajdowanie plików lub tekstu w systemie plików piaskownicy za pomocą dopasowywania wzorców.

## Integracja z Model Context Protocol (MCP)

Integruję się z protokołem Model Context Protocol (MCP), co pozwala mi na interakcję z zewnętrznymi usługami i narzędziami. Dostępne serwery MCP to:

*   `canva`: Do wyszukiwania, tworzenia, organizowania i eksportowania projektów w koncie Canva użytkownika.
*   `gmail`: Narzędzia Gmail.
*   `google-calendar`: Narzędzia Google Calendar.

Interakcja z serwerami MCP odbywa się za pomocą narzędzia `manus-mcp-cli`.

## Druk 3D i Produkcja

W ramach moich kompetencji oferuję zaawansowane wsparcie w zakresie druku 3D, obejmujące:
*   **Generowanie modeli 3D**: Tworzenie plików STL z opisów parametrycznych.
*   **Analiza opłacalności**: Szacowanie kosztów produkcji i ocena potencjału komercyjnego.
*   **Optymalizacja projektów**: Dostosowanie modeli do technologii FDM/SLA.

Szczegółowe informacje znajdziesz w pliku [3d_printing_commercial_viability.md](3d_printing_commercial_viability.md) oraz w katalogu `3d_printing_assets/`.

## Dostępne Umiejętności (Skills)

Umiejętności (Skills) to modułowe zdolności, które rozszerzają moją funkcjonalność. Poniżej znajduje się lista dostępnych umiejętności:


| Nazwa Umiejętności | Opis |
|---|---|
| stock-analysis | Analyze stocks and companies using financial market data. Get company profiles, technical insights, price charts, insider holdings, and SEC filings for comprehensive stock research. |
| 3dsmax-scripting | Automate 3ds Max with MAXScript and Python — scene manipulation, object creation, material assignment, camera setup, batch operations, UI tools, and file I/O. Use when tasks involve automating repetitive 3ds Max workflows, batch processing scenes, creating custom tools, or scripting scene setup for archviz, product visualization, or VFX. |
| blender-addon-dev | Build custom Blender add-ons with Python. Use when the user wants to create a Blender add-on, register operators, build UI panels, add custom properties, create menus, package an add-on for distribution, or extend Blender with custom tools and workflows. |
| pdf-analyzer | Extract text, tables, metadata, and structured data from PDF files. Use when a user asks to read a PDF, parse a PDF, extract data from a PDF, summarize a PDF document, pull tables from a PDF, or convert PDF content to structured formats like JSON or CSV. Handles single and multi-page documents, scanned PDFs, and PDFs with complex table layouts. |
| verification-before-completion | Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always |
| articulated-toys | Generate print-in-place articulated toys for 3D printing. Creates STL files of segmented creatures (snakes, dragons, caterpillars, fish, robots) with hook-and-axle joints that move freely right off the print bed — no assembly required. Supports wings, legs, and branching body structures. Can also convert existing static 3D models (STL/OBJ/3MF) into articulated print-in-place toys. |
| canva-mcp | Guide for using the Canva MCP server integration. Use when creating, importing, exporting, or managing designs in the user's Canva account via MCP. Covers recommended workflows, import limits, template constraints, available tools, and critical pitfalls to avoid. |
| blender-vse-pipeline | Automate video editing in Blender's Video Sequence Editor with Python. Use when the user wants to add video, image, or audio strips, create transitions, apply effects, build edit timelines, batch assemble footage, estimate render times, or script any VSE workflow from the command line. |
| blender-motion-capture | Automate motion capture and tracking workflows in Blender with Python. Use when the user wants to import BVH or FBX mocap data, retarget motion to armatures, track camera or object motion from video, solve camera motion, clean up motion capture data, or script any tracking pipeline in Blender. |
| table-extractor | Extract tables from PDFs with high accuracy using camelot. Handles complex table structures including merged cells, multi-line rows, and spanning headers. Use when a user asks to extract a table from a PDF, pull tabular data from a document, convert PDF tables to CSV or Excel, or parse structured tables from reports. |
| using-git-worktrees | Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification |
| threejs | Assists with building interactive 3D experiences in the browser using Three.js. Use when creating 3D product configurators, data visualizations, games, or creative experiences with scenes, cameras, lighting, model loading, and performance optimization. Trigger words: threejs, three.js, 3d, webgl, react three fiber, r3f, glb, gltf. |
| executing-plans | Use when you have a written implementation plan to execute in a separate session with review checkpoints |
| blender-compositing | Automate Blender compositing and post-processing with Python. Use when the user wants to set up compositor nodes, add post-processing effects, color correct renders, combine render passes, apply blur or glare, key green screens, create node-based VFX pipelines, or script the Blender compositor. |
| csv-data-summarizer | Analyzes CSV files, generates summary stats, and plots quick visualizations using Python and pandas. |
| gws-best-practices | Best practices for using the gws CLI with supported Google Workspace services (Drive, Docs, Sheets, Slides). Use when performing any operation with the gws CLI. |
| sharp | Process and transform images with Sharp for Node.js. Use when a user asks to resize images, convert image formats (WebP, AVIF, PNG, JPEG), compress images, crop or rotate photos, generate thumbnails, add watermarks, optimize images for web, batch process images, create responsive image variants, extract image metadata, or build image processing pipelines. Covers resizing, format conversion, compression, cropping, compositing, and metadata extraction. |
| excel-generator | Professional Excel spreadsheet creation with a focus on aesthetics and data analysis. Use when creating spreadsheets for organizing, analyzing, and presenting structured data in a clear and professional format. |
| test-driven-development | Use when implementing any feature or bugfix, before writing implementation code |
| video-generator | Professional AI video production workflow. Use when creating videos, short films, commercials, or any video content using AI generation tools. |
| opencv | You are an expert in OpenCV (Open Source Computer Vision Library), the most popular library for real-time computer vision. You help developers build image processing pipelines, object detection systems, video analysis tools, augmented reality, and document processing using OpenCV's 2,500+ algorithms for image manipulation, feature detection, camera calibration, 3D reconstruction, and DNN inference — in Python, C++, or JavaScript. |
| internet-skill-finder | Search and recommend Agent Skills from verified GitHub repositories. Use when users ask to find, discover, search for, or recommend skills/plugins for specific tasks, domains, or workflows. |
| skill-creator | Guide for creating or updating skills that extend Manus via specialized knowledge, workflows, or tool integrations. For any modification or improvement request, MUST first read this skill and follow its update workflow instead of editing files directly. |
| image-enhancer | Improves the quality of images, especially screenshots, by enhancing resolution, sharpness, and clarity. Perfect for preparing images for presentations, documentation, or social media posts. |
| systematic-debugging | Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes |
| requesting-code-review | Use when completing tasks, implementing major features, or before merging to verify work meets requirements |
| web-design-guidelines | Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices". |
| article-extractor | Extract clean article content from URLs (blog posts, articles, tutorials) and save as readable text. Use when user wants to download, extract, or save an article/blog post from a URL without ads, navigation, or clutter. |
| spec-to-3d | Generate 3D building models from architectural specifications, parsed drawings, or building code data. Outputs Three.js geometry, Pascal Editor JSON, or plain JSON for IFC conversion. Use when: converting floor plans to 3D, building spec-driven 3D models, generating architectural visualizations from structured data. |
| scientific-writing | Core skill for the deep research and writing tool. Write scientific manuscripts in full paragraphs (never bullet points). Use two-stage process with (1) section outlines with key points using research-lookup then (2) convert to flowing prose. IMRAD structure, citations (APA/AMA/Vancouver), figures/tables, reporting guidelines (CONSORT/STROBE/PRISMA), for research papers and journal submissions. |
| vertex-media-generation | Generate images with Imagen and videos with Veo using the Vercel AI SDK Google Vertex provider. Use when the user wants to generate images, edit images (inpainting, outpainting, background swap), generate videos, or build media generation pipelines with @ai-sdk/google-vertex. Covers Imagen 4.0/3.0 and Veo 3.1/3.0/2.0 models. |
| deep-research | Execute autonomous multi-step research using Google Gemini Deep Research Agent. Use for: market analysis, competitive landscaping, literature reviews, technical research, due diligence. Takes 2-10 minutes but produces detailed, cited reports. Costs $2-5 per task. |
| writing-plans | Use when you have a spec or requirements for a multi-step task, before touching code |
| blender-animation | Animate 3D objects and characters in Blender with Python. Use when the user wants to keyframe properties, create armatures and rigs, set up IK/FK chains, animate shape keys for facial animation, edit F-Curves, use the NLA editor to blend actions, add drivers for expression-based animation, or script any animation workflow in Blender. |
| mysql | Execute read-only SQL queries against multiple MySQL databases. Use when: (1) querying MySQL databases, (2) exploring database schemas/tables, (3) running SELECT queries for data analysis, (4) checking database contents. Supports multiple database connections with descriptions for intelligent auto-selection. Blocks all write operations (INSERT, UPDATE, DELETE, DROP, etc.) for safety. |
| yt-dlp | Download video and audio from YouTube and other platforms with yt-dlp. Use when a user asks to download YouTube videos, extract audio from videos, download playlists, get subtitles, download specific formats or qualities, batch download, archive channels, extract metadata, embed thumbnails, download from social media platforms (Twitter, Instagram, TikTok), or build media ingestion pipelines. Covers format selection, audio extraction, playlists, subtitles, metadata, and automation. |
| remotion-video-toolkit | Programmatic video creation with React using Remotion. Use when a user asks to create videos with code, generate personalized videos, build animated data visualizations, add TikTok-style captions, render video programmatically, or automate video production. Supports CLI rendering, AWS Lambda, and Google Cloud Run deployment. |
| lead-research-assistant | Identifies high-quality leads for your product or service by analyzing your business, searching for target companies, and providing actionable contact strategies. Perfect for sales, business development, and marketing professionals. |
| blender-render-automation | Automate Blender rendering from the command line. Use when the user wants to set up renders, batch render scenes, configure Cycles or EEVEE, set up cameras and lights, render animations, create materials and shaders, or build a render pipeline with Blender Python scripting. |
| scientific-visualization | Meta-skill for publication-ready figures. Use when creating journal submission figures requiring multi-panel layouts, significance annotations, error bars, colorblind-safe palettes, and specific journal formatting (Nature, Science, Cell). Orchestrates matplotlib/seaborn/plotly with publication styles. For quick exploration use seaborn or plotly directly. |
| sanitize | Detect and redact PII from text files. Supports 15 categories including credit cards, SSNs, emails, API keys, addresses, and more — with zero dependencies. |
| similarweb-analytics | Analyze websites and domains using SimilarWeb traffic data. Get traffic metrics, engagement stats, global rankings, traffic sources, and geographic distribution for comprehensive website research. |
| openscad | Create and render OpenSCAD 3D models. Generate preview images from multiple angles, extract customizable parameters, validate syntax, and export STL files for 3D printing platforms like MakerWorld. |
| flux-model | FLUX image generation models — Flux Pro, Dev, and Schnell via fal.ai, Replicate, or Black Forest Labs API. Use when generating high-quality or photorealistic images, applying LoRA fine-tuning for custom styles, or building production image generation pipelines. |
| react-three-fiber | You are an expert in React Three Fiber (R3F), the React renderer for Three.js that lets developers build 3D scenes using JSX components. You help teams create interactive 3D websites, product configurators, data visualizations, games, and immersive experiences — using React patterns (hooks, state, props, suspense) instead of imperative Three.js code, with full access to the Three.js ecosystem. |
| receiving-code-review | Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation |
| playwright-skill | Battle-tested Playwright patterns for E2E, API, component, visual, accessibility, and security testing. Covers locators, fixtures, POM, network mocking, auth flows, debugging, CI/CD (GitHub Actions, GitLab, CircleCI, Azure, Jenkins), framework recipes (React, Next.js, Vue, Angular), and migration guides from Cypress/Selenium. TypeScript and JavaScript. |
| playwright-ci | Production-ready CI/CD configurations for Playwright — GitHub Actions, GitLab CI, CircleCI, Azure DevOps, Jenkins, Docker, parallel sharding, reporting, code coverage, and global setup/teardown. |
| playwright-core | Battle-tested Playwright patterns for E2E, API, component, visual, accessibility, and security testing. Covers locators, assertions, fixtures, network mocking, auth flows, debugging, and framework recipes for React, Next.js, Vue, and Angular. TypeScript and JavaScript. |
| playwright-migration | Step-by-step migration guides for moving to Playwright from Cypress or Selenium/WebDriver — command mappings, architecture changes, and incremental adoption strategies. |
| playwright-cli | Automates browser interactions for testing and validating your own web applications using playwright-cli. Use when the user needs to navigate their own apps, fill forms, take screenshots, test web application behavior, mock network requests, manage browser sessions, or generate test code. Only use against applications you own or have explicit authorization to test. |
| playwright-pom | Page Object Model patterns for Playwright — when to use POM, how to structure page objects, and when fixtures or helpers are a better fit. |
| xlsx | Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .csv, or .tsv file (e.g., adding columns, computing formulas, formatting, charting, cleaning messy data); create a new spreadsheet from scratch or from other data sources; or convert between tabular file formats. Trigger especially when the user references a spreadsheet file by name or path — even casually (like "the xlsx in my downloads") — and wants something done to it or produced from it. Also trigger for cleaning or restructuring messy tabular data files (malformed rows, misplaced headers, junk data) into proper spreadsheets. The deliverable must be a spreadsheet file. Do NOT trigger when the primary deliverable is a Word document, HTML report, standalone Python script, database pipeline, or Google Sheets API integration, even if tabular data is involved. |
| blender-scripting | Write and run Blender Python scripts for 3D automation and procedural modeling. Use when the user wants to automate Blender tasks, create 3D models from code, run headless scripts, manipulate scenes, batch process .blend files, build geometry with bmesh, apply modifiers, generate procedural shapes, or import/export 3D models using the bpy API. |
| exploratory-data-analysis | Perform comprehensive exploratory data analysis on scientific data files across 200+ file formats. This skill should be used when analyzing any scientific data file to understand its structure, content, quality, and characteristics. Automatically detects file type and generates detailed markdown reports with format-specific analysis, quality metrics, and downstream analysis recommendations. Covers chemistry, bioinformatics, microscopy, spectroscopy, proteomics, metabolomics, and general scientific data formats. |
| tailored-resume-generator | Analyzes job descriptions and generates tailored resumes that highlight relevant experience, skills, and achievements to maximize interview chances |
| whisper | Transcribe audio to text with OpenAI Whisper. Use when a user asks to transcribe audio files, generate subtitles (SRT/VTT), transcribe podcasts, convert speech to text, translate audio to English, build transcription pipelines, do speaker diarization, transcribe meetings, process voice memos, create searchable audio archives, or integrate speech-to-text into applications. Covers OpenAI Whisper (local), Whisper API, faster-whisper, whisper.cpp, and production deployment patterns. |
| vercel-composition-patterns | React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on tasks involving compound components, render props, context providers, or component architecture. Includes React 19 API changes. |
| dispatching-parallel-agents | Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies |
| 3d-print-model-generator | Generate 3D printable STL models from parametric descriptions. Use for creating 3D models, STL files, mechanical parts, gears, brackets, enclosures, or any geometry for 3D printing. Supports primitives, functional objects, custom scripts, and PNG previews. |
| bgm-prompter | MUST read this skill BEFORE entering generate mode for music tasks. Covers prompt crafting framework, structure syntax, and multi-clip strategy. |
| blender-grease-pencil | Create 2D art and animation in Blender using Grease Pencil and Python. Use when the user wants to draw strokes programmatically, create 2D animations, build Grease Pencil objects from code, manage GP layers and frames, apply GP modifiers, set up drawing guides, or script any Grease Pencil workflow in Blender. |
| finishing-a-development-branch | Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup |
| mcp-builder | Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK). |
| deploy-to-vercel | Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment". |
| research-lookup | Look up current research information using the Parallel Chat API (primary) or Perplexity sonar-pro-search (academic paper searches). Automatically routes queries to the best backend. Use for finding papers, gathering research data, and verifying scientific information. |
| imagen | Generate images using Google Gemini's image generation capabilities. Use this skill when the user needs to create, generate, or produce images for any purpose including UI mockups, icons, illustrations, diagrams, concept art, placeholder images, or visual representations.  |
| 3dsmax-rendering | Configure and optimize rendering in 3ds Max — V-Ray and Corona render settings, render elements, light mix, batch rendering, network rendering, denoising, and post-production workflows. Use when tasks involve setting up production renders, optimizing render times, batch rendering multiple views, or configuring render farms for archviz and product visualization. |
| github-gem-seeker | Search GitHub for battle-tested solutions instead of reinventing the wheel. Use when the user's problem is universal enough that open source developers have probably solved it already—especially for: format conversion (video/audio/image/document), media downloading, file manipulation, web scraping/archiving, automation scripts, and CLI tools. Prefer this skill over writing custom code for well-trodden problems.  |
| content-research-writer | Assists in writing high-quality content by conducting research, adding citations, improving hooks, iterating on outlines, and providing real-time feedback on each section. Transforms your writing process from solo effort to collaborative partnership. |
| subagent-driven-development | Use when executing implementation plans with independent tasks in the current session |
| web-scraper | Extract structured data from web pages and load it into databases. Use when a user asks to scrape a website, build a data pipeline, extract data from a webpage, pull prices from a site, collect links, gather product listings, download page content, parse HTML, set up ETL, or automate data collection. Handles static HTML, JavaScript-rendered pages, anti-bot proxies (Bright Data), data transformation, deduplication, and database loading. |
| youtube-downloader | Download YouTube videos with customizable quality and format options. Use this skill when the user asks to download, save, or grab YouTube videos. Supports various quality settings (best, 1080p, 720p, 480p, 360p), multiple formats (mp4, webm, mkv), and audio-only downloads as MP3. |
| invoice-organizer | Automatically organizes invoices and receipts for tax preparation by reading messy files, extracting key information, renaming them consistently, and sorting them into logical folders. Turns hours of manual bookkeeping into minutes of automated organization. |
| self-improvement | Captures learnings, errors, and corrections to enable continuous improvement. Use when: (1) A command or operation fails unexpectedly, (2) User corrects Claude ('No, that's wrong...', 'Actually...'), (3) User requests a capability that doesn't exist, (4) An external API or tool fails, (5) Claude realizes its knowledge is outdated or incorrect, (6) A better approach is discovered for a recurring task. Also review learnings before major tasks. |
| statistical-analysis | Guided statistical analysis with test selection and reporting. Use when you need help choosing appropriate tests for your data, assumption checking, power analysis, and APA-formatted results. Best for academic research reporting, test selection guidance. For implementing specific models programmatically use statsmodels. |
| postgres | Execute read-only SQL queries against multiple PostgreSQL databases. Use when: (1) querying PostgreSQL databases, (2) exploring database schemas/tables, (3) running SELECT queries for data analysis, (4) checking database contents. Supports multiple database connections with descriptions for intelligent auto-selection. Blocks all write operations (INSERT, UPDATE, DELETE, DROP, etc.) for safety. |
