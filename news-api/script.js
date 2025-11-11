
    const API_KEY = 'c633abd40bb05f5a824bdf204d4a564c'; 
    const API_URL = 'https://gnews.io/api/v4/top-headlines';
    const MAX_ARTICLES = 10;


    const fetchBtn = document.getElementById('fetchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statusEl = document.getElementById('status');
    const resultsEl = document.getElementById('results');

    function setStatus(text, isError = false) {
      statusEl.textContent = text;
      statusEl.style.color = isError ? '#ffcccc' : '#e6eef8';
    }

    function createCard(article) {
      const div = document.createElement('article');
      div.className = 'card';

      const image = article.image || '';
      const img = document.createElement('img');
      img.className = 'thumb';
      img.alt = article.title || 'article image';
      img.src = image || 'https://via.placeholder.com/640x360?text=No+Image';

      const body = document.createElement('div');
      body.className = 'card-body';

      const h3 = document.createElement('h3');
      h3.textContent = article.title || 'Untitled';

      const p = document.createElement('p');
      p.textContent = article.description || article.content || '';

      const meta = document.createElement('div');
      meta.className = 'meta';

      const source = document.createElement('div');
      source.className = 'chip';
      source.textContent = article.source?.name || 'Unknown';

      const link = document.createElement('a');
      link.className = 'link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.href = article.url || '#';
      link.textContent = 'Read';

      meta.appendChild(source);
      meta.appendChild(link);

      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(meta);

      div.appendChild(img);
      div.appendChild(body);

      return div;
    }

    async function fetchNews() {
      if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
        alert('Please replace the API_KEY variable in the script with your GNews API key.');
        return;
      }

      setStatus('Loading...', false);
      fetchBtn.disabled = true;

      const url = new URL(API_URL);
      url.searchParams.set('token', API_KEY);
      url.searchParams.set('lang', 'en');
      url.searchParams.set('max', String(MAX_ARTICLES));

      try {
        const res = await fetch(url.toString());
        if (!res.ok) {

          const text = await res.text().catch(()=>null);
          throw new Error('HTTP ' + res.status + ': ' + (text || res.statusText));
        }

        const data = await res.json();

        const articles = data.articles || [];

        resultsEl.innerHTML = '';
        if (articles.length === 0) {
          resultsEl.innerHTML = '<div class="empty">No articles returned.</div>';
          setStatus('No articles', false);
        } else {
          const grid = document.createElement('div');
          grid.className = 'grid';
          articles.forEach(a => grid.appendChild(createCard(a)));
          resultsEl.appendChild(grid);
          setStatus('Loaded ' + articles.length + ' articles', false);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        resultsEl.innerHTML = '<div class="empty">Failed to load news. See console for details.</div>';
        setStatus('Error fetching news', true);
      } finally {
        fetchBtn.disabled = false;
      }
    }


    function clearResults(){
      resultsEl.innerHTML = '<div class="empty">No news loaded yet. Click <strong>Fetch News</strong>.</div>';
      setStatus('Cleared', false);
    }


    fetchBtn.addEventListener('click', fetchNews);
    clearBtn.addEventListener('click', clearResults);


    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'f') fetchNews();
    });