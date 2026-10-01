// Dados dos artigos (mock)
const articles = [
  {
    id: 1,
    title: "Cientistas descobrem planeta com chuva de vidro",
    content: "Astrônomos identificaram um exoplaneta onde a atmosfera atinge temperaturas extremas, fazendo com que silicatos se condensem e caiam como vidro derretido. O fenômeno, previsto em teoria desde 2013, foi finalmente observado em detalhes."
  },
  {
    id: 2,
    title: "A história do café: da Etiópia para o mundo",
    content: "Lenda ou não, a descoberta do café é atribuída a um pastor etíope que notou suas cabras mais energéticas após comerem certos frutos. Hoje, o café é a segunda bebida mais consumida do planeta, atrás apenas da água."
  },
  {
    id: 3,
    title: "Por que sentimos déjà vu?",
    content: "A sensação de já ter vivido algo pela primeira vez intriga filósofos e neurocientistas há séculos. Estudos recentes sugerem que o déjà vu pode ser um 'erro de checagem' do cérebro, que confunde uma experiência nova com uma memória antiga."
  },
  {
    id: 4,
    title: "Voyager 1: a mensagem mais distante da humanidade",
    content: "Lançada em 1977, a sonda Voyager 1 já ultrapassou os limites do Sistema Solar e continua enviando dados. A bordo, carrega um disco de ouro com sons e imagens da Terra, uma cápsula do tempo para possíveis civilizações extraterrestres."
  },
  {
    id: 5,
    title: "A arte perdida de escrever cartas",
    content: "Em tempos de mensagens instantâneas, a carta manuscrita virou relíquia. Mas pesquisas mostram que escrever à mão estimula áreas do cérebro ligadas à memória e à criatividade — algo que o teclado dificilmente substitui."
  },
  {
    id: 6,
    title: "Ablublé",
    content: "Ablublé"
  },
  {
    id: 7,
    title: "Ablublé2",
    content: "Ablublé2"
  }
];

// Configurações de paginação
const ARTICLES_PER_PAGE = 2;
let currentPage = 1;
const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

// DOM
const articlesContainer = document.getElementById('articles-container');
const paginationNav = document.getElementById('pagination');

// Funções auxiliares para comentários
function getComments(articleId) {
  const stored = localStorage.getItem('blog_comments');
  const allComments = stored ? JSON.parse(stored) : {};
  return allComments[articleId] || [];
}

function saveComments(articleId, comments) {
  const stored = localStorage.getItem('blog_comments');
  const allComments = stored ? JSON.parse(stored) : {};
  allComments[articleId] = comments;
  localStorage.setItem('blog_comments', JSON.stringify(allComments));
}

// Renderização de comentários
function renderComments(articleElement, articleId) {
  const commentsList = articleElement.querySelector('.comments-list');
  commentsList.innerHTML = ''; // limpa

  const comments = getComments(articleId);
  const commentTemplate = document.getElementById('comment-template');

  comments.forEach((comment, index) => {
    const clone = commentTemplate.content.cloneNode(true);
    clone.querySelector('.comment-author-display').textContent = comment.author;
    clone.querySelector('.comment-text-display').textContent = comment.text;

    const removeBtn = clone.querySelector('.remove-comment');
    removeBtn.dataset.index = index;
    removeBtn.dataset.articleId = articleId;
    removeBtn.addEventListener('click', handleRemoveComment);

    commentsList.appendChild(clone);
  });
}

// Remover comentário
function handleRemoveComment(event) {
  const button = event.currentTarget;
  const articleId = Number(button.dataset.articleId);
  const index = Number(button.dataset.index);

  const comments = getComments(articleId);
  comments.splice(index, 1);
  saveComments(articleId, comments);

  // Re-renderiza os comentários do artigo
  const articleElement = button.closest('.article-card');
  renderComments(articleElement, articleId);
}

// Adicionar comentário
function handleCommentSubmit(event, articleId) {
  event.preventDefault();
  const form = event.currentTarget;
  const authorInput = form.querySelector('.comment-author');
  const textInput = form.querySelector('.comment-text');

  const author = authorInput.value.trim();
  const text = textInput.value.trim();

  if (!author || !text) return; // validação extra (o required já ajuda)

  const comments = getComments(articleId);
  comments.push({ author, text });
  saveComments(articleId, comments);

  // Limpa o formulário
  form.reset();

  // Re-renderiza os comentários
  const articleElement = form.closest('.article-card');
  renderComments(articleElement, articleId);
}

// Renderização dos artigos
function renderArticles() {
  articlesContainer.innerHTML = '';

  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const pageArticles = articles.slice(start, end);

  const articleTemplate = document.getElementById('article-template');

  pageArticles.forEach(article => {
    const clone = articleTemplate.content.cloneNode(true);
    const articleCard = clone.querySelector('.article-card');
    articleCard.dataset.id = article.id;

    clone.querySelector('.article-title').textContent = article.title;
    clone.querySelector('.article-content').textContent = article.content;

    // Adiciona o evento de submit do formulário de comentário
    const form = clone.querySelector('.comment-form');
    form.addEventListener('submit', (e) => handleCommentSubmit(e, article.id));

    articlesContainer.appendChild(clone);

    // Após inserir no DOM, renderiza os comentários existentes
    const insertedCard = articlesContainer.lastElementChild;
    renderComments(insertedCard, article.id);
  });
}

// Renderização da paginação
function renderPagination() {
  paginationNav.innerHTML = '';

  // Botão Anterior
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Anterior';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      update();
    }
  });
  paginationNav.appendChild(prevBtn);

  // Botões de página
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    if (i === currentPage) pageBtn.classList.add('active');
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      update();
    });
    paginationNav.appendChild(pageBtn);
  }

  // Botão Próximo
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Próximo';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      update();
    }
  });
  paginationNav.appendChild(nextBtn);
}

// Atualiza a página (artigos + paginação)
function update() {
  renderArticles();
  renderPagination();
}

update();
