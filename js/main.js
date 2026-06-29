(function () {
  const data = window.JIKE_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function imageEditable(src, alt, placeholder = "图片待补充") {
    return `
      <div class="image-editable" data-placeholder="${placeholder}">
        <img src="${src}" alt="${alt}" />
        <div class="image-tools">
          <label>替换<input type="file" accept="image/*" /></label>
          <button type="button">删除</button>
        </div>
      </div>
    `;
  }

  function initRender() {
    $("#capabilityGrid").innerHTML = data.capabilities.map((item, index) => `
      <article class="glass-card">
        <span class="card-label">0${index + 1} / ${item.label}</span>
        <h3 class="editable-text">${item.title}</h3>
        <p class="editable-text">${item.text}</p>
      </article>
    `).join("");

    $("#contentMatrix").innerHTML = data.content.map((item, index) => `
      <article class="content-card">
        <span class="card-label">0${index + 1} / ${item.tag}</span>
        <h3 class="editable-text">${item.title}</h3>
        <p class="editable-text">${item.text}</p>
      </article>
    `).join("");

    $("#mentorFeature").innerHTML = `
      <div class="mentor-console" id="mentorConsole">
        <div class="mentor-console-list">
          ${data.mentors.map((mentor, index) => `
            <button class="mentor-console-item ${index === 0 ? "active" : ""}" type="button" data-mentor="${mentor.name}">
              <img src="${mentor.image}" alt="${mentor.name}" />
              <span>${mentor.name}</span>
              <small>${mentor.title}</small>
            </button>
          `).join("")}
        </div>
        <article class="mentor-detail-panel" id="mentorDetailPanel"></article>
      </div>
    `;

    $("#mentorWall").innerHTML = data.mentorNetwork.map((mentor) => `
      <article class="mentor-mini-card" data-modal="networkMentor" data-name="${mentor.name}">
        ${imageEditable(mentor.image, mentor.name, "合作导师头像")}
        <div class="mentor-mini-copy">
          <h3 class="editable-text">${mentor.name}</h3>
          <p class="editable-text">${mentor.title}</p>
          <span>${mentor.works[0]}</span>
        </div>
      </article>
    `).join("");

    $("#coursePath").innerHTML = data.courseSteps.map((step) => `
      <article class="course-step">
        <h3 class="editable-text">${step.title}</h3>
        <p class="editable-text">${step.text}</p>
      </article>
    `).join("");

    $("#posterStrip").innerHTML = data.posters.map((poster) => `
      <article class="poster-card" data-modal="poster" data-title="${poster.title}">
        ${imageEditable(poster.image, poster.title, "课程海报")}
        <div class="poster-meta">
          <strong class="editable-text">${poster.title}</strong>
          <p class="editable-text">${poster.type}</p>
        </div>
      </article>
    `).join("");
    ensurePosterFocus();
    updatePosterFocus(data.posters[0]);

    renderCases("全部");

    $("#partnerWall").innerHTML = data.partners.map((partner) => `
      <div class="partner-item image-editable" data-placeholder="合作伙伴Logo" title="${partner.type}">
        <img src="${partner.image}" alt="${partner.name}" />
        <span>${partner.type}</span>
        <div class="image-tools">
          <label>替换<input type="file" accept="image/*" /></label>
          <button type="button">删除</button>
        </div>
      </div>
    `).join("");

    $("#railNav").innerHTML = $$(".section").map(section => `
      <a href="#${section.id}" data-label="${section.dataset.label || section.id}" aria-label="${section.dataset.label || section.id}"></a>
    `).join("");

    updateMentorPanel(data.mentors[0]);
  }

  function updateMentorPanel(mentor) {
    const panel = $("#mentorDetailPanel");
    if (!panel || !mentor) return;
    panel.innerHTML = `
      <div class="mentor-detail-visual">
        <img src="${mentor.image}" alt="${mentor.name}" />
      </div>
      <div class="mentor-detail-copy">
        <span class="card-label">MENTOR CAPABILITY NODE</span>
        <h3 class="editable-text">${mentor.name}</h3>
        <p class="editable-text">${mentor.intro}</p>
        <div class="tag-row">${mentor.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
        <div class="mentor-work-row">${mentor.works.map(work => `<span>${work}</span>`).join("")}</div>
        <button class="panel-action" type="button" data-modal="mentor" data-name="${mentor.name}">查看完整详情</button>
      </div>
    `;
  }

  function ensurePosterFocus() {
    const strip = $("#posterStrip");
    if (!strip || $(".poster-focus")) return;
    strip.insertAdjacentHTML("beforebegin", `
      <article class="poster-focus" id="posterFocus">
        <div class="poster-focus-bg" aria-hidden="true"></div>
        <div>
          <span class="card-label">COURSE EXPERIENCE</span>
          <h3 class="editable-text"></h3>
          <p class="editable-text"></p>
        </div>
      </article>
    `);
  }

  function updatePosterFocus(poster) {
    const focus = $("#posterFocus");
    if (!focus || !poster) return;
    $(".poster-focus-bg", focus).style.backgroundImage = `url("${poster.image}")`;
    $("h3", focus).textContent = poster.title;
    $("p", focus).textContent = `${poster.type} / 自动滚动展示课程资产，悬停暂停并聚焦当前海报，点击查看完整长图。`;
  }

  function ensureCaseBrowser(cases) {
    const filters = $("#caseFilters");
    if (!filters) return;
    let browser = $("#caseBrowser");
    if (!browser) {
      filters.insertAdjacentHTML("afterend", `<div class="case-browser" id="caseBrowser"></div>`);
      browser = $("#caseBrowser");
    }
    browser.innerHTML = cases.map((item, index) => `
      <button class="${index === 0 ? "active" : ""}" type="button" data-case-jump="${item.title}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${item.title}</strong>
        <small>${item.category} / ${item.type}</small>
      </button>
    `).join("");
  }

  function renderCases(active) {
    const cats = ["全部", ...new Set(data.cases.map(item => item.category))];
    $("#caseFilters").innerHTML = cats.map(cat => `
      <button class="case-filter ${cat === active ? "active" : ""}" type="button" data-category="${cat}">${cat}</button>
    `).join("");
    const cases = active === "全部" ? data.cases : data.cases.filter(item => item.category === active);
    $("#caseGallery").innerHTML = cases.map(item => `
      ${item.layout === "split" ? renderSplitCase(item) : renderStandardCase(item)}
    `).join("");
    ensureCaseBrowser(cases);
  }

  function renderStandardCase(item) {
    return `
      <article class="case-card" data-modal="case" data-title="${item.title}">
        <div class="case-copy">
          <span class="card-label">${item.category} / ${item.type}</span>
          <h3 class="editable-text">${item.title}</h3>
          <p class="editable-text">${item.text}</p>
        </div>
        <div class="case-media-row">
          ${item.images.map((src, index) => imageEditable(src, `${item.title} ${index + 1}`, "案例素材")).join("")}
        </div>
      </article>
    `;
  }

  function renderSplitCase(item) {
    return `
      <article class="case-card case-card-split" data-modal="case" data-title="${item.title}">
        <div class="case-copy split-intro">
          <span class="card-label">${item.category} / ${item.type}</span>
          <h3 class="editable-text">${item.title}</h3>
          <p class="editable-text">${item.text}</p>
        </div>
        <div class="case-split-grid">
          ${item.items.map((course) => `
            <section class="case-course">
              ${imageEditable(course.image, course.title, "课程案例图")}
              <div class="case-course-copy">
                <h4 class="editable-text">${course.title}</h4>
                <p class="editable-text">${course.text}</p>
              </div>
            </section>
          `).join("")}
        </div>
      </article>
    `;
  }

  function initModal() {
    document.addEventListener("click", (event) => {
      const filter = event.target.closest(".case-filter");
      if (filter) {
        renderCases(filter.dataset.category);
        applyEditState();
        bindImageTools();
        return;
      }

      const caseJump = event.target.closest("[data-case-jump]");
      if (caseJump) {
        $$(".case-browser button").forEach(button => button.classList.toggle("active", button === caseJump));
        const target = $(`.case-card[data-title="${CSS.escape(caseJump.dataset.caseJump)}"]`);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const mentorPick = event.target.closest(".mentor-console-item");
      if (mentorPick) {
        $$(".mentor-console-item").forEach(button => button.classList.toggle("active", button === mentorPick));
        updateMentorPanel(data.mentors.find(item => item.name === mentorPick.dataset.mentor));
        return;
      }

      const posterHoverCard = event.target.closest(".poster-card");
      if (posterHoverCard) {
        updatePosterFocus(data.posters.find(item => item.title === posterHoverCard.dataset.title));
      }

      const trigger = event.target.closest("[data-modal]");
      if (!trigger || document.body.classList.contains("editing")) return;
      if (trigger.dataset.modal === "mentor") {
        const mentor = data.mentors.find(item => item.name === trigger.dataset.name);
        openModal(`
          <div class="modal-layout">
            <img src="${mentor.image}" alt="${mentor.name}" />
            <div>
              <span class="card-label">${mentor.title}</span>
              <h3 id="modalTitle">${mentor.name}</h3>
              <p>${mentor.intro}</p>
              <div class="tag-row">${mentor.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
              <p><strong>代表作品：</strong>${mentor.works.join(" / ")}</p>
            </div>
          </div>
        `);
      }
      if (trigger.dataset.modal === "networkMentor") {
        const mentor = data.mentorNetwork.find(item => item.name === trigger.dataset.name);
        openModal(`
          <div class="modal-layout">
            <img src="${mentor.image}" alt="${mentor.name}" />
            <div>
              <span class="card-label">${mentor.title}</span>
              <h3 id="modalTitle">${mentor.name}</h3>
              <p>合作导师 / 创作者网络成员。点击卡片进入详情，后续可继续补充个人简介、课程方向、合作方向和作品链接。</p>
              <p><strong>代表作品：</strong>${mentor.works.join(" / ")}</p>
            </div>
          </div>
        `);
      }
      if (trigger.dataset.modal === "poster") {
        const poster = data.posters.find(item => item.title === trigger.dataset.title);
        openModal(`
          <div class="poster-modal-layout">
            <div class="poster-modal-image">
              <img src="${poster.image}" alt="${poster.title}" />
            </div>
            <div class="poster-modal-copy">
              <span class="card-label">${poster.type}</span>
              <h3 id="modalTitle">${poster.title}</h3>
              <p>完整海报可在左侧滚动查看。课程详情可继续补充：课程亮点、导师、适合人群、交付成果与相关课程推荐。</p>
            </div>
          </div>
        `);
      }
      if (trigger.dataset.modal === "case") {
        const item = data.cases.find(caseItem => caseItem.title === trigger.dataset.title);
        const modalMedia = item.layout === "split"
          ? item.items.map(course => `
              <section class="modal-course">
                <img src="${course.image}" alt="${course.title}" />
                <h4>${course.title}</h4>
                <p>${course.text}</p>
              </section>
            `).join("")
          : item.images.map(src => `<img src="${src}" alt="${item.title}" />`).join("");
        openModal(`
          <div class="${item.layout === "split" ? "modal-split-grid" : "modal-case-strip"}">${modalMedia}</div>
          <h3 id="modalTitle">${item.title}</h3>
          <p>${item.text}</p>
        `);
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-modal]")) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  function openModal(html) {
    $("#modalBody").innerHTML = html;
    $("#modal").classList.add("open");
    $("#modal").setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    $("#modal").classList.remove("open");
    $("#modal").setAttribute("aria-hidden", "true");
  }

  function initEditMode() {
    $("#editToggle").addEventListener("click", () => {
      document.body.classList.toggle("editing");
      const editing = document.body.classList.contains("editing");
      $("#editToggle").textContent = editing ? "退出编辑" : "编辑模式";
      applyEditState();
      if (!editing) saveEditableText();
    });
    restoreEditableText();
  }

  function applyEditState() {
    const editing = document.body.classList.contains("editing");
    $$(".editable-text").forEach((node, index) => {
      node.dataset.editKey ||= `text-${index}-${node.textContent.trim().slice(0, 12)}`;
      node.setAttribute("contenteditable", editing ? "true" : "false");
    });
  }

  function saveEditableText() {
    const payload = {};
    $$(".editable-text").forEach(node => {
      payload[node.dataset.editKey] = node.innerHTML;
    });
    localStorage.setItem("jikeEditableText", JSON.stringify(payload));
  }

  function restoreEditableText() {
    const raw = localStorage.getItem("jikeEditableText");
    if (!raw) return;
    const payload = JSON.parse(raw);
    $$(".editable-text").forEach((node, index) => {
      node.dataset.editKey ||= `text-${index}-${node.textContent.trim().slice(0, 12)}`;
      if (payload[node.dataset.editKey]) node.innerHTML = payload[node.dataset.editKey];
    });
  }

  function bindImageTools() {
    $$(".image-editable").forEach((wrap) => {
      const input = $("input[type='file']", wrap);
      const remove = $("button", wrap);
      if (input && !input.dataset.bound) {
        input.dataset.bound = "true";
        input.addEventListener("change", () => {
          const file = input.files && input.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            let img = $("img", wrap);
            const placeholder = $(".image-placeholder", wrap);
            if (!img) {
              img = document.createElement("img");
              img.alt = wrap.dataset.placeholder || "替换图片";
              wrap.prepend(img);
            }
            if (placeholder) placeholder.remove();
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        });
      }
      if (remove && !remove.dataset.bound) {
        remove.dataset.bound = "true";
        remove.addEventListener("click", () => {
          const img = $("img", wrap);
          if (img) img.remove();
          if (!$(".image-placeholder", wrap)) {
            const placeholder = document.createElement("div");
            placeholder.className = "image-placeholder";
            placeholder.textContent = `${wrap.dataset.placeholder || "图片"} / 点击替换上传`;
            wrap.prepend(placeholder);
          }
        });
      }
    });
  }

  function initNav() {
    $("#menuToggle").addEventListener("click", () => {
      $(".site-header").classList.toggle("nav-open");
    });
    $$(".top-nav a").forEach(link => link.addEventListener("click", () => $(".site-header").classList.remove("nav-open")));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$(".rail-nav a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { threshold: 0.45 });
    $$(".section").forEach(section => observer.observe(section));
  }

  function initAtmosphere() {
    const glow = $(".cursor-glow");
    window.addEventListener("pointermove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = "1";
    });

    const canvas = $("#fieldCanvas");
    const ctx = canvas.getContext("2d");
    let points = [];
    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      points = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 18)) }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = "rgba(81,230,255,0.45)";
      ctx.strokeStyle = "rgba(81,230,255,0.08)";
      points.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        ctx.fillRect(p.x, p.y, 1.4, 1.4);
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.globalAlpha = 1 - dist / 120;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
      requestAnimationFrame(tick);
    }
    window.addEventListener("resize", resize);
    resize();
    tick();
  }

  function initPosterAutoScroll() {
    const strip = $("#posterStrip");
    if (!strip) return;
    let paused = false;
    let direction = 1;
    strip.addEventListener("mouseenter", () => { paused = true; });
    strip.addEventListener("mouseleave", () => { paused = false; });
    strip.addEventListener("focusin", () => { paused = true; });
    strip.addEventListener("focusout", () => { paused = false; });
    strip.addEventListener("mouseover", (event) => {
      const card = event.target.closest(".poster-card");
      if (card) updatePosterFocus(data.posters.find(item => item.title === card.dataset.title));
    });

    function move() {
      if (!paused && strip.scrollWidth > strip.clientWidth) {
        strip.scrollLeft += 0.28 * direction;
        const max = strip.scrollWidth - strip.clientWidth - 2;
        if (strip.scrollLeft >= max) direction = -1;
        if (strip.scrollLeft <= 1) direction = 1;
      }
      requestAnimationFrame(move);
    }
    move();
  }

  initRender();
  initModal();
  initEditMode();
  applyEditState();
  bindImageTools();
  initNav();
  initAtmosphere();
  initPosterAutoScroll();
})();
