<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="text-white header-gradient" reveal>
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="payments" class="q-mr-sm text-lime" />
          <span class="text-weight-bold text-lime">FinteckX</span>
        </q-toolbar-title>

        <div class="gt-sm">
          <q-btn flat icon="home" label="Home" to="/" class="q-mx-xs" />
          <q-btn flat icon="star" label="Advantages" to="/" @click.prevent="scrollTo('advantages')" class="q-mx-xs" />
          <q-btn flat icon="diversity_3" label="Services" to="/" @click.prevent="scrollTo('services')" class="q-mx-xs" />
          <q-btn flat icon="group" label="Users" to="/" @click.prevent="scrollTo('metrics')" class="q-mx-xs" />
          <q-btn flat icon="handshake" label="Partners" to="/" @click.prevent="scrollTo('partners')" class="q-mx-xs" />
        </div>

        <q-space />
        <q-btn flat rounded class="btn-gradient" to="/register" icon="rocket_launch" label="Get Started" />
        <q-btn flat class="q-ml-sm btn-outline-light" to="/login" icon="login" label="Access Account" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page v-if="isHome" class="q-pa-none">
        <!-- Hero (text left, image right) -->
        <section class="hero-section row items-center">
          <div class="col-12 col-md-6 q-pa-lg">
            <h1 class="text-h2 text-lime text-bold">Next-Gen Payments with FinteckX</h1>
            <p class="text-subtitle1 q-mt-md">
              Secure. Fast. Scalable. Empowering merchants and users with future-ready payment infrastructure.
            </p>
            <div class="q-mt-lg">
              <q-btn rounded class="btn-gradient q-mx-sm" icon="rocket_launch" label="Get Started" to="/register" />
              <q-btn flat rounded class="btn-outline-light q-mx-sm" icon="info" label="Learn More" to="/" />
            </div>
          </div>
          <div class="col-12 col-md-6 text-center">
            <q-img
              src="/images/hero.svg"
              alt="Fintech 3D"
              class="hero-img floating"
              fit="contain"
              ratio="16/10"
              @error="usePlaceholder($event)"
            />
          </div>
        </section>

        <!-- Advantages (both rows image on right, card on left) -->
        <section id="advantages" class="q-pa-xl">
          <!-- Row 1 -->
          <div class="row items-center q-my-xl">
            <div class="col-12 col-md-6">
              <q-card class="q-pa-lg card-dark lime-glow tall-card card-with-margins">
                <div class="text-h5 text-lime text-bold">Global Reach</div>
                <p class="q-mt-sm">
                  Expand your business with our cross-border payment solutions trusted by thousands of merchants worldwide.
                </p>
                <div class="text-h4 text-lime q-mt-md">+200K</div>
                <div class="text-caption">Active Merchants</div>
              </q-card>
            </div>
            <div class="col-12 col-md-6 text-center">
              <q-img
                src="/images/reach.svg"
                alt="Global Reach"
                class="section-img floating"
                fit="contain"
                ratio="16/10"
                @error="usePlaceholder($event)"
              />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="row items-center q-my-xl">
            <div class="col-12 col-md-6">
              <q-card class="q-pa-lg card-dark lime-glow tall-card card-with-margins">
                <div class="text-h5 text-lime text-bold">Bank-Grade Security</div>
                <p class="q-mt-sm">
                  Transactions are encrypted with multi-layer authentication, giving peace of mind to merchants and customers.
                </p>
                <div class="text-h4 text-lime q-mt-md">99.99%</div>
                <div class="text-caption">System Uptime</div>
              </q-card>
            </div>
            <div class="col-12 col-md-6 text-center">
              <q-img
                src="/images/security.svg"
                alt="Security"
                class="section-img floating"
                fit="contain"
                ratio="16/10"
                @error="usePlaceholder($event)"
              />
            </div>
          </div>
        </section>

        <!-- Services -->
        <section id="services" class="q-pa-xl">
          <div class="text-center q-mb-xl">
            <h2 class="text-h4 text-lime text-bold">Our Services</h2>
            <p class="text-subtitle2">All-in-one fintech platform for payments, analytics, and growth.</p>
          </div>
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4">
              <q-card class="q-pa-lg card-dark lime-glow text-center tall-card card-with-margins">
                <q-icon name="credit_card" size="40px" class="text-lime q-mb-md" />
                <div class="text-h6 text-lime text-bold">Smart Checkout</div>
                <p>Fast and seamless checkout experience with multiple payment methods.</p>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="q-pa-lg card-dark lime-glow text-center tall-card card-with-margins">
                <q-icon name="stacked_bar_chart" size="40px" class="text-lime q-mb-md" />
                <div class="text-h6 text-lime text-bold">Analytics</div>
                <p>Track and optimize your performance with real-time insights and reporting tools.</p>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="q-pa-lg card-dark lime-glow text-center tall-card card-with-margins">
                <q-icon name="support" size="40px" class="text-lime q-mb-md" />
                <div class="text-h6 text-lime text-bold">24/7 Support</div>
                <p>Always-on support system to resolve issues instantly and keep business running.</p>
              </q-card>
            </div>
          </div>
        </section>

        <!-- Metrics -->
        <section id="metrics" class="q-pa-xl">
          <q-card class="q-pa-xl card-dark lime-glow">
            <div class="row text-center items-stretch">
              <div class="col-6 col-md-3 q-mb-md q-mb-none-md">
                <div class="text-h4 text-lime">120K+</div>
                <div class="text-caption">Users</div>
              </div>
              <div class="col-6 col-md-3 q-mb-md q-mb-none-md">
                <div class="text-h4 text-lime">48</div>
                <div class="text-caption">Countries</div>
              </div>
              <div class="col-6 col-md-3 q-mb-md q-mb-none-md">
                <div class="text-h4 text-lime">$2.3B</div>
                <div class="text-caption">Amount Processed</div>
              </div>
              <div class="col-6 col-md-3">
                <div class="text-h4 text-lime">99.98%</div>
                <div class="text-caption">Uptime</div>
              </div>
            </div>
          </q-card>
        </section>

        <!-- Partners (gapless continuous marquee, local logos) -->
        <section id="partners" class="q-pa-xl">
          <div class="text-center q-mb-md">
            <h2 class="text-h5 text-lime text-bold">Official Partners</h2>
          </div>
          <div class="partners-marquee">
            <div class="marquee-group">
              <img v-for="(logo, i) in logos" :key="'g1-'+i" :src="logo" :alt="'logo-'+i" @error="useLogoPlaceholder($event)" />
            </div>
            <div class="marquee-group" aria-hidden="true">
              <img v-for="(logo, i) in logos" :key="'g2-'+i" :src="logo" :alt="'logo-'+i" @error="useLogoPlaceholder($event)" />
            </div>
          </div>
        </section>
      </q-page>

      <router-view v-else />
    </q-page-container>

    <!-- Footer -->
    <footer class="custom-footer q-pa-xl">
      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-3">
          <h5 class="text-lime">FinteckX</h5>
          <p>A complete fintech ecosystem designed to scale your payments securely and globally.</p>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="text-bold">Company</h6>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Newsroom</a></li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="text-bold">Resources</h6>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">API Docs</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="text-bold">Legal</h6>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
        <div class="col-12 col-md-3">
          <h6 class="text-bold">Follow Us</h6>
          <div class="row q-gutter-sm">
            <q-btn round flat icon="public" />
            <q-btn round flat icon="code" />
            <q-btn round flat icon="business" />
          </div>
        </div>
      </div>
      <div class="text-center q-mt-lg text-caption">
        © {{ new Date().getFullYear() }} FinteckX. All Rights Reserved.
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')

const logos = [
  '/images/logos/mastercard.svg',
  '/images/logos/amazon.svg',
  '/images/logos/visa.svg',
  '/images/logos/stripe.svg',
  '/images/logos/binance.svg'
]

const usePlaceholder = (e) => { e.target.src = '/images/hero.svg' }
const useLogoPlaceholder = (e) => { e.target.src = '/images/logos/mastercard.svg' }

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
/* Float animation */
.floating { animation: float 4s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }

/* Hero */
.hero-section { min-height: 80vh; padding: 40px; }
.hero-img { max-width: 92%; height: auto; border-radius: 12px; }

/* Section images */
.section-img { max-width: 85%; height: auto; border-radius: 12px; }

/* Cards */
.card-dark {
  background: #000;
  color: #fff;
  border-radius: 14px;
  border: 1px solid rgba(189, 240, 0, 0.28);
}
.lime-glow {
  box-shadow:
    0 10px 28px rgba(0,0,0,0.35),
    0 0 0 1px rgba(189,240,0,0.28),
    0 0 24px rgba(189,240,0,0.18);
}
.tall-card { min-height: 240px; }
.card-with-margins { margin-top: 12px; margin-bottom: 12px; }

/* Buttons */
.btn-gradient {
  background: linear-gradient(135deg, #bdf000, #ffffff);
  color: #09050d;
  font-weight: 700;
  border: 1px solid rgba(189, 240, 0, 0.5);
}
.btn-outline-light { border: 1px solid #fff; color: #fff; }

/* Partners marquee (gapless, two groups with offset) */
.partners-marquee {
  position: relative;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(189, 240, 0, 0.25);
  border-radius: 12px;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
}
.marquee-group {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 18px 24px;
  flex-shrink: 0;
  animation: marquee 22s linear infinite;
}
.marquee-group:nth-child(2) { animation-delay: -11s; }
.marquee-group img { height: 26px; width: auto; filter: grayscale(100%); opacity: .9; }
@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-100%) } }

/* Footer */
.custom-footer { background: #000; color: #ccc; }
.custom-footer h5, .custom-footer h6 { color: #bdf000; }
.custom-footer ul { list-style: none; padding: 0; margin: 0; }
.custom-footer li { margin: 6px 0; }
.custom-footer a { color: #ccc; text-decoration: none; }
.custom-footer a:hover { color: #bdf000; }

/* Lime + header gradient */
.text-lime { color: #bdf000; }
.header-gradient { background: linear-gradient(90deg, #09050d 0%, #121018 60%, #171719 100%); }
</style>
