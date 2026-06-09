'use client'

import { useEffect } from 'react'
import Image from "next/image";

const awards = [
  {
    id: 1,
    brand: "Samsung",
    brandColor: "#1428A0",
    accentColor: "#E8F0FE",
    title: "SAMMAAN — Outstanding Performance Award",
    year: "2024",
    issuer: "Samsung India Electronics Pvt. Ltd.",
    signatories: ["Alok Pathak – Head (VD Sales)", "Vipiesh Dang – Head (VD Business)", "Mike Chu – Corporate VP (VD Business)"],
    description:
      "Awarded under Samsung's prestigious 'The Big Take Off 2025' program for exceptional sales performance and dedication throughout 2024. This recognition reflects Hari Om Electronics' consistent contribution to Samsung's growth as a trusted Visual Display partner in the Pune region.",
    badge: "⭐ Performance Excellence",
    image: "/awards/samsung-sammaan.jpg",
    imageAlt: "Samsung SAMMAAN 2025 Award Certificate",
  },
  {
    id: 2,
    brand: "Haier",
    brandColor: "#003087",
    accentColor: "#E8F4FD",
    title: "Star Performer Award",
    year: "2025–26",
    issuer: "Dynamic Distributors — Haier India",
    signatories: [],
    description:
      "Hari Om Electronics was recognised as a Star Performer by Haier for the year 2025–26, presented by Dynamic Distributors. This award honours outstanding retail performance, product knowledge, and commitment to customer satisfaction in the Haier brand ecosystem.",
    badge: "🏆 Star Performer",
    image: "/awards/haier-star-performer.jpg",
    imageAlt: "Haier Star Performer Award 2025-26",
  },
  {
    id: 3,
    brand: "Bajaj Finserv",
    brandColor: "#0066CC",
    accentColor: "#EBF4FF",
    title: "Elite Club — Top Partner of Pune",
    year: "Ongoing",
    issuer: "Bajaj Finance Ltd.",
    signatories: [],
    description:
      "Bajaj Finance recognises Hari Om Electronics as a member of its exclusive Elite Club, honouring us among the Top Partners of Pune. This distinction is awarded for unwavering support, high EMI conversion performance, and commitment to providing flexible financing solutions to customers.",
    badge: "💎 Elite Club Member",
    image: "/awards/bajaj-elite-club.jpg",
    imageAlt: "Bajaj Finserv Elite Club Award",
  },
  {
    id: 4,
    brand: "Sony India",
    brandColor: "#000000",
    accentColor: "#F5F5F5",
    title: "Certificate of Authorisation",
    year: "Valid till March 2026",
    issuer: "Sony India Pvt. Ltd.",
    signatories: ["Sunil Nayyar – Managing Director, Sony India", "Satish Padmanabhan – Head of Sales, Sony India"],
    description:
      "Sony India has certified Hari Om Electronics as an Authorised Dealer for Consumer Audio and Visual Products. This certification ensures that every Sony product sold at our store is 100% genuine, backed by official warranty, and supported by Sony's national service network.",
    badge: "✅ Authorised Dealer",
    image: "/awards/sony-authorisation.jpg",
    imageAlt: "Sony India Certificate of Authorisation",
  },
  {
    id: 5,
    brand: "Novel Sewing Machines",
    brandColor: "#B22222",
    accentColor: "#FFF5F5",
    title: "Authorised Dealer Certificate",
    year: "2024–25",
    issuer: "Novel Sewing Machine Technologies (Since 1955, ISO 9002:2008 Certified)",
    signatories: [],
    description:
      "Novel Sewing Machine Technologies — an Indian brand with over 70 years of heritage — has appointed Hari Om Electronics as an Authorised Dealer for Household and Highspeed Auto Lubrication Industrial Sewing Machines. Models authorised include LINK, Designer Auto 22, and NL-9100 A2.",
    badge: "🪡 Authorised Dealer",
    image: "/awards/novel-dealer.jpg",
    imageAlt: "Novel Sewing Machine Technologies Dealer Certificate",
  },
];

export default function AwardsPage() {
  useEffect(function () {
    document.title = "Awards & Recognitions | Hari Om Electronics"
  }, [])

  return (
    <>
      <section className="awards-hero">
        <div className="awards-hero__inner">
          <span className="awards-hero__eyebrow">Since 1988 · Alandi, Maharashtra</span>
          <h1 className="awards-hero__heading">Awards &amp; Recognitions</h1>
          <p className="awards-hero__sub">
            Over three decades of trusted service — recognised by the world&rsquo;s leading brands for performance, integrity, and customer commitment.
          </p>
          <div className="awards-hero__stats">
            <div className="stat">
              <span className="stat__num">5+</span>
              <span className="stat__label">Brand Awards</span>
            </div>
            <div className="stat">
              <span className="stat__num">38+</span>
              <span className="stat__label">Years in Business</span>
            </div>
            <div className="stat">
              <span className="stat__num">50+</span>
              <span className="stat__label">Brands Carried</span>
            </div>
          </div>
        </div>
      </section>

      <section className="awards-list">
        <div className="awards-list__inner">
          {awards.map((award, idx) => (
            <article
              key={award.id}
              className={`award-card ${idx % 2 === 1 ? "award-card--reverse" : ""}`}
              style={{ "--accent": award.accentColor, "--brand": award.brandColor }}
            >
              <div className="award-card__photo">
                <div className="award-card__photo-frame">
                  <Image
                    src={award.image}
                    alt={award.imageAlt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  <div className="award-card__badge">{award.badge}</div>
                </div>
              </div>

              <div className="award-card__content">
                <span className="award-card__brand" style={{ color: award.brandColor }}>
                  {award.brand}
                </span>
                <h2 className="award-card__title">{award.title}</h2>
                <div className="award-card__meta">
                  <span className="meta-chip">📅 {award.year}</span>
                  <span className="meta-chip">🏢 {award.issuer}</span>
                </div>
                <p className="award-card__desc">{award.description}</p>
                {award.signatories.length > 0 && (
                  <div className="award-card__signatories">
                    <span className="signatories__label">Signed by</span>
                    <ul>
                      {award.signatories.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="awards-cta">
        <div className="awards-cta__inner">
          <h2>Shop with confidence at an award-winning store</h2>
          <p>Every purchase at Hari Om Electronics is backed by genuine products, authorised warranties, and trusted brand partnerships.</p>
          <div className="awards-cta__btns">
            <a href="/products" className="btn btn--primary">Explore Products</a>
            <a href="/stores" className="btn btn--outline">Visit a Store</a>
          </div>
        </div>
      </section>

      <style jsx>{`
        :root {
          --gold: #c9a84c;
          --gold-light: #f9f3e3;
          --page-bg: #fafafa;
          --text-dark: #1a1a1a;
          --text-mid: #4a4a4a;
          --text-light: #757575;
          --radius: 16px;
          --shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
        }

        .awards-hero {
          background: linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 60%, #0d0d2b 100%);
          color: #fff;
          padding: 80px 24px 72px;
          text-align: center;
        }
        .awards-hero__inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .awards-hero__eyebrow {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          font-weight: 600;
        }
        .awards-hero__heading {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 20px;
          background: linear-gradient(90deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .awards-hero__sub {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          margin: 0 auto 40px;
          max-width: 560px;
        }
        .awards-hero__stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .stat { display: flex; flex-direction: column; align-items: center; }
        .stat__num {
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--gold);
          line-height: 1;
        }
        .stat__label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .awards-list {
          background: var(--page-bg);
          padding: 80px 24px;
        }
        .awards-list__inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        .award-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          background: #fff;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          border: 1px solid #ebebeb;
        }
        .award-card--reverse {
          direction: rtl;
        }
        .award-card--reverse > * {
          direction: ltr;
        }

        .award-card__photo {
          position: relative;
          aspect-ratio: 4/3;
          background: var(--accent, #f5f5f5);
        }
        .award-card__photo-frame {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .award-card__badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.72);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
          letter-spacing: 0.02em;
        }

        .award-card__content {
          padding: 40px 40px 40px 0;
        }
        .award-card--reverse .award-card__content {
          padding: 40px 0 40px 40px;
        }
        .award-card__brand {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .award-card__title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.25;
          margin: 0 0 16px;
        }
        .award-card__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .meta-chip {
          background: var(--accent, #f5f5f5);
          color: var(--text-mid);
          font-size: 0.8rem;
          padding: 4px 12px;
          border-radius: 999px;
          font-weight: 500;
        }
        .award-card__desc {
          font-size: 0.95rem;
          color: var(--text-mid);
          line-height: 1.75;
          margin: 0 0 20px;
        }
        .award-card__signatories {
          border-top: 1px solid #ebebeb;
          padding-top: 16px;
        }
        .signatories__label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-light);
          display: block;
          margin-bottom: 8px;
        }
        .award-card__signatories ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 24px;
        }
        .award-card__signatories li {
          font-size: 0.83rem;
          color: var(--text-mid);
          font-weight: 500;
        }

        .awards-cta {
          background: linear-gradient(135deg, #0d0d2b, #1a1a4e);
          padding: 72px 24px;
          text-align: center;
          color: #fff;
        }
        .awards-cta__inner {
          max-width: 640px;
          margin: 0 auto;
        }
        .awards-cta h2 {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          margin: 0 0 16px;
        }
        .awards-cta p {
          color: rgba(255,255,255,0.72);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0 0 32px;
        }
        .awards-cta__btns {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.15s, opacity 0.15s;
        }
        .btn:hover { transform: translateY(-1px); opacity: 0.9; }
        .btn--primary {
          background: var(--gold);
          color: #fff;
        }
        .btn--outline {
          background: transparent;
          border: 2px solid rgba(255,255,255,0.4);
          color: #fff;
        }

        @media (max-width: 768px) {
          .award-card,
          .award-card--reverse {
            grid-template-columns: 1fr;
            direction: ltr;
          }
          .award-card__photo {
            aspect-ratio: 16/9;
          }
          .award-card__content,
          .award-card--reverse .award-card__content {
            padding: 24px 24px 32px;
          }
          .awards-list { padding: 48px 16px; }
          .awards-list__inner { gap: 40px; }
        }
      `}</style>
    </>
  );
}
