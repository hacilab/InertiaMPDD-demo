"use strict";
const $ = id => document.getElementById(id);
const player = $("player"), refSelect = $("refselect");
const pageURL = new URL(location.href);
const assetURL = path => new URL(path.replace(/^\/+/, ""), document.baseURI).href;

const I18N = {
  zh: {
    title: "InertiaMPDD · 个体情绪动力学",
    h1: "沿着访谈，看见情绪动力学",
    model_name: "InertiaMPDD",
    sub: "将访谈视频与预计算的逐秒残差、特质同步呈现，观察个体轨迹与健康训练参照的关系。",
    tag: "研究演示 · 非诊断结论",
    placeholder: "选择视频", loading: "载入中", loading_title: "正在读取参考数据",
    paper_eyebrow: "PAPER CASE / 原始数据", paper_h2: "沿时间轴查看论文原案",
    paper_p: "拖动时间滑块或点击图表即可查看对应时刻。", paper_time: "查看时刻",
    media_default: "参考视频含访谈原音轨。",
    guide_h2: "如何阅读这张图",
    guide_p: "（b）绿线为模型预测，红虚线为观测动态；（c）红线为个体残差，绿虚线与阴影为健康训练中位数和 5–95% 参照。",
    guide_tip: "点击或拖动曲线可定位视频，方向键每次移动 5 秒。",
    compare_h2: "对照查看", compare_p: "切换参与者，查看同一口径下的已有个案。",
    eyebrow_case: "01 / 访谈个案", analysis_h2: "个体轨迹与健康参考", reveal: "曲线与参考随播放展开",
    legend_subject: "个体残差", legend_mean: "个体全片均值",
    plot_b: "(b) 潜在情绪动态",
    legend_predicted: "健康动力学模型预测", legend_observed: "观测潜在情绪动态",
    latent_readout: "t = {0} · 观测 {1} · 预测 {2}",
    latent_source: "潜状态：健康训练池共同 PC1（解释方差 {0}）。预测已对齐目标时刻；下方残差由全维潜状态计算。",
    latent_missing: "该样本未提供导出的潜在轨迹。",
    plot_a: "(a) 视频帧带", plot_c: "(c) 逐步残差",
    trait_eyebrow: "03 / 全片特质", trait_heading: "全片情绪动力学描述", trait_subtitle: "固定全片值 · 探针链官方划分",
    paper_extra_h3: "全片图形摘要",
    diag_summary: "滑窗特质时序与类别分布",
    diag_note: "蓝 / 橙：正常 / 抑郁全片值分布；绿带：健康训练全片值 5–95%。滑窗曲线为演示变体。",
    panel_residual: "残差均值", panel_force: "回复力量", panel_rho: "预测映射谱半径",
    diag_note2: "R、f′ 按秒更新；ρ 在首个完整窗口后每 5 秒更新。短窗 f′ 可能回退健康先验；ρ 不是情绪恢复率。",
    footer: "研究演示 · 非诊断结论。仅展示既有 MPDD 个案与预计算结果，数据口径见上方系统介绍。",
    select_label: "选择参考个案",
    dep: "抑郁", hea: "正常", word_paper: "定性原案", word_video: "官方测试",
    case_title: "参与者 {0}",
    meta_paper: "探针链 · 官方 train · 定性原案 · {0}", meta_test: "探针链 · 官方 test · PHQ-9 {0} · {1}",
    media_seg: "参考视频：{0} 段拼接，含访谈音轨。",
    media_privacy: "片头 {0} 秒已静音，视频时序保留。",
    media_paper_novideo: "未提供该个案视频；拖动时间滑块或点击图表可查看时刻。",
    seg: "片段 {0}",
    residual_raw: "原始逐步残差 · 1Hz", residual_rec: "由窗口时序恢复",
    ref_pool_label: "健康训练中位数", range_pool_label: "健康训练 5–95%",
    trait_z: "较健康池 {0}", trait_na: "该个案未提供此参数。",
    trait_residual_name: "残差偏离", trait_residual_meaning: "数值越大，预测与观测的偏离越大。",
    trait_force_ar_name: "回复力量", trait_force_ar_meaning: "由残差中位数中心化的无截距 AR(1) 衰减经先验收缩得到。",
    trait_rho_name: "预测映射谱半径", trait_rho_meaning: "固定坐标下预测映射的局部谱描述，不直接表示情绪惯性或恢复速度。",
    psum_exceed_label: "超出参考上界", psum_exceed_unit: "有效参考时刻",
    psum_exceed_desc: "残差高于健康池同秒 p95 的比例。",
    film_paper: "原图 {0} 帧 · 按段拼接", film_sampled: "离线采样 {0} 帧 · 按段拼接",
    film_loading: "正在读取预览帧…", film_paper_missing: "论文帧带暂不可用",
    film_fail: "预览帧暂不可用，仍可播放视频和查看曲线",
    seg_draw: "视频 {0}", not_analyzed: "未解析",
    readout_paper_end: "该时刻无对应逐步残差", readout_beyond: "该时刻无对应逐步残差",
    readout_prompt: "播放或点击曲线查看逐秒残差", readout_none: "未提供逐步残差数据",
    diag_early: "短窗回退先验", diag_wait: "等待首个可用窗口", kde_label: "官方 test",
    video_error: "视频无法播放，请检查视频文件或浏览器编码支持；图表仍可查看。",
    load_fail: "载入失败：{0}。请检查静态数据文件，或刷新后重试。",
    no_series: "没有可用的参考序列",
    edition: "交互式样本展示",
    skip: "跳转到样本展示",
    about_title: "关于系统与数据口径",
    method1_title: "多模态状态",
    method1: "由访谈音视频提取状态表示，同一参与者的片段按顺序拼接。",
    method2_title: "预测与观测",
    method2: "健康动力学模型预测下一步状态，以预测和观测之间的距离构成逐步残差。",
    method3_title: "三个互补描述量",
    method3: "R 描述平均残差；f′ 描述残差 AR 衰减；ρ 描述固定坐标下预测映射的局部谱性质。",
    protocol_note: "本页与论文定性个案采用 O 系列探针链、MPDD young 官方 88/22 划分。论文定量表格采用组内分层 80/20 重训链，两者的健康池统计不能直接等同。71 为官方训练个案；42、89、105 为官方测试个案。",
    about_precomputed: "浏览器播放已有视频并显示已有数据；播放过程不运行模型。标签用于研究个案说明，不能据此推断测试性能或作出个体诊断。",
    control_tip: "播放视频逐步展开曲线，或点击图表跳转时刻。",
    paused: "已暂停",
    playing: "正在播放",
    ended: "播放结束",
    pool_note: "逐秒健康参照：官方训练健康池 n = {0}；无参考覆盖的时刻留空。",
    window_heading: "当前滑窗描述量",
    window_note: "最长 60 秒窗口 · 演示变体",
    window_r: "残差均值 R",
    window_f: "回复力量 f′",
    window_rho: "预测映射 ρ",
    window_prompt: "播放后显示当前滑窗的预计算值；ρ 从首个完整窗口起显示。",
    window_status: "窗口 {0}–{1} · ρ 最近采样 {2}",
    window_wait: "等待完整窗口",
    window_wait_short: "等待首个可用窗口",
    missing_reference: "该个案缺少逐秒健康训练参考带",
    local_bundle_missing: "本地数据包未加载（{0}）。请保留完整 docs 文件夹，确认 assets/sample-data.js 存在后重新打开页面。",
    data_fetch_fail: "无法读取数据文件 {0}：{1}",
  },
  en: {
    title: "InertiaMPDD · Individual Emotion Dynamics",
    h1: "Emotion dynamics along the interview",
    model_name: "InertiaMPDD",
    sub: "Explore interview video alongside precomputed per-step residuals and traits, and compare individual trajectories with a healthy training reference.",
    tag: "Research demo · not a diagnosis",
    placeholder: "Select a video", loading: "Loading", loading_title: "Loading reference data",
    paper_eyebrow: "PAPER CASE / ORIGINAL DATA", paper_h2: "Explore the paper's original case",
    paper_p: "Drag the slider or click a chart to inspect a moment.", paper_time: "Time",
    media_default: "Reference video includes the original interview audio.",
    guide_h2: "How to read this figure",
    guide_p: "(b) Green: model prediction; red dashed: observed dynamics. (c) Red: individual residual; green dashed and shading: healthy training median and 5–95% reference.",
    guide_tip: "Click or drag a chart to seek; arrow keys move by 5 seconds.",
    compare_h2: "Compare cases", compare_p: "Explore another participant under the same protocol.",
    eyebrow_case: "01 / INTERVIEW CASE", analysis_h2: "Individual trajectory vs healthy reference", reveal: "Reveal curves and reference with playback",
    legend_subject: "Individual residual", legend_mean: "Individual full-series mean",
    plot_b: "(b) Latent emotion dynamics",
    legend_predicted: "Healthy-dynamics model prediction", legend_observed: "Observed latent emotion dynamics",
    latent_readout: "t = {0} · observed {1} · predicted {2}",
    latent_source: "Latent states: common healthy-training PC1 ({0} variance explained). Predictions align to target time; residuals below use the full latent state.",
    latent_missing: "No exported latent trajectory for this sample.",
    plot_a: "(a) Frame strip", plot_c: "(c) Per-step residual",
    trait_eyebrow: "03 / FULL-SERIES TRAITS", trait_heading: "Full-series dynamics descriptors", trait_subtitle: "Fixed full-series values · official probe split",
    paper_extra_h3: "Full-series summary",
    diag_summary: "Window trajectories & class distributions",
    diag_note: "Blue / orange: healthy / depressed full-series distributions. Green: healthy training full-series 5–95%. Window curves are a demo variant.",
    panel_residual: "Residual mean", panel_force: "Return force", panel_rho: "Predictor spectral radius",
    diag_note2: "R and f′ update each second; ρ updates every 5 seconds after the first complete window. Short-window f′ may use the healthy prior. ρ is not an emotion-recovery rate.",
    footer: "Research showcase, not a diagnosis. Existing MPDD cases and precomputed results only. See the system introduction above for the data protocol.",
    select_label: "Select a reference case",
    dep: "Depressed", hea: "Healthy", word_paper: "Paper case", word_video: "Official test",
    case_title: "Participant {0}",
    meta_paper: "Probe chain · official train · paper case · {0}", meta_test: "Probe chain · official test · PHQ-9 {0} · {1}",
    media_seg: "Reference video: {0} joined segments, with interview audio.",
    media_privacy: "The first {0} s are silent; the video timeline is preserved.",
    media_paper_novideo: "No video for this case; drag the slider or click a chart to inspect a moment.",
    seg: "Segment {0}",
    residual_raw: "Raw per-step residuals · 1 Hz", residual_rec: "Recovered from window series",
    ref_pool_label: "Healthy training median", range_pool_label: "Healthy training 5–95%",
    trait_z: "{0} vs healthy pool", trait_na: "Not provided for this case.",
    trait_residual_name: "Residual deviation", trait_residual_meaning: "Larger → predictions deviate more from observations.",
    trait_force_ar_name: "Return force", trait_force_ar_meaning: "Prior-shrunk decay from a median-centered, no-intercept residual AR(1) fit.",
    trait_rho_name: "Spectral radius of prediction map", trait_rho_meaning: "A local predictor-spectrum descriptor in fixed coordinates; not a direct measure of emotional inertia or recovery.",
    psum_exceed_label: "Above reference upper bound", psum_exceed_unit: "valid time points",
    psum_exceed_desc: "Share of seconds with residual above the healthy pool's p95.",
    film_paper: "Original {0} frames · by segment", film_sampled: "{0} offline preview frames · by segment",
    film_loading: "Loading preview frames…", film_paper_missing: "Paper frame strip unavailable",
    film_fail: "Preview frames unavailable; video and curves remain viewable",
    seg_draw: "Video {0}", not_analyzed: "not analyzed",
    readout_paper_end: "No per-step residual at this time", readout_beyond: "No per-step residual at this time",
    readout_prompt: "Play or click the curve to inspect residuals", readout_none: "No per-step residual data",
    diag_early: "prior fallback (short window)", diag_wait: "Waiting for first window", kde_label: "official test",
    video_error: "Video cannot play; check the file or browser codec support. Charts remain viewable.",
    load_fail: "Load failed: {0}. Check the static data files or refresh to retry.",
    no_series: "No reference series available",
    edition: "INTERACTIVE CASE SHOWCASE",
    skip: "Skip to case showcase",
    about_title: "About the system & data protocol",
    method1_title: "Multimodal states",
    method1: "Interview audio and video provide state representations. Segments from the same participant are joined in order.",
    method2_title: "Prediction & observation",
    method2: "A healthy-dynamics model predicts the next state. The distance from the observed target state gives a per-step residual.",
    method3_title: "Three complementary descriptors",
    method3: "R describes average residuals; f′ describes residual AR decay; ρ describes the local predictor spectrum in fixed coordinates.",
    protocol_note: "This showcase and the qualitative paper cases use the O-series probe chain with the official MPDD young 88/22 split. Quantitative tables use a separate within-cohort 80/20 retraining protocol. Their healthy-pool statistics are not interchangeable. Case 71 is official train; 42, 89 and 105 are official test.",
    about_precomputed: "The browser plays existing videos and displays existing data; no model runs during playback. Case labels illustrate research examples and do not establish test performance or individual diagnoses.",
    control_tip: "Play to reveal the curves, or click a chart to jump to a moment.",
    paused: "Paused",
    playing: "Playing",
    ended: "Ended",
    pool_note: "Per-step reference: official healthy training pool, n = {0}. Uncovered time points remain blank.",
    window_heading: "Current window descriptors",
    window_note: "Up to 60 seconds · demo variant",
    window_r: "Residual mean R",
    window_f: "Return force f′",
    window_rho: "Predictor ρ",
    window_prompt: "Play to inspect precomputed window values. ρ begins at the first complete window.",
    window_status: "Window {0}–{1} · latest ρ sample {2}",
    window_wait: "awaiting complete window",
    missing_reference: "This case has no per-step healthy training reference",
    local_bundle_missing: "The local data bundle is unavailable ({0}). Keep the complete docs folder, including assets/sample-data.js, and reopen the page.",
    data_fetch_fail: "Cannot read data file {0}: {1}",
  }
};
let lang = "zh";
try { const saved = localStorage.getItem("inertiampdd-showcase-lang"); if (saved === "en" || saved === "zh") lang = saved; } catch (e) { /* 隐私模式 */ }
if (["en", "zh"].includes(pageURL.searchParams.get("lang"))) lang = pageURL.searchParams.get("lang");
const t = (key, ...args) => {
  let s = (I18N[lang] && I18N[lang][key]) ?? I18N.zh[key] ?? key;
  args.forEach((a, i) => { s = s.replace(`{${i}}`, a); });
  return s;
};
function applyStatic() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $("langbtn").textContent = lang === "zh" ? "EN" : "中文";
  $("langbtn").setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
}
function setLang(next) {
  if (next !== "zh" && next !== "en") return;
  lang = next;
  try { localStorage.setItem("inertiampdd-showcase-lang", lang); } catch (e) { /* 隐私模式 */ }
  applyStatic();
  renderCaseList();
  if (currentVideo) renderMeta(currentVideo, false);
  pageURL.searchParams.set("lang", lang); history.replaceState(null, "", pageURL);
  if (series) { updateCase(); scheduleDraw(); }
}

const TRAITS = ["residual", "force_ar", "rho"];
const TRAIT_SYMBOL = { residual: "R", force_ar: "f′", rho: "ρ(J)" };

// Shared display scales across participants; scientific values are not normalized.
const Y_AXES = {
  "case-latent": { limits: [-15, 15], ticks: [-15, -10, -5, 0, 5, 10, 15], decimals: 0 },
  "case-residual": { limits: [0, 20], ticks: [0, 5, 10, 15, 20], decimals: 0 },
  "c0": { limits: [0, 20], ticks: [0, 5, 10, 15, 20], decimals: 0 },
  "c1": { limits: [0, 2.5], ticks: [0, .5, 1, 1.5, 2, 2.5], decimals: 1 },
  "c2": { limits: [0, 2], ticks: [0, .5, 1, 1.5, 2], decimals: 1 }
};


const refs = new Map();
let frameController = null, activeFrames = [];
let frameTask = Promise.resolve();
let manifest, series, currentVideo = null, curLabel = null, curT = 0, videoDur = 0;
let allCases = [];
let drawPending = false, pendingSeek = null, chartGeometry = new Map();
const finite = Number.isFinite;
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const fmt = v => finite(v) ? v.toFixed(3) : "—";
const time = v => `${String(Math.floor(Math.max(0, v) / 60)).padStart(2, "0")}:${String(Math.floor(Math.max(0, v) % 60)).padStart(2, "0")}`;
function poolOf(key) { const p = manifest?.healthy_pool?.[key]; return p && finite(p.mean) && p.std > 0 ? p : null; }
function zOf(pool, v) { return (v - pool.mean) / pool.std; }
function fmtZ(z) { return `${z >= 0 ? "+" : ""}${z.toFixed(2)}σ`; }
function fullValue(key) { return series?.csv?.[key] ?? series?.full?.[key] ?? null; }
async function getJSON(url) {
  const key = url.replace(/^\/+/, ""), bundled = window.INERTIAMPDD_SAMPLE_DATA?.files;
  if (bundled && Object.prototype.hasOwnProperty.call(bundled, key)) {
    // Match JSON responses: give each consumer its own copy of the original data.
    return JSON.parse(JSON.stringify(bundled[key]));
  }
  if (location.protocol === "file:") throw new Error(t("local_bundle_missing", key));
  try {
    const response = await fetch(assetURL(url));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    throw new Error(t("data_fetch_fail", key, e.message));
  }
}
function reportError(e) { $("page-status").textContent = t("load_fail", e.message); }

// Render exported values only. Missing scientific data must not be reconstructed.
function prepare(s) {
  const raw = s.case?.residual, rawTimes = s.case?.residual_time;
  if (!Array.isArray(raw) || !Array.isArray(rawTimes) || raw.length !== rawTimes.length)
    throw new Error("Invalid exported residual data");
  return { ...s, raw, rawTimes };
}
function healthyReference() {
  const reference = series.case?.healthy_ref;
  if (reference && [reference.p5, reference.p50, reference.p95].every(a => Array.isArray(a) && a.length === series.raw.length)) {
    const rows = series.rawTimes.map((t, i) => [reference.p5[i], reference.p50[i], reference.p95[i]].every(finite)
      ? { t, low: reference.p5[i], mid: reference.p50[i], high: reference.p95[i], n: reference.n_per_step?.[i] ?? reference.n } : null);
    return { healthy: [], rows, origin: reference.source, meta: reference };
  }
  throw new Error(t("missing_reference"));
}
async function init() {
  manifest = await getJSON("reference/manifest.json");
  allCases = [...(manifest.paper_cases || []), ...manifest.videos];
  const loaded = await Promise.allSettled(allCases.map(async v => {
    refs.set(v.sid, prepare(await getJSON(v.series_url)));
  }));
  loaded.forEach((result, i) => { if (result.status === "rejected") console.warn("参考数据不可用", allCases[i].sid, result.reason); });
  renderCaseList();
  refSelect.addEventListener("change", () => { const v = allCases.find(v => v.sid === refSelect.value); if (v) loadReference(v); });
  $("timeline").addEventListener("input", () => seek(+$("timeline").value));
  player.addEventListener("play", animatePlayback);
  player.addEventListener("pause", syncTime);
  player.addEventListener("ended", syncTime);
  player.addEventListener("timeupdate", syncTime);
  player.addEventListener("seeking", syncTime);
  player.addEventListener("loadedmetadata", () => {
    videoDur = finite(player.duration) ? player.duration : series?.T || 0;
    if (pendingSeek !== null) { player.currentTime = Math.min(pendingSeek, videoDur); pendingSeek = null; }
    syncTime();
  });
  player.addEventListener("error", () => { if (player.currentSrc) $("page-status").textContent = t("video_error"); });
  $("reveal").addEventListener("change", scheduleDraw);
  document.querySelector(".diagnostics").addEventListener("toggle", scheduleDraw);
  new ResizeObserver(scheduleDraw).observe(document.querySelector(".analysis-column"));
  window.addEventListener("resize", scheduleDraw);
  ["filmstrip", "case-latent", "case-residual", "c0", "c1", "c2"].forEach(id => bindSeek($(id)));
  const requested = pageURL.searchParams.get("case");
  const first = allCases.find(v => v.key === requested && refs.has(v.sid)) || allCases.find(v => refs.has(v.sid));
  if (first) loadReference(first); else throw new Error(t("no_series"));
}
function renderCaseList() {
  refSelect.replaceChildren();
  const ph = document.createElement("option"); ph.value = ""; ph.textContent = t("placeholder"); refSelect.appendChild(ph);
  $("case-links").replaceChildren();
  for (const v of allCases) {
    const opt = document.createElement("option"); opt.value = v.sid;
    opt.textContent = `${t("word_" + (v.mode === "paper" ? "paper" : "video"))} ${v.key} · ${t(v.label === 1 ? "dep" : "hea")} · ${time(v.audio_sec)}`;
    opt.disabled = !refs.has(v.sid); refSelect.appendChild(opt);
    const button = document.createElement("button");
    const dot = document.createElement("i"); dot.className = "dot" + (v.label === 1 ? " dep" : "");
    button.append(dot, `${t("word_" + (v.mode === "paper" ? "paper" : "video"))} ${v.key} · ${t(v.label === 1 ? "dep" : "hea")}`);
    button.dataset.sid = v.sid; button.disabled = !refs.has(v.sid);
    button.addEventListener("click", () => loadReference(v)); $("case-links").appendChild(button);
  }
  if (currentVideo && refs.has(currentVideo.sid)) refSelect.value = currentVideo.sid;
  else refSelect.value = "";
}
function renderMeta(v, refreshMedia = true) {
  const paper = v.mode === "paper";
  $("labelbadge").textContent = t(v.label === 1 ? "dep" : "hea");
  $("labelbadge").className = "badge " + (v.label === 1 ? "dep" : "hea");
  $("case-title").textContent = t("case_title", v.key);
  $("metainfo").textContent = paper ? t("meta_paper", time(v.audio_sec)) : t("meta_test", v.phq9, time(v.audio_sec));
  $("media-note").textContent = t("media_seg", v.n_seg || 1);
    if (v.silence_prefix_seconds) $("media-note").textContent += " " + t("media_privacy", v.silence_prefix_seconds);
  $("timeline").max = videoDur;
  if (refreshMedia) {
    player.poster = assetURL(v.poster);
    const mediaURL = new URL(assetURL(v.mp4));
    if (v.silence_prefix_seconds) mediaURL.searchParams.set("privacy", `intro-muted-${v.silence_prefix_seconds}s-20261108`);
    player.src = mediaURL.href;
    player.load();
  }
}
function syncTime() {
  curT = player.currentTime || 0;
  scheduleDraw();
}
function animatePlayback() {
  syncTime();
  if (!player.paused && !player.ended) requestAnimationFrame(animatePlayback);
}
function loadReference(v) {
  player.pause(); pendingSeek = null; currentVideo = v; curLabel = v.label;
  series = refs.get(v.sid); curT = 0; videoDur = v.duration_video || v.audio_sec || series.T;
  refSelect.value = v.sid; $("page-status").textContent = "";
  pageURL.searchParams.set("case", v.key); history.replaceState(null, "", pageURL);
  renderMeta(v);
  $("timeline").value = 0;
  updateCase();
}
function updateCase() {
  activeFrames = [];
  frameTask = buildFilmstrip();
  document.querySelectorAll("#case-links button").forEach(b => { const active = b.dataset.sid === currentVideo?.sid; b.classList.toggle("selected", active); b.setAttribute("aria-pressed", String(active)); });
  $("segments").replaceChildren();
  let start = 0;
  for (const [i, seconds] of (currentVideo?.seg_secs || []).entries()) {
    const from = start, button = document.createElement("button");
    button.textContent = `${t("seg", i + 1)} · ${time(from)}`; button.dataset.start = from; button.dataset.end = from + seconds;
    button.addEventListener("click", () => seek(from)); $("segments").appendChild(button); start += seconds;
  }
  $("residual-source").textContent = series.case?.residual || series.residual_raw ? t("residual_raw") : t("residual_rec");
  const { rows, meta } = healthyReference();
  $("pool-note").textContent = t("pool_note", meta.n);
  series.reference = rows;
  document.querySelectorAll(".reference-label").forEach(el => { el.textContent = t("ref_pool_label"); });
  document.querySelectorAll(".range-label").forEach(el => { el.textContent = t("range_pool_label"); });
  $("trait-summary").replaceChildren();
  renderPaperSummary(rows);
  TRAITS.forEach(key => {
    const card = document.createElement("article"); card.className = "trait";
    const name = document.createElement("div"); name.className = "trait-name"; name.textContent = `${t("trait_" + key + "_name")} / ${TRAIT_SYMBOL[key]}`;
    const available = finite(fullValue(key));
    const val = document.createElement("div"); val.className = "trait-value" + (available ? "" : " unavailable"); val.textContent = available ? fmt(fullValue(key)) : "—";
    const z = document.createElement("div"); z.className = "trait-z";
    const pool = poolOf(key); z.textContent = pool && finite(fullValue(key)) ? t("trait_z", fmtZ(zOf(pool, fullValue(key)))) : "";
    const note = document.createElement("p"); note.textContent = available ? t("trait_" + key + "_meaning") : t("trait_na");
    card.append(name, val, z, note); $("trait-summary").appendChild(card);
  });
  scheduleDraw();
}
function renderPaperSummary(rows) {
  $("paper-summary").replaceChildren();
  const valid = rows.map((row, i) => row && finite(series.raw[i]) ? [series.raw[i], row.high] : null).filter(Boolean);
  const share = valid.length ? valid.filter(([residual, upper]) => residual > upper).length / valid.length : null;
  const items = [
    [t("psum_exceed_label"), finite(share) ? `${(share * 100).toFixed(1)}%` : "—", t("psum_exceed_unit"), t("psum_exceed_desc")]
  ];
  for (const [label, value, unit, description] of items) {
    const card = document.createElement("article"); card.className = "trait";
    const name = document.createElement("div"); name.className = "trait-name"; name.textContent = label;
    const val = document.createElement("div"); val.className = "trait-value"; val.textContent = value;
    const small = document.createElement("small"); small.textContent = unit; val.appendChild(small);
    const note = document.createElement("p"); note.textContent = description;
    card.append(name, val, note); $("paper-summary").appendChild(card);
  }
}
function seek(t) {
  if (!series) return;
  curT = Math.max(0, Math.min(t, videoDur || series.T));
  $("timeline").value = curT;
  if (!player.hidden) {
    if (player.readyState >= 1) player.currentTime = curT; else pendingSeek = curT;
  }
  scheduleDraw();
}
function bindSeek(canvas) {
  let dragging = false;
  const move = e => { const g = chartGeometry.get(canvas); if (g) seek((e.clientX - canvas.getBoundingClientRect().left - g.left) / g.width * g.T); };
  canvas.addEventListener("pointerdown", e => { if (e.button !== 0) return; dragging = true; canvas.setPointerCapture(e.pointerId); move(e); });
  canvas.addEventListener("pointermove", e => { if (dragging) move(e); });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("pointercancel", () => { dragging = false; });
  canvas.addEventListener("keydown", e => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); seek(e.key === "Home" ? 0 : e.key === "End" ? series?.T || 0 : curT + (e.key === "ArrowRight" ? 5 : -5)); } });
}
function filmSegments() {
  const durations = currentVideo?.seg_secs || [videoDur || series.T];
  let start = 0;
  return durations.map((duration, index) => { const result = { start, end: start + duration, index }; start += duration; return result; });
}
// All preview frames are prepared offline. Browsing never extracts features or frames.
async function buildFilmstrip() {
  frameController?.abort();
  const item = currentVideo, controller = new AbortController(); frameController = controller;
  $("filmstrip-note").textContent = t("film_loading");
  const image = new Image(); image.src = assetURL(item.frame_strip_url || item.sprite);
  try {
    await image.decode();
    if (controller.signal.aborted) return;
    activeFrames = item.frame_strip_url
      ? [{ start: 0, end: item.audio_sec, image }]
      : item.intervals.map((cell, i) => ({ ...cell, image,
          crop: [i * item.frame_width, 0, item.frame_width, item.frame_height] }));
    $("filmstrip-note").textContent = t(item.frame_strip_url ? "film_paper" : "film_sampled", item.n_frames || activeFrames.length);
    scheduleDraw();
  } catch (e) {
    if (!controller.signal.aborted) $("filmstrip-note").textContent = t("film_fail");
  }
}
function drawFilmstrip() {
  const canvas = $("filmstrip"), w = canvas.clientWidth, h = 92, dpr = devicePixelRatio || 1;
  if (w < 20) return;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== h * dpr) { canvas.width = Math.round(w * dpr); canvas.height = h * dpr; }
  const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
  const left = 51, right = w - 13, width = right - left, T = Math.max(series.T, videoDur), X = t => left + t / T * width;
  chartGeometry.set(canvas, { left, width, T });
  ctx.save(); ctx.beginPath(); ctx.rect(left, 0, width, h); ctx.clip();
  for (const seg of filmSegments()) {
    ctx.fillStyle = seg.index % 2 ? "#f7f9fa" : "#edf2f4"; ctx.fillRect(X(seg.start), 20, X(seg.end) - X(seg.start), 62);
    ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = css("--muted"); ctx.fillText(t("seg_draw", seg.index + 1), X((seg.start + seg.end) / 2), 3);
  }
  for (const frame of activeFrames) {
    const x = X(frame.start), cellWidth = X(frame.end) - x;
    const crop = frame.crop || [0, 0, frame.image.width, frame.image.height];
    const scale = Math.min((cellWidth - 1) / crop[2], 58 / crop[3]);
    const dw = crop[2] * scale, dh = crop[3] * scale;
    ctx.drawImage(frame.image, ...crop, x + (cellWidth - dw) / 2, 22 + (58 - dh) / 2, dw, dh);
  }
  for (const seg of filmSegments().slice(1)) { ctx.strokeStyle = "#a6b5bf"; ctx.beginPath(); ctx.moveTo(X(seg.start), 20); ctx.lineTo(X(seg.start), 82); ctx.stroke(); }
  ctx.strokeStyle = "#526e80"; ctx.beginPath(); ctx.moveTo(X(curT), 20); ctx.lineTo(X(curT), 82); ctx.stroke(); ctx.restore();
}
function scheduleDraw() { if (drawPending) return; drawPending = true; requestAnimationFrame(() => { drawPending = false; draw(); }); }
function niceTicks(lo, hi, n = 4) {
  const base = 10 ** Math.floor(Math.log10((hi - lo || 1) / n));
  const error = (hi - lo) / n / base, step = base * (error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1);
  const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-6 ? 0 : v); return out;
}
function range(values) {
  let lo = Infinity, hi = -Infinity;
  for (const v of values) if (finite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  if (!finite(lo)) return [0, 1];
  const pad = (hi - lo || Math.max(Math.abs(hi) * .1, .1)) * .14;
  return [lo - pad, hi + pad];
}
function canvasPlot(canvas, values, { bandWidth = 0, height = 240, transform = v => v, yRange = null } = {}) {
  const w = canvas.clientWidth; if (w < 20) return null;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(height * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(height * dpr); }
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, height);
  const axis = Y_AXES[canvas.id];
  let [lo, hi] = axis ? axis.limits : range(values.map(transform));
  if (!axis && yRange && yRange.every(finite) && yRange[0] < yRange[1]) {
    // Preserve the paper's display bounds, expanding only if actual data would be clipped.
    const valid = values.filter(finite).map(transform);
    lo = Math.min(yRange[0], ...valid); hi = Math.max(yRange[1], ...valid);
  }
  const left = 51, top = 22, bottom = height - 32, right = w - 13 - bandWidth;
  const T = Math.max(series.T, videoDur), width = right - left;
  const X = t => left + t / T * width;
  // Y always consumes raw values. Apply the axis transformation exactly once.
  const Y = v => top + (hi - transform(v)) / (hi - lo) * (bottom - top);
  const yCoord = tick => top + (hi - tick) / (hi - lo) * (bottom - top);
  ctx.font = "10px -apple-system, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.textBaseline = "middle";
  const decimals = axis?.decimals ?? Math.min(4, Math.max(0, -Math.floor(Math.log10((hi - lo) / 4)) + 1));
  const yTicks = axis?.ticks || niceTicks(lo, hi);
  for (const tick of yTicks) {
    const y = yCoord(tick); ctx.strokeStyle = css("--grid"); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke(); ctx.fillText(tick.toFixed(decimals), left - 9, y);
  }
  const step = T <= 200 ? 30 : T <= 400 ? 60 : 120;
  const ticks = []; for (let t = 0; t < T; t += step) if (t <= T - step * .35) ticks.push(t); ticks.push(T);
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  ticks.forEach(t => { const x = X(t); ctx.strokeStyle = css("--grid"); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke(); ctx.fillText(time(t), x, bottom + 9); });
  ctx.strokeStyle = css("--axis"); ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
  chartGeometry.set(canvas, { left, width, T });
  ctx.save(); ctx.beginPath(); ctx.rect(left, top, width, bottom - top); ctx.clip();
  return { ctx, X, Y, left, right, top, bottom, T, w, height, bandWidth, yLimits: [lo, hi], yTicks };
}
function line(g, points, color, { dash = [], alpha = 1, width = 1.5 } = {}) {
  const { ctx, X, Y } = g;
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = alpha; ctx.setLineDash(dash); ctx.beginPath();
  let started = false;
  for (const [t, v] of points) {
    if (!finite(t) || !finite(v)) { started = false; continue; }
    if (started) ctx.lineTo(X(t), Y(v)); else ctx.moveTo(X(t), Y(v)); started = true;
  }
  ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
}
function playLine(g, points, color, options = {}) {
  if (!$("reveal").checked) line(g, points, color, options);
  else line(g, points.filter(([t]) => t <= curT), color, options);
}
function finishPlot(g) {
  const { ctx, X, top, bottom, right, left } = g;
  let sum = 0;
  for (const sec of (currentVideo?.seg_secs || []).slice(0, -1)) { sum += sec; ctx.strokeStyle = "#b7c3cb"; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(X(sum), top); ctx.lineTo(X(sum), bottom); ctx.stroke(); }
  ctx.setLineDash([]);
  const stateEnd = series.case?.predicted_time?.at(-1) ?? series.T;
  if (videoDur > stateEnd + 1) {
    ctx.fillStyle = "rgba(110,125,136,.09)"; ctx.fillRect(X(stateEnd), top, right - X(stateEnd), bottom - top);
    if (right - X(stateEnd) > 45) { ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(t("not_analyzed"), right - 5, top + 5); }
  }
  const xp = Math.max(left, Math.min(right, X(curT)));
  ctx.strokeStyle = "#526e80"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xp, top); ctx.lineTo(xp, bottom); ctx.stroke(); ctx.restore();
}
// Use exported target-time coordinates: pred at t compares with observation at t.
// Never infer this projected trajectory from the full-dimensional residual.
function latentPoints(key) {
  const values = series.case?.[key], times = series.case?.[key + "_time"];
  if (!Array.isArray(values) || !Array.isArray(times) || values.length !== times.length) return [];
  return values.map((value, i) => [times[i], value]);
}
function drawLatent() {
  const observed = latentPoints("observed"), predicted = latentPoints("predicted");
  const values = [...observed, ...predicted].map(point => point[1]);
  const g = canvasPlot($("case-latent"), values, { height: 220 });
  if (!g) return;
  playLine(g, observed, css("--subject"), { dash: [6, 4], width: 1.7 });
  playLine(g, predicted, css("--hr"), { width: 1.5 });
  const { ctx, X, Y } = g;
  // Match the paper's prediction markers, clipped to the current reveal time.
  ctx.fillStyle = css("--hr");
  for (const [second, value] of predicted) {
    if (!finite(second) || !finite(value) || ($("reveal").checked && second > curT)) continue;
    ctx.beginPath(); ctx.arc(X(second), Y(value), 1.3, 0, Math.PI * 2); ctx.fill();
  }
  const second = Math.floor(curT);
  const obs = observed.find(point => point[0] === second);
  const pred = predicted.find(point => point[0] === second);
  for (const [point, color] of [[obs, css("--subject")], [pred, css("--hr")]]) {
    if (!point || !point.every(finite)) continue;
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(point[0]), Y(point[1]), 3, 0, Math.PI * 2); ctx.fill();
  }
  finishPlot(g);
  $("latent-readout").textContent = observed.length && predicted.length
    ? t("latent_readout", time(second), fmt(obs?.[1]), fmt(pred?.[1])) : t("latent_missing");
  const explained = series.case?.pc1_var_expl;
  $("latent-source").textContent = observed.length && predicted.length
    ? t("latent_source", finite(explained) ? (explained * 100).toFixed(1) + "%" : "—") : t("latent_missing");
}
function drawResidual() {
  const rows = series.reference || [], values = series.raw.slice();
  rows.forEach(r => { if (r) values.push(r.low, r.high); });
  const g = canvasPlot($("case-residual"), values, {}); if (!g) return;
  const { ctx, X, Y, top, left } = g;
  // Reveal all residual data together at the video cursor, including the reference
  // band, median and full-series mean. Axes and the cursor remain fully visible.
  ctx.save();
  if ($("reveal").checked) {
    ctx.beginPath();
    ctx.rect(left, top, Math.max(0, Math.min(g.right, X(curT)) - left), g.bottom - top);
    ctx.clip();
  }
  // Separate contiguous reference runs; never fill missing seconds or extend a short recording.
  let run = [];
  function fillRun() {
    if (!run.length) return; ctx.beginPath(); ctx.moveTo(X(run[0].t), Y(run[0].low));
    run.forEach(r => ctx.lineTo(X(r.t), Y(r.low))); run.slice().reverse().forEach(r => ctx.lineTo(X(r.t), Y(r.high))); ctx.closePath(); ctx.fillStyle = "rgba(68,130,102,.15)"; ctx.fill(); run = [];
  }
  for (const row of rows) { if (row) run.push(row); else fillRun(); } fillRun();
  line(g, rows.map(r => r ? [r.t, r.mid] : [null, null]), css("--hr"), { dash: [5, 3], width: 1.3 });
  const mean = series.raw.length ? series.raw.reduce((a, b) => a + b, 0) / series.raw.length : null;
  if (finite(mean)) line(g, [[series.rawTimes[0], mean], [series.rawTimes[series.rawTimes.length - 1], mean]], "#8b979f", { dash: [2, 4], width: 1 });
  // Canvas clipping progressively reveals each connecting segment between 1 Hz samples.
  line(g, series.raw.map((v, i) => [series.rawTimes[i], v]), css("--subject"));
  let i = -1; for (let j = 0; j < series.rawTimes.length; j++) if (series.rawTimes[j] <= curT) i = j;
  const v = series.raw[i];
  if (finite(v) && curT <= series.T) {
    ctx.fillStyle = css("--subject"); ctx.beginPath(); ctx.arc(X(series.rawTimes[i]), Y(v), 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  if (!series.raw.length) { ctx.fillStyle = css("--muted"); ctx.textAlign = "left"; ctx.fillText(t("readout_none"), left + 10, top + 20); }
  finishPlot(g);
  $("case-readout").textContent = curT > series.T ? (currentVideo?.mode === "paper" ? t("readout_paper_end") : t("readout_beyond")) : finite(v) ? `t = ${time(series.rawTimes[i])} · r = ${fmt(v)}` : t("readout_prompt");
  $("time-readout").textContent = `${time(curT)} / ${time(videoDur || series.T)}`;
}
function kdeAt(b, value) {
  if (value < b.x[0] || value > b.x[b.x.length - 1]) return null;
  for (let i = 1; i < b.x.length; i++) if (value <= b.x[i]) { const a = (value - b.x[i - 1]) / (b.x[i] - b.x[i - 1]); return b.y[i - 1] + a * (b.y[i] - b.y[i - 1]); }
  return b.y[b.y.length - 1];
}
function drawDiagnostic(p, index) {
  const pool = poolOf(p), band = manifest.dist_bands?.[p];
  let points;
  if (p === "rho") {
    points = [];
    (series.rho || []).forEach((v, i) => { const t = series.rho_pos[i]; if (i) points.push([t, series.rho[i - 1]]); points.push([t, v]); });
    if (points.length) points.push([series.T, series.rho[series.rho.length - 1]]);
  } else points = (series[p] || []).map((v, i) => [i + 1, v]);
  const values = points.map(x => x[1]); const full = fullValue(p);
  if (finite(full)) values.push(full);
  if (pool) values.push(pool.p5, pool.p95);
  if (band) for (const cls of ["healthy", "depressed"]) if (band[cls]) values.push(...band[cls].x);
  const g = canvasPlot($("c" + index), values, { height: 170, bandWidth: band ? 65 : 0 }); if (!g) return;
  const { ctx, X, Y, left, right, top, bottom } = g;
  if (pool) { ctx.fillStyle = "rgba(68,130,102,.10)"; ctx.fillRect(left, Y(pool.p95), right - left, Y(pool.p5) - Y(pool.p95)); }
  if (finite(full)) line(g, [[0, full], [series.T, full]], "#8b979f", { dash: [2, 4], width: 1 });
  playLine(g, points, curLabel === 1 ? css("--dep") : curLabel === 0 ? css("--hea") : css("--ink-2"));
  let current = null; for (const [t, v] of points) if (t <= curT) current = v;
  const early = p === "force_ar" && curT < 10 ? " · " + t("diag_early") : "";
  $("r" + index).textContent = curT > series.T ? t("readout_beyond") : finite(current) ? `${fmt(current)}${early}` : p === "rho" ? t("diag_wait") : "—";
  finishPlot(g);
  if (!band) return;
  ctx.save(); ctx.beginPath(); ctx.rect(right + 7, top, 58, bottom - top); ctx.clip();
  const x0 = right + 10, reach = 43;
  for (const [cls, color] of [["healthy", css("--hea")], ["depressed", css("--dep")]]) {
    const b = band[cls]; if (!b?.x?.length || !b.y?.length) continue;
    const peak = Math.max(...b.y); if (peak <= 0) continue;
    ctx.beginPath(); ctx.moveTo(x0, Y(b.x[0])); b.x.forEach((v, i) => ctx.lineTo(x0 + b.y[i] / peak * reach, Y(v))); ctx.lineTo(x0, Y(b.x[b.x.length - 1])); ctx.closePath();
    ctx.fillStyle = color; ctx.globalAlpha = .12; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); b.x.forEach((v, i) => { const x = x0 + b.y[i] / peak * reach; if (i) ctx.lineTo(x, Y(v)); else ctx.moveTo(x, Y(v)); }); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();
    if (curLabel === (cls === "depressed" ? 1 : 0) && finite(full)) {
      const density = kdeAt(b, full);
      if (density !== null) { const x = x0 + density / peak * reach, y = Y(full); ctx.fillStyle = color; ctx.beginPath(); if (curLabel === 1) { ctx.moveTo(x, y - 4); ctx.lineTo(x - 4, y + 3); ctx.lineTo(x + 4, y + 3); ctx.closePath(); } else ctx.arc(x, y, 3, 0, 2 * Math.PI); ctx.fill(); }
    }
  }
  ctx.restore(); ctx.fillStyle = css("--muted"); ctx.font = "9px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(t("kde_label"), right + 34, top - 5);
}
function updateWindowReadout() {
  const index = Math.min(Math.floor(curT) - 1, (series.residual || []).length - 1);
  const lastRho = (series.rho_pos || []).reduce((last, position, i) => position <= curT ? i : last, -1);
  $("live-r").textContent = fmt(index >= 0 ? series.residual[index] : null);
  $("live-f").textContent = fmt(index >= 0 ? series.force_ar[index] : null);
  $("live-rho").textContent = fmt(lastRho >= 0 ? series.rho[lastRho] : null);
  $("window-status").textContent = curT < 1 ? t("window_prompt") :
    t("window_status", time(Math.max(0, Math.floor(curT) - (series.win || 60))), time(Math.floor(curT)),
      lastRho >= 0 ? time(series.rho_pos[lastRho]) : t("window_wait"));
}
function draw() {
  if (!series) return;
  drawFilmstrip(); drawLatent(); drawResidual();
  $("timeline").value = curT;
  $("playback-time").textContent = `${time(curT)} / ${time(videoDur)}`;
  $("playback-state").textContent = t(player.ended ? "ended" : player.paused ? "paused" : "playing");
  $("playback-state").classList.toggle("playing", !player.paused && !player.ended);
  updateWindowReadout();
  if (document.querySelector(".diagnostics").open) TRAITS.forEach(drawDiagnostic);
  document.querySelectorAll("#segments button").forEach(b => b.classList.toggle("active", curT >= +b.dataset.start && curT < +b.dataset.end));
}
$("langbtn").addEventListener("click", () => setLang(lang === "zh" ? "en" : "zh"));
applyStatic();
init().catch(reportError);
