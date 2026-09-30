(() => {
  const CONFIG = window.GAINLYTIC_CONFIG;
  const PRODUCTS = window.GAINLYTIC_PRODUCTS;
  const state = { category: 'all', query: '', sort: 'featured' };

  const productGrid = document.querySelector('#productGrid');
  const categoryGrid = document.querySelector('#categoryGrid');
  const categorySelect = document.querySelector('#categorySelect');
  const filterPills = document.querySelector('#filterPills');
  const searchInput = document.querySelector('#searchInput');
  const sortSelect = document.querySelector('#sortSelect');
  const emptyState = document.querySelector('#emptyState');

  const iconMap = {
    Protein: 'P',
    Kreatin: 'C',
    Essentials: 'E',
    Zubehör: 'Z'
  };

  function amazonAffiliateUrl(product) {
    let url;
    if (product.amazonUrl) {
      url = new URL(product.amazonUrl);
    } else if (product.asin) {
      url = new URL(`${CONFIG.amazonDomain}/dp/${encodeURIComponent(product.asin)}`);
    } else {
      url = new URL(`${CONFIG.amazonDomain}/s`);
      url.searchParams.set('k', product.query || product.name);
    }
    url.searchParams.set('tag', CONFIG.amazonTag);
    return url.toString();
  }

  function ensureAmazonTag(rawUrl) {
    try {
      const url = new URL(rawUrl, window.location.href);
      if (/(^|\.)amazon\.de$/i.test(url.hostname)) {
        url.searchParams.set('tag', CONFIG.amazonTag);
      }
      return url.toString();
    } catch (_) {
      return rawUrl;
    }
  }

  window.gainlyticAffiliateUrl = ensureAmazonTag;

  const categories = ['all', ...new Set(PRODUCTS.map(p => p.category))];

  function renderCategories() {
    categoryGrid.innerHTML = categories.filter(c => c !== 'all').map(category => {
      const count = PRODUCTS.filter(p => p.category === category).length;
      return `
        <button class="category-card" data-category="${category}" type="button">
          <span class="category-icon">${iconMap[category] || 'G'}</span>
          <span><strong>${category}</strong><small>${count} ${count === 1 ? 'Eintrag' : 'Einträge'}</small></span>
          <span class="arrow">→</span>
        </button>`;
    }).join('');

    categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c === 'all' ? 'Alle Kategorien' : c}</option>`).join('');
    filterPills.innerHTML = categories.map(c => `<button type="button" class="pill ${c === state.category ? 'active' : ''}" data-category="${c}">${c === 'all' ? 'Alle' : c}</button>`).join('');
  }

  function productCard(product) {
    const href = amazonAffiliateUrl(product);
    return `
      <article class="product-card">
        <div class="product-art art-${product.category.toLowerCase().replace('ä','a')}">
          <span class="art-letter">${iconMap[product.category] || 'G'}</span>
          <span class="art-type">${product.type}</span>
        </div>
        <div class="product-content">
          <div class="product-meta"><span>${product.category}</span><span>${product.type}</span></div>
          <h3>${product.name}</h3>
          <p>${product.tagline}</p>
          <div class="tags">${product.highlights.map(h => `<span>${h}</span>`).join('')}</div>
          <div class="product-bottom">
            <div class="price-note"><strong>Preis prüfen</strong><small>aktuell bei Amazon</small></div>
            <a class="amazon-btn" href="${href}" target="_blank" rel="sponsored nofollow noopener" aria-label="${product.name} bei Amazon ansehen">Bei Amazon ansehen <span>↗</span></a>
          </div>
          <small class="ad-note">Bezahlter Link · mögliche Provision</small>
        </div>
      </article>`;
  }

  function renderProducts() {
    const q = state.query.trim().toLowerCase();
    let items = PRODUCTS.filter(p => state.category === 'all' || p.category === state.category)
      .filter(p => !q || [p.name, p.category, p.type, p.tagline, ...p.highlights].join(' ').toLowerCase().includes(q));

    items = [...items].sort((a, b) => {
      if (state.sort === 'name') return a.name.localeCompare(b.name, 'de');
      if (state.sort === 'category') return a.category.localeCompare(b.category, 'de') || a.name.localeCompare(b.name, 'de');
      return a.featured - b.featured;
    });

    productGrid.innerHTML = items.map(productCard).join('');
    emptyState.hidden = items.length > 0;
    filterPills.querySelectorAll('.pill').forEach(btn => btn.classList.toggle('active', btn.dataset.category === state.category));
    categorySelect.value = state.category;
  }

  function setCategory(category) {
    state.category = category;
    renderProducts();
    if (category !== 'all') document.querySelector('#produkte').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  categoryGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-category]');
    if (btn) setCategory(btn.dataset.category);
  });
  filterPills.addEventListener('click', e => {
    const btn = e.target.closest('[data-category]');
    if (btn) setCategory(btn.dataset.category);
  });
  categorySelect.addEventListener('change', e => setCategory(e.target.value));
  searchInput.addEventListener('input', e => { state.query = e.target.value; renderProducts(); });
  sortSelect.addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href*="amazon.de"]');
    if (link) link.href = ensureAmazonTag(link.href);
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
  renderCategories();
  renderProducts();
})();
